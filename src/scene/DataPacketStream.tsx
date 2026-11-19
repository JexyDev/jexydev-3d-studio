/**
 * DataPacketStream.tsx
 * Renders animated glowing 3D data packets traveling along curved splines
 * from HermesCore to each active agent workstation.
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { AgentId, SimulationTask } from '../types/studio';
import { AGENT_DEFINITIONS } from '../data/agents';

interface DataPacketStreamProps {
  activeTasks: SimulationTask[];
}

const HERMES_POS = new THREE.Vector3(0, 0.5, 0);

interface PacketData {
  taskId: string;
  agentId: AgentId;
  color: string;
  curve: THREE.CatmullRomCurve3;
  offset: number; // 0–1 progress offset for phase staggering
}

function buildCurve(agentId: AgentId): THREE.CatmullRomCurve3 {
  const def = AGENT_DEFINITIONS[agentId];
  const [ax, _ay, az] = def.position as [number, number, number];
  const target = new THREE.Vector3(ax, 0.8, az);

  // Control points: start → midpoint arc → target
  const mid = HERMES_POS.clone().lerp(target, 0.5).add(
    new THREE.Vector3(
      (Math.random() - 0.5) * 2,
      1.5 + Math.random() * 0.5,
      (Math.random() - 0.5) * 2,
    ),
  );

  return new THREE.CatmullRomCurve3([HERMES_POS.clone(), mid, target]);
}

export default function DataPacketStream({ activeTasks }: DataPacketStreamProps) {
  const packets = useMemo<PacketData[]>(() => {
    return activeTasks
      .filter((t) => t.assignedTo !== 'hermes')
      .map((task, i) => ({
        taskId: task.id,
        agentId: task.assignedTo,
        color: AGENT_DEFINITIONS[task.assignedTo].accentColor,
        curve: buildCurve(task.assignedTo),
        offset: (i * 0.33) % 1,
      }));
  }, [activeTasks]);

  if (packets.length === 0) return null;

  return (
    <group>
      {packets.map((packet) => (
        <PacketTrail key={packet.taskId} packet={packet} />
      ))}
    </group>
  );
}

interface PacketTrailProps {
  packet: PacketData;
}

function PacketTrail({ packet }: PacketTrailProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const progressRef = useRef(packet.offset);

  // Tube geometry for the path (non-animated, just the trail path)
  const tubeGeom = useMemo(() => {
    return new THREE.TubeGeometry(packet.curve, 40, 0.008, 4, false);
  }, [packet.curve]);

  useFrame((_state, delta) => {
    progressRef.current = (progressRef.current + delta * 0.4) % 1;

    if (meshRef.current) {
      const pt = packet.curve.getPoint(progressRef.current);
      meshRef.current.position.copy(pt);
    }
  });

  return (
    <group>
      {/* Static path tube */}
      <mesh>
        <primitive object={tubeGeom} attach="geometry" />
        <meshBasicMaterial
          color={packet.color}
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* Moving packet */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshBasicMaterial color={packet.color} />
      </mesh>

      {/* Packet point light for glow */}
      <PacketLight meshRef={meshRef} color={packet.color} />
    </group>
  );
}

interface PacketLightProps {
  meshRef: React.RefObject<THREE.Mesh | null>;
  color: string;
}

function PacketLight({ meshRef, color }: PacketLightProps) {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(() => {
    if (lightRef.current && meshRef.current) {
      lightRef.current.position.copy(meshRef.current.position);
    }
  });

  return <pointLight ref={lightRef} color={color} intensity={0.5} distance={1.5} decay={2} />;
}
