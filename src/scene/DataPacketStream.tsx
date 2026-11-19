/**
 * DataPacketStream.tsx
 * Renders animated glowing 3D data packets traveling along curved splines
 * from HermesCore to each active agent workstation.
 * Enhanced with comet trail effects, larger glowing spheres, emissive
 * materials, and multiple simultaneous packets per stream.
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
const PACKETS_PER_STREAM = 4;
const TRAIL_LENGTH = 5;

interface PacketData {
  taskId: string;
  agentId: AgentId;
  color: string;
  curve: THREE.CatmullRomCurve3;
  offset: number;
}

function buildCurve(agentId: AgentId): THREE.CatmullRomCurve3 {
  const def = AGENT_DEFINITIONS[agentId];
  const [ax, _ay, az] = def.position as [number, number, number];
  const target = new THREE.Vector3(ax, 0.8, az);

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
  const tubeGeom = useMemo(() => {
    return new THREE.TubeGeometry(packet.curve, 40, 0.008, 4, false);
  }, [packet.curve]);

  // Generate multiple offset packets per stream
  const offsets = useMemo(() => {
    const result: number[] = [];
    for (let i = 0; i < PACKETS_PER_STREAM; i++) {
      result.push((packet.offset + i / PACKETS_PER_STREAM) % 1);
    }
    return result;
  }, [packet.offset]);

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

      {/* Multiple moving packets with trail */}
      {offsets.map((offset, idx) => (
        <CometPacket
          key={idx}
          curve={packet.curve}
          color={packet.color}
          initialOffset={offset}
        />
      ))}
    </group>
  );
}

/* ── Comet Packet with Trail ─────────────────────────────────────────────── */

interface CometPacketProps {
  curve: THREE.CatmullRomCurve3;
  color: string;
  initialOffset: number;
}

function CometPacket({ curve, color, initialOffset }: CometPacketProps) {
  const leadRef = useRef<THREE.Mesh>(null);
  const trailRefs = useRef<(THREE.Mesh | null)[]>([]);
  const progressRef = useRef(initialOffset);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((_state, delta) => {
    progressRef.current = (progressRef.current + delta * 0.4) % 1;

    // Lead sphere
    if (leadRef.current) {
      const pt = curve.getPoint(progressRef.current);
      leadRef.current.position.copy(pt);

      // Update light position
      if (lightRef.current) {
        lightRef.current.position.copy(pt);
      }
    }

    // Trail spheres — follow behind at decreasing progress
    for (let i = 0; i < TRAIL_LENGTH; i++) {
      const trailMesh = trailRefs.current[i];
      if (trailMesh) {
        const trailProgress = (progressRef.current - (i + 1) * 0.025 + 1) % 1;
        const trailPt = curve.getPoint(trailProgress);
        trailMesh.position.copy(trailPt);
        // Fade out trail
        const mat = trailMesh.material as THREE.MeshBasicMaterial;
        mat.opacity = 0.6 - i * 0.1;
      }
    }
  });

  return (
    <group>
      {/* Lead sphere — larger and glowing */}
      <mesh ref={leadRef}>
        <sphereGeometry args={[0.09, 10, 10]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.2}
          metalness={0.3}
          roughness={0.5}
        />
      </mesh>

      {/* Trail spheres */}
      {Array.from({ length: TRAIL_LENGTH }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => { trailRefs.current[i] = el; }}
        >
          <sphereGeometry args={[0.06 - i * 0.008, 6, 6]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.6 - i * 0.1}
          />
        </mesh>
      ))}

      {/* Packet point light for glow */}
      <pointLight
        ref={lightRef}
        color={color}
        intensity={0.6}
        distance={1.5}
        decay={2}
      />
    </group>
  );
}
