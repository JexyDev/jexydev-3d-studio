/**
 * App.tsx
 * Root application component for the JexyDev Autonomous 3D Engineering Studio.
 * Orchestrates engine state, UI state, and renders the full HUD + 3D scene.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import StudioCanvas from './scene/StudioCanvas';
import TopBar from './components/hud/TopBar';
import AgentInspector from './components/hud/AgentInspector';
import TelemetryTerminal from './components/hud/TelemetryTerminal';
import TaskDispatchModal from './components/hud/TaskDispatchModal';
import ProjectsDrawer from './components/hud/ProjectsDrawer';
import { autonomousEngine } from './engine/autonomousEngine';
import { connectSSETelemetry } from './engine/telemetryBridge';
import { AGENT_DEFINITIONS } from './data/agents';
import type {
  AgentId,
  CameraPreset,
  SimulationSpeed,
  StudioEngineState,
  TelemetryEntry,
  UIState,
} from './types/studio';

const MAX_TELEMETRY_ENTRIES = 200;

const INITIAL_UI_STATE: UIState = {
  selectedAgentId: null,
  activeCameraPreset: 'OVERVIEW',
  isInspectorOpen: false,
  isTerminalOpen: false,
  isDispatchModalOpen: false,
  isProjectsDrawerOpen: false,
};

/** Explicit lookup map: AgentId → CameraPreset. Avoids fragile string manipulation. */
const AGENT_CAMERA_MAP: Record<AgentId, CameraPreset> = {
  hermes: 'HERMES_CORE',
  frontend: 'FRONTEND',
  backend: 'BACKEND',
  qa: 'QA_QC',
  devops: 'DEVOPS',
};

