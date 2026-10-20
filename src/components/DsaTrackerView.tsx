import React, { useState } from 'react';
import {
  Search,
  Plus,
  ExternalLink,
  Timer,
  Mic,
  CheckCircle2,
  RotateCcw,
  FileText,
  X,
  Layers,
  List,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { ProblemLogDoc } from '../types';
import { CURATED_DSA_PROBLEMS, DSA_PATTERNS_LIST, DsaProblemSeed } from '../data/seedData';

interface DsaTrackerViewProps {
  problemLogs: Record<string, ProblemLogDoc>;
  onUpsertProblemLog: (payload: {
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
  }) => Promise<void>;
  onOpenSoloTimer: (problemTitle: string) => void;
  onOpenSpokenStudio: (problemTitle: string, patternName: string) => void;
}

export const DsaTrackerView: React.FC<DsaTrackerViewProps> = ({
  problemLogs,
  onUpsertProblemLog,
  onOpenSoloTimer,
  onOpenSpokenStudio,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPattern, setSelectedPattern] = useState<string>('All');
  const [selectedSheetFilter, setSelectedSheetFilter] = useState<
    'all' | 'striver' | 'neetcode' | 'overlap'
  >('all');
  const [selectedStatusTab, setSelectedStatusTab] = useState<
    'all' | 'review_due' | 'solved' | 'mastered' | 'todo'
  >('all');
  const [layoutMode, setLayoutMode] = useState<'grouped' | 'table'>('grouped');
  const [collapsedPatterns, setCollapsedPatterns] = useState<Record<string, boolean>>({});

  // Custom problem modal
  const [isCustomModalOpen, setIsCustomModalOpen] = useState<boolean>(false);
  const [customTitle, setCustomTitle] = useState<string>('');
  const [customPattern, setCustomPattern] = useState<string>(DSA_PATTERNS_LIST[0]);
  const [customDifficulty, setCustomDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [customUrl, setCustomUrl] = useState<string>('https://leetcode.com/problemset/');
  const [customNotes, setCustomNotes] = useState<string>('');

  // Note / Detail Drawer Modal
  const [editingProblem, setEditingProblem] = useState<DsaProblemSeed | null>(null);
  const [drawerNotes, setDrawerNotes] = useState<string>('');
  const [drawerUsedHint, setDrawerUsedHint] = useState<boolean>(false);
  const [drawerSpokenDone, setDrawerSpokenDone] = useState<boolean>(false);

  const nowMs = Date.now();

  // Merge curated Striver A2Z + NeetCode 150 seeds with any custom logged problems
  const customProblems: DsaProblemSeed[] = (Object.values(problemLogs) as ProblemLogDoc[])
    .filter((log) => !CURATED_DSA_PROBLEMS.some((seed) => seed.problemId === log.problemId))
    .map((log) => ({
      problemId: log.problemId,
      title: log.title,
      pattern: log.pattern,
      subPattern: 'Custom Logged Problems',
      striverStep: 'Custom / Contest',
      sourceSheet: 'Striver A2Z',
      difficulty: log.difficulty,
      recommendedMonth: 'Custom Log',
      url: log.url,
    }));

  const allProblems: DsaProblemSeed[] = [...CURATED_DSA_PROBLEMS, ...customProblems];

  const isReviewDue = (log?: ProblemLogDoc): boolean => {
    if (!log || log.status !== 'solved') return false;
    return log.nextReviewAtMs <= nowMs || log.usedHint;
  };

  const reviewDueCount = allProblems.filter((p) => isReviewDue(problemLogs[p.problemId])).length;
  const solvedCount = allProblems.filter((p) => {
    const st = problemLogs[p.problemId]?.status;
    return st === 'solved' || st === 'mastered';
  }).length;
  const masteredCount = allProblems.filter(
    (p) => problemLogs[p.problemId]?.status === 'mastered'
  ).length;

  const striverTotalCount = allProblems.filter((p) =>
    p.sourceSheet.includes('Striver A2Z')
  ).length;

  const filteredProblems = allProblems.filter((p) => {
    const log = problemLogs[p.problemId];
    const status = log?.status ?? 'todo';
    const due = isReviewDue(log);

    const matchesSearch =
      !searchQuery.trim() ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.pattern.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subPattern.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.striverStep.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPattern = selectedPattern === 'All' || p.pattern === selectedPattern;

    const matchesSheet =
      selectedSheetFilter === 'all' ||
      (selectedSheetFilter === 'striver' && p.sourceSheet.includes('Striver A2Z')) ||
      (selectedSheetFilter === 'neetcode' && p.sourceSheet.includes('NeetCode 150')) ||
      (selectedSheetFilter === 'overlap' &&
        p.sourceSheet === 'Striver A2Z + NeetCode 150');

    const matchesTab =
      selectedStatusTab === 'all' ||
      (selectedStatusTab === 'review_due' && due) ||
      (selectedStatusTab === 'solved' && (status === 'solved' || status === 'mastered')) ||
      (selectedStatusTab === 'mastered' && status === 'mastered') ||
      (selectedStatusTab === 'todo' && status === 'todo');

    return matchesSearch && matchesPattern && matchesSheet && matchesTab;
  });

  const handleMarkSolved = async (problem: DsaProblemSeed, usedHint = false) => {
    const existing = problemLogs[problem.problemId];
    await onUpsertProblemLog({
      problemId: problem.problemId,
      title: problem.title,
      pattern: problem.pattern,
      difficulty: problem.difficulty,
      url: problem.url,
      status: 'solved',
      usedHint: usedHint || (existing?.usedHint ?? false),
      spokenExplanationDone: existing?.spokenExplanationDone ?? false,
      notes: existing?.notes ?? '',
    });
  };

  const handleMarkColdReSolved = async (problem: DsaProblemSeed) => {
    const existing = problemLogs[problem.problemId];
    await onUpsertProblemLog({
      problemId: problem.problemId,
      title: problem.title,
      pattern: problem.pattern,
      difficulty: problem.difficulty,
      url: problem.url,
      status: 'mastered',
      usedHint: false,
      spokenExplanationDone: existing?.spokenExplanationDone ?? true,
      notes: existing?.notes ?? '',
      markColdReSolve: true,
    });
  };

  const handleResetToTodo = async (problem: DsaProblemSeed) => {
    const existing = problemLogs[problem.problemId];
    await onUpsertProblemLog({
      problemId: problem.problemId,
      title: problem.title,
      pattern: problem.pattern,
      difficulty: problem.difficulty,
      url: problem.url,
      status: 'todo',
      usedHint: false,
      spokenExplanationDone: false,
      notes: existing?.notes ?? '',
    });
  };

  const openProblemDrawer = (problem: DsaProblemSeed) => {
    const existing = problemLogs[problem.problemId];
    setEditingProblem(problem);
    setDrawerNotes(existing?.notes ?? '');
    setDrawerUsedHint(existing?.usedHint ?? false);
    setDrawerSpokenDone(existing?.spokenExplanationDone ?? false);
  };

  const handleSaveDrawer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProblem) return;
    const existing = problemLogs[editingProblem.problemId];
    await onUpsertProblemLog({
      problemId: editingProblem.problemId,
      title: editingProblem.title,
      pattern: editingProblem.pattern,
      difficulty: editingProblem.difficulty,
      url: editingProblem.url,
      status: existing?.status && existing.status !== 'todo' ? existing.status : 'solved',
      usedHint: drawerUsedHint,
      spokenExplanationDone: drawerSpokenDone,
      notes: drawerNotes,
    });
    setEditingProblem(null);
  };

  const handleCreateCustomProblem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;
    const slug = `custom_${customTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .slice(0, 48)}_${Date.now().toString(36)}`;
    await onUpsertProblemLog({
      problemId: slug,
      title: customTitle.trim(),
      pattern: customPattern,
      difficulty: customDifficulty,
      url: customUrl.trim() || 'https://leetcode.com',
      status: 'solved',
      usedHint: false,
      spokenExplanationDone: false,
      notes: customNotes.trim(),
    });
    setCustomTitle('');
    setCustomNotes('');
    setIsCustomModalOpen(false);
  };

  const formatDaysUntilReview = (log?: ProblemLogDoc): string => {
    if (!log || log.status === 'todo') return 'Not solved yet';
    if (log.status === 'mastered') return `Cold Re-Solved (${log.reSolvedCount}x)`;
    const diffDays = Math.ceil((log.nextReviewAtMs - nowMs) / (1000 * 60 * 60 * 24));
    if (log.usedHint) return 'Hint used → Due for 7-day cold re-solve';
    if (diffDays <= 0) return '7-Day Review Due Now';
    return `7-day re-solve in ${diffDays}d`;
  };

  const togglePatternCollapse = (pat: string) => {
    setCollapsedPatterns((prev) => ({ ...prev, [pat]: !prev[pat] }));
  };

  // Group filteredProblems by Pattern -> SubPattern
  const groupedByPattern = DSA_PATTERNS_LIST.map((patternName, idx) => {
    const problemsInPattern = filteredProblems.filter((p) => p.pattern === patternName);
    const allInPattern = allProblems.filter((p) => p.pattern === patternName);
    const solvedInPattern = allInPattern.filter((p) => {
      const st = problemLogs[p.problemId]?.status;
      return st === 'solved' || st === 'mastered';
    }).length;
    const masteredInPattern = allInPattern.filter(
      (p) => problemLogs[p.problemId]?.status === 'mastered'
    ).length;

    // Group by subPattern preserving order
    const subPatternMap = new Map<string, DsaProblemSeed[]>();
    problemsInPattern.forEach((prob) => {
      const key = prob.subPattern || 'Core Pattern Problems';
      const existingList = subPatternMap.get(key) || [];
      existingList.push(prob);
      subPatternMap.set(key, existingList);
    });

    return {
      index: idx + 1,
      patternName,
      problemsInPattern,
      totalInPattern: allInPattern.length,
      solvedInPattern,
      masteredInPattern,
      subPatterns: Array.from(subPatternMap.entries()),
    };
  }).filter((group) => group.problemsInPattern.length > 0);

  const renderProblemRow = (prob: DsaProblemSeed) => {
    const log = problemLogs[prob.problemId];
    const status = log?.status ?? 'todo';
    const due = isReviewDue(log);

    return (
      <tr key={prob.problemId} className="hover:bg-slate-800/30 transition-colors">
        <td className="py-3.5 px-4 align-top">
          <div className="flex flex-wrap items-center gap-2 text-slate-400 mb-1">
            <span className="font-medium text-indigo-400">{prob.striverStep}</span>
            <span aria-hidden="true">·</span>
            <span
              className={
                prob.difficulty === 'Easy'
                  ? 'text-emerald-400 font-medium'
                  : prob.difficulty === 'Medium'
                  ? 'text-amber-400 font-medium'
                  : 'text-rose-400 font-medium'
              }
            >
              {prob.difficulty}
            </span>
            <span aria-hidden="true">·</span>
            <span>{prob.sourceSheet}</span>
            <span aria-hidden="true">·</span>
            <span>{prob.recommendedMonth}</span>
          </div>
          <a
            href={prob.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-100 hover:text-indigo-400 transition-colors"
          >
            <span>{prob.title}</span>
            <ExternalLink className="h-3.5 w-3.5 text-slate-500 shrink-0" />
          </a>
        </td>

        <td className="py-3.5 px-4 align-top font-mono-tabular">
          <div
            className={
              status === 'mastered'
                ? 'text-emerald-400 font-medium'
                : due
                ? 'text-amber-400 font-medium'
                : status === 'solved'
                ? 'text-indigo-300'
                : 'text-slate-500'
            }
          >
            {formatDaysUntilReview(log)}
          </div>
          {log?.usedHint && (
            <div className="mt-0.5 text-slate-400">Solved with hint after 30m</div>
          )}
        </td>

        <td className="py-3.5 px-4 align-top">
          <div className="flex items-center gap-2 text-slate-300">
            <span>Spoken: {log?.spokenExplanationDone ? 'Completed' : 'Pending'}</span>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => openProblemDrawer(prob)}
              className="inline-flex items-center gap-1 text-indigo-400 hover:underline whitespace-nowrap shrink-0"
            >
              <FileText className="h-3.5 w-3.5" />
              {log?.notes ? 'View/Edit Notes' : 'Add Note'}
            </button>
          </div>
          {log?.notes && (
            <p className="mt-1 line-clamp-1 max-w-xs text-slate-500">{log.notes}</p>
          )}
        </td>

        <td className="py-3.5 px-4 align-top text-right whitespace-nowrap">
          <div className="inline-flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onOpenSoloTimer(prob.title)}
              className="rounded-lg border border-slate-800 bg-[#0B0F17] px-2.5 py-1.5 text-xs text-slate-300 hover:border-slate-700 hover:text-white transition-colors whitespace-nowrap shrink-0"
              title="Start 30-min solo timer"
            >
              30m Timer
            </button>

            <button
              type="button"
              onClick={() => onOpenSpokenStudio(prob.title, prob.pattern)}
              className="rounded-lg border border-slate-800 bg-[#0B0F17] p-1.5 text-slate-300 hover:border-indigo-500/50 hover:text-indigo-400 transition-colors"
              title="Record 2-minute spoken explanation"
            >
              <Mic className="h-3.5 w-3.5" />
            </button>

            {status === 'todo' && (
              <>
                <button
                  type="button"
                  onClick={() => handleMarkSolved(prob, false)}
                  className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-500 transition-colors whitespace-nowrap shrink-0"
                >
                  Mark Solved (+7d)
                </button>
                <button
                  type="button"
                  onClick={() => handleMarkSolved(prob, true)}
                  className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-2.5 py-1.5 text-xs font-medium text-amber-300 hover:bg-amber-500/20 transition-colors whitespace-nowrap shrink-0"
                >
                  Used Hint
                </button>
              </>
            )}

            {status === 'solved' && (
              <button
                type="button"
                onClick={() => handleMarkColdReSolved(prob)}
                className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-500 transition-colors whitespace-nowrap shrink-0"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Re-Solved Cold
              </button>
            )}

            {status === 'mastered' && (
              <button
                type="button"
                onClick={() => handleMarkColdReSolved(prob)}
                className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1.5 text-xs font-medium text-emerald-300 hover:bg-emerald-500/20 transition-colors whitespace-nowrap shrink-0"
              >
                +1 Cold Re-Solve ({log?.reSolvedCount || 1}x)
              </button>
            )}

            {status !== 'todo' && (
              <button
                type="button"
                onClick={() => handleResetToTodo(prob)}
                className="rounded-lg border border-slate-800 bg-[#0B0F17] p-1.5 text-slate-500 hover:text-slate-300"
                title="Reset status"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-medium text-indigo-400">
            Striver A2Z DSA Sheet + NeetCode 150 · Organized by Pattern & Sub-Pattern
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-100">
            Pattern-Based Striver A2Z & NeetCode Problem Tracker
          </h1>
          <p className="mt-1 text-sm text-slate-400 max-w-3xl">
            Every high-yield problem from Striver A2Z Steps 1–17 and NeetCode 150, structured into logical sub-patterns (e.g., Binary Search on Answer, Exact-K Sliding Window, Boyer-Moore Voting, Monotonic Stack, Topo Sort, 7 DP Sub-Patterns) with automatic 7-day cold re-solve tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-[#111827] px-3.5 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
          >
            <span>Striver A2Z Official Sheet</span>
            <ExternalLink className="h-3.5 w-3.5 text-indigo-400" />
          </a>

          <button
            type="button"
            onClick={() => onOpenSoloTimer('DSA Problem Practice')}
            className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
          >
            <Timer className="h-4 w-4 text-indigo-400" />
            30m Solo Timer
          </button>

          <button
            type="button"
            onClick={() => setIsCustomModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors whitespace-nowrap shrink-0"
          >
            <Plus className="h-4 w-4" />
            Log Custom Problem
          </button>
        </div>
      </div>

      {/* Summary Strip */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-[#111827] p-4">
          <div className="text-xs text-slate-400">Total Solved (Sem 1 Goal: 150)</div>
          <div className="mt-1 font-mono-tabular text-2xl font-bold text-slate-100">
            {solvedCount} <span className="text-sm font-normal text-slate-500">/ 150</span>
          </div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-[#111827] p-4">
          <div className="text-xs text-slate-400">Mastered (Cold Re-Solved)</div>
          <div className="mt-1 font-mono-tabular text-2xl font-bold text-emerald-400">
            {masteredCount}
          </div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-[#111827] p-4">
          <div className="text-xs text-slate-400">7-Day Review / Hint Queue</div>
          <div className="mt-1 font-mono-tabular text-2xl font-bold text-amber-400">
            {reviewDueCount}
          </div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-[#111827] p-4">
          <div className="text-xs text-slate-400">Striver A2Z Pattern Bank</div>
          <div className="mt-1 font-mono-tabular text-2xl font-bold text-indigo-400">
            {striverTotalCount}{' '}
            <span className="text-xs font-normal text-slate-500">core problems</span>
          </div>
        </div>
      </div>

      {/* Filters & View Mode Toolbar */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-[#111827] p-4">
        <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by problem, Striver Step (e.g., Step 4.2, Step 15, Step 16), or sub-pattern (e.g., Boyer-Moore, Topo Sort, Knapsack)..."
              className="w-full rounded-lg border border-slate-800 bg-[#0B0F17] py-2 pl-9 pr-4 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Sheet Source Filter */}
          <div className="flex items-center gap-1 rounded-lg border border-slate-800 bg-[#0B0F17] p-1 overflow-x-auto">
            {[
              { id: 'all', label: `All (${allProblems.length})` },
              { id: 'striver', label: `Striver A2Z (${striverTotalCount})` },
              {
                id: 'neetcode',
                label: `NeetCode 150 (${
                  allProblems.filter((p) => p.sourceSheet.includes('NeetCode')).length
                })`,
              },
              {
                id: 'overlap',
                label: `Must-Do Overlap (${
                  allProblems.filter(
                    (p) => p.sourceSheet === 'Striver A2Z + NeetCode 150'
                  ).length
                })`,
              },
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedSheetFilter(s.id as typeof selectedSheetFilter)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  selectedSheetFilter === s.id
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Layout Toggle: Pattern-Grouped vs Flat Table */}
          <div className="flex items-center gap-1 rounded-lg border border-slate-800 bg-[#0B0F17] p-1 shrink-0">
            <button
              type="button"
              onClick={() => setLayoutMode('grouped')}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                layoutMode === 'grouped'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              Pattern Roadmap
            </button>
            <button
              type="button"
              onClick={() => setLayoutMode('table')}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                layoutMode === 'table'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <List className="h-3.5 w-3.5" />
              Flat Table
            </button>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-3 border-t border-slate-800/80 pt-3 lg:flex-row lg:items-center">
          {/* Pattern Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {['All', ...DSA_PATTERNS_LIST].map((pat) => (
              <button
                key={pat}
                type="button"
                onClick={() => setSelectedPattern(pat)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  selectedPattern === pat
                    ? 'bg-slate-800 text-slate-100 border border-slate-700'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                {pat}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 rounded-lg border border-slate-800 bg-[#0B0F17] p-1 overflow-x-auto shrink-0">
            {[
              { id: 'all', label: 'All Statuses' },
              { id: 'review_due', label: `7-Day Due (${reviewDueCount})` },
              { id: 'solved', label: `Solved (${solvedCount})` },
              { id: 'mastered', label: `Mastered (${masteredCount})` },
              { id: 'todo', label: 'Unsolved' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedStatusTab(tab.id as typeof selectedStatusTab)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  selectedStatusTab === tab.id
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content: Pattern-Grouped View or Flat Table View */}
      {filteredProblems.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-[#111827] py-16 text-center">
          <p className="text-sm font-medium text-slate-300">
            No problems match the current filter criteria
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Try resetting your search query or switching status tabs.
          </p>
        </div>
      ) : layoutMode === 'grouped' ? (
        <div className="space-y-6">
          {groupedByPattern.map((group) => {
            const isCollapsed = Boolean(collapsedPatterns[group.patternName]);
            const pct =
              group.totalInPattern > 0
                ? Math.round((group.solvedInPattern / group.totalInPattern) * 100)
                : 0;

            return (
              <div
                key={group.patternName}
                className="overflow-hidden rounded-xl border border-slate-800 bg-[#111827]"
              >
                {/* Pattern Group Header */}
                <button
                  type="button"
                  onClick={() => togglePatternCollapse(group.patternName)}
                  className="flex w-full flex-col justify-between gap-3 border-b border-slate-800 bg-[#0B0F17]/70 px-5 py-4 text-left hover:bg-[#0B0F17] transition-colors sm:flex-row sm:items-center"
                >
                  <div className="flex items-center gap-3">
                    {isCollapsed ? (
                      <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-indigo-400 shrink-0" />
                    )}
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="font-mono-tabular font-semibold text-indigo-400">
                          {String(group.index).padStart(2, '0')}. {group.patternName}
                        </span>
                        <span>·</span>
                        <span>{group.subPatterns.length} Sub-Patterns</span>
                      </div>
                      <h2 className="text-base font-bold text-slate-100 mt-0.5">
                        {group.patternName} Mastery Module
                      </h2>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:w-64">
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs font-mono-tabular mb-1">
                        <span className="text-slate-300">
                          {group.solvedInPattern}/{group.totalInPattern} Solved
                        </span>
                        <span className="text-emerald-400">
                          {group.masteredInPattern} Cold ({pct}%)
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full bg-indigo-500 transition-transform duration-200 origin-left"
                          style={{ transform: `scaleX(${pct / 100})` }}
                        />
                      </div>
                    </div>
                  </div>
                </button>

                {/* Sub-Patterns & Problem Rows */}
                {!isCollapsed && (
                  <div className="divide-y divide-slate-800">
                    {group.subPatterns.map(([subPatName, subProbs]) => (
                      <div key={subPatName} className="bg-[#111827]">
                        <div className="flex items-center justify-between bg-slate-900/60 px-5 py-2 text-xs">
                          <span className="font-semibold text-slate-200">
                            Sub-Pattern: {subPatName}
                          </span>
                          <span className="font-mono-tabular text-slate-400">
                            {
                              subProbs.filter((p) => {
                                const st = problemLogs[p.problemId]?.status;
                                return st === 'solved' || st === 'mastered';
                              }).length
                            }
                            /{subProbs.length} completed
                          </span>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <tbody className="divide-y divide-slate-800/70 text-xs">
                              {subProbs.map((prob) => renderProblemRow(prob))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#111827]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-[#0B0F17]/60 text-xs font-medium text-slate-400">
                  <th className="py-3 px-4">Problem, Striver Step & Sub-Pattern</th>
                  <th className="py-3 px-4">7-Day Spaced Repetition Status</th>
                  <th className="py-3 px-4">2-Min Spoken & Notes</th>
                  <th className="py-3 px-4 text-right">Mastery Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-xs">
                {filteredProblems.map((prob) => renderProblemRow(prob))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Problem Notes & Reflection Modal */}
      {editingProblem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="w-full max-w-lg rounded-xl border border-slate-800 bg-[#111827] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <p className="text-xs text-indigo-400">
                  {editingProblem.pattern} · {editingProblem.subPattern}
                </p>
                <h2 className="text-base font-semibold text-slate-100">
                  {editingProblem.title} — Notes & Checklist
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setEditingProblem(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveDrawer} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Java Approach, Invariant & Time/Space Complexity Notes
                </label>
                <textarea
                  rows={4}
                  value={drawerNotes}
                  onChange={(e) => setDrawerNotes(e.target.value)}
                  placeholder="Write your key insight, why brute force was slow, and any tricky Java edge cases..."
                  className="w-full rounded-lg border border-slate-800 bg-[#0B0F17] p-3 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2 rounded-lg border border-slate-800 bg-[#0B0F17] p-3">
                <label className="flex items-center gap-2.5 text-xs text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={drawerSpokenDone}
                    onChange={(e) => setDrawerSpokenDone(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-indigo-600"
                  />
                  <span>Completed 2-minute spoken explanation aloud after solving</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={drawerUsedHint}
                    onChange={(e) => setDrawerUsedHint(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-indigo-600"
                  />
                  <span>Needed a hint after 25–30 minutes (flags for priority 7-day cold re-solve)</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProblem(null)}
                  className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
                >
                  Save Problem Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Problem Modal */}
      {isCustomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="w-full max-w-md rounded-xl border border-slate-800 bg-[#111827] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-base font-semibold text-slate-100">
                Log Custom DSA / Contest Problem
              </h2>
              <button
                type="button"
                onClick={() => setIsCustomModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomProblem} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Problem Title
                </label>
                <input
                  type="text"
                  required
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="e.g., LeetCode Weekly Contest Q2 - Count Subarrays"
                  className="w-full rounded-lg border border-slate-800 bg-[#0B0F17] px-3 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    DSA Pattern
                  </label>
                  <select
                    value={customPattern}
                    onChange={(e) => setCustomPattern(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-[#0B0F17] px-3 py-2 text-xs text-slate-100"
                  >
                    {DSA_PATTERNS_LIST.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Difficulty
                  </label>
                  <select
                    value={customDifficulty}
                    onChange={(e) =>
                      setCustomDifficulty(e.target.value as 'Easy' | 'Medium' | 'Hard')
                    }
                    className="w-full rounded-lg border border-slate-800 bg-[#0B0F17] px-3 py-2 text-xs text-slate-100"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Problem URL
                </label>
                <input
                  type="url"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-[#0B0F17] px-3 py-2 text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Notes
                </label>
                <textarea
                  rows={3}
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="Key takeaway or pattern trigger..."
                  className="w-full rounded-lg border border-slate-800 bg-[#0B0F17] p-2.5 text-xs text-slate-100"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCustomModalOpen(false)}
                  className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-medium text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
                >
                  Log Problem (+7d Review)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
