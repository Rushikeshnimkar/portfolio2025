"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Stars, Sparkles } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { useMemo, useRef, Suspense, useEffect } from "react";
import * as THREE from "three";

const AQUA = "#2ee6d6";
const CYAN = "#36a2ff";
const TEAL = "#14f1b2";
const MIDNIGHT = "#0a1b2e";

// Camera descends this many Y-units as scroll goes 0→1
const DESCENT = 90;

function getScrollProgress(): number {
  if (typeof window === "undefined") return 0;
  const max = document.body.scrollHeight - window.innerHeight;
  return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
}

// ─── RISING BUBBLES ───────────────────────────────────────────────────────────

function Bubbles() {
  const COUNT = 260;
  const pointsRef = useRef<THREE.Points>(null);

  const { posArray, speedArray } = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const spd = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 26;
      pos[i * 3 + 1] = -Math.random() * DESCENT;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 14;
      spd[i] = 0.005 + Math.random() * 0.02;
    }
    return { posArray: pos, speedArray: spd };
  }, []);

  useEffect(() => {
    if (!pointsRef.current) return;
    pointsRef.current.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(posArray, 3)
    );
  }, [posArray]);

  useFrame(() => {
    if (!pointsRef.current) return;
    const attr = pointsRef.current.geometry.getAttribute(
      "position"
    ) as THREE.BufferAttribute;
    if (!attr) return;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < COUNT; i++) {
      arr[i * 3 + 1] += speedArray[i];
      if (arr[i * 3 + 1] > 5) {
        arr[i * 3 + 1] = -DESCENT - Math.random() * 10;
        arr[i * 3] = (Math.random() - 0.5) * 26;
        arr[i * 3 + 2] = (Math.random() - 0.5) * 14;
      }
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry />
      <pointsMaterial
        size={0.065}
        color={AQUA}
        transparent
        opacity={0.45}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ─── HOME ZONE (Y ≈ 0) — crystal spires + floating geometry ──────────────────

function CrystalSpire({
  position,
  height,
  color,
}: {
  position: [number, number, number];
  height: number;
  color: string;
}) {
  const ref = useRef<THREE.Group>(null);
  const rotSpeed = useMemo(() => 0.08 + Math.random() * 0.14, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * rotSpeed;
  });

  return (
    <group ref={ref} position={position}>
      <mesh>
        <coneGeometry args={[0.3, height, 6, 1]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.85}
          roughness={0.2}
          metalness={0.7}
          transparent
          opacity={0.72}
        />
      </mesh>
      <mesh position={[0, -height * 0.38, 0]}>
        <octahedronGeometry args={[0.42, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.7}
          transparent
          opacity={0.4}
        />
      </mesh>
    </group>
  );
}

function HomeZone() {
  const spires = useMemo(
    () => [
      { pos: [-5, -7, -4] as [number, number, number], h: 5, col: AQUA },
      { pos: [-3, -8, -7] as [number, number, number], h: 9, col: TEAL },
      { pos: [5, -7, -3] as [number, number, number], h: 6, col: CYAN },
      { pos: [3, -8, -8] as [number, number, number], h: 4, col: AQUA },
      { pos: [-7, -7, -5] as [number, number, number], h: 3.5, col: CYAN },
      { pos: [7, -8, -6] as [number, number, number], h: 7, col: TEAL },
      { pos: [0, -8, -9] as [number, number, number], h: 5.5, col: AQUA },
    ],
    []
  );

  return (
    <group>
      {spires.map((s, i) => (
        <Float
          key={i}
          speed={0.55 + i * 0.09}
          floatIntensity={0.6}
          floatingRange={[-0.25, 0.25]}
        >
          <CrystalSpire position={s.pos} height={s.h} color={s.col} />
        </Float>
      ))}

      {/* Central wireframe icosahedron */}
      <Float speed={0.85} floatIntensity={1.2} floatingRange={[-0.4, 0.4]}>
        <mesh position={[0, 1.5, -5]}>
          <icosahedronGeometry args={[1.6, 1]} />
          <meshStandardMaterial
            color={CYAN}
            emissive={CYAN}
            emissiveIntensity={0.6}
            wireframe
            transparent
            opacity={0.65}
          />
        </mesh>
      </Float>

      {/* Orbiting ring */}
      <Float speed={0.5} rotationIntensity={1.5} floatIntensity={0.4}>
        <mesh
          position={[0, 0.5, -5]}
          rotation={[Math.PI / 3, 0, Math.PI / 5]}
        >
          <torusGeometry args={[2.8, 0.045, 8, 80]} />
          <meshStandardMaterial
            color={AQUA}
            emissive={AQUA}
            emissiveIntensity={1.3}
          />
        </mesh>
      </Float>

      <Sparkles
        count={90}
        scale={[16, 10, 10]}
        position={[0, 0, -3]}
        size={2.2}
        speed={0.35}
        color={AQUA}
        opacity={0.55}
      />
    </group>
  );
}

// ─── ABOUT ZONE (Y ≈ -15) — bioluminescent jellyfish ─────────────────────────

function JellyfishShape({
  position,
  scale = 1,
  color = TEAL,
}: {
  position: [number, number, number];
  scale?: number;
  color?: string;
}) {
  const capRef = useRef<THREE.Mesh>(null);
  const tentacleAngles = useMemo(
    () => Array.from({ length: 7 }, (_, i) => (i / 7) * Math.PI * 2),
    []
  );

  useFrame((state) => {
    if (!capRef.current) return;
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.8) * 0.13;
    capRef.current.scale.x = pulse;
    capRef.current.scale.z = pulse;
    capRef.current.scale.y = 1 - (pulse - 1) * 0.6;
  });

  return (
    <group position={position} scale={scale}>
      <mesh ref={capRef}>
        <sphereGeometry
          args={[1.1, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.55]}
        />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.65}
          transparent
          opacity={0.32}
          side={THREE.DoubleSide}
        />
      </mesh>
      {tentacleAngles.map((angle, i) => (
        <mesh
          key={i}
          position={[Math.cos(angle) * 0.65, -0.9, Math.sin(angle) * 0.65]}
        >
          <cylinderGeometry args={[0.025, 0.008, 2.2 + i * 0.25, 4]} />
          <meshStandardMaterial
            color={AQUA}
            emissive={AQUA}
            emissiveIntensity={1.0}
            transparent
            opacity={0.38}
          />
        </mesh>
      ))}
    </group>
  );
}

