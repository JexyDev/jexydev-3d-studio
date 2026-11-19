/**
 * AgentInspector.tsx
 * Slide-in panel displayed on agent/Hermes click.
 * Shows: formal role description, active task, tech stack tags,
 * current pipeline stage, and task completion count.
 */

import type { AgentDefinition, AgentState, PipelinePhase } from '../../types/studio';

interface AgentInspectorProps {
  agentDef: AgentDefinition | null;
  agentState: AgentState | null;
  isHermes: boolean;
  onClose: () => void;
}

const PHASE_BADGE_COLORS: Record<PipelinePhase, string> = {
  DISCOVER: 'badge-cyan',
  PLAN: 'badge-purple',
  IMPLEMENT: 'badge-cyan',
  VERIFY: 'badge-amber',
  AUDIT: 'badge-amber',
  DEPLOY: 'badge-emerald',
};

const STATUS_COLORS: Record<string, string> = {
  IDLE: 'text-slate-500',
  PLANNING: 'text-purple-400',
  CODING: 'text-cyan-400',
  TESTING: 'text-amber-400',
  DEPLOYING: 'text-emerald-400',
  REVIEWING: 'text-orange-400',
};

export default function AgentInspector({
  agentDef,
  agentState,
  isHermes,
  onClose,
}: AgentInspectorProps) {
  if (!agentDef || !agentState) return null;

  const statusColorClass = STATUS_COLORS[agentState.status] ?? 'text-slate-400';
  const phaseBadgeClass = PHASE_BADGE_COLORS[agentState.currentPhase] ?? 'badge-cyan';

  return (
    <aside
      className="absolute right-0 top-12 bottom-0 w-80 hud-panel border-l border-slate-800 flex flex-col slide-in-right overflow-hidden"
      style={{ borderLeftColor: agentDef.accentColor + '33' }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b border-slate-800"
        style={{ borderLeftWidth: 3, borderLeftColor: agentDef.accentColor }}
      >
        <div>
          <h2
            className="font-mono text-sm font-bold tracking-widest"
            style={{ color: agentDef.accentColor }}
          >
            {agentDef.displayName}
          </h2>
          <p className="font-mono text-xs text-slate-500 mt-0.5">{agentDef.formalRole}</p>
        </div>
        <button
          onClick={onClose}
          className="font-mono text-xs text-slate-500 hover:text-slate-200 transition-colors px-1"
          aria-label="Close inspector"
        >
          ✕
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {/* Status row */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-slate-500">STATUS</span>
          <span className={`font-mono text-xs font-bold ${statusColorClass}`}>
            ● {agentState.status}
          </span>
        </div>

        {/* Pipeline phase */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-slate-500">PIPELINE PHASE</span>
          <span className={`badge ${phaseBadgeClass}`}>{agentState.currentPhase}</span>
        </div>

        {/* Task completion count */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-slate-500">TASKS COMPLETED</span>
          <span className="font-mono text-xs text-slate-300 tabular-nums">
            {agentState.taskCompletionCount}
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800" />

        {/* Active task */}
        <div>
          <p className="font-mono text-xs text-slate-500 mb-2 tracking-wider">ACTIVE TASK</p>
          {agentState.currentTask ? (
            <div className="bg-slate-900 rounded border border-slate-800 p-3">
              {agentState.currentTask.isUserDispatched && (
                <span className="badge badge-emerald mb-2 inline-block">USER DISPATCH</span>
              )}
              <p className="font-mono text-xs font-bold text-slate-200 mb-1.5 leading-relaxed">
                {agentState.currentTask.title}
              </p>
              <p className="font-mono text-xs text-slate-500 leading-relaxed">
                {agentState.currentTask.description}
              </p>
              <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className={`badge ${PHASE_BADGE_COLORS[agentState.currentTask.phase] ?? 'badge-cyan'}`}>
                  {agentState.currentTask.phase}
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 rounded border border-slate-800 p-3">
              <p className="font-mono text-xs text-slate-600 italic">
                Agent is idle — awaiting task assignment from Hermes.
              </p>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800" />

        {/* Formal description */}
        <div>
          <p className="font-mono text-xs text-slate-500 mb-2 tracking-wider">ROLE OVERVIEW</p>
          <p className="text-xs text-slate-400 leading-relaxed">
            {agentDef.formalDescription}
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800" />

        {/* Tech stack */}
        <div>
          <p className="font-mono text-xs text-slate-500 mb-2 tracking-wider">CORE STACK</p>
          <div className="flex flex-wrap gap-1.5">
            {agentDef.coreStack.map((tech) => (
              <span
                key={tech}
                className="font-mono text-xs px-2 py-0.5 rounded border border-slate-700 text-slate-400"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Quality gate */}
        <div>
          <p className="font-mono text-xs text-slate-500 mb-2 tracking-wider">QUALITY GATE</p>
          <p className="text-xs text-slate-400 leading-relaxed bg-slate-900 rounded p-2 border border-slate-800">
            {agentDef.qualityGate}
          </p>
        </div>

        {/* Hermes note */}
        {isHermes && (
          <div className="bg-cyan-400/5 rounded border border-cyan-400/20 p-3">
            <p className="font-mono text-xs text-cyan-400 font-bold mb-1">9ROUTER ACTIVE</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Hermes governs the global task queue and routes all engineering work
              via the 9Router protocol through the complete DISCOVER → DEPLOY lifecycle.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-slate-800">
        <p className="font-mono text-xs text-slate-600">
          Click an agent in the 3D scene to inspect its state.
        </p>
      </div>
    </aside>
  );
}
