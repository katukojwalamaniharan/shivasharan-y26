import React, { useState, useEffect, useCallback } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  getDocs,
} from 'firebase/firestore';
import {
  LayoutDashboard,
  Map,
  Code2,
  Mic,
  Library,
  GraduationCap,
  ShieldCheck,
  LogIn,
  LogOut,
  Timer,
  Eye,
} from 'lucide-react';
import {
  auth,
  db,
  googleProvider,
  SUPER_ADMIN_EMAIL,
  WORKSPACE_ID,
  OperationType,
  handleFirestoreError,
  sanitizeId,
  truncateStr,
  clampInt,
  sanitizeBoundedStringArray,
  getTodayDateString,
} from './firebase';
import {
  UserProfile,
  ResourceDoc,
  UserProgressDoc,
  ProblemLogDoc,
  PatternNoteDoc,
  ActivityLogDoc,
  ActiveTab,
} from './types';
import { INITIAL_RESOURCES } from './data/seedData';
import { DashboardView } from './components/DashboardView';
import { RoadmapView } from './components/RoadmapView';
import { DsaTrackerView } from './components/DsaTrackerView';
import { SpokenStudioView } from './components/SpokenStudioView';
import { ResourceLibraryView } from './components/ResourceLibraryView';
import { CsAptitudeView } from './components/CsAptitudeView';
import { AdminConsoleView } from './components/AdminConsoleView';
import { SoloTimerModal } from './components/SoloTimerModal';

const DEFAULT_PROGRESS: UserProgressDoc = {
  userId: 'guest',
  checkedRoadmapIds: ['s1_m1_t1', 's1_m1_t2'],
  checkedRoutineIds: ['routine_mon_fri'],
  checkedCsFundamentalsIds: ['cs_java_memory'],
  aptitudeSessionsDone: 4,
  logicPuzzlesDone: 1,
  mockInterviewsDone: 0,
  contestsAttended: 0,
  weekdayHours: '2 hrs/weekday (Mon–Fri)',
  weekendHours: '5–6 hrs/day (Sat–Sun)',
  sem1ExamDates: 'TBD — Switch to Light Mode (30–45m revision) during exam weeks',
  week1JavaCheckResult: 'In progress: FizzBuzz, reverse array, class with constructor',
};