function AboutZone() {
  return (
    <group position={[0, -15, 0]}>
      <Float speed={0.7} floatIntensity={1.1} floatingRange={[-0.5, 0.5]}>
        <JellyfishShape position={[-5.5, 0, -5]} scale={1.1} color={TEAL} />
      </Float>
      <Float speed={0.9} floatIntensity={0.9} floatingRange={[-0.4, 0.4]}>
        <JellyfishShape position={[5, 1.5, -7]} scale={0.8} color={AQUA} />
      </Float>
      <Float speed={0.6} floatIntensity={1.3} floatingRange={[-0.6, 0.6]}>
        <JellyfishShape position={[0, -2, -9]} scale={1.3} color={CYAN} />
      </Float>

      <Float speed={0.4} floatIntensity={0.8}>
        <mesh position={[3, 3, -6]}>
          <icosahedronGeometry args={[0.8, 2]} />
          <meshStandardMaterial
            color={TEAL}
            emissive={TEAL}
            emissiveIntensity={0.5}
            transparent
            opacity={0.22}
            wireframe
          />
        </mesh>
      </Float>

      <Sparkles
        count={55}
        scale={[20, 12, 10]}
        position={[0, 0, -4]}
        size={1.6}
        speed={0.28}
        color={TEAL}
        opacity={0.45}
      />
    </group>
  );
}

// ─── SKILLS ZONE (Y ≈ -30) — hex node grid ───────────────────────────────────

function SkillNode({
  position,
  color,
  phase,
}: {
  position: [number, number, number];
  color: string;
  phase: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const mat = ref.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity =
      0.55 + Math.sin(state.clock.elapsedTime * 2.2 + phase) * 0.45;
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.22, 8, 8]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.8}
        roughness={0.1}
        metalness={0.9}
      />
    </mesh>
  );
}

function SkillsZone() {
  const nodes = useMemo(() => {
    const palette = [AQUA, CYAN, TEAL];
    const result: {
      pos: [number, number, number];
      color: string;
      phase: number;
    }[] = [];
    const rows = 5;
    const cols = 6;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = (c - cols / 2 + 0.5) * 2.1 + (r % 2) * 1.05;
        const y = (r - rows / 2 + 0.5) * 1.85;
        const z = -4.5 - (r + c) * 0.3;
        result.push({
          pos: [x, y, z] as [number, number, number],
          color: palette[(r + c) % 3],
          phase: (r * cols + c) * 0.42,
        });
      }
    }
    return result;
  }, []);

  return (
    <group position={[0, -30, 0]}>
      {nodes.map((n, i) => (
        <SkillNode key={i} position={n.pos} color={n.color} phase={n.phase} />
      ))}

      <Float speed={0.35} rotationIntensity={0.5} floatIntensity={0.3}>
        <mesh position={[0, 0, -8]} rotation={[0.3, 0.2, 0]}>
          <torusGeometry args={[7, 0.04, 8, 100]} />
          <meshStandardMaterial
            color={CYAN}
            emissive={CYAN}
            emissiveIntensity={0.8}
            transparent
            opacity={0.4}
          />
        </mesh>
      </Float>

      <Sparkles
        count={45}
        scale={[22, 14, 10]}
        position={[0, 0, -3]}
        size={1.3}
        speed={0.2}
        color={CYAN}
        opacity={0.38}
      />
    </group>
  );
}

