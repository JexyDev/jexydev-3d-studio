/**
 * AgentWorkstation.tsx
 * Renders an individual agent workstation with a detailed humanoid
 * robot/android character built from Three.js primitives, articulated
 * typing animations, floating holographic monitors, and particle effects.
 */

import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import type { AgentDefinition, AgentState } from '../types/studio';

interface AgentWorkstationProps {
  agent: AgentDefinition;
  state: AgentState;
  isSelected: boolean;
  onClick: () => void;
}

const STATUS_COLORS: Record<string, string> = {
  IDLE: '#64748B',
  PLANNING: '#A78BFA',
  CODING: '#38BDF8',
  TESTING: '#FCD34D',
  DEPLOYING: '#10B981',
  REVIEWING: '#F97316',
};

const STATUS_EMOJIS: Record<string, string> = {
  IDLE: '😴',
  PLANNING: '🧠',
  CODING: '⚡',
  TESTING: '🔍',
  DEPLOYING: '🚀',
  REVIEWING: '📋',
};

/* ── Workstation Particle Effects ─────────────────────────────────────────── */

const WS_PARTICLE_COUNT = 24;

function WorkstationParticles({ color, active }: { color: string; active: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(WS_PARTICLE_COUNT * 3);
    for (let i = 0; i < WS_PARTICLE_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 2.4;
      pos[i * 3 + 1] = Math.random() * 2.0;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 2.0;
    }
    return pos;
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current || !active) return;
    const geo = pointsRef.current.geometry;
    const posAttr = geo.getAttribute('position') as THREE.BufferAttribute;
    const t = clock.getElapsedTime();
    for (let i = 0; i < WS_PARTICLE_COUNT; i++) {
      const baseY = positions[i * 3 + 1];
      posAttr.setY(i, baseY + Math.sin(t * 1.5 + i * 0.8) * 0.3);
    }
    posAttr.needsUpdate = true;
  });

  if (!active) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={WS_PARTICLE_COUNT}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.03}
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/* ── Holographic Monitor Screen ──────────────────────────────────────────── */

