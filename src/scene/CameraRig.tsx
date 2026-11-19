/**
 * CameraRig.tsx
 * Provides OrbitControls with damping and smooth lerped camera presets
 * for navigating the 3D studio scene.
 */

import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import type { CameraPreset } from '../types/studio';
import { AGENT_DEFINITIONS } from '../data/agents';

interface CameraRigProps {
  activePreset: CameraPreset;
}

type PresetConfig = {
  position: THREE.Vector3;
  target: THREE.Vector3;
};

const PRESETS: Record<CameraPreset, PresetConfig> = {
  OVERVIEW: {
    position: new THREE.Vector3(0, 12, 14),
    target: new THREE.Vector3(0, 0, 0),
  },
  HERMES_CORE: {
    position: new THREE.Vector3(0, 4, 8),
    target: new THREE.Vector3(0, 0.5, 0),
  },
  FRONTEND: {
    position: new THREE.Vector3(-8, 3, 0),
    target: new THREE.Vector3(
      AGENT_DEFINITIONS.frontend.position[0],
      0.5,
      AGENT_DEFINITIONS.frontend.position[2],
    ),
  },
  BACKEND: {
    position: new THREE.Vector3(8, 3, 0),
    target: new THREE.Vector3(
      AGENT_DEFINITIONS.backend.position[0],
      0.5,
      AGENT_DEFINITIONS.backend.position[2],
    ),
  },
  QA_QC: {
    position: new THREE.Vector3(-8, 3, 8),
    target: new THREE.Vector3(
      AGENT_DEFINITIONS.qa.position[0],
      0.5,
      AGENT_DEFINITIONS.qa.position[2],
    ),
  },
  DEVOPS: {
    position: new THREE.Vector3(8, 3, 8),
    target: new THREE.Vector3(
      AGENT_DEFINITIONS.devops.position[0],
      0.5,
      AGENT_DEFINITIONS.devops.position[2],
    ),
  },
};

export default function CameraRig({ activePreset }: CameraRigProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();
  const targetPos = useRef(PRESETS.OVERVIEW.position.clone());
  const targetLookAt = useRef(PRESETS.OVERVIEW.target.clone());
  const tempTarget = useRef(new THREE.Vector3());

  useEffect(() => {
    const preset = PRESETS[activePreset];
    targetPos.current.copy(preset.position);
    targetLookAt.current.copy(preset.target);
  }, [activePreset]);

  useFrame((_, delta) => {
    // Frame-rate independent exponential smoothing easing curve
    const factor = 1 - Math.exp(-5.5 * Math.min(delta, 0.1));
    camera.position.lerp(targetPos.current, factor);

    if (controlsRef.current) {
      tempTarget.current.copy(controlsRef.current.target);
      tempTarget.current.lerp(targetLookAt.current, factor);
      controlsRef.current.target.copy(tempTarget.current);
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.08}
      minDistance={3}
      maxDistance={30}
      maxPolarAngle={Math.PI / 2.1}
      minPolarAngle={0.1}
      enablePan
      panSpeed={0.6}
      rotateSpeed={0.5}
      zoomSpeed={0.8}
      makeDefault
    />
  );
}