// ─── PROJECTS ZONE (Y ≈ -45) — submersible pods ──────────────────────────────

function SubmersiblePod({
  position,
  color,
  phase,
}: {
  position: [number, number, number];
  color: string;
  phase: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime * 0.35 + phase;
    groupRef.current.position.y = position[1] + Math.sin(t) * 0.55;
    groupRef.current.rotation.y = Math.sin(t * 0.4) * 0.12;
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh>
        <cylinderGeometry args={[0.55, 0.55, 2.8, 12, 1, false]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          roughness={0.35}
          metalness={0.85}
          transparent
          opacity={0.55}
        />
      </mesh>
      {/* Porthole ring */}
      <mesh position={[0, 0, 0.56]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.32, 0.055, 8, 28]} />
        <meshStandardMaterial
          color={AQUA}
          emissive={AQUA}
          emissiveIntensity={1.5}
        />
      </mesh>
      {/* Side fins */}
      <mesh position={[0.72, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.15, 0.8, 4]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          roughness={0.4}
          metalness={0.8}
          transparent
          opacity={0.6}
        />
      </mesh>
      <mesh position={[-0.72, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.15, 0.8, 4]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          roughness={0.4}
          metalness={0.8}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
}

function ProjectsZone() {
  const pods = useMemo(
    () => [
      { pos: [-7, 0, -5] as [number, number, number], col: AQUA, phase: 0 },
      {
        pos: [-2.5, 2, -8] as [number, number, number],
        col: TEAL,
        phase: 1.2,
      },
      {
        pos: [2.5, -1, -6] as [number, number, number],
        col: CYAN,
        phase: 2.4,
      },
      { pos: [7, 1, -4] as [number, number, number], col: AQUA, phase: 0.7 },
      {
        pos: [-4.5, -2.5, -9] as [number, number, number],
        col: CYAN,
        phase: 1.9,
      },
    ],
    []
  );

  return (
    <group position={[0, -45, 0]}>
      {pods.map((p, i) => (
        <SubmersiblePod
          key={i}
          position={p.pos}
          color={p.col}
          phase={p.phase}
        />
      ))}

      <Float speed={0.4} floatIntensity={0.4} rotationIntensity={0.3}>
        <mesh position={[0, 0, -7]} rotation={[0.15, 0, 0]}>
          <torusGeometry args={[6, 0.055, 8, 90]} />
          <meshStandardMaterial
            color={TEAL}
            emissive={TEAL}
            emissiveIntensity={1.0}
            transparent
            opacity={0.5}
          />
        </mesh>
      </Float>

      <Sparkles
        count={40}
        scale={[22, 12, 12]}
        position={[0, 0, -5]}
        size={1.4}
        speed={0.18}
        color={AQUA}
        opacity={0.35}
      />
    </group>
  );
}

// ─── EXPERIENCE ZONE (Y ≈ -60) — fiber-optic timeline ────────────────────────

function ExperienceZone() {
  const nodeColors = [AQUA, TEAL, CYAN, AQUA];
  const nodeRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state) => {
    nodeRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity =
        0.7 + Math.sin(state.clock.elapsedTime * 1.6 + i * 1.3) * 0.5;
    });
  });

  const nodeYs = [6, 2, -2, -6];

  return (
    <group position={[-1, -60, 0]}>
      {/* Vertical spine */}
      <mesh position={[0, 0, -5]}>
        <cylinderGeometry args={[0.035, 0.035, 18, 8]} />
        <meshStandardMaterial
          color={AQUA}
          emissive={AQUA}
          emissiveIntensity={0.9}
          transparent
          opacity={0.55}
        />
      </mesh>

      {nodeYs.map((y, i) => (
        <group key={i} position={[0, y, -5]}>
          <mesh
            ref={(el) => {
              nodeRefs.current[i] = el;
            }}
          >
            <sphereGeometry args={[0.38, 12, 12]} />
            <meshStandardMaterial
              color={nodeColors[i]}
              emissive={nodeColors[i]}
              emissiveIntensity={0.8}
              roughness={0.1}
              metalness={0.9}
            />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.65, 0.04, 8, 32]} />
            <meshStandardMaterial
              color={nodeColors[i]}
              emissive={nodeColors[i]}
              emissiveIntensity={1.1}
              transparent
              opacity={0.65}
            />
          </mesh>
          {/* Horizontal arm */}
          <mesh position={[2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.025, 0.025, 4, 5]} />
            <meshStandardMaterial
              color={nodeColors[i]}
              emissive={nodeColors[i]}
              emissiveIntensity={0.7}
              transparent
              opacity={0.45}
            />
          </mesh>
        </group>
      ))}

      <Float speed={0.5} floatIntensity={0.7} rotationIntensity={0.4}>
        <mesh position={[7, 0, -8]}>
          <dodecahedronGeometry args={[1.8, 0]} />
          <meshStandardMaterial
            color={TEAL}
            emissive={TEAL}
            emissiveIntensity={0.35}
            wireframe
            transparent
            opacity={0.45}
          />
        </mesh>
      </Float>
    </group>
  );
}