const DEFAULT_PROFILE: UserProfile = {
  uid: 'guest',
  displayName: 'Brother (FAANG Track)',
  role: 'member',
  canEditResources: false,
  examLightMode: false,
  workspaceId: 'faang-hub',
  solvedCount: 0,
  masteredCount: 0,
  spokenCount: 0,
  roadmapDoneCount: 2,
  streakDays: 1,
};

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [authReady, setAuthReady] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Current logged-in user's profile
  const [myProfile, setMyProfile] = useState<UserProfile>(DEFAULT_PROFILE);

  // Admin can inspect any learner's UID; defaults to current user's UID
  const [inspectedUid, setInspectedUid] = useState<string>('guest');
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);

  // Workspace Data States (for inspectedUid, or local state when signed out)
  const [resources, setResources] = useState<ResourceDoc[]>(
    INITIAL_RESOURCES.map((r) => ({
      ...r,
      visibility: 'workspace',
      updatedBy: 'system',
    }))
  );
  const [progress, setProgress] = useState<UserProgressDoc>(DEFAULT_PROGRESS);
  const [problemLogs, setProblemLogs] = useState<Record<string, ProblemLogDoc>>({});
  const [patternNotes, setPatternNotes] = useState<PatternNoteDoc[]>([]);
  const [activityLogs, setActivityLogs] = useState<Record<string, ActivityLogDoc>>({});

  // Solo Timer & Spoken Studio contextual launch states
  const [isSoloTimerOpen, setIsSoloTimerOpen] = useState<boolean>(false);
  const [soloTimerProblem, setSoloTimerProblem] = useState<string>('');
  const [spokenProblemTitle, setSpokenProblemTitle] = useState<string>('');
  const [spokenPatternName, setSpokenPatternName] = useState<string>('Arrays & Hashing');

  // 1. Bootstrap User Profile, Private PII, Initial Progress & Seed Resources on Sign-In
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (!user) {
        setMyProfile(DEFAULT_PROFILE);
        setInspectedUid('guest');
        setAuthReady(true);
        return;
      }

      const uid = sanitizeId(user.uid, 'user_1');
      const isSuperAdmin =
        user.email?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase() &&
        user.emailVerified;

      try {
        // 1a. Ensure /admins/{uid} exists if Super Admin
        if (isSuperAdmin) {
          const adminRef = doc(db, 'admins', uid);
          const adminSnap = await getDoc(adminRef);
          if (!adminSnap.exists()) {
            await setDoc(adminRef, {
              uid,
              grantedBy: uid,
              createdAt: serverTimestamp(),
            });
          }
        }

        // 1b. Ensure /users/{uid} exists
        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);
        let currentProfile: UserProfile;

        if (!userSnap.exists()) {
          const newProfile = {
            uid,
            displayName: truncateStr(
              user.displayName || user.email?.split('@')[0] || 'Learner',
              100,
              1,
              'Learner'
            ),
            role: isSuperAdmin ? ('admin' as const) : ('member' as const),
            canEditResources: Boolean(isSuperAdmin),
            examLightMode: false,
            workspaceId: WORKSPACE_ID as 'faang-hub',
            solvedCount: 0,
            masteredCount: 0,
            spokenCount: 0,
            roadmapDoneCount: 2,
            streakDays: 1,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          };
          await setDoc(userRef, newProfile);
          currentProfile = newProfile;
        } else {
          const data = userSnap.data() as UserProfile;
          currentProfile = data;
          // Upgrade to admin if super admin signed in
          if (isSuperAdmin && (data.role !== 'admin' || !data.canEditResources)) {
            await updateDoc(userRef, {
              role: 'admin',
              canEditResources: true,
              updatedAt: serverTimestamp(),
            });
            currentProfile = { ...data, role: 'admin', canEditResources: true };
          }
        }

        setMyProfile(currentProfile);
        setInspectedUid(uid);

        // 1c. Ensure isolated PII /users/{uid}/private/info exists
        if (user.email) {
          const privRef = doc(db, 'users', uid, 'private', 'info');
          const privSnap = await getDoc(privRef);
          if (!privSnap.exists()) {
            await setDoc(privRef, {
              uid,
              email: truncateStr(user.email, 254, 3, 'user@example.com'),
              createdAt: serverTimestamp(),
            });
          }
        }

        // 1d. Ensure /userProgress/{uid} exists
        const progRef = doc(db, 'userProgress', uid);
        const progSnap = await getDoc(progRef);
        if (!progSnap.exists()) {
          await setDoc(progRef, {
            userId: uid,
            checkedRoadmapIds: ['s1_m1_t1', 's1_m1_t2'],
            checkedRoutineIds: ['routine_mon_fri'],
            checkedCsFundamentalsIds: ['cs_java_memory'],
            aptitudeSessionsDone: 4,
            logicPuzzlesDone: 1,
            mockInterviewsDone: 0,
            contestsAttended: 0,
            weekdayHours: '2 hrs/weekday (Mon–Fri)',
            weekendHours: '5–6 hrs/day (Sat–Sun)',
            sem1ExamDates: 'TBD — Switch to Light Mode during exam weeks',
            week1JavaCheckResult: 'Pending Week 1 check: FizzBuzz, reverse array, class with constructor',
            updatedAt: serverTimestamp(),
          });
        }

        // 1e. Seed any missing INITIAL_RESOURCES (including Striver A2Z pattern modules) if user canEditResources or isAdmin
        if (currentProfile.role === 'admin' || currentProfile.canEditResources) {
          const resQuery = query(
            collection(db, 'resources'),
            where('visibility', '==', 'workspace')
          );
          const resSnap = await getDocs(resQuery);
          const existingIds = new Set<string>();
          resSnap.forEach((docSnap) => existingIds.add(docSnap.id));

          for (const item of INITIAL_RESOURCES) {
            const cleanId = sanitizeId(item.id, 'res_item');
            if (!existingIds.has(cleanId)) {
              await setDoc(doc(db, 'resources', cleanId), {
                id: cleanId,
                title: truncateStr(item.title, 200, 1, 'Resource'),
                category: truncateStr(item.category, 80, 1, 'DSA'),
                typeFocus: truncateStr(item.typeFocus, 200, 0, ''),
                priority: item.priority,
                recommendedUse: truncateStr(item.recommendedUse, 500, 0, ''),
                url: truncateStr(item.url, 1000, 0, 'https://leetcode.com'),
                status: item.status,
                notes: truncateStr(item.notes, 1000, 0, ''),
                visibility: 'workspace',
                updatedBy: uid,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
              });
            }
          }
        }
      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        setAuthReady(true);
      }
    });

    return () => unsubAuth();
  }, []);

  // 2. Listen to Global Resources & User Profile when authenticated
  useEffect(() => {
    if (!authReady || !firebaseUser) return;
    const myUid = sanitizeId(firebaseUser.uid, 'user_1');

    // Listen to my own profile
    const unsubMyProfile = onSnapshot(
      doc(db, 'users', myUid),
      (snap) => {
        if (snap.exists()) {
          setMyProfile(snap.data() as UserProfile);
        }
      },
      (err) => handleFirestoreError(err, OperationType.GET, `users/${myUid}`)
    );

    // Listen to shared resources
    const resQuery = query(
      collection(db, 'resources'),
      where('visibility', '==', 'workspace')
    );
    const unsubResources = onSnapshot(
      resQuery,
      (snap) => {
        if (!snap.empty) {
          const list: ResourceDoc[] = [];
          snap.forEach((d) => list.push(d.data() as ResourceDoc));
          setResources(list);
        }
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'resources')
    );

    return () => {
      unsubMyProfile();
      unsubResources();
    };
  }, [authReady, firebaseUser]);

  // 3. If Admin, listen to all registered users in workspace
  useEffect(() => {
    if (!authReady || !firebaseUser || myProfile.role !== 'admin') {
      setAllUsers(firebaseUser ? [myProfile] : []);
      return;
    }

    const usersQuery = query(
      collection(db, 'users'),
      where('workspaceId', '==', WORKSPACE_ID)
    );
    const unsubUsers = onSnapshot(
      usersQuery,
      (snap) => {
        const list: UserProfile[] = [];
        snap.forEach((d) => list.push(d.data() as UserProfile));
        setAllUsers(list);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'users')
    );

    return () => unsubUsers();
  }, [authReady, firebaseUser, myProfile.role]);

  // 4. Listen to Inspected User's Progress, Problem Logs, Pattern Notes & Activity Logs
  useEffect(() => {
    if (!authReady || !firebaseUser || !inspectedUid || inspectedUid === 'guest') return;
    const targetUid = sanitizeId(inspectedUid, sanitizeId(firebaseUser.uid));

    const unsubProg = onSnapshot(
      doc(db, 'userProgress', targetUid),
      (snap) => {
        if (snap.exists()) {
          setProgress(snap.data() as UserProgressDoc);
        }
      },
      (err) => handleFirestoreError(err, OperationType.GET, `userProgress/${targetUid}`)
    );

    const probQuery = query(
      collection(db, 'problemLogs'),
      where('userId', '==', targetUid)
    );
    const unsubProbs = onSnapshot(
      probQuery,
      (snap) => {
        const map: Record<string, ProblemLogDoc> = {};
        snap.forEach((d) => {
          const data = d.data() as ProblemLogDoc;
          map[data.problemId] = { ...data, id: d.id };
        });
        setProblemLogs(map);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'problemLogs')
    );

    const notesQuery = query(
      collection(db, 'patternNotes'),
      where('userId', '==', targetUid)
    );
    const unsubNotes = onSnapshot(
      notesQuery,
      (snap) => {
        const list: PatternNoteDoc[] = [];
        snap.forEach((d) => list.push({ ...(d.data() as PatternNoteDoc), id: d.id }));
        setPatternNotes(list);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'patternNotes')
    );

    const actQuery = query(
      collection(db, 'activityLogs'),
      where('userId', '==', targetUid)
    );
    const unsubAct = onSnapshot(
      actQuery,
      (snap) => {
        const map: Record<string, ActivityLogDoc> = {};
        snap.forEach((d) => {
          const data = d.data() as ActivityLogDoc;
          map[data.date] = { ...data, id: d.id };
        });
        setActivityLogs(map);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'activityLogs')
    );

    return () => {
      unsubProg();
      unsubProbs();
      unsubNotes();
      unsubAct();
    };
  }, [authReady, firebaseUser, inspectedUid]);

  // Helper: Increment daily activity log for heatmap
  const recordDailyActivity = useCallback(
    async (
      field:
        | 'problemsSolved'
        | 'revisionsCompleted'
        | 'spokenRecorded'
        | 'roadmapTasksDone'
        | 'aptitudeDone'
    ) => {
      const dateStr = getTodayDateString();
      const existing = activityLogs[dateStr];
      const nextDoc: ActivityLogDoc = {
        id: `${inspectedUid}_${dateStr}`,
        userId: inspectedUid,
        date: dateStr,
        problemsSolved: (existing?.problemsSolved ?? 0) + (field === 'problemsSolved' ? 1 : 0),
        revisionsCompleted:
          (existing?.revisionsCompleted ?? 0) + (field === 'revisionsCompleted' ? 1 : 0),
        spokenRecorded: (existing?.spokenRecorded ?? 0) + (field === 'spokenRecorded' ? 1 : 0),
        roadmapTasksDone:
          (existing?.roadmapTasksDone ?? 0) + (field === 'roadmapTasksDone' ? 1 : 0),
        aptitudeDone: (existing?.aptitudeDone ?? 0) + (field === 'aptitudeDone' ? 1 : 0),
        totalActions: (existing?.totalActions ?? 0) + 1,
      };

      setActivityLogs((prev) => ({ ...prev, [dateStr]: nextDoc }));

      if (!firebaseUser || inspectedUid === 'guest') return;
      const targetUid = sanitizeId(inspectedUid);
      const actId = sanitizeId(`${targetUid}_${dateStr}`);
      const actRef = doc(db, 'activityLogs', actId);

      try {
        const snap = await getDoc(actRef);
        if (!snap.exists()) {
          await setDoc(actRef, {
            userId: targetUid,
            date: dateStr,
            problemsSolved: clampInt(nextDoc.problemsSolved, 0, 500),
            revisionsCompleted: clampInt(nextDoc.revisionsCompleted, 0, 500),
            spokenRecorded: clampInt(nextDoc.spokenRecorded, 0, 500),
            roadmapTasksDone: clampInt(nextDoc.roadmapTasksDone, 0, 500),
            aptitudeDone: clampInt(nextDoc.aptitudeDone, 0, 500),
            totalActions: clampInt(nextDoc.totalActions, 0, 2500),
            updatedAt: serverTimestamp(),
          });
        } else {
          await updateDoc(actRef, {
            problemsSolved: clampInt(nextDoc.problemsSolved, 0, 500),
            revisionsCompleted: clampInt(nextDoc.revisionsCompleted, 0, 500),
            spokenRecorded: clampInt(nextDoc.spokenRecorded, 0, 500),
            roadmapTasksDone: clampInt(nextDoc.roadmapTasksDone, 0, 500),
            aptitudeDone: clampInt(nextDoc.aptitudeDone, 0, 500),
            totalActions: clampInt(nextDoc.totalActions, 0, 2500),
            updatedAt: serverTimestamp(),
          });
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `activityLogs/${actId}`);
      }
    },
    [activityLogs, firebaseUser, inspectedUid]
  );

  // Sync user summary telemetry counts to /users/{targetUid}
  const syncUserSummaryMetrics = useCallback(
    async (overrides: Partial<UserProfile>) => {
      if (!firebaseUser || inspectedUid === 'guest') return;
      const targetUid = sanitizeId(inspectedUid);
      const userRef = doc(db, 'users', targetUid);
      try {
        await updateDoc(userRef, {
          ...overrides,
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${targetUid}`);
      }
    },
    [firebaseUser, inspectedUid]
  );

  // Auth Handlers
  const handleGoogleSignIn = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('auth/unauthorized-domain')) {
        const currentHost = window.location.hostname;
        setAuthError(
          `Domain "${currentHost}" is not authorized for OAuth in Firebase. If you are using http://127.0.0.1:3000, please switch to http://localhost:3000, or add "${currentHost}" to Firebase Console -> Authentication -> Settings -> Authorized Domains.`
        );
      } else {
        setAuthError(msg || 'Google Sign-In was cancelled or failed.');
      }
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  // Roadmap & Routine Handlers
  const handleToggleRoadmapTask = async (taskId: string) => {
    const exists = progress.checkedRoadmapIds.includes(taskId);
    const nextIds = exists
      ? progress.checkedRoadmapIds.filter((id) => id !== taskId)
      : [...progress.checkedRoadmapIds, taskId];
    const bounded = sanitizeBoundedStringArray(nextIds, 300);

    setProgress((prev) => ({ ...prev, checkedRoadmapIds: bounded }));
    if (!exists) {
      await recordDailyActivity('roadmapTasksDone');
    }

    if (!firebaseUser || inspectedUid === 'guest') return;
    const targetUid = sanitizeId(inspectedUid);
    try {
      await updateDoc(doc(db, 'userProgress', targetUid), {
        checkedRoadmapIds: bounded,
        updatedAt: serverTimestamp(),
      });
      await syncUserSummaryMetrics({ roadmapDoneCount: clampInt(bounded.length, 0, 1000) });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `userProgress/${targetUid}`);
    }
  };

  const handleToggleRoutineTask = async (routineId: string) => {
    const exists = progress.checkedRoutineIds.includes(routineId);
    const nextIds = exists
      ? progress.checkedRoutineIds.filter((id) => id !== routineId)
      : [...progress.checkedRoutineIds, routineId];
    const bounded = sanitizeBoundedStringArray(nextIds, 20);

    setProgress((prev) => ({ ...prev, checkedRoutineIds: bounded }));
    if (!firebaseUser || inspectedUid === 'guest') return;
    const targetUid = sanitizeId(inspectedUid);
    try {
      await updateDoc(doc(db, 'userProgress', targetUid), {
        checkedRoutineIds: bounded,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `userProgress/${targetUid}`);
    }
  };

  const handleToggleCsTopic = async (topicId: string) => {
    const exists = progress.checkedCsFundamentalsIds.includes(topicId);
    const nextIds = exists
      ? progress.checkedCsFundamentalsIds.filter((id) => id !== topicId)
      : [...progress.checkedCsFundamentalsIds, topicId];
    const bounded = sanitizeBoundedStringArray(nextIds, 150);

    setProgress((prev) => ({ ...prev, checkedCsFundamentalsIds: bounded }));
    if (!firebaseUser || inspectedUid === 'guest') return;
    const targetUid = sanitizeId(inspectedUid);
    try {
      await updateDoc(doc(db, 'userProgress', targetUid), {
        checkedCsFundamentalsIds: bounded,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `userProgress/${targetUid}`);
    }
  };

  const handleIncrementCounter = async (
    field:
      | 'aptitudeSessionsDone'
      | 'logicPuzzlesDone'
      | 'mockInterviewsDone'
      | 'contestsAttended',
    delta: number
  ) => {
    const maxMap = {
      aptitudeSessionsDone: 5000,
      logicPuzzlesDone: 2000,
      mockInterviewsDone: 500,
      contestsAttended: 1000,
    };
    const nextVal = clampInt((progress[field] ?? 0) + delta, 0, maxMap[field]);
    setProgress((prev) => ({ ...prev, [field]: nextVal }));

    if (delta > 0) {
      await recordDailyActivity('aptitudeDone');
    }

    if (!firebaseUser || inspectedUid === 'guest') return;
    const targetUid = sanitizeId(inspectedUid);
    try {
      await updateDoc(doc(db, 'userProgress', targetUid), {
        [field]: nextVal,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `userProgress/${targetUid}`);
    }
  };

  const handleUpdateOpenItems = async (fields: {
    weekdayHours: string;
    weekendHours: string;
    sem1ExamDates: string;
    week1JavaCheckResult: string;
  }) => {
    const sanitized = {
      weekdayHours: truncateStr(fields.weekdayHours, 100, 0, ''),
      weekendHours: truncateStr(fields.weekendHours, 100, 0, ''),
      sem1ExamDates: truncateStr(fields.sem1ExamDates, 200, 0, ''),
      week1JavaCheckResult: truncateStr(fields.week1JavaCheckResult, 300, 0, ''),
    };
    setProgress((prev) => ({ ...prev, ...sanitized }));
    if (!firebaseUser || inspectedUid === 'guest') return;
    const targetUid = sanitizeId(inspectedUid);
    try {
      await updateDoc(doc(db, 'userProgress', targetUid), {
        ...sanitized,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `userProgress/${targetUid}`);
    }
  };

  // DSA Problem Log Upsert Handler (+7-Day Spaced Repetition)
  const handleUpsertProblemLog = async (payload: {
    problemId: string;
    title: string;
    pattern: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    url: string;
    status: 'todo' | 'solved' | 'mastered';
    usedHint: boolean;
    spokenExplanationDone: boolean;
    notes: string;
    markColdReSolve?: boolean;
  }) => {
    const cleanProbId = sanitizeId(payload.problemId, 'prob_1');
    const existing = problemLogs[cleanProbId];
    const now = Date.now();
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

    const solvedAtMs =
      payload.status === 'todo'
        ? 0
        : existing?.solvedAtMs && existing.solvedAtMs > 0
        ? existing.solvedAtMs
        : now;

    const nextReviewAtMs =
      payload.status === 'todo'
        ? 0
        : payload.markColdReSolve
        ? now + sevenDaysMs * 2
        : existing?.nextReviewAtMs && existing.nextReviewAtMs > 0
        ? existing.nextReviewAtMs
        : now + sevenDaysMs;

    const reSolvedCount = payload.markColdReSolve
      ? clampInt((existing?.reSolvedCount ?? 0) + 1, 0, 1000)
      : clampInt(existing?.reSolvedCount ?? 0, 0, 1000);

    const targetUid = firebaseUser ? sanitizeId(inspectedUid) : 'guest';
    const docId = sanitizeId(`${targetUid}_${cleanProbId}`);

    const updatedLog: ProblemLogDoc = {
      id: docId,
      userId: targetUid,
      problemId: cleanProbId,
      title: truncateStr(payload.title, 200, 1, 'DSA Problem'),
      pattern: truncateStr(payload.pattern, 100, 1, 'Arrays & Hashing'),
      difficulty: payload.difficulty,
      url: truncateStr(payload.url, 500, 0, 'https://leetcode.com'),
      status: payload.status,
      usedHint: Boolean(payload.usedHint),
      spokenExplanationDone: Boolean(payload.spokenExplanationDone),
      solvedAtMs,
      nextReviewAtMs,
      reSolvedCount,
      notes: truncateStr(payload.notes, 2000, 0, ''),
    };

    const nextMap = { ...problemLogs, [cleanProbId]: updatedLog };
    setProblemLogs(nextMap);

    if (payload.markColdReSolve) {
      await recordDailyActivity('revisionsCompleted');
    } else if (payload.status === 'solved' && (!existing || existing.status === 'todo')) {
      await recordDailyActivity('problemsSolved');
    }

    if (!firebaseUser || inspectedUid === 'guest') return;

    const logRef = doc(db, 'problemLogs', docId);
    try {
      const snap = await getDoc(logRef);
      const firestorePayload = {
        userId: updatedLog.userId,
        problemId: updatedLog.problemId,
        title: updatedLog.title,
        pattern: updatedLog.pattern,
        difficulty: updatedLog.difficulty,
        url: updatedLog.url,
        status: updatedLog.status,
        usedHint: updatedLog.usedHint,
        spokenExplanationDone: updatedLog.spokenExplanationDone,
        solvedAtMs: updatedLog.solvedAtMs,
        nextReviewAtMs: updatedLog.nextReviewAtMs,
        reSolvedCount: updatedLog.reSolvedCount,
        notes: updatedLog.notes,
        updatedAt: serverTimestamp(),
      };
      if (!snap.exists()) {
        await setDoc(logRef, firestorePayload);
      } else {
        await updateDoc(logRef, firestorePayload);
      }

      const allVals = Object.values(nextMap) as ProblemLogDoc[];
      const solvedTotal = allVals.filter(
        (l) => l.status === 'solved' || l.status === 'mastered'
      ).length;
      const masteredTotal = allVals.filter((l) => l.status === 'mastered').length;
      await syncUserSummaryMetrics({
        solvedCount: clampInt(solvedTotal, 0, 10000),
        masteredCount: clampInt(masteredTotal, 0, 10000),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `problemLogs/${docId}`);
    }
  };

  // Spoken Studio & Pattern Note Handlers
  const handleSavePatternNote = async (payload: {
    patternName: string;
    problemTitle: string;
    coreIntuition: string;
    complexityAnalysis: string;
    spokenDurationSec: number;
    selfRating: number;
  }) => {
    const targetUid = firebaseUser ? sanitizeId(inspectedUid) : 'guest';
    const noteId = sanitizeId(`note_${targetUid}_${Date.now().toString(36)}`);

    const newNote: PatternNoteDoc = {
      id: noteId,
      userId: targetUid,
      patternName: truncateStr(payload.patternName, 120, 1, 'Arrays & Hashing'),
      problemTitle: truncateStr(payload.problemTitle, 200, 0, 'Pattern Summary'),
      coreIntuition: truncateStr(payload.coreIntuition, 3000, 1, 'Pattern notes'),
      complexityAnalysis: truncateStr(payload.complexityAnalysis, 500, 0, 'O(N)'),
      spokenDurationSec: clampInt(payload.spokenDurationSec, 0, 1800),
      selfRating: clampInt(payload.selfRating, 1, 5),
    };

    const nextNotes = [newNote, ...patternNotes];
    setPatternNotes(nextNotes);
    await recordDailyActivity('spokenRecorded');

    if (!firebaseUser || inspectedUid === 'guest') return;
    try {
      await setDoc(doc(db, 'patternNotes', noteId), {
        userId: newNote.userId,
        patternName: newNote.patternName,
        problemTitle: newNote.problemTitle,
        coreIntuition: newNote.coreIntuition,
        complexityAnalysis: newNote.complexityAnalysis,
        spokenDurationSec: newNote.spokenDurationSec,
        selfRating: newNote.selfRating,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      await syncUserSummaryMetrics({
        spokenCount: clampInt(nextNotes.length, 0, 10000),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `patternNotes/${noteId}`);
    }
  };

  const handleDeletePatternNote = async (noteId: string) => {
    setPatternNotes((prev) => prev.filter((n) => n.id !== noteId));
    if (!firebaseUser || inspectedUid === 'guest') return;
    const cleanId = sanitizeId(noteId);
    try {
      await deleteDoc(doc(db, 'patternNotes', cleanId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `patternNotes/${cleanId}`);
    }
  };

  // Shared Resource Library CRUD Handlers
  const handleSaveResource = async (
    data: Omit<ResourceDoc, 'visibility' | 'updatedBy' | 'createdAt' | 'updatedAt'>
  ) => {
    const cleanId = sanitizeId(data.id, `res_${Date.now().toString(36)}`);
    const updaterUid = firebaseUser ? sanitizeId(firebaseUser.uid) : 'guest';
    const nextResource: ResourceDoc = {
      id: cleanId,
      title: truncateStr(data.title, 200, 1, 'Resource'),
      category: truncateStr(data.category, 80, 1, 'DSA'),
      typeFocus: truncateStr(data.typeFocus, 200, 0, ''),
      priority: data.priority,
      recommendedUse: truncateStr(data.recommendedUse, 500, 0, ''),
      url: truncateStr(data.url, 1000, 0, 'https://leetcode.com'),
      status: data.status,
      notes: truncateStr(data.notes, 1000, 0, ''),
      visibility: 'workspace',
      updatedBy: updaterUid,
    };

    setResources((prev) => {
      const idx = prev.findIndex((r) => r.id === cleanId);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = nextResource;
        return copy;
      }
      return [nextResource, ...prev];
    });

    if (!firebaseUser) return;
    const resRef = doc(db, 'resources', cleanId);
    try {
      const snap = await getDoc(resRef);
      if (!snap.exists()) {
        await setDoc(resRef, {
          ...nextResource,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } else {
        await updateDoc(resRef, {
          title: nextResource.title,
          category: nextResource.category,
          typeFocus: nextResource.typeFocus,
          priority: nextResource.priority,
          recommendedUse: nextResource.recommendedUse,
          url: nextResource.url,
          status: nextResource.status,
          notes: nextResource.notes,
          updatedBy: nextResource.updatedBy,
          updatedAt: serverTimestamp(),
        });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `resources/${cleanId}`);
    }
  };

  const handleDeleteResource = async (id: string) => {
    const cleanId = sanitizeId(id);
    setResources((prev) => prev.filter((r) => r.id !== cleanId));
    if (!firebaseUser) return;
    try {
      await deleteDoc(doc(db, 'resources', cleanId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `resources/${cleanId}`);
    }
  };

  // Admin User Permission Handlers
  const handleToggleUserResourcePermission = async (targetUser: UserProfile) => {
    if (!firebaseUser || myProfile.role !== 'admin') return;
    const targetUid = sanitizeId(targetUser.uid);
    try {
      await updateDoc(doc(db, 'users', targetUid), {
        canEditResources: !targetUser.canEditResources,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${targetUid}`);
    }
  };

  const handleToggleUserAdminRole = async (targetUser: UserProfile) => {
    if (!firebaseUser || myProfile.role !== 'admin') return;
    const targetUid = sanitizeId(targetUser.uid);
    const nextRole = targetUser.role === 'admin' ? 'member' : 'admin';
    try {
      if (nextRole === 'admin') {
        await setDoc(doc(db, 'admins', targetUid), {
          uid: targetUid,
          grantedBy: sanitizeId(firebaseUser.uid),
          createdAt: serverTimestamp(),
        });
      } else {
        await deleteDoc(doc(db, 'admins', targetUid));
      }
      await updateDoc(doc(db, 'users', targetUid), {
        role: nextRole,
        canEditResources: nextRole === 'admin' ? true : targetUser.canEditResources,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${targetUid}`);
    }
  };

  const handleToggleUserExamMode = async (targetUser: UserProfile) => {
    const nextExam = !targetUser.examLightMode;
    if (targetUser.uid === myProfile.uid) {
      setMyProfile((prev) => ({ ...prev, examLightMode: nextExam }));
    }
    if (!firebaseUser || targetUser.uid === 'guest') return;
    const targetUid = sanitizeId(targetUser.uid);
    try {
      await updateDoc(doc(db, 'users', targetUid), {
        examLightMode: nextExam,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${targetUid}`);
    }
  };

  const inspectedProfile =
    allUsers.find((u) => u.uid === inspectedUid) || myProfile;
  const canEditResources =
    myProfile.role === 'admin' || myProfile.canEditResources;

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="flex items-center justify-between gap-8 px-6 py-3.5 border-b border-slate-800 bg-[#0B0F17]/95 sticky top-0 z-30">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#dashboard"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('dashboard');
          }}
          className="text-lg font-bold tracking-tight text-slate-100 whitespace-nowrap shrink-0 font-display"
        >
          FAANG Path
        </a>

        {/* Zone 2: 5 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <a
            href="#dashboard"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('dashboard');
            }}
            className={`hover:text-slate-100 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'dashboard' ? 'text-slate-100 underline' : ''
            }`}
          >
            Dashboard
          </a>
          <a
            href="#roadmap"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('roadmap');
            }}
            className={`hover:text-slate-100 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'roadmap' ? 'text-slate-100 underline' : ''
            }`}
          >
            Roadmap
          </a>
          <a
            href="#dsa"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('dsa');
            }}
            className={`hover:text-slate-100 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'dsa' ? 'text-slate-100 underline' : ''
            }`}
          >
            DSA Tracker
          </a>
          <a
            href="#resources"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('resources');
            }}
            className={`hover:text-slate-100 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'resources' ? 'text-slate-100 underline' : ''
            }`}
          >
            Resources
          </a>
          <a
            href="#cs-aptitude"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('cs_aptitude');
            }}
            className={`hover:text-slate-100 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'cs_aptitude' ? 'text-slate-100 underline' : ''
            }`}
          >
            CS & Aptitude
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {!firebaseUser ? (
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors whitespace-nowrap shrink-0"
            >
              <LogIn className="h-3.5 w-3.5" />
              Sign In with Google
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-200 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out ({myProfile.displayName.split(' ')[0]})
            </button>
          )}
        </div>
      </header>

      {/* Main Workspace Layout: Sidebar Rail + Content Viewport */}
      <div className="flex flex-1">
        {/* Left Sidebar Navigation Rail (256px) */}
        <aside className="hidden lg:flex w-64 shrink-0 flex-col justify-between border-r border-slate-800 bg-[#111827]/70 p-4">
          <div className="space-y-6">
            {/* Navigation Menu */}
            <div className="space-y-1">
              {[
                { id: 'dashboard', label: 'Analytics & Daily Hub', icon: LayoutDashboard },
                { id: 'roadmap', label: '4-Semester Roadmap', icon: Map },
                { id: 'dsa', label: 'DSA & 7-Day Review', icon: Code2 },
                { id: 'spoken', label: '2-Min Spoken Studio', icon: Mic },
                { id: 'resources', label: 'Resource Library', icon: Library },
                { id: 'cs_aptitude', label: 'CS Core & Aptitude', icon: GraduationCap },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id as ActiveTab)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-100'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              {myProfile.role === 'admin' && (
                <button
                  type="button"
                  onClick={() => setActiveTab('admin')}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    activeTab === 'admin'
                      ? 'bg-indigo-600 text-white'
                      : 'text-indigo-300 hover:bg-slate-800/70 hover:text-white'
                  }`}
                >
                  <ShieldCheck className="h-4 w-4 shrink-0" />
                  <span>Admin & Users Console</span>
                </button>
              )}
            </div>

            {/* Quick 30-Min Solo Timer Trigger */}
            <div className="rounded-xl border border-slate-800 bg-[#0B0F17] p-3.5 space-y-2.5">
              <div className="text-xs font-semibold text-slate-200">
                25–30 Min Solo Rule
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Always try a problem alone for 25–30 minutes before checking hints.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSoloTimerProblem('');
                  setIsSoloTimerOpen(true);
                }}
                className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 py-1.5 text-xs font-medium text-slate-100 hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0"
              >
                <Timer className="h-3.5 w-3.5 text-indigo-400" />
                Open Solo Timer
              </button>
            </div>

            {/* Admin Learner Switcher */}
            {myProfile.role === 'admin' && allUsers.length > 1 && (
              <div className="rounded-xl border border-slate-800 bg-[#0B0F17] p-3.5 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400">
                  <Eye className="h-3.5 w-3.5" />
                  <span>Inspecting Learner</span>
                </div>
                <select
                  value={inspectedUid}
                  onChange={(e) => setInspectedUid(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-[#111827] px-2.5 py-1.5 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                >
                  {allUsers.map((u) => (
                    <option key={u.uid} value={u.uid}>
                      {u.displayName} ({u.role})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Account Status Footer */}
          <div className="border-t border-slate-800 pt-4 text-xs text-slate-400 space-y-1">
            {firebaseUser ? (
              <>
                <div className="font-semibold text-slate-200 truncate">
                  {myProfile.displayName}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <span>{myProfile.role === 'admin' ? 'Super Admin' : 'Learner'}</span>
                  <span>·</span>
                  <span>
                    {canEditResources ? 'Resource Editor' : 'Standard Access'}
                  </span>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <p className="text-[11px] text-slate-400">
                  Sign in with Google ({SUPER_ADMIN_EMAIL} for Admin) to sync progress & edit resources in the cloud.
                </p>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full rounded-lg bg-indigo-600 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
                >
                  Google Sign-In
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content Viewport */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* Mobile Tab Bar */}
          <div className="flex lg:hidden items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800">
            {[
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'roadmap', label: 'Roadmap' },
              { id: 'dsa', label: 'DSA Tracker' },
              { id: 'spoken', label: 'Spoken Studio' },
              { id: 'resources', label: 'Resources' },
              { id: 'cs_aptitude', label: 'CS & Aptitude' },
              ...(myProfile.role === 'admin' ? [{ id: 'admin', label: 'Admin' }] : []),
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id as ActiveTab)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 ${
                  activeTab === t.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-[#111827] text-slate-400 border border-slate-800'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {authError && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 px-4 py-3 text-xs text-rose-300">
              {authError}
            </div>
          )}

          {/* Admin Inspecting Another User Banner */}
          {firebaseUser && inspectedUid !== firebaseUser.uid && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-indigo-500/30 bg-indigo-950/20 px-4 py-3 text-xs text-indigo-200">
              <span>
                Admin Mode: Currently viewing and managing{' '}
                <strong>{inspectedProfile.displayName}</strong>’s live dashboard and study logs.
              </span>
              <button
                type="button"
                onClick={() => setInspectedUid(firebaseUser.uid)}
                className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-500 whitespace-nowrap shrink-0"
              >
                Return to My Workspace
              </button>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <DashboardView
              profile={inspectedProfile}
              progress={progress}
              problemLogs={problemLogs}
              patternNotes={patternNotes}
              activityLogs={activityLogs}
              onNavigate={setActiveTab}
              onOpenSoloTimer={(title) => {
                setSoloTimerProblem(title || '');
                setIsSoloTimerOpen(true);
              }}
              onToggleExamLightMode={() => handleToggleUserExamMode(inspectedProfile)}
              onToggleRoutineTask={handleToggleRoutineTask}
              onQuickColdReSolve={(log) =>
                handleUpsertProblemLog({
                  problemId: log.problemId,
                  title: log.title,
                  pattern: log.pattern,
                  difficulty: log.difficulty,
                  url: log.url,
                  status: 'mastered',
                  usedHint: false,
                  spokenExplanationDone: log.spokenExplanationDone,
                  notes: log.notes,
                  markColdReSolve: true,
                })
              }
            />
          )}

          {activeTab === 'roadmap' && (
            <RoadmapView
              progress={progress}
              examLightMode={inspectedProfile.examLightMode}
              onToggleRoadmapTask={handleToggleRoadmapTask}
              onToggleRoutineTask={handleToggleRoutineTask}
              onUpdateOpenItems={handleUpdateOpenItems}
            />
          )}

          {activeTab === 'dsa' && (
            <DsaTrackerView
              problemLogs={problemLogs}
              onUpsertProblemLog={handleUpsertProblemLog}
              onOpenSoloTimer={(title) => {
                setSoloTimerProblem(title);
                setIsSoloTimerOpen(true);
              }}
              onOpenSpokenStudio={(probTitle, patName) => {
                setSpokenProblemTitle(probTitle);
                setSpokenPatternName(patName);
                setActiveTab('spoken');
              }}
            />
          )}

          {activeTab === 'spoken' && (
            <SpokenStudioView
              patternNotes={patternNotes}
              onSavePatternNote={handleSavePatternNote}
              onDeletePatternNote={handleDeletePatternNote}
              initialProblemTitle={spokenProblemTitle}
              initialPatternName={spokenPatternName}
            />
          )}

          {activeTab === 'resources' && (
            <ResourceLibraryView
              resources={resources}
              canEdit={canEditResources}
              onSaveResource={handleSaveResource}
              onDeleteResource={handleDeleteResource}
            />
          )}

          {activeTab === 'cs_aptitude' && (
            <CsAptitudeView
              progress={progress}
              onToggleCsTopic={handleToggleCsTopic}
              onIncrementCounter={handleIncrementCounter}
            />
          )}

          {activeTab === 'admin' && myProfile.role === 'admin' && (
            <AdminConsoleView
              currentUserProfile={myProfile}
              allUsers={allUsers}
              inspectedUserId={inspectedUid}
              onSelectInspectedUser={(uid) => {
                setInspectedUid(uid);
                setActiveTab('dashboard');
              }}
              onToggleUserResourcePermission={handleToggleUserResourcePermission}
              onToggleUserAdminRole={handleToggleUserAdminRole}
              onToggleUserExamMode={handleToggleUserExamMode}
            />
          )}
        </main>
      </div>

      {/* Solo Attempt 25-30m Modal */}
      <SoloTimerModal
        isOpen={isSoloTimerOpen}
        onClose={() => setIsSoloTimerOpen(false)}
        initialProblemTitle={soloTimerProblem}
      />
    </div>
  );
}
