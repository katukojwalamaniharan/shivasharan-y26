import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Download, Plus, Trash2, BookOpen } from 'lucide-react';
import { PatternNoteDoc } from '../types';
import { DSA_PATTERNS_LIST } from '../data/seedData';

interface SpokenStudioViewProps {
  patternNotes: PatternNoteDoc[];
  onSavePatternNote: (payload: {
    patternName: string;
    problemTitle: string;
    coreIntuition: string;
    complexityAnalysis: string;
    spokenDurationSec: number;
    selfRating: number;
  }) => Promise<void>;
  onDeletePatternNote: (noteId: string) => Promise<void>;
  initialProblemTitle?: string;
  initialPatternName?: string;
}

export const SpokenStudioView: React.FC<SpokenStudioViewProps> = ({
  patternNotes,
  onSavePatternNote,
  onDeletePatternNote,
  initialProblemTitle = '',
  initialPatternName = 'Arrays & Hashing',
}) => {
  const [patternName, setPatternName] = useState<string>(initialPatternName || DSA_PATTERNS_LIST[0]);
  const [problemTitle, setProblemTitle] = useState<string>(initialProblemTitle);
  const [coreIntuition, setCoreIntuition] = useState<string>('');
  const [complexityAnalysis, setComplexityAnalysis] = useState<string>('Time: O(N) · Space: O(1)');
  const [selfRating, setSelfRating] = useState<number>(4);
  const [filterPattern, setFilterPattern] = useState<string>('All');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // In-browser 2-minute Audio Recorder state
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedSeconds, setRecordedSeconds] = useState<number>(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [micError, setMicError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (initialProblemTitle) setProblemTitle(initialProblemTitle);
    if (initialPatternName) setPatternName(initialPatternName);
  }, [initialProblemTitle, initialPatternName]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    setMicError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
      setRecordedSeconds(0);

      timerRef.current = window.setInterval(() => {
        setRecordedSeconds((prev) => {
          if (prev + 1 >= 120) {
            stopRecording();
            return 120;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      setMicError(
        err instanceof Error
          ? `Microphone access unavailable (${err.message}). You can still time your 2-minute spoken explanation and log your pattern notes below.`
          : 'Microphone access unavailable.'
      );
    }
  };

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coreIntuition.trim()) return;
    setIsSaving(true);
    try {
      await onSavePatternNote({
        patternName,
        problemTitle: problemTitle.trim() || 'Pattern Summary Note',
        coreIntuition: coreIntuition.trim(),
        complexityAnalysis: complexityAnalysis.trim() || 'Time: O(N) · Space: O(N)',
        spokenDurationSec: recordedSeconds,
        selfRating,
      });
      setCoreIntuition('');
      setProblemTitle('');
      setRecordedSeconds(0);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredNotes = patternNotes.filter(
    (n) => filterPattern === 'All' || n.patternName === filterPattern
  );

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-medium text-indigo-400">
            Must-Have Alongside Track · Communication & Pattern Notes
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-100">
            2-Minute Spoken Explanation Studio & Pattern Notebook
          </h1>
          <p className="mt-1 text-sm text-slate-400 max-w-3xl">
            Roadmap Rule: Deliver a 2-minute spoken explanation after each problem, record at least 1 explanation per week to listen back, and write 1 concise note per DSA pattern.
          </p>
        </div>
        <div className="flex items-center gap-6 text-sm text-slate-300 font-mono-tabular">
          <div>
            <span className="text-slate-500">Saved Notes:</span>{' '}
            <span className="font-semibold text-slate-100">{patternNotes.length}</span>
          </div>
          <span>·</span>
          <div>
            <span className="text-slate-500">Recorded Sessions:</span>{' '}
            <span className="font-semibold text-emerald-400">
              {patternNotes.filter((n) => n.spokenDurationSec > 0).length}
            </span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Split */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch">
        {/* Left 5 cols: Voice Recorder + Note Creator */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-xl border border-slate-800 bg-[#111827] p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-100">
                1. Record 2-Minute Spoken Walkthrough
              </h2>
              <span className="font-mono-tabular text-xs text-slate-400">
                {formatDuration(recordedSeconds)} / 02:00
              </span>
            </div>

            <div className="rounded-lg border border-slate-800 bg-[#0B0F17] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-400">
                  {isRecording
                    ? 'Recording microphone... Explain problem statement → brute force → optimal invariant → Big-O'
                    : 'Click Record and explain your solution aloud as if in a Google interview'}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {!isRecording ? (
                  <button
                    type="button"
                    onClick={startRecording}
                    className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-500 transition-colors whitespace-nowrap shrink-0"
                  >
                    <Mic className="h-4 w-4" />
                    Record 2-Min Explanation
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-xs font-medium text-white hover:bg-rose-500 transition-colors whitespace-nowrap shrink-0"
                  >
                    <Square className="h-4 w-4" />
                    Stop Recording ({formatDuration(120 - recordedSeconds)} left)
                  </button>
                )}

                {!isRecording && recordedSeconds === 0 && (
                  <button
                    type="button"
                    onClick={() => setRecordedSeconds(120)}
                    className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
                  >
                    Mark 2-Min Spoken Aloud (No Mic)
                  </button>
                )}
              </div>

              {micError && (
                <p className="text-xs text-amber-400">{micError}</p>
              )}

              {audioUrl && (
                <div className="pt-2 space-y-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Listen back & audit clarity (filler words, pacing, Big-O precision):</span>
                    <a
                      href={audioUrl}
                      download={`spoken-explanation-${Date.now()}.webm`}
                      className="flex items-center gap-1 text-indigo-400 hover:underline whitespace-nowrap shrink-0"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download Audio
                    </a>
                  </div>
                  <audio controls src={audioUrl} className="w-full h-9" />
                </div>
              )}
            </div>
          </div>

          {/* Pattern Note Form */}
          <form onSubmit={handleSubmit} className="space-y-4 border-t border-slate-800 pt-5">
            <h2 className="text-base font-semibold text-slate-100">
              2. Log Pattern Note & Explanation Summary
            </h2>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  DSA Pattern
                </label>
                <select
                  value={patternName}
                  onChange={(e) => setPatternName(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-[#0B0F17] px-3 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
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
                  Problem / Topic Title
                </label>
                <input
                  type="text"
                  value={problemTitle}
                  onChange={(e) => setProblemTitle(e.target.value)}
                  placeholder="e.g., 3Sum / Two Pointers Template"
                  className="w-full rounded-lg border border-slate-800 bg-[#0B0F17] px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Core Pattern Intuition, Trigger Conditions & Java Template
              </label>
              <textarea
                rows={4}
                required
                value={coreIntuition}
                onChange={(e) => setCoreIntuition(e.target.value)}
                placeholder="When to use this pattern? What invariant holds? What edge cases (duplicates, empty array, overflow) must be handled?"
                className="w-full rounded-lg border border-slate-800 bg-[#0B0F17] p-3 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Time & Space Complexity
                </label>
                <input
                  type="text"
                  value={complexityAnalysis}
                  onChange={(e) => setComplexityAnalysis(e.target.value)}
                  placeholder="Time: O(N log N) · Space: O(1)"
                  className="w-full rounded-lg border border-slate-800 bg-[#0B0F17] px-3 py-2 text-xs font-mono-tabular text-slate-100 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Spoken Clarity Self-Rating (1–5)
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setSelfRating(rating)}
                      className={`flex-1 rounded-lg py-1.5 text-xs font-mono-tabular font-medium transition-colors ${
                        selfRating === rating
                          ? 'bg-indigo-600 text-white'
                          : 'border border-slate-800 bg-[#0B0F17] text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {rating}/5
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving || !coreIntuition.trim()}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors whitespace-nowrap shrink-0"
            >
              <Plus className="h-4 w-4" />
              {isSaving ? 'Saving Pattern Note...' : 'Save Pattern Note & Spoken Log'}
            </button>
          </form>
        </div>

        {/* Right 7 cols: Pattern Notes Library */}
        <div className="lg:col-span-7 flex flex-col rounded-xl border border-slate-800 bg-[#111827] p-6">
          <div className="flex flex-col justify-between gap-3 border-b border-slate-800 pb-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-indigo-400" />
              <h2 className="text-base font-semibold text-slate-100">
                Saved Pattern Notes & Spoken Reflections ({filteredNotes.length})
              </h2>
            </div>

            <select
              value={filterPattern}
              onChange={(e) => setFilterPattern(e.target.value)}
              className="rounded-lg border border-slate-800 bg-[#0B0F17] px-3 py-1.5 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
            >
              <option value="All">All DSA Patterns</option>
              {DSA_PATTERNS_LIST.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {filteredNotes.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
              <p className="text-sm font-medium text-slate-300">
                No pattern notes logged for this filter yet
              </p>
              <p className="mt-1 max-w-md text-xs text-slate-500">
                Record a 2-minute spoken explanation on the left or write your first pattern summary note to build your personal interview revision handbook.
              </p>
            </div>
          ) : (
            <div className="mt-4 divide-y divide-slate-800/80 overflow-y-auto max-h-[600px] pr-1">
              {filteredNotes.map((note) => (
                <div key={note.id} className="py-4 first:pt-0 last:pb-0 space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                        <span className="font-medium text-indigo-400">{note.patternName}</span>
                        <span>·</span>
                        <span className="font-mono-tabular">{note.complexityAnalysis}</span>
                        <span>·</span>
                        <span className="font-mono-tabular">
                          Spoken: {note.spokenDurationSec > 0 ? `${note.spokenDurationSec}s` : 'Written Note'}
                        </span>
                        <span>·</span>
                        <span className="font-mono-tabular text-emerald-400">
                          Clarity {note.selfRating}/5
                        </span>
                      </div>
                      <h3 className="mt-1 text-sm font-semibold text-slate-100">
                        {note.problemTitle}
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => onDeletePatternNote(note.id)}
                      className="rounded p-1 text-slate-500 hover:bg-slate-800 hover:text-rose-400 transition-colors"
                      title="Delete note"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="whitespace-pre-wrap text-xs leading-relaxed text-slate-300">
                    {note.coreIntuition}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
