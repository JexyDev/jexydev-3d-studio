/**
 * StudioCanvas.tsx
 * Root Three.js canvas that assembles all 3D scene components.
 */

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader, Stats } from '@react-three/drei';
import OfficeEnvironment from './OfficeEnvironment';
import HermesCore from './HermesCore';
import AgentWorkstation from './AgentWorkstation';
import DataPacketStream from './DataPacketStream';
import VisualEffects from './VisualEffects';
import CameraRig from './CameraRig';
import type { StudioEngineState, UIState, AgentId } from '../types/studio';
import { AGENT_DEFINITIONS, AGENT_IDS } from '../data/agents';

interface StudioCanvasProps {
  engineState: StudioEngineState;
  uiState: UIState;
  onSelectAgent: (id: AgentId | null) => void;
  onSelectHermes: () => void;
}

export default function StudioCanvas({
  engineState,
  uiState,
  onSelectAgent,
  onSelectHermes,
}: StudioCanvasProps) {
  const isDev = import.meta.env.DEV;

  return (
    <>
      <Canvas
        camera={{ position: [0, 12, 14], fov: 55, near: 0.1, far: 200 }}
        shadows
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: 1, // ACESFilmicToneMapping
          toneMappingExposure: 1.2,
        }}
        style={{ background: '#0B1120' }}
      >
        <Suspense fallback={null}>
          {/* Scene environment & lighting */}
          <OfficeEnvironment />

          {/* Global visual effects: particles, scanlines, holo walls */}
          <VisualEffects />

          {/* Camera rig with preset lerping */}
          <CameraRig activePreset={uiState.activeCameraPreset} />

          {/* Hermes Core — central orchestrator */}
          <HermesCore
            currentPhase={engineState.currentPipelinePhase}
            isActive={engineState.isRunning}
            isSelected={uiState.selectedAgentId === null && uiState.isInspectorOpen}
            onClick={onSelectHermes}
          />

          {/* Agent workstations */}
          {AGENT_IDS.filter((id) => id !== 'hermes').map((agentId) => (
            <AgentWorkstation
              key={agentId}
              agent={AGENT_DEFINITIONS[agentId]}
              state={engineState.agents[agentId]}
              isSelected={uiState.selectedAgentId === agentId}
              onClick={() => onSelectAgent(agentId)}
            />
          ))}

          {/* Data packet streams */}
          {engineState.isRunning && (
            <DataPacketStream activeTasks={engineState.activeTasks} />
          )}
        </Suspense>

        {/* Performance stats in dev mode */}
        {isDev && <Stats />}
      </Canvas>

      {/* Three.js Loader fallback */}
      <Loader
        containerStyles={{ background: '#0B1120' }}
        innerStyles={{ background: '#1E293B' }}
        barStyles={{ background: '#38BDF8' }}
        dataStyles={{ color: '#94A3B8', fontFamily: 'monospace' }}
        dataInterpolation={(p) => `Initializing Studio... ${p.toFixed(0)}%`}
        initialState={(active) => active}
      />
    </>
  );
}
