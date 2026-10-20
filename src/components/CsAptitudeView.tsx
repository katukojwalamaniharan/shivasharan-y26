import React, { useState } from 'react';
import { CheckSquare, Square, Plus, Minus, ExternalLink } from 'lucide-react';
import { UserProgressDoc } from '../types';
import { CS_FUNDAMENTALS_TOPICS } from '../data/seedData';

interface CsAptitudeViewProps {
  progress: UserProgressDoc;
  onToggleCsTopic: (topicId: string) => Promise<void>;
  onIncrementCounter: (
    field: 'aptitudeSessionsDone' | 'logicPuzzlesDone' | 'mockInterviewsDone' | 'contestsAttended',
    delta: number
  ) => Promise<void>;
}

const SUBJECT_TABS = [
  'All',
  'Java & OOP',
  'Discrete Maths & Logic',
  'Operating Systems',
  'DBMS',
  'Computer Networks',
  'Aptitude & Puzzles',
] as const;

export const CsAptitudeView: React.FC<CsAptitudeViewProps> = ({
  progress,
  onToggleCsTopic,
  onIncrementCounter,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('All');

  const filteredTopics = CS_FUNDAMENTALS_TOPICS.filter(
    (t) => selectedSubject === 'All' || t.subject === selectedSubject
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-medium text-indigo-400">
            College Syllabus Alignment + Placement Aptitude Habits
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-100">
            CS Fundamentals, IndiaBix Aptitude & Contest Tracker
          </h1>
          <p className="mt-1 text-sm text-slate-400 max-w-3xl">
            Roadmap Note: Cover CS Fundamentals and Aptitude during college class hours + 15 minutes of IndiaBix 4 days a week + 1 paper logic puzzle every weekend.
          </p>
        </div>

        <a
          href="https://www.indiabix.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/80 px-4 py-2 text-xs font-medium text-slate-100 hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
        >
          <span>Launch IndiaBix 15-Min Drill</span>
          <ExternalLink className="h-3.5 w-3.5 text-indigo-400" />
        </a>
      </div>

      {/* 4 Habit & Milestone Counter Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col justify-between rounded-xl border border-slate-800 bg-[#111827] p-5">
          <div>
            <div className="text-xs text-slate-400">
              IndiaBix 15-Min Sessions (4x/wk)
            </div>
            <div className="mt-2 font-mono-tabular text-3xl font-bold text-slate-100">
              {progress.aptitudeSessionsDone}{' '}
              <span className="text-xs font-normal text-slate-500">/ 96 Sem 1</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Cover in class hours or 15m after problems
            </p>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              onClick={() => onIncrementCounter('aptitudeSessionsDone', 1)}
              className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-indigo-600 py-1.5 text-xs font-medium text-white hover:bg-indigo-500 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Log 15m Session
            </button>
            <button
              type="button"
              onClick={() => onIncrementCounter('aptitudeSessionsDone', -1)}
              className="rounded-lg border border-slate-800 bg-[#0B0F17] p-1.5 text-slate-400 hover:text-slate-200"
              aria-label="Decrement aptitude session"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-xl border border-slate-800 bg-[#111827] p-5">
          <div>
            <div className="text-xs text-slate-400">
              Paper Logic Puzzles (1x/wk)
            </div>
            <div className="mt-2 font-mono-tabular text-3xl font-bold text-emerald-400">
              {progress.logicPuzzlesDone}{' '}
              <span className="text-xs font-normal text-slate-500">/ 24 Sem 1</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              1 puzzle a week solved on paper without hints
            </p>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              onClick={() => onIncrementCounter('logicPuzzlesDone', 1)}
              className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-emerald-600 py-1.5 text-xs font-medium text-white hover:bg-emerald-500 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Log Weekly Puzzle
            </button>
            <button
              type="button"
              onClick={() => onIncrementCounter('logicPuzzlesDone', -1)}
              className="rounded-lg border border-slate-800 bg-[#0B0F17] p-1.5 text-slate-400 hover:text-slate-200"
              aria-label="Decrement logic puzzle"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-xl border border-slate-800 bg-[#111827] p-5">
          <div>
            <div className="text-xs text-slate-400">
              LeetCode Contests (Target: 6+ Sem 1)
            </div>
            <div className="mt-2 font-mono-tabular text-3xl font-bold text-indigo-400">
              {progress.contestsAttended}{' '}
              <span className="text-xs font-normal text-slate-500">/ 6 Sem 1</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              M3 virtual → M4 first live → M5 bi-weekly
            </p>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              onClick={() => onIncrementCounter('contestsAttended', 1)}
              className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-indigo-600 py-1.5 text-xs font-medium text-white hover:bg-indigo-500 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Log Contest
            </button>
            <button
              type="button"
              onClick={() => onIncrementCounter('contestsAttended', -1)}
              className="rounded-lg border border-slate-800 bg-[#0B0F17] p-1.5 text-slate-400 hover:text-slate-200"
              aria-label="Decrement contest"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-xl border border-slate-800 bg-[#111827] p-5">
          <div>
            <div className="text-xs text-slate-400">
              45-Min Mock Interviews (Talk Aloud)
            </div>
            <div className="mt-2 font-mono-tabular text-3xl font-bold text-amber-400">
              {progress.mockInterviewsDone}{' '}
              <span className="text-xs font-normal text-slate-500">/ 2 Sem 1</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Month 6 milestone with brother/mentor
            </p>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              onClick={() => onIncrementCounter('mockInterviewsDone', 1)}
              className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-amber-600 py-1.5 text-xs font-medium text-white hover:bg-amber-500 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Log Mock Interview
            </button>
            <button
              type="button"
              onClick={() => onIncrementCounter('mockInterviewsDone', -1)}
              className="rounded-lg border border-slate-800 bg-[#0B0F17] p-1.5 text-slate-400 hover:text-slate-200"
              aria-label="Decrement mock interview"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Subject Filter Tabs */}
      <div className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-[#111827] p-2 overflow-x-auto">
        {SUBJECT_TABS.map((subj) => (
          <button
            key={subj}
            type="button"
            onClick={() => setSelectedSubject(subj)}
            className={`rounded-lg px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              selectedSubject === subj
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            {subj}
          </button>
        ))}
      </div>

      {/* CS Fundamentals Topic Checklist */}
      <div className="rounded-xl border border-slate-800 bg-[#111827] divide-y divide-slate-800">
        {filteredTopics.map((topic) => {
          const isChecked = progress.checkedCsFundamentalsIds.includes(topic.id);
          return (
            <button
              key={topic.id}
              type="button"
              onClick={() => onToggleCsTopic(topic.id)}
              className="flex w-full items-start gap-4 p-5 text-left hover:bg-slate-800/20 transition-colors"
            >
              {isChecked ? (
                <CheckSquare className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
              ) : (
                <Square className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />
              )}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                  <span className="font-semibold text-indigo-400">{topic.subject}</span>
                  <span>·</span>
                  <span>{topic.semesterTarget}</span>
                  <span>·</span>
                  <span className="text-emerald-400/90">{topic.inClassNote}</span>
                </div>
                <h3
                  className={`mt-1 text-sm font-semibold ${
                    isChecked ? 'line-through text-slate-500' : 'text-slate-100'
                  }`}
                >
                  {topic.title}
                </h3>
                <p className="mt-1 text-xs text-slate-400">{topic.keyConcepts}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
