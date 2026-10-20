export interface UserProfile {
  uid: string;
  displayName: string;
  role: 'admin' | 'member';
  canEditResources: boolean;
  examLightMode: boolean;
  workspaceId: 'faang-hub';
  solvedCount: number;
  masteredCount: number;
  spokenCount: number;
  roadmapDoneCount: number;
  streakDays: number;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface ResourceDoc {
  id: string;
  title: string;
  category: string;
  typeFocus: string;
  priority: 'High' | 'Optional' | 'Reference' | 'Parked';
  recommendedUse: string;
  url: string;
  status: 'Not started' | 'In progress' | 'Completed' | 'Reference';
  notes: string;
  visibility: 'workspace';
  updatedBy: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface UserProgressDoc {
  userId: string;
  checkedRoadmapIds: string[];
  checkedRoutineIds: string[];
  checkedCsFundamentalsIds: string[];
  aptitudeSessionsDone: number;
  logicPuzzlesDone: number;
  mockInterviewsDone: number;
  contestsAttended: number;
  weekdayHours: string;
  weekendHours: string;
  sem1ExamDates: string;
  week1JavaCheckResult: string;
  updatedAt?: unknown;
}

export interface ProblemLogDoc {
  id: string;
  userId: string;
  problemId: string;
  title: string;
  pattern: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  url: string;
  status: 'todo' | 'solved' | 'mastered';
  usedHint: boolean;
  spokenExplanationDone: boolean;
  solvedAtMs: number;
  nextReviewAtMs: number;
  reSolvedCount: number;
  notes: string;
  updatedAt?: unknown;
}

export interface PatternNoteDoc {
  id: string;
  userId: string;
  patternName: string;
  problemTitle: string;
  coreIntuition: string;
  complexityAnalysis: string;
  spokenDurationSec: number;
  selfRating: number;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface ActivityLogDoc {
  id: string;
  userId: string;
  date: string;
  problemsSolved: number;
  revisionsCompleted: number;
  spokenRecorded: number;
  roadmapTasksDone: number;
  aptitudeDone: number;
  totalActions: number;
  updatedAt?: unknown;
}

export type ActiveTab =
  | 'dashboard'
  | 'roadmap'
  | 'dsa'
  | 'resources'
  | 'spoken'
  | 'cs_aptitude'
  | 'admin';
