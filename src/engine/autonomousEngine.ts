/**
 * autonomousEngine.ts
 * JexyDev Autonomous Studio — 24/7 Simulation Engine
 *
 * Implements a continuous state machine that simulates autonomous engineering
 * pipeline activity. Manages agent states, task lifecycle, speed control,
 * and pipeline phase transitions.
 */

import type {
  AgentId,
  AgentState,
  AgentStatus,
  PipelinePhase,
  SimulationSpeed,
  SimulationTask,
  StudioEngineState,
  TelemetryEntry,
  TelemetryLevel,
} from '../types/studio';

// ─── Task Templates ───────────────────────────────────────────────────────────

interface TaskTemplate {
  readonly title: string;
  readonly description: string;
  readonly assignedTo: AgentId;
  readonly phase: PipelinePhase;
  readonly durationMs: number;
}

const TASK_POOL: TaskTemplate[] = [
  // Frontend tasks
  {
    title: 'Responsive Dashboard Component Slicing',
    description: 'Decompose Figma mockup into atomic React components with Tailwind CSS utility classes; implement mobile-first breakpoints.',
    assignedTo: 'frontend',
    phase: 'IMPLEMENT',
    durationMs: 8000,
  },
  {
    title: 'State Management Architecture Review',
    description: 'Audit Zustand store topology, eliminate redundant subscriptions, and enforce selector memoization across dashboard views.',
    assignedTo: 'frontend',
    phase: 'VERIFY',
    durationMs: 6000,
  },
  {
    title: 'Cross-Platform Flutter Navigation Refactor',
    description: 'Migrate Navigator 1.0 imperatives to GoRouter declarative routing; implement deep link scheme for all merchant pages.',
    assignedTo: 'frontend',
    phase: 'IMPLEMENT',
    durationMs: 10000,
  },
  {
    title: 'Accessibility & WCAG 2.1 AA Compliance Audit',
    description: 'Run axe-core scan, remediate missing ARIA labels, enforce color contrast ratios across all interactive elements.',
    assignedTo: 'frontend',
    phase: 'AUDIT',
    durationMs: 5000,
  },
  // Backend tasks
  {
    title: 'API Schema Migration — Telemetry Ingestion Endpoint',
    description: 'Design and implement versioned REST endpoint for IoT sensor payload ingestion with provenance tagging and Modbus frame validation.',
    assignedTo: 'backend',
    phase: 'IMPLEMENT',
    durationMs: 9000,
  },
  {
    title: 'PostgreSQL Index Optimization — Telemetry Queries',
    description: 'Analyze slow query logs, design composite B-tree indexes on (school_id, device_id, created_at), validate with EXPLAIN ANALYZE.',
    assignedTo: 'backend',
    phase: 'VERIFY',
    durationMs: 7000,
  },
  {
    title: 'Multi-Tenant Authorization Middleware Hardening',
    description: 'Enforce school_id isolation at middleware layer; audit all Eloquent queries for IDOR vulnerabilities using Spatie Policy checks.',
    assignedTo: 'backend',
    phase: 'IMPLEMENT',
    durationMs: 11000,
  },
  {
    title: 'GraphQL Schema Definition & Resolver Implementation',
    description: 'Define SDL types for waste classification data layer; implement DataLoader-batched resolvers to eliminate N+1 patterns.',
    assignedTo: 'backend',
    phase: 'IMPLEMENT',
    durationMs: 8500,
  },
  // QA tasks
  {
    title: 'Automated Regression Suite Execution',
    description: 'Execute full PHPUnit regression matrix across SQLite (in-memory) and PostgreSQL 17 test environments; report coverage delta.',
    assignedTo: 'qa',
    phase: 'VERIFY',
    durationMs: 7500,
  },
  {
    title: 'Edge-Case Validation — Concurrent Schedule Booking',
    description: 'Simulate 50 concurrent lab reservation requests; verify pessimistic row locking prevents scheduling collisions under contention.',
    assignedTo: 'qa',
    phase: 'VERIFY',
    durationMs: 6500,
  },
  {
    title: 'Static Analysis & Code Style Enforcement',
    description: 'Run PHP-CS-Fixer (Pint), ESLint, and PHPStan level 8 across all changed files; enforce zero-warning policy pre-merge.',
    assignedTo: 'qa',
    phase: 'AUDIT',
    durationMs: 5000,
  },
  // DevOps tasks
  {
    title: 'Docker Multi-Stage Build Pipeline Configuration',
    description: 'Implement multi-stage Dockerfile for Laravel API with Nginx/Supervisor; configure BuildKit layer caching for sub-60s CI builds.',
    assignedTo: 'devops',
    phase: 'DEPLOY',
    durationMs: 8000,
  },
  {
    title: 'GitHub Actions CI/CD Pipeline Rollout',
    description: 'Configure parallel job matrix: Pint + PHPStan → PHPUnit (SQLite) → PHPUnit (PostgreSQL) → Vite build → staging deploy gate.',
    assignedTo: 'devops',
    phase: 'DEPLOY',
    durationMs: 9000,
  },
  {
    title: 'API Specification Documentation Update',
    description: 'Synchronize OpenAPI 3.x YAML with new telemetry endpoints; generate Redoc static site and publish to docs environment.',
    assignedTo: 'devops',
    phase: 'AUDIT',
    durationMs: 5500,
  },
  // Hermes tasks
  {
    title: 'Sprint Queue Decomposition — BERSEKA v2.4',
    description: 'Decompose 14 user stories into 47 atomic engineering tasks; assign priority weights and agent routing via 9Router protocol.',
    assignedTo: 'hermes',
    phase: 'PLAN',
    durationMs: 6000,
  },
  {
    title: 'Pipeline Phase Gate Verification',
    description: 'Audit all IMPLEMENT-phase tasks for completion certificates; authorize promotion to VERIFY phase for 8 qualifying deliverables.',
    assignedTo: 'hermes',
    phase: 'DISCOVER',
    durationMs: 4500,
  },
];

