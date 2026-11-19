/**
 * OfficeEnvironment.tsx
 * Dark minimalist studio floor with reflective grid, animated floor pulse,
 * floating holographic UI panels, ambient particles, subtle fog,
 * colored rim lights per zone, and atmospheric depth effects.
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Grid, Environment } from '@react-three/drei';
import * as THREE from 'three';

/* ── Floating Holographic UI Panel ───────────────────────────────────────── */

function HoloPanel({
  position,
  rotation,
  width,
  height,
  color,
  speed,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  width: number;
  height: number;
  color: string;
  speed: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.03 + Math.sin(t * speed) * 0.015;
    meshRef.current.position.y = position[1] + Math.sin(t * speed * 0.5) * 0.15;
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.03}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ── Animated Floor Pulse Ring ────────────────────────────────────────────── */

function FloorPulseRing() {
  const ringRef = useRef<THREE.Mesh>(null);
  const scaleRef = useRef(0);

  useFrame(({ clock }) => {
    if (!ringRef.current) return;
    const t = clock.getElapsedTime();
    // Pulse wave emanating from center, resets every 4 seconds
    scaleRef.current = (t % 4) / 4;
    const s = scaleRef.current * 15;
    ringRef.current.scale.set(s, s, 1);
    const mat = ringRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = (1 - scaleRef.current) * 0.06;
  });

  return (
    <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0]}>
      <ringGeometry args={[0.9, 1.0, 64]} />
      <meshBasicMaterial
        color="#38BDF8"
        transparent
        opacity={0.06}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ── Second Pulse Ring (offset) ──────────────────────────────────────────── */

function FloorPulseRing2() {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ringRef.current) return;
    const t = clock.getElapsedTime();
    const phase = ((t + 2) % 4) / 4;
    const s = phase * 15;
    ringRef.current.scale.set(s, s, 1);
    const mat = ringRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = (1 - phase) * 0.04;
  });

  return (
    <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0]}>
      <ringGeometry args={[0.9, 1.0, 64]} />
      <meshBasicMaterial
        color="#10B981"
        transparent
        opacity={0.04}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ── Main Environment ────────────────────────────────────────────────────── */

export default function OfficeEnvironment() {
  const floorRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (floorRef.current) {
      const mat = floorRef.current.material as THREE.MeshStandardMaterial;
      mat.envMapIntensity = 0.4 + Math.sin(clock.getElapsedTime() * 0.3) * 0.1;
    }
  });

  return (
    <group>
      {/* Environment map for reflections */}
      <Environment preset="city" />

      {/* Subtle fog for depth */}
      <fog attach="fog" args={['#0B1120', 18, 50]} />

      {/* Ambient light — base scene illumination */}
      <ambientLight intensity={0.15} color="#1E293B" />

      {/* Primary directional light — cool overhead */}
      <directionalLight
        position={[0, 20, 0]}
        intensity={0.8}
        color="#38BDF8"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.1}
        shadow-camera-far={100}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      {/* Fill light — warm secondary */}
      <directionalLight
        position={[-10, 10, 10]}
        intensity={0.3}
        color="#10B981"
      />

      {/* Hermes core point light — cyan glow */}
      <pointLight position={[0, 2, 0]} intensity={1.5} color="#38BDF8" distance={12} decay={2} />

      {/* Agent zone point lights */}
      <pointLight position={[-5, 1.5, -4]} intensity={0.8} color="#10B981" distance={6} decay={2} />
      <pointLight position={[5, 1.5, -4]} intensity={0.8} color="#A78BFA" distance={6} decay={2} />
      <pointLight position={[-5, 1.5, 4]} intensity={0.8} color="#FCD34D" distance={6} decay={2} />
      <pointLight position={[5, 1.5, 4]} intensity={0.8} color="#F9A8D4" distance={6} decay={2} />

      {/* Colored rim lights per zone — additional dramatic lighting */}
      <spotLight position={[-8, 5, -6]} intensity={0.5} color="#10B981" angle={0.4} penumbra={0.8} distance={12} />
      <spotLight position={[8, 5, -6]} intensity={0.5} color="#A78BFA" angle={0.4} penumbra={0.8} distance={12} />
      <spotLight position={[-8, 5, 6]} intensity={0.5} color="#FCD34D" angle={0.4} penumbra={0.8} distance={12} />
      <spotLight position={[8, 5, 6]} intensity={0.5} color="#F9A8D4" angle={0.4} penumbra={0.8} distance={12} />

      {/* Atmospheric fog-like hemisphere light */}
      <hemisphereLight args={['#0B1120', '#0F172A', 0.5]} />

      {/* Floor — dark reflective material */}
      <mesh
        ref={floorRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, 0]}
        receiveShadow
      >
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial
          color="#0B1120"
          metalness={0.6}
          roughness={0.3}
          envMapIntensity={0.4}
        />
      </mesh>

      {/* Grid overlay */}
      <Grid
        args={[40, 40]}
        position={[0, 0.001, 0]}
        cellSize={1}
        cellThickness={0.4}
        cellColor="#1E3A5F"
        sectionSize={5}
        sectionThickness={0.8}
        sectionColor="#38BDF8"
        fadeDistance={25}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid={false}
      />

      {/* Animated floor pulse rings */}
      <FloorPulseRing />
      <FloorPulseRing2 />

      {/* Zone dividers — glass/metal panels */}
      <mesh position={[0, 0.75, 0]} receiveShadow>
        <boxGeometry args={[14, 1.5, 0.05]} />
        <meshStandardMaterial
          color="#1E293B"
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.3}
        />
      </mesh>

      <mesh position={[0, 0.75, 0]} receiveShadow>
        <boxGeometry args={[0.05, 1.5, 12]} />
        <meshStandardMaterial
          color="#1E293B"
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Floating holographic UI panels (decorative) */}
      <HoloPanel position={[-12, 3.5, -8]} rotation={[0, 0.3, 0]} width={3} height={2} color="#38BDF8" speed={0.8} />
      <HoloPanel position={[12, 4.0, -6]} rotation={[0, -0.4, 0]} width={2.5} height={1.8} color="#A78BFA" speed={1.0} />
      <HoloPanel position={[-10, 2.8, 8]} rotation={[0, 0.2, 0.05]} width={2} height={1.5} color="#10B981" speed={0.6} />
      <HoloPanel position={[11, 3.2, 7]} rotation={[0, -0.25, 0]} width={2.8} height={1.6} color="#F9A8D4" speed={0.9} />
      <HoloPanel position={[0, 5.0, -12]} rotation={[0.1, 0, 0]} width={5} height={2.5} color="#38BDF8" speed={0.5} />

      {/* Perimeter walls (subtle backdrop) */}
      <mesh position={[0, 2, -15]} receiveShadow>
        <planeGeometry args={[40, 10]} />
        <meshStandardMaterial color="#0B1120" metalness={0.4} roughness={0.6} />
      </mesh>
      <mesh position={[0, 2, 15]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[40, 10]} />
        <meshStandardMaterial color="#0B1120" metalness={0.4} roughness={0.6} />
      </mesh>
    </group>
  );
}
