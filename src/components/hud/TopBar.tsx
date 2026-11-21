/**
 * TopBar.tsx
 * Executive HUD top bar: branding, uptime counter, mode badge,
 * speed toggle, camera preset buttons, dispatch trigger, projects button.
 */

import { useEffect, useRef, useState } from 'react';
import type { CameraPreset, SimulationSpeed, StudioEngineState } from '../../types/studio';

interface TopBarProps {
  engineState: StudioEngineState;
  activeCameraPreset: CameraPreset;
  onTogglePause: () => void;
  onSetSpeed: (speed: SimulationSpeed) => void;
  onSetCamera: (preset: CameraPreset) => void;
  onOpenDispatch: () => void;
  onToggleProjects: () => void;
  onToggleTerminal: () => void;
}

const CAMERA_PRESETS: { label: string; value: CameraPreset }[] = [
  { label: 'OVW', value: 'OVERVIEW' },
  { label: 'HRM', value: 'HERMES_CORE' },
  { label: 'FE', value: 'FRONTEND' },
  { label: 'BE', value: 'BACKEND' },
  { label: 'QA', value: 'QA_QC' },
  { label: 'OPS', value: 'DEVOPS' },
];

const SPEED_OPTIONS: { label: string; value: SimulationSpeed }[] = [
  { label: '1×', value: 1 },
  { label: '2×', value: 2 },
  { label: '5×', value: 5 },
];

function formatUptime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function TopBar({
  engineState,
  activeCameraPreset,
  onTogglePause,
  onSetSpeed,
  onSetCamera,
  onOpenDispatch,
  onToggleProjects,
  onToggleTerminal,
}: TopBarProps) {
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    tickRef.current = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, []);

  const wibTime = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(currentTime);

  return (
    <header className="absolute top-0 left-0 right-0 z-50 h-12 hud-panel border-b border-slate-800 flex items-center px-3 gap-3 select-none">
      {/* Branding */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <span className="font-mono text-xs font-bold text-cyan-400 tracking-widest">
          JEXYDEV // 3D SYSTEMS STUDIO
        </span>
      </div>

      <div className="w-px h-6 bg-slate-700 shrink-0" />

      {/* Uptime */}
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="font-mono text-xs text-slate-500 tracking-wider">UPTIME</span>
        <span className="font-mono text-xs text-slate-300 tabular-nums">
          {formatUptime(engineState.uptimeSeconds)}
        </span>
      </div>

      <div className="w-px h-6 bg-slate-700 shrink-0" />

      {/* Mode badge */}
      <button
        onClick={onTogglePause}
        className={`badge shrink-0 cursor-pointer transition-all hover:opacity-80 active:scale-95 ${
          engineState.isRunning ? 'badge-emerald' : 'badge-amber'
        }`}
        title={engineState.isRunning ? 'Click to pause simulation' : 'Click to resume simulation'}
      >
        {engineState.isRunning ? '● SIMULATION ONLINE' : '⏸ PAUSED'}
      </button>

      {/* Speed toggle */}
      <div className="flex items-center gap-1 shrink-0">
        {SPEED_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSetSpeed(opt.value)}
            className={`font-mono text-xs px-1.5 py-0.5 rounded border transition-all hover:border-cyan-400 hover:text-cyan-400 ${
              engineState.speed === opt.value
                ? 'border-cyan-400 text-cyan-400 bg-cyan-400/10'
                : 'border-slate-700 text-slate-500'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="w-px h-6 bg-slate-700 shrink-0" />

      {/* Camera presets */}
      <div className="flex items-center gap-1 shrink-0">
        <span className="font-mono text-xs text-slate-600 mr-1">CAM</span>
        {CAMERA_PRESETS.map((preset) => (
          <button
            key={preset.value}
            onClick={() => onSetCamera(preset.value)}
            className={`font-mono text-xs px-1.5 py-0.5 rounded border transition-all hover:border-cyan-400 hover:text-cyan-400 ${
              activeCameraPreset === preset.value
                ? 'border-cyan-400 text-cyan-400 bg-cyan-400/10'
                : 'border-slate-700 text-slate-500'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Task count */}
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="font-mono text-xs text-slate-500">TASKS</span>
        <span className="font-mono text-xs text-slate-300 tabular-nums">
          {engineState.completedTaskCount}
        </span>
      </div>

      <div className="w-px h-6 bg-slate-700 shrink-0" />

      {/* Clock (WIB) */}
      <div className="flex items-center gap-1 shrink-0">
        <span className="font-mono text-xs text-slate-500">WIB</span>
        <span className="font-mono text-xs text-slate-300 tabular-nums">{wibTime}</span>
      </div>

      <div className="w-px h-6 bg-slate-700 shrink-0" />

      {/* Action buttons */}
      <button
        onClick={onToggleTerminal}
        className="font-mono text-xs px-2 py-1 rounded border border-slate-700 text-slate-400 hover:border-cyan-400 hover:text-cyan-400 transition-all shrink-0"
      >
        TERMINAL
      </button>

      <button
        onClick={onOpenDispatch}
        className="font-mono text-xs px-2 py-1 rounded border border-emerald-500/50 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 transition-all shrink-0"
      >
        + DISPATCH
      </button>

      <button
        onClick={onToggleProjects}
        className="font-mono text-xs px-2 py-1 rounded border border-slate-700 text-slate-400 hover:border-cyan-400 hover:text-cyan-400 transition-all shrink-0"
      >
        SYSTEMS
      </button>
    </header>
  );
}