// ─── Telemetry Log Messages ───────────────────────────────────────────────────

const TELEMETRY_TEMPLATES: Array<{
  agent: AgentId | 'SYSTEM';
  level: TelemetryLevel;
  messages: string[];
}> = [
  {
    agent: 'hermes',
    level: 'INFO',
    messages: [
      'Dispatching endpoint verification to QA/QC Agent for review.',
      'Sprint queue decomposition complete. 47 tasks routed via 9Router.',
      'Pipeline phase IMPLEMENT authorized. 3 agents activated.',
      'Quality gate assessment initiated for VERIFY phase candidates.',
      'Task routing matrix recalculated. Frontend Agent prioritized.',
    ],
  },
  {
    agent: 'frontend',
    level: 'INFO',
    messages: [
      'React component tree rendered. 24 components hydrated successfully.',
      'Flutter widget tree compiled. iOS and Android targets passing.',
      'Tailwind CSS purge complete. Final bundle: 12.4 kB (gzip).',
      'State management audit complete. 0 redundant subscriptions detected.',
      'Responsive breakpoints validated across 320px–1920px viewport range.',
    ],
  },
  {
    agent: 'backend',
    level: 'INFO',
    messages: [
      'API endpoint /api/v1/telemetry/ingest registered. Modbus validation active.',
      'Prisma migration applied. 3 new columns added to telemetry_readings.',
      'PostgreSQL EXPLAIN ANALYZE: query time reduced from 840ms to 12ms.',
      'Laravel Sanctum token rotation policy enforced across all sessions.',
      'Multi-tenant isolation audit passed. Zero IDOR vulnerabilities detected.',
    ],
  },
  {
    agent: 'qa',
    level: 'SUCCESS',
    messages: [
      'PHPUnit suite passed. 312 tests, 0 failures, coverage: 87.4%.',
      'Regression matrix complete. No regressions detected across 48 scenarios.',
      'Static analysis passed. PHPStan level 8: 0 errors.',
      'Edge-case validation passed. Concurrent booking collision test: SAFE.',
      'ESLint scan complete. 0 errors, 2 warnings resolved.',
    ],
  },
  {
    agent: 'devops',
    level: 'INFO',
    messages: [
      'Docker multi-stage build complete. Image size: 148 MB (compressed).',
      'GitHub Actions pipeline green. Deploy gate authorized.',
      'Nginx configuration validated. TLS 1.3 enforced. HSTS headers active.',
      'Staging environment deployment successful. Health check: PASSING.',
      'OpenAPI 3.x specification published to docs.berseka.id.',
    ],
  },
  {
    agent: 'SYSTEM',
    level: 'INFO',
    messages: [
      'Autonomous Studio initialized. All 5 agents online.',
      'Pipeline cycle completed. Initiating next sprint queue.',
      'Manual task dispatched by visitor. Routing via Hermes.',
      'Speed modifier applied. Simulation running at 2x velocity.',
    ],
  },
];

// ─── Utility Helpers ──────────────────────────────────────────────────────────

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function agentStatusForPhase(phase: PipelinePhase): AgentStatus {
  const map: Record<PipelinePhase, AgentStatus> = {
    DISCOVER: 'REVIEWING',
    PLAN: 'PLANNING',
    IMPLEMENT: 'CODING',
    VERIFY: 'TESTING',
    AUDIT: 'REVIEWING',
    DEPLOY: 'DEPLOYING',
  };
  return map[phase];
}

