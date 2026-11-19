/**
 * HermesCore.tsx
 * The central server monolith representing Hermes (Lead Orchestrator).
 * Features multi-tier geometry, rotating holographic status rings,
 * and color-coded LED strips per pipeline phase.
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import type { PipelinePhase } from '../types/studio';

interface HermesCoreProps {
  currentPhase: PipelinePhase;
  isActive: boolean;
  onClick: () => void;
  isSelected: boolean;
}

const PHASE_COLORS: Record<PipelinePhase, string> = {
  DISCOVER: '#64748B',
  PLAN: '#A78BFA',
  IMPLEMENT: '#38BDF8',
  VERIFY: '#FCD34D',
  AUDIT: '#F97316',
  DEPLOY: '#10B981',
};

export default function HermesCore({ currentPhase, isActive, onClick, isSelected }: HermesCoreProps) {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  const phaseColor = PHASE_COLORS[currentPhase];

  const ledMaterial = useMemo(
    () => new THREE.MeshBasicMaterial({ color: phaseColor }),
    [phaseColor],
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (ring1Ref.current) ring1Ref.current.rotation.z = t * 0.6;
    if (ring2Ref.current) ring2Ref.current.rotation.z = -t * 0.4;
    if (ring3Ref.current) ring3Ref.current.rotation.x = t * 0.3;

    if (coreRef.current && isSelected) {
      coreRef.current.rotation.y = t * 0.2;
    }

    if (glowRef.current) {
      const scale = 1 + Math.sin(t * 2) * 0.08;
      glowRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Click hit area */}
      <mesh onClick={onClick} visible={false}>
        <sphereGeometry args={[1.8, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Outer glow sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.6, 32, 32]} />
        <meshBasicMaterial
          color={isSelected ? '#38BDF8' : '#1E3A5F'}
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Main server body — multi-tier monolith */}
      <group ref={coreRef} position={[0, 0, 0]}>
        {/* Base tier */}
        <mesh position={[0, -0.5, 0]} castShadow>
          <boxGeometry args={[0.9, 0.5, 0.9]} />
          <meshStandardMaterial color="#0F172A" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Mid tier */}
        <mesh position={[0, 0.1, 0]} castShadow>
          <boxGeometry args={[0.75, 0.6, 0.75]} />
          <meshStandardMaterial color="#162032" metalness={0.85} roughness={0.15} />
        </mesh>

        {/* Top tier */}
        <mesh position={[0, 0.65, 0]} castShadow>
          <boxGeometry args={[0.6, 0.5, 0.6]} />
          <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Apex sphere */}
        <mesh position={[0, 1.0, 0]} castShadow>
          <sphereGeometry args={[0.22, 16, 16]} />
          <MeshDistortMaterial
            color="#38BDF8"
            distort={isActive ? 0.3 : 0.05}
            speed={2}
            metalness={0.5}
            roughness={0.2}
          />
        </mesh>

        {/* LED strips — phase color */}
        {[-0.5, 0.1, 0.65].map((y, i) => (
          <mesh key={i} position={[0, y, 0.46]} material={ledMaterial}>
            <boxGeometry args={[0.5, 0.04, 0.02]} />
          </mesh>
        ))}

        {/* Panel detail lines */}
        {[-0.3, -0.1, 0.1, 0.3].map((y, i) => (
          <mesh key={`detail-${i}`} position={[0, y, 0.38]} castShadow>
            <boxGeometry args={[0.6, 0.015, 0.01]} />
            <meshBasicMaterial color="#1E3A5F" />
          </mesh>
        ))}
      </group>

      {/* Holographic rotating rings */}
      <mesh ref={ring1Ref} position={[0, 0.2, 0]}>
        <torusGeometry args={[1.1, 0.025, 8, 64]} />
        <meshBasicMaterial color="#38BDF8" transparent opacity={0.7} />
      </mesh>

      <mesh ref={ring2Ref} position={[0, 0.4, 0]} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1.3, 0.015, 8, 64]} />
        <meshBasicMaterial color={phaseColor} transparent opacity={0.5} />
      </mesh>

      <mesh ref={ring3Ref} position={[0, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.9, 0.012, 8, 48]} />
        <meshBasicMaterial color="#10B981" transparent opacity={0.4} />
      </mesh>

      {/* Label */}
      <Text
        position={[0, 1.6, 0]}
        fontSize={0.18}
        color="#38BDF8"
        font="https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD3oiw.woff"
        anchorX="center"
        anchorY="middle"
      >
        HERMES
      </Text>
      <Text
        position={[0, 1.35, 0]}
        fontSize={0.1}
        color="#94A3B8"
        anchorX="center"
        anchorY="middle"
      >
        ORCHESTRATOR · {currentPhase}
      </Text>

      {/* Selection indicator */}
      {isSelected && (
        <mesh position={[0, -0.76, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.2, 1.3, 32]} />
          <meshBasicMaterial color="#38BDF8" transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
}
