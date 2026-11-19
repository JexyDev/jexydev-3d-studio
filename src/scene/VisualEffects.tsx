/**
 * VisualEffects.tsx
 * Global visual effects: ambient floating particles, floor scan line,
 * and background holographic grid walls.
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ── Ambient Floating Particles ──────────────────────────────────────────── */

const PARTICLE_COUNT = 120;

function AmbientParticles() {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, speeds } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const spd = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = Math.random() * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30;
      spd[i] = 0.1 + Math.random() * 0.3;
    }
    return { positions: pos, speeds: spd };
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const posAttr = geo.getAttribute('position') as THREE.BufferAttribute;
    const t = clock.getElapsedTime();
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const baseY = positions[i * 3 + 1];
      posAttr.setY(i, baseY + Math.sin(t * speeds[i] + i) * 0.5);
      posAttr.setX(i, positions[i * 3] + Math.sin(t * speeds[i] * 0.3 + i * 2) * 0.3);
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={PARTICLE_COUNT}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#38BDF8"
        size={0.04}
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/* ── Floor Scan Line ─────────────────────────────────────────────────────── */

function FloorScanLine() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const z = ((t * 2) % 30) - 15;
    meshRef.current.position.z = z;
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.08 + Math.sin(t * 3) * 0.03;
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
      <planeGeometry args={[40, 0.15]} />
      <meshBasicMaterial
        color="#38BDF8"
        transparent
        opacity={0.08}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ── Background Holographic Grid Walls ───────────────────────────────────── */

function HolographicGridWalls() {
  const leftRef = useRef<THREE.Mesh>(null);
  const rightRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const opacity = 0.04 + Math.sin(t * 0.5) * 0.015;
    if (leftRef.current) {
      (leftRef.current.material as THREE.MeshBasicMaterial).opacity = opacity;
    }
    if (rightRef.current) {
      (rightRef.current.material as THREE.MeshBasicMaterial).opacity = opacity;
    }
  });

  return (
    <group>
      {/* Left wall */}
      <mesh ref={leftRef} position={[-18, 3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[30, 8]} />
        <meshBasicMaterial
          color="#38BDF8"
          transparent
          opacity={0.04}
          wireframe
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Right wall */}
      <mesh ref={rightRef} position={[18, 3, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[30, 8]} />
        <meshBasicMaterial
          color="#38BDF8"
          transparent
          opacity={0.04}
          wireframe
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

/* ── Combined Export ─────────────────────────────────────────────────────── */

export default function VisualEffects() {
  return (
    <group>
      <AmbientParticles />
      <FloorScanLine />
      <HolographicGridWalls />
    </group>
  );
}