// ─── Engine Class ─────────────────────────────────────────────────────────────

type EngineListener = (state: StudioEngineState) => void;
type TelemetryListener = (entry: TelemetryEntry) => void;

export class AutonomousEngine {
  private state: StudioEngineState;
  private listeners: Set<EngineListener> = new Set();
  private telemetryListeners: Set<TelemetryListener> = new Set();
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private readonly TICK_MS = 500;

  constructor() {
    this.state = this.createInitialState();
  }

  // ── Initialization ──────────────────────────────────────────────────────────

  private createInitialState(): StudioEngineState {
    const makeAgent = (id: AgentId): AgentState => ({
      id,
      status: 'IDLE',
      currentTask: null,
      taskCompletionCount: 0,
      currentPhase: 'DISCOVER',
    });

    return {
      isRunning: true,
      speed: 1,
      uptimeSeconds: 0,
      currentPipelinePhase: 'PLAN',
      completedTaskCount: 0,
      activeTasks: [],
      agents: {
        hermes: makeAgent('hermes'),
        frontend: makeAgent('frontend'),
        backend: makeAgent('backend'),
        qa: makeAgent('qa'),
        devops: makeAgent('devops'),
      },
    };
  }

  // ── Lifecycle ───────────────────────────────────────────────────────────────

  start(): void {
    if (this.intervalId !== null) return;

    this.emitTelemetry('SYSTEM', 'INFO', 'JexyDev Autonomous Studio initialized. All 5 agents ONLINE. Pipeline active.');
    this.assignInitialTasks();

    this.intervalId = setInterval(() => {
      this.tick();
    }, this.TICK_MS);
  }