export default function App() {
  const [engineState, setEngineState] = useState<StudioEngineState>(
    () => autonomousEngine.getState() as StudioEngineState,
  );
  const [uiState, setUiState] = useState<UIState>(INITIAL_UI_STATE);
  const [telemetryEntries, setTelemetryEntries] = useState<TelemetryEntry[]>([]);
  const engineStartedRef = useRef(false);

  // ── Engine Initialization ─────────────────────────────────────────────────

  useEffect(() => {
    if (engineStartedRef.current) return;
    engineStartedRef.current = true;

    // Start the autonomous engine
    autonomousEngine.start();

    // Subscribe to engine state updates
    const unsubEngine = autonomousEngine.subscribe((state) => {
      setEngineState({ ...state });
    });

    // Subscribe to telemetry
    const unsubTelemetry = autonomousEngine.subscribeTelemetry((entry) => {
      setTelemetryEntries((prev) => {
        const updated = [...prev, entry];
        return updated.length > MAX_TELEMETRY_ENTRIES
          ? updated.slice(updated.length - MAX_TELEMETRY_ENTRIES)
          : updated;
      });
    });

    // Connect SSE bridge (silent no-op if VITE_SSE_URL not set)
    const cleanupSSE = connectSSETelemetry((entry) => {
      setTelemetryEntries((prev) => {
        const updated = [...prev, entry];
        return updated.length > MAX_TELEMETRY_ENTRIES
          ? updated.slice(updated.length - MAX_TELEMETRY_ENTRIES)
          : updated;
      });
    });

    return () => {
      unsubEngine();
      unsubTelemetry();
      cleanupSSE();
      autonomousEngine.destroy();
    };
  }, []);

  // ── UI Handlers ───────────────────────────────────────────────────────────

  const handleSelectAgent = useCallback((id: AgentId | null) => {
    setUiState((prev) => ({
      ...prev,
      selectedAgentId: id,
      isInspectorOpen: id !== null,
      activeCameraPreset: id !== null
        ? AGENT_CAMERA_MAP[id]
        : prev.activeCameraPreset,
    }));
  }, []);

  const handleSelectHermes = useCallback(() => {
    setUiState((prev) => ({
      ...prev,
      selectedAgentId: null,
      isInspectorOpen: true,
      activeCameraPreset: 'HERMES_CORE',
    }));
  }, []);

  const handleCloseInspector = useCallback(() => {
    setUiState((prev) => ({
      ...prev,
      isInspectorOpen: false,
      selectedAgentId: null,
    }));
  }, []);

  const handleTogglePause = useCallback(() => {
    autonomousEngine.setRunning(!engineState.isRunning);
  }, [engineState.isRunning]);

  const handleSetSpeed = useCallback((speed: SimulationSpeed) => {
    autonomousEngine.setSpeed(speed);
  }, []);

  const handleSetCamera = useCallback((preset: CameraPreset) => {
    setUiState((prev) => ({ ...prev, activeCameraPreset: preset }));
  }, []);

  const handleOpenDispatch = useCallback(() => {
    setUiState((prev) => ({ ...prev, isDispatchModalOpen: true }));
  }, []);

  const handleCloseDispatch = useCallback(() => {
    setUiState((prev) => ({ ...prev, isDispatchModalOpen: false }));
  }, []);

  const handleDispatchTask = useCallback((title: string) => {
    autonomousEngine.dispatchUserTask(title);
  }, []);

  const handleToggleProjects = useCallback(() => {
    setUiState((prev) => ({
      ...prev,
      isProjectsDrawerOpen: !prev.isProjectsDrawerOpen,
    }));
  }, []);

  const handleToggleTerminal = useCallback(() => {
    setUiState((prev) => ({ ...prev, isTerminalOpen: !prev.isTerminalOpen }));
  }, []);

  // ── Inspector data ─────────────────────────────────────────────────────────

  const inspectorAgentDef = uiState.isInspectorOpen
    ? (uiState.selectedAgentId
        ? AGENT_DEFINITIONS[uiState.selectedAgentId]
        : AGENT_DEFINITIONS.hermes)
    : null;

  const inspectorAgentState = uiState.isInspectorOpen
    ? (uiState.selectedAgentId
        ? engineState.agents[uiState.selectedAgentId]
        : engineState.agents.hermes)
    : null;

  const isHermesSelected = uiState.isInspectorOpen && uiState.selectedAgentId === null;

  // Inspector camera preset mapping
  const handleAgentSelectFromInspectorClose = useCallback(() => {
    handleCloseInspector();
  }, [handleCloseInspector]);

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: '#0B1120' }}>
      {/* 3D Canvas — full viewport */}
      <StudioCanvas
        engineState={engineState}
        uiState={uiState}
        onSelectAgent={handleSelectAgent}
        onSelectHermes={handleSelectHermes}
      />

      {/* HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* All HUD children need pointer-events-auto */}

        {/* Top Bar */}
        <div className="pointer-events-auto">
          <TopBar
            engineState={engineState}
            activeCameraPreset={uiState.activeCameraPreset}
            onTogglePause={handleTogglePause}
            onSetSpeed={handleSetSpeed}
            onSetCamera={handleSetCamera}
            onOpenDispatch={handleOpenDispatch}
            onToggleProjects={handleToggleProjects}
            onToggleTerminal={handleToggleTerminal}
          />
        </div>

        {/* Agent Inspector */}
        {uiState.isInspectorOpen && (
          <div className="pointer-events-auto">
            <AgentInspector
              agentDef={inspectorAgentDef}
              agentState={inspectorAgentState}
              isHermes={isHermesSelected}
              onClose={handleAgentSelectFromInspectorClose}
            />
          </div>
        )}

        {/* Telemetry Terminal */}
        <div className="pointer-events-auto">
          <TelemetryTerminal
            entries={telemetryEntries}
            isOpen={uiState.isTerminalOpen}
            isInspectorOpen={uiState.isInspectorOpen}
            onToggle={handleToggleTerminal}
          />
        </div>

        {/* Task Dispatch Modal */}
        {uiState.isDispatchModalOpen && (
          <div className="pointer-events-auto">
            <TaskDispatchModal
              isOpen={uiState.isDispatchModalOpen}
              onClose={handleCloseDispatch}
              onDispatch={handleDispatchTask}
            />
          </div>
        )}

        {/* Projects Drawer */}
        {uiState.isProjectsDrawerOpen && (
          <div className="pointer-events-auto">
            <ProjectsDrawer
              isOpen={uiState.isProjectsDrawerOpen}
              onClose={handleToggleProjects}
            />
          </div>
        )}
      </div>

      {/* Keyboard shortcut hint (bottom-left) */}
      {!uiState.isTerminalOpen && (
        <div className="absolute bottom-2 left-3 pointer-events-none">
          <p className="font-mono text-xs text-slate-700">
            Click agents to inspect · Scroll/drag to navigate · TERMINAL for logs
          </p>
        </div>
      )}
    </div>
  );
}
