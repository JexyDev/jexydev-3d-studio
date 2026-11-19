/**
 * TelemetryTerminal.tsx
 * Collapsible bottom console showing timestamped, color-coded formal logs.
 */

import { useEffect, useRef } from 'react';
import type { TelemetryEntry } from '../../types/studio';

interface TelemetryTerminalProps {
  entries: TelemetryEntry[];
  isOpen: boolean;
  isInspectorOpen: boolean;
  onToggle: () => void;
}

const LEVEL_COLORS: Record<string, string> = {
  INFO: 'text-cyan-400',
  SUCCESS: 'text-emerald-400',
  WARN: 'text-amber-400',
  ERROR: 'text-red-400',
  DEBUG: 'text-slate-500',
};

const AGENT_COLORS: Record<string, string> = {
  hermes: 'text-cyan-300',
  frontend: 'text-emerald-300',
  backend: 'text-purple-300',
  qa: 'text-amber-300',
  devops: 'text-pink-300',
  SYSTEM: 'text-slate-400',
};

function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export default function TelemetryTerminal({
  entries,
  isOpen,
  isInspectorOpen,
  onToggle,
}: TelemetryTerminalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new entries
  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries, isOpen]);

  return (
    <div
      className={`absolute bottom-0 left-0 hud-panel border-t border-slate-800 transition-all duration-300 ease-in-out z-40 ${
        isOpen ? 'h-48' : 'h-9'
      }`}
      style={{ right: isInspectorOpen ? '320px' : '0px' }}
    >
      {/* Terminal header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 h-9 hover:bg-slate-800/50 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="font-mono text-xs text-slate-500 tracking-wider">
          TELEMETRY TERMINAL
        </span>
        <div className="flex gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500 opacity-70" />
          <span className="w-2 h-2 rounded-full bg-amber-500 opacity-70" />
          <span className="w-2 h-2 rounded-full bg-emerald-500 opacity-70" />
        </div>
        <span className="font-mono text-xs text-slate-600">
          {entries.length} entries
        </span>
        <div className="flex-1" />
        <span className="font-mono text-xs text-slate-600 mr-2">
          {isOpen ? '▼ COLLAPSE' : '▲ EXPAND'}
        </span>
        {/* Blinking cursor */}
        <span className="font-mono text-xs text-cyan-400 cursor-blink">█</span>
      </button>

      {/* Log entries */}
      {isOpen && (
        <div
          ref={scrollRef}
          className="h-[calc(100%-36px)] overflow-y-auto px-4 py-2 space-y-1"
        >
          {entries.length === 0 && (
            <p className="font-mono text-xs text-slate-600 italic">
              Awaiting telemetry data stream...
            </p>
          )}
          {entries.map((entry) => {
            const levelColor = LEVEL_COLORS[entry.level] ?? 'text-slate-400';
            const agentColor = AGENT_COLORS[entry.agent] ?? 'text-slate-400';

            return (
              <div key={entry.id} className="flex items-start gap-2 font-mono text-xs leading-5">
                {/* Timestamp */}
                <span className="text-slate-600 shrink-0 tabular-nums">
                  [{formatTimestamp(entry.timestamp)}]
                </span>

                {/* Agent */}
                <span className={`${agentColor} shrink-0 uppercase font-bold w-16`}>
                  [{entry.agent.toUpperCase().slice(0, 6)}]
                </span>

                {/* Level */}
                <span className={`${levelColor} shrink-0 w-9`}>
                  {entry.level}
                </span>

                {/* Message */}
                <span className="text-slate-300">{entry.message}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