  stop(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  destroy(): void {
    this.stop();
    this.listeners.clear();
    this.telemetryListeners.clear();
  }

  // ── State Access ────────────────────────────────────────────────────────────

  getState(): Readonly<StudioEngineState> {
    return this.state;
  }

  // ── Subscriptions ───────────────────────────────────────────────────────────

  subscribe(listener: EngineListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  subscribeTelemetry(listener: TelemetryListener): () => void {
    this.telemetryListeners.add(listener);
    return () => this.telemetryListeners.delete(listener);
  }

  // ── Controls ────────────────────────────────────────────────────────────────

  setRunning(running: boolean): void {
    this.state = { ...this.state, isRunning: running };
    const msg = running
      ? 'Autonomous pipeline RESUMED. All agents reactivating.'
      : 'Autonomous pipeline PAUSED. Agent states preserved.';
    this.emitTelemetry('SYSTEM', 'INFO', msg);
    this.notify();
  }

  setSpeed(speed: SimulationSpeed): void {
    this.state = { ...this.state, speed };
    this.emitTelemetry('SYSTEM', 'INFO', `Simulation speed modifier set to ${speed}x.`);
    this.notify();
  }

  dispatchUserTask(title: string): void {
    const template = pickRandom(TASK_POOL.filter((t) => t.assignedTo !== 'hermes'));
    const task: SimulationTask = {
      id: generateId(),
      title: title.trim() || 'User-Dispatched Engineering Task',
      description: `Visitor-initiated task dispatched via Manual Dispatch interface. Routed by Hermes via 9Router to ${template.assignedTo.toUpperCase()} Agent for execution.`,
      assignedTo: template.assignedTo,
      phase: 'PLAN',
      startedAt: Date.now(),
      completedAt: null,
      isUserDispatched: true,
    };

    this.emitTelemetry('hermes', 'INFO', `Manual dispatch received: "${task.title}". Routing to ${task.assignedTo.toUpperCase()} Agent via 9Router.`);
    this.assignTaskToAgent(task);
    this.notify();
  }

  // ── Tick ────────────────────────────────────────────────────────────────────

  private tick(): void {
    if (!this.state.isRunning) return;

    const speedFactor = this.state.speed;
    const elapsedMs = this.TICK_MS * speedFactor;

    // Update uptime
    this.state = {
      ...this.state,
      uptimeSeconds: this.state.uptimeSeconds + (elapsedMs / 1000),
    };

    // Check active tasks for completion
    const now = Date.now();
    let completedDelta = 0;
    const updatedAgents = { ...this.state.agents };

    for (const agentId of Object.keys(updatedAgents) as AgentId[]) {
      const agent = updatedAgents[agentId];
      if (agent.currentTask && agent.currentTask.completedAt !== null) continue;
      if (!agent.currentTask) continue;

      const task = agent.currentTask;
      const template = TASK_POOL.find((t) => t.title === task.title);
      const duration = template?.durationMs ?? 8000;
      const elapsed = (now - task.startedAt) * speedFactor;

      if (elapsed >= duration) {
        // Task complete
        const completedTask: SimulationTask = { ...task, completedAt: now };
        completedDelta++;

        this.emitTelemetry(
          agentId,
          'SUCCESS',
          `Task completed: "${task.title}". Phase: ${task.phase}.`,
        );

        updatedAgents[agentId] = {
          ...agent,
          status: 'IDLE',
          currentTask: null,
          taskCompletionCount: agent.taskCompletionCount + 1,
          currentPhase: task.phase,
        };

        // Assign next task with a slight delay (randomly skip a tick to simulate idle)
        if (Math.random() > 0.3) {
          this.scheduleNextTask(agentId);
        }

        // Remove completed task from activeTasks
        this.state = {
          ...this.state,
          activeTasks: this.state.activeTasks.filter((t) => t.id !== completedTask.id),
          completedTaskCount: this.state.completedTaskCount + completedDelta,
        };
      }
    }

    this.state = {
      ...this.state,
      agents: updatedAgents,
    };

    // Occasionally emit a random telemetry log
    if (Math.random() < 0.08 * speedFactor) {
      this.emitRandomTelemetry();
    }

    // Occasionally re-assign idle agents
    for (const agentId of Object.keys(this.state.agents) as AgentId[]) {
      if (this.state.agents[agentId].status === 'IDLE' && Math.random() < 0.04 * speedFactor) {
        this.scheduleNextTask(agentId);
      }
    }

    this.notify();
  }

  // ── Task Assignment ─────────────────────────────────────────────────────────

  private assignInitialTasks(): void {
    // Assign one task per agent at startup
    const agentIds: AgentId[] = ['hermes', 'frontend', 'backend', 'qa', 'devops'];
    for (const agentId of agentIds) {
      const templates = TASK_POOL.filter((t) => t.assignedTo === agentId);
      if (templates.length === 0) continue;
      const template = pickRandom(templates);
      this.assignTaskToAgent(this.createTask(template));
    }
  }

  private scheduleNextTask(agentId: AgentId): void {
    const templates = TASK_POOL.filter((t) => t.assignedTo === agentId);
    if (templates.length === 0) return;
    const template = pickRandom(templates);
    const task = this.createTask(template);
    this.assignTaskToAgent(task);
  }

  private createTask(template: TaskTemplate): SimulationTask {
    return {
      id: generateId(),
      title: template.title,
      description: template.description,
      assignedTo: template.assignedTo,
      phase: template.phase,
      startedAt: Date.now(),
      completedAt: null,
      isUserDispatched: false,
    };
  }

  private assignTaskToAgent(task: SimulationTask): void {
    const agent = this.state.agents[task.assignedTo];
    if (!agent) return;

    // If agent already has a task, queue it for later
    if (agent.currentTask !== null) {
      this.emitTelemetry('hermes', 'INFO', `Task queued for ${task.assignedTo.toUpperCase()}: "${task.title}".`);
      return;
    }

    const status = agentStatusForPhase(task.phase);

    this.state = {
      ...this.state,
      agents: {
        ...this.state.agents,
        [task.assignedTo]: {
          ...agent,
          status,
          currentTask: task,
          currentPhase: task.phase,
        },
      },
      activeTasks: [...this.state.activeTasks, task],
      currentPipelinePhase: task.phase,
    };

    this.emitTelemetry(
      'hermes',
      'INFO',
      `Task dispatched to ${task.assignedTo.toUpperCase()}: "${task.title}" [${task.phase}]`,
    );
  }

  // ── Telemetry ───────────────────────────────────────────────────────────────

  private emitTelemetry(agent: AgentId | 'SYSTEM', level: TelemetryLevel, message: string): void {
    const entry: TelemetryEntry = {
      id: generateId(),
      timestamp: new Date(),
      agent,
      level,
      message,
    };
    for (const listener of this.telemetryListeners) {
      listener(entry);
    }
  }

  private emitRandomTelemetry(): void {
    const template = pickRandom(TELEMETRY_TEMPLATES);
    const message = pickRandom(template.messages);
    this.emitTelemetry(template.agent, template.level, message);
  }

  // ── Notify ──────────────────────────────────────────────────────────────────

  private notify(): void {
    const snapshot = { ...this.state };
    for (const listener of this.listeners) {
      listener(snapshot);
    }
  }
}

// Singleton instance
export const autonomousEngine = new AutonomousEngine();
