import React, { useState, useEffect } from 'react';
import { Timer, Play, Pause, RotateCcw, X } from 'lucide-react';

interface SoloTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProblemTitle?: string;
}

export const SoloTimerModal: React.FC<SoloTimerModalProps> = ({
  isOpen,
  onClose,
  initialProblemTitle = '',
}) => {
  const [targetMinutes, setTargetMinutes] = useState<number>(30);
  const [secondsLeft, setSecondsLeft] = useState<number>(30 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [problemLabel, setProblemLabel] = useState<string>(initialProblemTitle);

  useEffect(() => {
    if (initialProblemTitle) {
      setProblemLabel(initialProblemTitle);
    }
  }, [initialProblemTitle]);

  useEffect(() => {
    if (!isRunning) return;
    const interval = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  if (!isOpen) return null;

  const totalSeconds = targetMinutes * 60;
  const elapsedSeconds = totalSeconds - secondsLeft;
  const progressPct = Math.min(100, Math.round((elapsedSeconds / totalSeconds) * 100));
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const handlePreset = (minsPreset: number) => {
    setIsRunning(false);
    setTargetMinutes(minsPreset);
    setSecondsLeft(minsPreset * 60);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
      <div className="w-full max-w-md rounded-xl border border-slate-800 bg-[#111827] p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <Timer className="h-5 w-5 text-indigo-400" />
            <h2 className="text-lg font-semibold text-slate-100">
              25–30 Min Solo Attempt Timer
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
            aria-label="Close timer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <p className="text-xs text-slate-400 leading-relaxed">
            Roadmap Golden Rule: Struggle alone on paper and in your IDE for 25 to 30 minutes before checking any hint. If you need a hint, schedule the problem for a 7-day cold re-solve.
          </p>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Active Problem / Task
            </label>
            <input
              type="text"
              value={problemLabel}
              onChange={(e) => setProblemLabel(e.target.value)}
              placeholder="e.g., Longest Repeating Character Replacement"
              className="w-full rounded-lg border border-slate-800 bg-[#0B0F17] px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            {[25, 30, 45].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handlePreset(preset)}
                className={`flex-1 rounded-lg py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  targetMinutes === preset
                    ? 'bg-indigo-600 text-white'
                    : 'bg-[#0B0F17] text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {preset} Min {preset === 45 ? '(Mock)' : '(Solo Rule)'}
              </button>
            ))}
          </div>

          <div className="rounded-xl border border-slate-800 bg-[#0B0F17] p-6 text-center">
            <div className="font-mono-tabular text-5xl font-bold tracking-tight text-slate-100">
              {formattedTime}
            </div>
            <div className="mt-2 text-xs text-slate-400">
              {secondsLeft === 0
                ? 'Solo window complete — you may now inspect 1 hint if stuck, or dry-run your code!'
                : isRunning
                ? 'No hints, no editorials — write examples & invariants on paper'
                : 'Ready to start solo problem-solving block'}
            </div>
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full bg-indigo-500 transition-transform duration-200 origin-left"
                style={{ transform: `scaleX(${progressPct / 100})` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsRunning((prev) => !prev)}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 transition-colors whitespace-nowrap shrink-0"
            >
              {isRunning ? (
                <>
                  <Pause className="h-4 w-4" />
                  Pause Timer
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  {secondsLeft < totalSeconds && secondsLeft > 0 ? 'Resume Timer' : 'Start Solo Timer'}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRunning(false);
                setSecondsLeft(targetMinutes * 60);
              }}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/70 px-4 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