function HoloMonitor({
  position,
  rotation,
  color,
  active,
  index,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  color: string;
  active: boolean;
  index: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = active
      ? 0.25 + Math.sin(t * 2.5 + index) * 0.1
      : 0.08;
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation ?? [0, 0, 0]}>
      <planeGeometry args={[0.65, 0.42]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.15}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ── Humanoid Robot Character ────────────────────────────────────────────── */

function RobotCharacter({
  color,
  status,
  isWorking,
}: {
  color: string;
  status: string;
  isWorking: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const visorRef = useRef<THREE.Mesh>(null);

  const statusEmoji = STATUS_EMOJIS[status] ?? '😴';

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Head subtle bob
    if (groupRef.current) {
      groupRef.current.position.y = isWorking
        ? Math.sin(t * 1.5) * 0.02
        : Math.sin(t * 0.4) * 0.01;
    }

    // Typing animation — arms move up/down rhythmically
    if (leftArmRef.current && rightArmRef.current) {
      if (isWorking) {
        leftArmRef.current.rotation.x = -0.6 + Math.sin(t * 6) * 0.15;
        rightArmRef.current.rotation.x = -0.6 + Math.sin(t * 6 + Math.PI) * 0.15;
      } else {
        // Arms folded / resting
        leftArmRef.current.rotation.x = -0.3;
        rightArmRef.current.rotation.x = -0.3;
      }
    }

    // Visor glow pulse
    if (visorRef.current) {
      const mat = visorRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = isWorking
        ? 0.6 + Math.sin(t * 3) * 0.3
        : 0.2;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.44, 0.45]}>
      {/* ── Head ── */}
      <group position={[0, 0.72, 0]}>
        {/* Skull */}
        <mesh castShadow>
          <boxGeometry args={[0.22, 0.2, 0.2]} />
          <meshStandardMaterial
            color="#1E293B"
            metalness={0.85}
            roughness={0.15}
          />
        </mesh>
        {/* Visor / face screen */}
        <mesh ref={visorRef} position={[0, 0, 0.105]} castShadow>
          <boxGeometry args={[0.18, 0.08, 0.02]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.4}
            metalness={0.3}
            roughness={0.4}
          />
        </mesh>
        {/* Status emoji label */}
        <Text
          position={[0, 0.0, 0.12]}
          fontSize={0.07}
          anchorX="center"
          anchorY="middle"
        >
          {statusEmoji}
        </Text>
        {/* Antenna */}
        <mesh position={[0, 0.14, 0]} castShadow>
          <cylinderGeometry args={[0.008, 0.008, 0.08, 6]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0, 0.19, 0]}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshBasicMaterial color={color} />
        </mesh>
      </group>

      {/* ── Torso ── */}
      <group position={[0, 0.42, 0]}>
        {/* Main body */}
        <mesh castShadow>
          <boxGeometry args={[0.26, 0.3, 0.18]} />
          <meshStandardMaterial
            color="#162032"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        {/* LED chest panel */}
        <mesh position={[0, 0.02, 0.095]}>
          <boxGeometry args={[0.14, 0.1, 0.01]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={isWorking ? 0.6 : 0.15}
            metalness={0.4}
            roughness={0.3}
          />
        </mesh>
      </group>

      {/* ── Left Arm ── */}
      <group ref={leftArmRef} position={[-0.19, 0.48, 0.05]}>
        {/* Upper arm */}
        <mesh position={[0, -0.08, 0]} castShadow>
          <boxGeometry args={[0.06, 0.16, 0.06]} />
          <meshStandardMaterial color="#1E293B" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Forearm */}
        <mesh position={[0, -0.2, 0.04]} castShadow>
          <boxGeometry args={[0.05, 0.12, 0.05]} />
          <meshStandardMaterial color="#162032" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.28, 0.06]}>
          <sphereGeometry args={[0.025, 6, 6]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
        </mesh>
      </group>

      {/* ── Right Arm ── */}
      <group ref={rightArmRef} position={[0.19, 0.48, 0.05]}>
        {/* Upper arm */}
        <mesh position={[0, -0.08, 0]} castShadow>
          <boxGeometry args={[0.06, 0.16, 0.06]} />
          <meshStandardMaterial color="#1E293B" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Forearm */}
        <mesh position={[0, -0.2, 0.04]} castShadow>
          <boxGeometry args={[0.05, 0.12, 0.05]} />
          <meshStandardMaterial color="#162032" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.28, 0.06]}>
          <sphereGeometry args={[0.025, 6, 6]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
        </mesh>
      </group>

      {/* ── Seated Lower Body (legs on chair) ── */}
      <group position={[0, 0.2, 0.05]}>
        {/* Left thigh */}
        <mesh position={[-0.06, 0, 0.04]} castShadow>
          <boxGeometry args={[0.08, 0.08, 0.16]} />
          <meshStandardMaterial color="#162032" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Right thigh */}
        <mesh position={[0.06, 0, 0.04]} castShadow>
          <boxGeometry args={[0.08, 0.08, 0.16]} />
          <meshStandardMaterial color="#162032" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>

      {/* ── Futuristic Chair ── */}
      <group position={[0, 0.1, 0.1]}>
        {/* Seat */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.3, 0.04, 0.26]} />
          <meshStandardMaterial color="#0F172A" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Backrest */}
        <mesh position={[0, 0.2, -0.1]} castShadow>
          <boxGeometry args={[0.28, 0.4, 0.03]} />
          <meshStandardMaterial color="#0F172A" metalness={0.85} roughness={0.15} />
        </mesh>
        {/* Chair base */}
        <mesh position={[0, -0.08, 0]}>
          <cylinderGeometry args={[0.04, 0.06, 0.12, 8]} />
          <meshStandardMaterial color="#162032" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
    </group>
  );
}

/* ── Main Component ──────────────────────────────────────────────────────── */

