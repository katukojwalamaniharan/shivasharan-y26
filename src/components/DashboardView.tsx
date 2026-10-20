import React from 'react';
import {
  Timer,
  Mic,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  RotateCcw,
} from 'lucide-react';
import {
  UserProfile,
  UserProgressDoc,
  ProblemLogDoc,
  PatternNoteDoc,
  ActivityLogDoc,
  ActiveTab,
} from '../types';
import {
  CURATED_DSA_PROBLEMS,
  DSA_PATTERNS_LIST,
  FOUR_SEMESTER_ROADMAP,
  WEEKLY_ROUTINE_ITEMS,
} from '../data/seedData';
import { ContributionHeatmap } from './ContributionHeatmap';

interface DashboardViewProps {
  profile: UserProfile;
  progress: UserProgressDoc;
  problemLogs: Record<string, ProblemLogDoc>;
  patternNotes: PatternNoteDoc[];
  activityLogs: Record<string, ActivityLogDoc>;
  onNavigate: (tab: ActiveTab) => void;
  onOpenSoloTimer: (problemTitle?: string) => void;
  onToggleExamLightMode: () => Promise<void>;
  onToggleRoutineTask: (routineId: string) => Promise<void>;
  onQuickColdReSolve: (log: ProblemLogDoc) => Promise<void>;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  progress,
  problemLogs,
  patternNotes,
  activityLogs,
  onNavigate,
  onOpenSoloTimer,
  onToggleExamLightMode,
  onToggleRoutineTask,
  onQuickColdReSolve,
}) => {
  const nowMs = Date.now();
  const logsArray: ProblemLogDoc[] = Object.values(problemLogs);

  const solvedCount = logsArray.filter(
    (l) => l.status === 'solved' || l.status === 'mastered'
  ).length;
  const masteredCount = logsArray.filter((l) => l.status === 'mastered').length;
  const dueRevisions = logsArray.filter(
    (l) => l.status === 'solved' && (l.nextReviewAtMs <= nowMs || l.usedHint)
  );
  const spokenExplanationsCount =
    logsArray.filter((l) => l.spokenExplanationDone).length +
    patternNotes.filter((n) => n.spokenDurationSec > 0).length;

  const allRoadmapTasks = FOUR_SEMESTER_ROADMAP.flatMap((p) => p.tasks);
  const sem1Tasks = FOUR_SEMESTER_ROADMAP.filter((p) => p.semester === 1).flatMap(
    (p) => p.tasks
  );
  const sem1DoneCount = sem1Tasks.filter((t) =>
    progress.checkedRoadmapIds.includes(t.id)
  ).length;
  const sem1Pct = Math.round((sem1DoneCount / sem1Tasks.length) * 100);

  return (
    <div className="space-y-8">
      {/* Top Hero Split: Goal & Exam Mode Control */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch">
        <div className="lg:col-span-8 flex flex-col justify-between rounded-xl border border-slate-800 bg-[#111827] p-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-indigo-400">
                Foundation Phase · Oct 2026 – Apr 2027
              </span>
              <span>·</span>
              <span>Long-Term Target: Google / FAANG by 2nd Year</span>
              <span>·</span>
              <span>{progress.weekdayHours || '2h/weekday'} & {progress.weekendHours || '5–6h/weekend'}</span>
            </div>

            <h1 className="mt-2 text-2xl font-bold text-slate-100 sm:text-3xl">
              {profile.displayName}’s FAANG Mastery Command Center
            </h1>

            <p className="mt-2 text-sm text-slate-300 leading-relaxed max-w-2xl">
              By Apr 2027: solid Java, 150 DSA problems you can re-solve cold, 2 projects on GitHub, and clear 2-minute spoken explanations. Quality over quantity—never duplicate sheets before Month 6.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 pt-2 border-t border-slate-800/80">
            <button
              type="button"
              onClick={() => onNavigate('dsa')}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors whitespace-nowrap shrink-0"
            >
              <span>Open DSA Problem Tracker</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={() => onOpenSoloTimer()}
              className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
            >
              <Timer className="h-3.5 w-3.5 text-indigo-400" />
              Start 25–30m Solo Timer
            </button>

            <button
              type="button"
              onClick={() => onNavigate('spoken')}
              className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
            >
              <Mic className="h-3.5 w-3.5 text-emerald-400" />
              Record 2-Min Explanation
            </button>
          </div>
        </div>

        {/* Right 4 cols: Exam Week Light Mode & Today's Operating Mode */}
        <div className="lg:col-span-4 flex flex-col justify-between rounded-xl border border-slate-800 bg-[#111827] p-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">
                Current Schedule Posture
              </span>
              <span
                className={`text-xs font-semibold ${
                  profile.examLightMode ? 'text-amber-400' : 'text-emerald-400'
                }`}
              >
                {profile.examLightMode ? 'Exam Week Light Mode' : 'Full Growth Mode (15–18h/wk)'}
              </span>
            </div>

            <h2 className="mt-2 text-lg font-bold text-slate-100">
              {profile.examLightMode
                ? '30–45 Min Old Problem Revision Only'
                : 'Mon–Fri 2h · Sat 5h · Sun Consolidation'}
            </h2>

            <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
              {profile.examLightMode
                ? 'Exam Mode is active: pause new topics and spend 30–45 minutes revising previously solved problems from your 7-day queue.'
                : 'Try every problem 25–30 minutes alone on paper before taking a hint, then explain aloud for 2 minutes.'}
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Sem-1 Exam Window:</span>
              <span className="font-mono-tabular text-slate-200">
                {progress.sem1ExamDates || 'Not set yet'}
              </span>
            </div>
            <button
              type="button"
              onClick={onToggleExamLightMode}
              className={`w-full rounded-lg px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                profile.examLightMode
                  ? 'bg-amber-600 text-white hover:bg-amber-500'
                  : 'border border-slate-700 bg-[#0B0F17] text-slate-200 hover:border-amber-500/50 hover:text-amber-300'
              }`}
            >
              {profile.examLightMode
                ? 'Disable Exam Light Mode (Return to Normal)'
                : 'Activate Exam Week Light Mode (30–45m Revision)'}
            </button>
          </div>
        </div>
      </div>

      {/* Full-Width 4-Column KPI Telemetry Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-[#111827] p-5">
          <div className="text-xs text-slate-400">
            Sem 1 DSA Problem Target (By Apr 2027)
          </div>
          <div className="mt-2 flex items-baseline justify-between font-mono-tabular">
            <span className="text-3xl font-bold text-slate-100">{solvedCount}</span>
            <span className="text-xs text-indigo-400">
              {Math.min(100, Math.round((solvedCount / 150) * 100))}% of 150 Goal
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full bg-indigo-500 transition-transform duration-200 origin-left"
              style={{ transform: `scaleX(${Math.min(1, solvedCount / 150)})` }}
            />
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#111827] p-5">
          <div className="text-xs text-slate-400">
            7-Day Cold Re-Solved Mastery
          </div>
          <div className="mt-2 flex items-baseline justify-between font-mono-tabular">
            <span className="text-3xl font-bold text-emerald-400">{masteredCount}</span>
            <span className="text-xs text-slate-400">
              {dueRevisions.length} due in queue
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full bg-emerald-500 transition-transform duration-200 origin-left"
              style={{
                transform: `scaleX(${
                  solvedCount > 0 ? Math.min(1, masteredCount / solvedCount) : 0
                })`,
              }}
            />
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#111827] p-5">
          <div className="text-xs text-slate-400">
            Sem 1 Foundation Checkpoints (M1–M6)
          </div>
          <div className="mt-2 flex items-baseline justify-between font-mono-tabular">
            <span className="text-3xl font-bold text-slate-100">
              {sem1DoneCount}/{sem1Tasks.length}
            </span>
            <span className="text-xs text-emerald-400">{sem1Pct}% Done</span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full bg-emerald-500 transition-transform duration-200 origin-left"
              style={{ transform: `scaleX(${sem1Pct / 100})` }}
            />
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#111827] p-5">
          <div className="text-xs text-slate-400">
            2-Min Spoken Walkthroughs & Pattern Notes
          </div>
          <div className="mt-2 flex items-baseline justify-between font-mono-tabular">
            <span className="text-3xl font-bold text-indigo-400">
              {spokenExplanationsCount}
            </span>
            <span className="text-xs text-slate-400">
              {patternNotes.length} written notes
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-500">
            Aptitude: {progress.aptitudeSessionsDone} sessions · Contests: {progress.contestsAttended}
          </div>
        </div>
      </div>

      {/* 12-Month Contribution Heatmap Component */}
      <ContributionHeatmap activityLogs={activityLogs} />

      {/* Bottom 2-Column Split: 7-Day Review Queue + DSA Pattern Mastery */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch">
        {/* 7-Day Cold Re-Solve Queue & Today's Routine */}
        <div className="lg:col-span-6 flex flex-col justify-between rounded-xl border border-slate-800 bg-[#111827] p-6 space-y-6">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4 text-amber-400" />
                <h2 className="text-base font-semibold text-slate-100">
                  7-Day Cold Re-Solve Queue ({dueRevisions.length})
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('dsa')}
                className="text-xs font-medium text-indigo-400 hover:underline"
              >
                View All Problems →
              </button>
            </div>

            {dueRevisions.length === 0 ? (
              <div className="mt-4 rounded-lg border border-slate-800/80 bg-[#0B0F17] p-5 text-center">
                <p className="text-xs font-medium text-slate-300">
                  All 7-day reviews are caught up!
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  When you mark new DSA problems as Solved (or Used Hint), they will automatically surface here for your cold re-solve check.
                </p>
              </div>
            ) : (
              <div className="mt-3 divide-y divide-slate-800/80">
                {dueRevisions.slice(0, 5).map((item) => (
                  <div
                    key={item.problemId}
                    className="flex items-center justify-between gap-3 py-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="text-indigo-400 font-medium">{item.pattern}</span>
                        <span>·</span>
                        <span>{item.difficulty}</span>
                        {item.usedHint && (
                          <>
                            <span>·</span>
                            <span className="text-amber-400">Used Hint</span>
                          </>
                        )}
                      </div>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-slate-100 hover:text-indigo-400"
                      >
                        {item.title}
                      </a>
                    </div>

                    <button
                      type="button"
                      onClick={() => onQuickColdReSolve(item)}
                      className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-500 transition-colors whitespace-nowrap shrink-0"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Re-Solved Cold
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Daily Routine Quick Check */}
          <div className="border-t border-slate-800 pt-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-100">
                Daily Routine Quick Check-In
              </h3>
              <button
                type="button"
                onClick={() => onNavigate('roadmap')}
                className="text-xs text-indigo-400 hover:underline"
              >
                Full Roadmap →
              </button>
            </div>
            <div className="space-y-2">
              {WEEKLY_ROUTINE_ITEMS.slice(0, 3).map((r) => {
                const checked = progress.checkedRoutineIds.includes(r.id);
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => onToggleRoutineTask(r.id)}
                    className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-xs transition-colors ${
                      checked
                        ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-300'
                        : 'border-slate-800 bg-[#0B0F17] text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="truncate pr-2">
                      <strong>{r.dayLabel}:</strong> {r.title}
                    </span>
                    <span className="font-mono-tabular shrink-0 text-[11px]">
                      {checked ? 'Done' : 'Check'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 6 cols: Pattern Coverage Analytics */}
        <div className="lg:col-span-6 flex flex-col justify-between rounded-xl border border-slate-800 bg-[#111827] p-6">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-indigo-400" />
                <h2 className="text-base font-semibold text-slate-100">
                  DSA Pattern Mastery Telemetry
                </h2>
              </div>
              <span className="text-xs text-slate-400 font-mono-tabular">
                {allRoadmapTasks.filter((t) => progress.checkedRoadmapIds.includes(t.id)).length}/
                {allRoadmapTasks.length} Total Roadmap Tasks
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {DSA_PATTERNS_LIST.slice(0, 10).map((pat) => {
                const totalInPat = CURATED_DSA_PROBLEMS.filter((p) => p.pattern === pat).length || 5;
                const solvedInPat = logsArray.filter(
                  (l) =>
                    l.pattern === pat && (l.status === 'solved' || l.status === 'mastered')
                ).length;
                const masteredInPat = logsArray.filter(
                  (l) => l.pattern === pat && l.status === 'mastered'
                ).length;
                const pct = Math.min(100, Math.round((solvedInPat / totalInPat) * 100));

                return (
                  <div key={pat} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-200">{pat}</span>
                      <span className="font-mono-tabular text-slate-400">
                        {solvedInPat}/{totalInPat} solved · {masteredInPat} cold
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full bg-indigo-500 transition-transform duration-200 origin-left"
                        style={{ transform: `scaleX(${pct / 100})` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
