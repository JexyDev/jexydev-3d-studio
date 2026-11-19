/**
 * studio.ts
 * Core type definitions for the JexyDev Autonomous 3D Engineering Studio.
 */

// ─── Agent & Pipeline Types ───────────────────────────────────────────────────

export type AgentId = 'hermes' | 'frontend' | 'backend' | 'qa' | 'devops';

export type PipelinePhase =
  | 'DISCOVER'
  | 'PLAN'
  | 'IMPLEMENT'
  | 'VERIFY'
  | 'AUDIT'
  | 'DEPLOY';

export type AgentStatus =
  | 'IDLE'
  | 'PLANNING'
  | 'CODING'
  | 'TESTING'
  | 'DEPLOYING'
  | 'REVIEWING';

export type SimulationSpeed = 1 | 2 | 5;

export type CameraPreset =
  | 'OVERVIEW'
  | 'HERMES_CORE'
  | 'FRONTEND'
  | 'BACKEND'
  | 'QA_QC'
  | 'DEVOPS';

// ─── Agent Definition ─────────────────────────────────────────────────────────

export interface AgentDefinition {
  readonly id: AgentId;
  readonly displayName: string;
  readonly formalRole: string;
  readonly formalDescription: string;
  readonly coreStack: readonly string[];
  readonly qualityGate: string;
  readonly accentColor: string;
  readonly position: readonly [number, number, number];
  readonly cameraPosition: readonly [number, number, number];
  readonly cameraTarget: readonly [number, number, number];
}

// ─── Simulation Task ──────────────────────────────────────────────────────────

export interface SimulationTask {
  readonly id: string;
  title: string;
  description: string;
  assignedTo: AgentId;
  phase: PipelinePhase;
  startedAt: number;
  completedAt: number | null;
  isUserDispatched: boolean;
}

// ─── Agent Runtime State ──────────────────────────────────────────────────────

export interface AgentState {
  readonly id: AgentId;
  status: AgentStatus;
  currentTask: SimulationTask | null;
  taskCompletionCount: number;
  currentPhase: PipelinePhase;
}

// ─── Telemetry Log Entry ──────────────────────────────────────────────────────

export type TelemetryLevel = 'INFO' | 'WARN' | 'SUCCESS' | 'ERROR' | 'DEBUG';

export interface TelemetryEntry {
  readonly id: string;
  readonly timestamp: Date;
  readonly agent: AgentId | 'SYSTEM';
  readonly level: TelemetryLevel;
  readonly message: string;
}

// ─── Project Card Data ────────────────────────────────────────────────────────

export interface ProjectMetric {
  readonly label: string;
  readonly value: string;
}

export interface ProjectCard {
  readonly id: string;
  readonly name: string;
  readonly tagline: string;
  readonly domain: string;
  readonly techStack: readonly string[];
  readonly metrics: readonly ProjectMetric[];
  readonly accentColor: string;
  readonly githubUrl: string;
  readonly liveUrl: string | null;
}

// ─── Studio Engine State ──────────────────────────────────────────────────────

export interface StudioEngineState {
  isRunning: boolean;
  speed: SimulationSpeed;
  uptimeSeconds: number;
  agents: Record<AgentId, AgentState>;
  activeTasks: SimulationTask[];
  completedTaskCount: number;
  currentPipelinePhase: PipelinePhase;
}

// ─── UI State ─────────────────────────────────────────────────────────────────

export interface UIState {
  selectedAgentId: AgentId | null;
  activeCameraPreset: CameraPreset;
  isInspectorOpen: boolean;
  isTerminalOpen: boolean;
  isDispatchModalOpen: boolean;
  isProjectsDrawerOpen: boolean;
}
