/**
 * AgentWorkstation.tsx
 * Renders an individual agent workstation: desk, dual monitors,
 * geometric avatar with idle/working animation, floating status beacon,
 * and click/hover raycasting support.
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

export default function AgentWorkstation({ agent, state, isSelected, onClick }: AgentWorkstationProps) {
  const avatarRef = useRef<THREE.Mesh>(null);
  const beaconRef = useRef<THREE.Mesh>(null);
  const monitor1Ref = useRef<THREE.Mesh>(null);
  const monitor2Ref = useRef<THREE.Mesh>(null);
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

    // Avatar idle/working animation
    if (avatarRef.current) {
      if (isWorking) {
        avatarRef.current.rotation.y = t * 1.2;
        avatarRef.current.position.y = 0.9 + Math.sin(t * 2) * 0.04;
      } else {
        avatarRef.current.rotation.y = Math.sin(t * 0.5) * 0.3;
        avatarRef.current.position.y = 0.9;
      }
    }

    // Beacon pulse
    if (beaconRef.current) {
      const scale = isWorking ? 1 + Math.sin(t * 3) * 0.2 : 1 + Math.sin(t * 1) * 0.08;
      beaconRef.current.scale.setScalar(scale);
    }

    // Monitor glow pulse
    if (monitor1Ref.current && monitor2Ref.current) {
      const intensity = isWorking ? 0.6 + Math.sin(t * 4) * 0.3 : 0.4;
      (monitor1Ref.current.material as THREE.MeshBasicMaterial).color.setStyle(
        isWorking ? accentColor : '#1E3A5F',
      );
      (monitor2Ref.current.material as THREE.MeshBasicMaterial).color.setStyle(
        isWorking ? accentColor : '#162032',
      );
      void intensity; // suppress unused warning
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

      {/* Monitor 1 — left */}
      <group position={[-0.5, 0.75, -0.3]}>
        <mesh castShadow>
          <boxGeometry args={[0.65, 0.42, 0.04]} />
          <meshStandardMaterial color="#0F172A" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Screen */}
        <mesh ref={monitor1Ref} position={[0, 0, 0.025]}>
          <boxGeometry args={[0.59, 0.36, 0.01]} />
          <meshBasicMaterial color={isWorking ? accentColor : '#1E3A5F'} />
        </mesh>
        {/* Monitor stand */}
        <mesh position={[0, -0.26, 0.05]} castShadow>
          <boxGeometry args={[0.08, 0.1, 0.08]} />
          <meshStandardMaterial color="#162032" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* Monitor 2 — right */}
      <group position={[0.5, 0.75, -0.3]}>
        <mesh castShadow>
          <boxGeometry args={[0.65, 0.42, 0.04]} />
          <meshStandardMaterial color="#0F172A" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh ref={monitor2Ref} position={[0, 0, 0.025]}>
          <boxGeometry args={[0.59, 0.36, 0.01]} />
          <meshBasicMaterial color={isWorking ? accentColor : '#162032'} />
        </mesh>
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

      {/* Geometric 3D Avatar */}
      <mesh ref={avatarRef} position={[0, 0.9, 0.4]} castShadow>
        <octahedronGeometry args={[0.22]} />
        <meshStandardMaterial
          color={accentColor}
          metalness={0.6}
          roughness={0.2}
          emissive={accentColor}
          emissiveIntensity={isWorking ? 0.5 : 0.15}
        />
      </mesh>

      {/* Avatar point light */}
      <pointLight
        position={[0, 0.9, 0.4]}
        intensity={isWorking ? 0.8 : 0.3}
        color={accentColor}
        distance={3}
        decay={2}
      />

      {/* Floating status beacon */}
      <group position={[0, 1.6, 0.4]}>
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
        position={[0, 1.9, 0]}
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
        position={[0, 1.73, 0]}
        fontSize={0.08}
        color="#64748B"
        anchorX="center"
        anchorY="middle"
      >
        {state.currentPhase}
      </Text>

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