export default function AgentWorkstation({ agent, state, isSelected, onClick }: AgentWorkstationProps) {
  const beaconRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const statusColor = STATUS_COLORS[state.status] ?? '#64748B';
  const isWorking = state.status !== 'IDLE';
  const accentColor = agent.accentColor;

  const statusMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: statusColor }),
    [statusColor],
  );
  const deskMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#0F172A', metalness: 0.9, roughness: 0.2 }),
    [],
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Beacon pulse
    if (beaconRef.current) {
      const scale = isWorking ? 1 + Math.sin(t * 3) * 0.2 : 1 + Math.sin(t * 1) * 0.08;
      beaconRef.current.scale.setScalar(scale);
    }
  });

  const [px, _py, pz] = agent.position as [number, number, number];

  return (
    <group position={[px, 0, pz]}>
      {/* Click / hover hit area */}
      <mesh
        onClick={onClick}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        visible={false}
      >
        <boxGeometry args={[2.5, 2.5, 2.5]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Desk surface */}
      <mesh position={[0, 0.4, 0]} castShadow material={deskMat}>
        <boxGeometry args={[2.0, 0.08, 1.0]} />
      </mesh>

      {/* Desk legs */}
      {[[-0.85, -0.4], [0.85, -0.4], [-0.85, 0.4], [0.85, 0.4]].map(([lx, lz], i) => (
        <mesh key={i} position={[lx, 0.2, lz]} castShadow>
          <boxGeometry args={[0.05, 0.4, 0.05]} />
          <meshStandardMaterial color="#162032" metalness={0.8} roughness={0.3} />
        </mesh>
      ))}

      {/* Holographic Monitor 1 — left */}
      <group position={[-0.5, 0.75, -0.3]}>
        <mesh castShadow>
          <boxGeometry args={[0.65, 0.42, 0.04]} />
          <meshStandardMaterial color="#0F172A" metalness={0.8} roughness={0.2} />
        </mesh>
        <HoloMonitor
          position={[0, 0, 0.025]}
          color={accentColor}
          active={isWorking}
          index={0}
        />
        {/* Monitor stand */}
        <mesh position={[0, -0.26, 0.05]} castShadow>
          <boxGeometry args={[0.08, 0.1, 0.08]} />
          <meshStandardMaterial color="#162032" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* Holographic Monitor 2 — right */}
      <group position={[0.5, 0.75, -0.3]}>
        <mesh castShadow>
          <boxGeometry args={[0.65, 0.42, 0.04]} />
          <meshStandardMaterial color="#0F172A" metalness={0.8} roughness={0.2} />
        </mesh>
        <HoloMonitor
          position={[0, 0, 0.025]}
          color={accentColor}
          active={isWorking}
          index={1}
        />
        <mesh position={[0, -0.26, 0.05]} castShadow>
          <boxGeometry args={[0.08, 0.1, 0.08]} />
          <meshStandardMaterial color="#162032" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* Keyboard */}
      <mesh position={[0, 0.46, 0.15]} castShadow>
        <boxGeometry args={[0.6, 0.02, 0.2]} />
        <meshStandardMaterial color="#162032" metalness={0.7} roughness={0.4} />
      </mesh>

      {/* Humanoid Robot Character */}
      <RobotCharacter
        color={accentColor}
        status={state.status}
        isWorking={isWorking}
      />

      {/* Avatar point light */}
      <pointLight
        position={[0, 1.0, 0.4]}
        intensity={isWorking ? 0.8 : 0.3}
        color={accentColor}
        distance={3}
        decay={2}
      />

      {/* Floating status beacon */}
      <group position={[0, 1.7, 0.4]}>
        <mesh ref={beaconRef}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshBasicMaterial color={statusColor} />
        </mesh>

        {/* Status text */}
        <Text
          position={[0.15, 0, 0]}
          fontSize={0.08}
          color={statusColor}
          anchorX="left"
          anchorY="middle"
        >
          {state.status}
        </Text>
      </group>

      {/* Agent name label */}
      <Text
        position={[0, 2.0, 0]}
        fontSize={0.13}
        color={accentColor}
        font="https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD3oiw.woff"
        anchorX="center"
        anchorY="middle"
      >
        {agent.displayName}
      </Text>

      {/* Phase badge */}
      <Text
        position={[0, 1.83, 0]}
        fontSize={0.08}
        color="#64748B"
        anchorX="center"
        anchorY="middle"
      >
        {state.currentPhase}
      </Text>

      {/* Workstation particles */}
      <WorkstationParticles color={accentColor} active={isWorking} />

      {/* Selection ring */}
      {(isSelected || hovered) && (
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.1, 1.2, 32]} />
          <meshBasicMaterial
            color={accentColor}
            transparent
            opacity={isSelected ? 0.7 : 0.35}
          />
        </mesh>
      )}

      {/* Accent floor strip */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.0, 1.0]} />
        <meshBasicMaterial color={accentColor} transparent opacity={0.04} />
      </mesh>

      {/* Accent stripe — desk edge */}
      <mesh position={[0, 0.44, -0.46]} material={statusMat}>
        <boxGeometry args={[2.0, 0.015, 0.015]} />
      </mesh>
    </group>
  );
}
