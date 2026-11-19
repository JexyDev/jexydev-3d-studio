/**
 * HermesCore.tsx
 * The central server monolith representing Hermes (Lead Orchestrator).
 * Features multi-tier geometry, 3 concentric gyroscope rings, vertical
 * light beam, holographic data sphere, pulsing energy field, and
 * color-coded LED strips per pipeline phase.
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
  PLAN: '#22D3EE',
  IMPLEMENT: '#10B981',
  VERIFY: '#FCD34D',
  AUDIT: '#F97316',
  DEPLOY: '#F9A8D4',
};

export default function HermesCore({ currentPhase, isActive, onClick, isSelected }: HermesCoreProps) {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const energyFieldRef = useRef<THREE.Mesh>(null);
  const dataSphereRef = useRef<THREE.Mesh>(null);
  const beamRef = useRef<THREE.Mesh>(null);

  const phaseColor = PHASE_COLORS[currentPhase];

  const ledMaterial = useMemo(
    () => new THREE.MeshBasicMaterial({ color: phaseColor }),
    [phaseColor],
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Gyroscope-style concentric rings at different speeds and axes
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = t * 0.6;
      ring1Ref.current.rotation.x = Math.sin(t * 0.2) * 0.3;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -t * 0.4;
      ring2Ref.current.rotation.y = t * 0.3;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = t * 0.5;
      ring3Ref.current.rotation.z = Math.cos(t * 0.25) * 0.4;
    }

    if (coreRef.current && isSelected) {
      coreRef.current.rotation.y = t * 0.2;
    }

    // Outer glow pulse
    if (glowRef.current) {
      const scale = 1 + Math.sin(t * 2) * 0.08;
      glowRef.current.scale.setScalar(scale);
    }

    // Energy field pulsing opacity
    if (energyFieldRef.current) {
      const mat = energyFieldRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.04 + Math.sin(t * 1.5) * 0.03;
      energyFieldRef.current.rotation.y = t * 0.15;
    }

    // Data sphere rotation
    if (dataSphereRef.current) {
      dataSphereRef.current.rotation.y = t * 0.4;
      dataSphereRef.current.rotation.x = t * 0.2;
      dataSphereRef.current.position.y = 1.8 + Math.sin(t * 1.2) * 0.08;
    }

    // Beam flicker
    if (beamRef.current) {
      const mat = beamRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = isActive
        ? 0.12 + Math.sin(t * 5) * 0.04
        : 0.04;
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

      {/* ── Pulsing Energy Field ── */}
      <mesh ref={energyFieldRef}>
        <sphereGeometry args={[2.0, 32, 32]} />
        <meshBasicMaterial
          color={phaseColor}
          transparent
          opacity={0.04}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* ── Vertical Light Beam ── */}
      <mesh ref={beamRef} position={[0, 3.5, 0]}>
        <cylinderGeometry args={[0.08, 0.2, 5, 8, 1, true]} />
        <meshBasicMaterial
          color="#38BDF8"
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* ── Holographic Data Sphere (wireframe above) ── */}
      <mesh ref={dataSphereRef} position={[0, 1.8, 0]}>
        <icosahedronGeometry args={[0.35, 1]} />
        <meshBasicMaterial
          color={phaseColor}
          wireframe
          transparent
          opacity={0.5}
          depthWrite={false}
        />
      </mesh>
      {/* Inner solid sphere for data sphere */}
      <mesh position={[0, 1.8, 0]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial
          color={phaseColor}
          emissive={phaseColor}
          emissiveIntensity={0.8}
          metalness={0.5}
          roughness={0.3}
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

        {/* LED strips — phase color (front, back, left, right) */}
        {[-0.5, 0.1, 0.65].map((y, i) => (
          <group key={i}>
            <mesh position={[0, y, 0.46]} material={ledMaterial}>
              <boxGeometry args={[0.5, 0.04, 0.02]} />
            </mesh>
            <mesh position={[0, y, -0.46]} material={ledMaterial}>
              <boxGeometry args={[0.5, 0.04, 0.02]} />
            </mesh>
            <mesh position={[0.46, y, 0]} material={ledMaterial}>
              <boxGeometry args={[0.02, 0.04, 0.5]} />
            </mesh>
            <mesh position={[-0.46, y, 0]} material={ledMaterial}>
              <boxGeometry args={[0.02, 0.04, 0.5]} />
            </mesh>
          </group>
        ))}

        {/* Panel detail lines */}
        {[-0.3, -0.1, 0.1, 0.3].map((y, i) => (
          <mesh key={`detail-${i}`} position={[0, y, 0.38]} castShadow>
            <boxGeometry args={[0.6, 0.015, 0.01]} />
            <meshBasicMaterial color="#1E3A5F" />
          </mesh>
        ))}
      </group>

      {/* ── 3 Concentric Gyroscope Rings ── */}
      {/* Ring 1 — largest, slow rotation */}
      <mesh ref={ring1Ref} position={[0, 0.2, 0]}>
        <torusGeometry args={[1.3, 0.025, 8, 64]} />
        <meshBasicMaterial color="#38BDF8" transparent opacity={0.7} />
      </mesh>

      {/* Ring 2 — mid size, opposite direction */}
      <mesh ref={ring2Ref} position={[0, 0.3, 0]} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1.1, 0.02, 8, 64]} />
        <meshBasicMaterial color={phaseColor} transparent opacity={0.5} />
      </mesh>

      {/* Ring 3 — smallest, perpendicular axis */}
      <mesh ref={ring3Ref} position={[0, 0.1, 0]} rotation={[Math.PI / 2, Math.PI / 4, 0]}>
        <torusGeometry args={[0.9, 0.015, 8, 48]} />
        <meshBasicMaterial color="#10B981" transparent opacity={0.4} />
      </mesh>

      {/* Label */}
      <Text
        position={[0, 2.4, 0]}
        fontSize={0.18}
        color="#38BDF8"
        font="https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD3oiw.woff"
        anchorX="center"
        anchorY="middle"
      >
        HERMES
      </Text>
      <Text
        position={[0, 2.15, 0]}
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