// ─── CONTACT ZONE / OCEAN FLOOR (Y ≈ -78) ────────────────────────────────────

function ContactZone() {
  const crystals = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        x: (i / 12 - 0.5) * 28,
        z: -3 - (i % 3) * 2.5,
        h: 1 + (i % 4) * 0.8,
        color: i % 3 === 0 ? AQUA : i % 3 === 1 ? TEAL : CYAN,
      })),
    []
  );

  return (
    <group position={[0, -78, 0]}>
      {/* Wireframe grid floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, -2]}>
        <planeGeometry args={[50, 30, 25, 15]} />
        <meshStandardMaterial
          color={TEAL}
          emissive={TEAL}
          emissiveIntensity={0.2}
          wireframe
          transparent
          opacity={0.28}
        />
      </mesh>

      {crystals.map((c, i) => (
        <mesh key={i} position={[c.x, -4, c.z]}>
          <coneGeometry args={[0.18, c.h, 5]} />
          <meshStandardMaterial
            color={c.color}
            emissive={c.color}
            emissiveIntensity={0.75}
            transparent
            opacity={0.55}
          />
        </mesh>
      ))}

      {/* Arch over the floor */}
      <Float speed={0.35} floatIntensity={0.3}>
        <mesh position={[0, -1, -7]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[4, 0.06, 8, 60, Math.PI]} />
          <meshStandardMaterial
            color={AQUA}
            emissive={AQUA}
            emissiveIntensity={1.1}
            transparent
            opacity={0.6}
          />
        </mesh>
      </Float>

      <Sparkles
        count={130}
        scale={[30, 8, 18]}
        position={[0, -1, -5]}
        size={2.2}
        speed={0.12}
        color={TEAL}
        opacity={0.6}
      />
    </group>
  );
}

// ─── CAMERA RIG ───────────────────────────────────────────────────────────────

function CameraRig() {
  const { camera, pointer } = useThree();
  const target = useRef(new THREE.Vector3(0, 0, 6));

  useFrame((_, delta) => {
    const p = getScrollProgress();

    target.current.set(
      pointer.x * 2.8,
      -p * DESCENT,
      6 + Math.sin(p * Math.PI * 0.7) * 1.5
    );

    const smooth = 1 - Math.pow(0.0008, delta);
    camera.position.lerp(target.current, smooth);
    camera.lookAt(
      pointer.x * 1.5,
      camera.position.y - 5 - p * 6,
      -8
    );
  });

  return null;
}

// ─── SCENE LIGHTS (follow camera down) ───────────────────────────────────────

function SceneLights() {
  const keyRef = useRef<THREE.PointLight>(null);
  const fillRef = useRef<THREE.PointLight>(null);
  const { camera } = useThree();

  useFrame(() => {
    if (keyRef.current)
      keyRef.current.position.set(
        camera.position.x + 8,
        camera.position.y + 5,
        camera.position.z - 3
      );
    if (fillRef.current)
      fillRef.current.position.set(
        camera.position.x - 6,
        camera.position.y - 3,
        camera.position.z - 5
      );
  });

  return (
    <>
      <ambientLight intensity={0.22} />
      <pointLight ref={keyRef} intensity={100} color={AQUA} />
      <pointLight ref={fillRef} intensity={70} color={TEAL} />
      <pointLight position={[4, -30, -4]} intensity={55} color={CYAN} />
      <pointLight position={[-4, -50, -3]} intensity={50} color={AQUA} />
      <pointLight position={[0, -78, -4]} intensity={60} color={TEAL} />
    </>
  );
}

// ─── FULL SCENE ───────────────────────────────────────────────────────────────

function Scene() {
  return (
    <>
      <fog attach="fog" args={[MIDNIGHT, 12, 42]} />
      <SceneLights />

      <Stars
        radius={160}
        depth={80}
        count={2800}
        factor={3}
        saturation={0}
        fade
        speed={0.35}
      />

      <Bubbles />
      <HomeZone />
      <AboutZone />
      <SkillsZone />
      <ProjectsZone />
      <ExperienceZone />
      <ContactZone />

      <CameraRig />

      <EffectComposer>
        <Bloom
          intensity={1.25}
          luminanceThreshold={0.12}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <Vignette eskil={false} offset={0.22} darkness={0.88} />
      </EffectComposer>
    </>
  );
}

export default function OceanWorld() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: MIDNIGHT }}
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
