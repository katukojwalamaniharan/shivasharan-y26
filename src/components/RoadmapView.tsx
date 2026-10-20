import React, { useState } from 'react';
import { CheckSquare, Square, Calendar, Save } from 'lucide-react';
import { UserProgressDoc } from '../types';
import { FOUR_SEMESTER_ROADMAP, WEEKLY_ROUTINE_ITEMS } from '../data/seedData';

interface RoadmapViewProps {
  progress: UserProgressDoc;
  examLightMode: boolean;
  onToggleRoadmapTask: (taskId: string) => Promise<void>;
  onToggleRoutineTask: (routineId: string) => Promise<void>;
  onUpdateOpenItems: (fields: {
    weekdayHours: string;
    weekendHours: string;
    sem1ExamDates: string;
    week1JavaCheckResult: string;
  }) => Promise<void>;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  progress,
  examLightMode,
  onToggleRoadmapTask,
  onToggleRoutineTask,
  onUpdateOpenItems,
}) => {
  const [selectedSemester, setSelectedSemester] = useState<number>(1);
  const [weekdayHours, setWeekdayHours] = useState<string>(progress.weekdayHours);
  const [weekendHours, setWeekendHours] = useState<string>(progress.weekendHours);
  const [sem1ExamDates, setSem1ExamDates] = useState<string>(progress.sem1ExamDates);
  const [week1JavaCheckResult, setWeek1JavaCheckResult] = useState<string>(
    progress.week1JavaCheckResult
  );
  const [savingMeta, setSavingMeta] = useState<boolean>(false);

  const phasesForSemester = FOUR_SEMESTER_ROADMAP.filter(
    (phase) => phase.semester === selectedSemester
  );

  const allRoadmapTaskIds = FOUR_SEMESTER_ROADMAP.flatMap((p) => p.tasks.map((t) => t.id));
  const completedCount = allRoadmapTaskIds.filter((id) =>
    progress.checkedRoadmapIds.includes(id)
  ).length;

  const handleSaveOpenItems = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingMeta(true);
    try {
      await onUpdateOpenItems({
        weekdayHours,
        weekendHours,
        sem1ExamDates,
        week1JavaCheckResult,
      });
    } finally {
      setSavingMeta(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-medium text-indigo-400">
            Oct 19, 2026 – Oct 2028 · 4-Semester FAANG Execution Plan
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-100">
            Interactive 2-Year Roadmap & Weekly Routine Checklist
          </h1>
          <p className="mt-1 text-sm text-slate-400 max-w-3xl">
            By Apr 2027 (Sem 1): solid Java, 150 DSA problems you can re-solve cold, 2 projects on GitHub, and clear spoken explanations. Semesters 2–4 scale into DP, Graphs, OS, DBMS, Computer Networks, and Google/FAANG internship readiness.
          </p>
        </div>

        <div className="font-mono-tabular text-sm text-slate-300">
          <span className="text-slate-500">Milestones Completed:</span>{' '}
          <span className="font-bold text-emerald-400">{completedCount}</span> /{' '}
          {allRoadmapTaskIds.length}
        </div>
      </div>

      {/* Weekly Routine + Open Items Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch">
        {/* Weekly Routine Card */}
        <div className="lg:col-span-7 rounded-xl border border-slate-800 bg-[#111827] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-semibold text-slate-100">
                Weekly Operating Routine (15–18 hrs/week)
              </h2>
              <span className="text-xs text-slate-400">
                {examLightMode ? 'Exam Light Mode Active (30–45m revision only)' : 'Standard Growth Mode'}
              </span>
            </div>

            <div className="mt-4 divide-y divide-slate-800/70">
              {WEEKLY_ROUTINE_ITEMS.map((item) => {
                const isChecked = progress.checkedRoutineIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onToggleRoutineTask(item.id)}
                    className="flex w-full items-start gap-3 py-3 text-left hover:bg-slate-800/20 transition-colors"
                  >
                    {isChecked ? (
                      <CheckSquare className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    ) : (
                      <Square className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="font-medium text-indigo-400">{item.dayLabel}</span>
                      </div>
                      <div
                        className={`text-sm font-medium ${
                          isChecked ? 'line-through text-slate-500' : 'text-slate-100'
                        }`}
                      >
                        {item.title}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">{item.detail}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Open Items Card from PDF */}
        <form
          onSubmit={handleSaveOpenItems}
          className="lg:col-span-5 rounded-xl border border-slate-800 bg-[#111827] p-6 flex flex-col justify-between space-y-4"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-indigo-400" />
                <h2 className="text-base font-semibold text-slate-100">
                  Roadmap Open Items & Calibration
                </h2>
              </div>
              <span className="text-xs text-slate-400">From Page 3 of Roadmap PDF</span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                1. Confirmed Weekday & Weekend Hours
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={weekdayHours}
                  onChange={(e) => setWeekdayHours(e.target.value)}
                  placeholder="Weekdays: 2 hrs/day"
                  className="rounded-lg border border-slate-800 bg-[#0B0F17] px-3 py-1.5 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
                />
                <input
                  type="text"
                  value={weekendHours}
                  onChange={(e) => setWeekendHours(e.target.value)}
                  placeholder="Weekends: 5–6 hrs/day"
                  className="rounded-lg border border-slate-800 bg-[#0B0F17] px-3 py-1.5 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                2. Sem-1 Exam Dates (Triggers Light Mode: 30–45m old revision)
              </label>
              <input
                type="text"
                value={sem1ExamDates}
                onChange={(e) => setSem1ExamDates(e.target.value)}
                placeholder="e.g., Mid-terms Dec 10–16, Finals Mar 25–Apr 5"
                className="w-full rounded-lg border border-slate-800 bg-[#0B0F17] px-3 py-1.5 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                3. Result of Week 1 Java Check (FizzBuzz, Reverse Array, Class + Constructor)
              </label>
              <textarea
                rows={2}
                value={week1JavaCheckResult}
                onChange={(e) => setWeek1JavaCheckResult(e.target.value)}
                placeholder="Log outcome of Week 1 check to decide if Month 1 can be shortened..."
                className="w-full rounded-lg border border-slate-800 bg-[#0B0F17] p-2.5 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={savingMeta}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors whitespace-nowrap shrink-0"
          >
            <Save className="h-3.5 w-3.5" />
            {savingMeta ? 'Saving Calibration...' : 'Save Roadmap Calibration'}
          </button>
        </form>
      </div>

      {/* Semester Selector Tabs */}
      <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-[#111827] p-1.5 overflow-x-auto">
        {[
          { sem: 1, label: 'Sem 1: Java + DSA Foundation (Oct 2026 – Apr 2027)' },
          { sem: 2, label: 'Sem 2: Heaps, Graphs, DP + OS/DBMS (May – Oct 2027)' },
          { sem: 3, label: 'Sem 3: CN, LLD, Hard Patterns & Contests (Nov 2027 – Apr 2028)' },
          { sem: 4, label: 'Sem 4: 2nd-Year FAANG Mocks & Sprint (May – Oct 2028)' },
        ].map((tab) => (
          <button
            key={tab.sem}
            type="button"
            onClick={() => setSelectedSemester(tab.sem)}
            className={`flex-1 rounded-lg px-4 py-2.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
              selectedSemester === tab.sem
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Monthly Roadmap Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {phasesForSemester.map((phase) => {
          const doneInPhase = phase.tasks.filter((t) =>
            progress.checkedRoadmapIds.includes(t.id)
          ).length;
          const pct = Math.round((doneInPhase / phase.tasks.length) * 100);

          return (
            <div
              key={phase.id}
              className="flex flex-col justify-between rounded-xl border border-slate-800 bg-[#111827] p-6"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-indigo-400">{phase.monthLabel}</span>
                    <span>·</span>
                    <span>{phase.windowLabel}</span>
                  </div>
                  <span className="font-mono-tabular text-slate-300">
                    Target: {phase.targetProblems} Problems · {doneInPhase}/{phase.tasks.length} ({pct}%)
                  </span>
                </div>

                <h3 className="mt-2 text-lg font-bold text-slate-100">{phase.title}</h3>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">{phase.summary}</p>

                {/* Progress Bar */}
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full bg-emerald-500 transition-transform duration-200 origin-left"
                    style={{ transform: `scaleX(${pct / 100})` }}
                  />
                </div>

                {/* Checklist Items */}
                <div className="mt-4 divide-y divide-slate-800/70">
                  {phase.tasks.map((task) => {
                    const checked = progress.checkedRoadmapIds.includes(task.id);
                    return (
                      <button
                        key={task.id}
                        type="button"
                        onClick={() => onToggleRoadmapTask(task.id)}
                        className="flex w-full items-start gap-3 py-3 text-left hover:bg-slate-800/20 transition-colors"
                      >
                        {checked ? (
                          <CheckSquare className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                        ) : (
                          <Square className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <span
                              className={
                                task.isCheckpoint
                                  ? 'font-semibold text-amber-400'
                                  : 'text-indigo-400'
                              }
                            >
                              {task.tag}
                            </span>
                          </div>
                          <div
                            className={`text-xs font-medium mt-0.5 ${
                              checked
                                ? 'line-through text-slate-500'
                                : task.isCheckpoint
                                ? 'text-amber-200 font-semibold'
                                : 'text-slate-100'
                            }`}
                          >
                            {task.title}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">{task.detail}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
