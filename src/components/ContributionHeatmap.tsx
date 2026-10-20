import React, { useState, useMemo } from 'react';
import { Flame, Calendar } from 'lucide-react';
import { ActivityLogDoc } from '../types';

interface ContributionHeatmapProps {
  activityLogs: Record<string, ActivityLogDoc>;
}

interface DayCell {
  dateStr: string;
  dateObj: Date;
  totalActions: number;
  log?: ActivityLogDoc;
  isPadding?: boolean;
}

const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const ContributionHeatmap: React.FC<ContributionHeatmapProps> = ({
  activityLogs,
}) => {
  const [selectedDay, setSelectedDay] = useState<DayCell | null>(null);

  const {
    weeks,
    monthLabels,
    totalActionsYear,
    activeDaysYear,
    longestStreak,
    currentStreak,
    todayCell,
  } = useMemo(() => {
    const now = new Date();
    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Start 364 days ago (365 days total inclusive of today)
    const startRaw = new Date(todayMidnight.getTime() - 364 * 86400000);
    // Align start to Sunday of that week so rows 0..6 map cleanly to Sun..Sat
    const startDayOfWeek = startRaw.getDay();
    const alignedStart = new Date(startRaw.getTime() - startDayOfWeek * 86400000);

    const allDays: DayCell[] = [];
    let cursor = new Date(alignedStart);

    let totalActionsSum = 0;
    let activeDaysCount = 0;
    let maxStreak = 0;
    let runningStreak = 0;
    let latestCell: DayCell | null = null;

    while (cursor <= todayMidnight) {
      const yyyy = cursor.getFullYear();
      const mm = String(cursor.getMonth() + 1).padStart(2, '0');
      const dd = String(cursor.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;
      const isBeforeWindow = cursor < startRaw;
      const log = activityLogs[dateStr];
      const count = isBeforeWindow ? 0 : log?.totalActions ?? 0;

      const cell: DayCell = {
        dateStr,
        dateObj: new Date(cursor),
        totalActions: count,
        log,
        isPadding: isBeforeWindow,
      };
      allDays.push(cell);

      if (!isBeforeWindow) {
        totalActionsSum += count;
        if (count > 0) {
          activeDaysCount += 1;
          runningStreak += 1;
          if (runningStreak > maxStreak) maxStreak = runningStreak;
        } else {
          runningStreak = 0;
        }
      }

      if (cursor.getTime() === todayMidnight.getTime()) {
        latestCell = cell;
      }

      cursor = new Date(cursor.getTime() + 86400000);
    }

    // Group into columns of 7 days (Sunday..Saturday)
    const weekColumns: DayCell[][] = [];
    for (let i = 0; i < allDays.length; i += 7) {
      weekColumns.push(allDays.slice(i, i + 7));
    }

    // Build month header positions per week column
    const labels: { weekIndex: number; label: string }[] = [];
    let lastMonth = -1;
    weekColumns.forEach((week, wIdx) => {
      const firstVisibleDay = week.find((d) => !d.isPadding) || week[0];
      if (firstVisibleDay) {
        const m = firstVisibleDay.dateObj.getMonth();
        if (m !== lastMonth) {
          // Avoid cramping if the previous label is only 1 column away
          if (labels.length === 0 || wIdx - labels[labels.length - 1].weekIndex >= 3) {
            labels.push({
              weekIndex: wIdx,
              label: MONTH_NAMES[m],
            });
          }
          lastMonth = m;
        }
      }
    });

    // Compute current streak backwards from today (or yesterday if today is 0 so far)
    let curStreak = 0;
    const nonPaddingDays = allDays.filter((d) => !d.isPadding);
    for (let i = nonPaddingDays.length - 1; i >= 0; i--) {
      if (nonPaddingDays[i].totalActions > 0) {
        curStreak += 1;
      } else if (i === nonPaddingDays.length - 1) {
        // Allow today to be 0 without breaking yesterday's active streak
        continue;
      } else {
        break;
      }
    }

    return {
      weeks: weekColumns,
      monthLabels: labels,
      totalActionsYear: totalActionsSum,
      activeDaysYear: activeDaysCount,
      longestStreak: maxStreak,
      currentStreak: curStreak,
      todayCell: latestCell,
    };
  }, [activityLogs]);

  const activeDayDetail = selectedDay || todayCell;

  const getGreenShadeClass = (count: number, isPadding?: boolean): string => {
    if (isPadding) {
      return 'bg-transparent border-transparent pointer-events-none';
    }
    if (count <= 0) {
      return 'bg-[#0B0F17] border-slate-800/90 hover:border-slate-600';
    }
    if (count === 1) {
      return 'bg-emerald-950 border-emerald-800/80 hover:border-emerald-400';
    }
    if (count <= 3) {
      return 'bg-emerald-800/90 border-emerald-600/80 hover:border-emerald-300';
    }
    if (count <= 6) {
      return 'bg-emerald-600 border-emerald-400 hover:border-white';
    }
    return 'bg-emerald-400 border-emerald-200 hover:border-white';
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-[#111827] p-6 space-y-5">
      {/* Header & 12-Month Summary Telemetry */}
      <div className="flex flex-col justify-between gap-3 border-b border-slate-800 pb-4 lg:flex-row lg:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-emerald-400" />
            <h2 className="text-base font-semibold text-slate-100">
              12-Month Study Contribution Heatmap
            </h2>
          </div>
          <p className="mt-0.5 text-xs text-slate-400">
            Visualizing daily <span className="font-mono-tabular text-slate-300">totalActions</span> across DSA problem solves, 7-day cold re-solves, 2-minute spoken explanations, roadmap tasks, and aptitude drills.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 font-mono-tabular">
          <div>
            <span className="text-slate-500">12-Mo Actions:</span>{' '}
            <strong className="text-emerald-400">{totalActionsYear}</strong>
          </div>
          <span aria-hidden="true">·</span>
          <div>
            <span className="text-slate-500">Active Days:</span>{' '}
            <strong className="text-slate-100">{activeDaysYear} / 365</strong>
          </div>
          <span aria-hidden="true">·</span>
          <div>
            <span className="text-slate-500">Current Streak:</span>{' '}
            <strong className="text-emerald-400">{currentStreak}d</strong>
          </div>
          <span aria-hidden="true">·</span>
          <div>
            <span className="text-slate-500">Best Streak:</span>{' '}
            <strong className="text-slate-100">{longestStreak}d</strong>
          </div>
        </div>
      </div>

      {/* 53-Week Scrollable Contribution Grid */}
      <div className="overflow-x-auto pb-2">
        <div className="inline-block min-w-[780px]">
          {/* Month Labels Row */}
          <div className="relative mb-2 ml-8 h-4 text-[11px] font-medium text-slate-400">
            {monthLabels.map((m) => (
              <span
                key={`${m.label}-${m.weekIndex}`}
                className="absolute top-0"
                style={{ left: `${m.weekIndex * 15}px` }}
              >
                {m.label}
              </span>
            ))}
          </div>

          <div className="flex items-start gap-2">
            {/* Day-of-Week Labels (Mon, Wed, Fri) */}
            <div className="grid grid-rows-7 gap-[3px] pr-1 text-[10px] font-mono-tabular text-slate-500 leading-[12px]">
              <span className="h-3 flex items-center opacity-0">Sun</span>
              <span className="h-3 flex items-center">Mon</span>
              <span className="h-3 flex items-center opacity-0">Tue</span>
              <span className="h-3 flex items-center">Wed</span>
              <span className="h-3 flex items-center opacity-0">Thu</span>
              <span className="h-3 flex items-center">Fri</span>
              <span className="h-3 flex items-center opacity-0">Sat</span>
            </div>

            {/* 53 Columns x 7 Rows */}
            <div className="flex gap-[3px]">
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="grid grid-rows-7 gap-[3px]">
                  {week.map((day) => {
                    const isSelected = activeDayDetail?.dateStr === day.dateStr && !day.isPadding;
                    return (
                      <button
                        key={day.dateStr}
                        type="button"
                        onClick={() => !day.isPadding && setSelectedDay(day)}
                        title={
                          day.isPadding
                            ? ''
                            : `${day.dateStr}: ${day.totalActions} study action${
                                day.totalActions === 1 ? '' : 's'
                              }`
                        }
                        className={`h-3 w-3 rounded-[2px] border transition-colors ${getGreenShadeClass(
                          day.totalActions,
                          day.isPadding
                        )} ${isSelected ? 'ring-1 ring-white' : ''}`}
                        aria-label={`${day.dateStr}: ${day.totalActions} study actions`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Day Breakdown & Legend Footer */}
      <div className="flex flex-col justify-between gap-4 border-t border-slate-800/80 pt-4 sm:flex-row sm:items-center">
        {activeDayDetail ? (
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 font-mono-tabular">
            <Calendar className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span className="font-semibold text-slate-100">{activeDayDetail.dateStr}</span>
            <span>·</span>
            <span className="text-emerald-400 font-semibold">
              {activeDayDetail.totalActions} total actions
            </span>
            <span>·</span>
            <span className="text-slate-400">
              DSA Solved: {activeDayDetail.log?.problemsSolved ?? 0}
            </span>
            <span>·</span>
            <span className="text-slate-400">
              7-Day Re-Solves: {activeDayDetail.log?.revisionsCompleted ?? 0}
            </span>
            <span>·</span>
            <span className="text-slate-400">
              Spoken: {activeDayDetail.log?.spokenRecorded ?? 0}
            </span>
            <span>·</span>
            <span className="text-slate-400">
              Roadmap: {activeDayDetail.log?.roadmapTasksDone ?? 0}
            </span>
            <span>·</span>
            <span className="text-slate-400">
              Aptitude: {activeDayDetail.log?.aptitudeDone ?? 0}
            </span>
          </div>
        ) : (
          <span className="text-xs text-slate-500">
            Click any day square to inspect daily breakdown.
          </span>
        )}

        {/* Graduated Shades of Green Legend */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 shrink-0">
          <span>Less</span>
          <span
            className="h-3 w-3 rounded-[2px] bg-[#0B0F17] border border-slate-800"
            title="0 actions"
          />
          <span
            className="h-3 w-3 rounded-[2px] bg-emerald-950 border border-emerald-800/80"
            title="1 action"
          />
          <span
            className="h-3 w-3 rounded-[2px] bg-emerald-800/90 border border-emerald-600/80"
            title="2–3 actions"
          />
          <span
            className="h-3 w-3 rounded-[2px] bg-emerald-600 border border-emerald-400"
            title="4–6 actions"
          />
          <span
            className="h-3 w-3 rounded-[2px] bg-emerald-400 border border-emerald-200"
            title="7+ actions"
          />
          <span>More</span>
        </div>
      </div>
    </div>
  );
};
