/**
 * TaskDispatchModal.tsx
 * Modal for visitor to type a custom engineering task and dispatch it
 * into the autonomous simulation pipeline.
 */

import { useState, useRef, useEffect } from 'react';

interface TaskDispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDispatch: (taskTitle: string) => void;
}

const EXAMPLE_TASKS = [
  'Build a real-time sensor dashboard for soil moisture monitoring',
  'Implement JWT refresh token rotation for the BERSEKA API',
  'Create a Flutter widget for geofenced waste collection alerts',
  'Write automated PHPUnit tests for multi-tenant classroom scheduling',
  'Configure Docker multi-stage build for the Bitanic Laravel application',
  'Design OpenAPI 3.x specification for the IoT telemetry ingestion endpoint',
];

export default function TaskDispatchModal({
  isOpen,
  onClose,
  onDispatch,
}: TaskDispatchModalProps) {
  const [taskTitle, setTaskTitle] = useState('');
  const [isDispatching, setIsDispatching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTaskTitle('');
      setIsDispatching(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleDispatch = () => {
    if (!taskTitle.trim()) return;
    setIsDispatching(true);

    // Brief dispatch animation delay
    setTimeout(() => {
      onDispatch(taskTitle.trim());
      setIsDispatching(false);
      onClose();
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleDispatch();
    if (e.key === 'Escape') onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 hud-panel rounded border border-slate-700 fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div>
            <h2 className="font-mono text-sm font-bold text-cyan-400 tracking-widest">
              MANUAL TASK DISPATCH
            </h2>
            <p className="font-mono text-xs text-slate-500 mt-0.5">
              Inject a custom engineering task into the autonomous pipeline via Hermes.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-200 transition-colors font-mono text-sm ml-4"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Task input */}
          <div>
            <label className="block font-mono text-xs text-slate-400 mb-2 tracking-wider">
              ENGINEERING TASK DESCRIPTION
            </label>
            <input
              ref={inputRef}
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe the engineering task..."
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2.5 font-mono text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition-colors"
              maxLength={120}
            />
            <p className="font-mono text-xs text-slate-600 mt-1 text-right">
              {taskTitle.length} / 120
            </p>
          </div>

          {/* Example suggestions */}
          <div>
            <p className="font-mono text-xs text-slate-500 mb-2 tracking-wider">
              EXAMPLE TASKS — Click to populate:
            </p>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {EXAMPLE_TASKS.map((example) => (
                <button
                  key={example}
                  onClick={() => setTaskTitle(example)}
                  className="w-full text-left font-mono text-xs text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded px-2 py-1 transition-colors leading-relaxed"
                >
                  ▸ {example}
                </button>
              ))}
            </div>
          </div>

          {/* Pipeline info */}
          <div className="bg-slate-900 rounded border border-slate-800 p-3">
            <p className="font-mono text-xs text-slate-500 leading-relaxed">
              <span className="text-cyan-400 font-bold">HERMES</span> will receive your task,
              route it via <span className="text-cyan-400">9Router</span>, and assign it
              to the appropriate specialized agent for execution through the standard
              pipeline phases.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="font-mono text-xs px-4 py-2 rounded border border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200 transition-all"
          >
            CANCEL
          </button>
          <button
            onClick={handleDispatch}
            disabled={!taskTitle.trim() || isDispatching}
            className="font-mono text-xs px-4 py-2 rounded border border-emerald-500/50 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isDispatching ? 'ROUTING VIA HERMES...' : '→ DISPATCH TO HERMES'}
          </button>
        </div>
      </div>
    </div>
  );
}
