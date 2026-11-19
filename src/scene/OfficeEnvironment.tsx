/**
 * OfficeEnvironment.tsx
 * Dark minimalist studio floor with reflective grid, ambient lighting,
 * glass/metal zone dividers, and a subtle atmospheric depth effect.
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Grid, Environment } from '@react-three/drei';
import * as THREE from 'three';

export default function OfficeEnvironment() {
  const floorRef = useRef<THREE.Mesh>(null);

  // Subtle floor reflectivity pulse
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

      {/* Zone dividers — glass/metal panels */}
      {/* Horizontal divider (Z-axis) */}
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

      {/* Vertical divider (X-axis) */}
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
