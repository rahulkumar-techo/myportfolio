'use client';

import { Suspense, useEffect, useMemo, useRef, useState, Component, type ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  Float, 
  Environment, 
  MeshDistortMaterial,
  Sparkles,
  Stars,
  Html,
  PerspectiveCamera,
} from '@react-three/drei';
import * as THREE from 'three';

function GlowingOrb({ position, color, size = 1, intensity = 1, segments = 24 }: { 
  position: [number, number, number]; 
  color: string; 
  size?: number;
  intensity?: number;
  segments?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[size, segments, segments]} />
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={intensity}
          distort={0.3}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      <pointLight position={position} color={color} intensity={intensity * 2} distance={10} />
    </Float>
  );
}

function DeskSetup({ showHtml }: { showHtml: boolean }) {
  const deskRef = useRef<THREE.Group>(null);
  
  return (
    <group ref={deskRef} position={[0, -1.5, 0]}>
      {/* Desk Surface */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[4, 0.1, 2]} />
        <meshStandardMaterial 
          color="#1a1a2e" 
          metalness={0.8} 
          roughness={0.2}
        />
      </mesh>
      
      {/* Monitor Base */}
      <mesh position={[0, 0.4, -0.5]}>
        <boxGeometry args={[0.3, 0.8, 0.1]} />
        <meshStandardMaterial color="#0a0a1a" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Monitor Screen */}
      <group position={[0, 1, -0.6]}>
        <mesh>
          <boxGeometry args={[2.4, 1.4, 0.05]} />
          <meshStandardMaterial color="#0a0a1a" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Screen Glow */}
        <mesh position={[0, 0, 0.03]}>
          <planeGeometry args={[2.2, 1.2]} />
          <meshBasicMaterial color="#00d4ff" opacity={0.3} transparent />
        </mesh>
        {/* Code Display */}
        {showHtml ? (
          <Html
            transform
            position={[0, 0, 0.04]}
            scale={0.12}
            style={{
              width: '320px',
              background: 'rgba(10, 10, 26, 0.9)',
              padding: '20px',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '11px',
              color: '#00d4ff',
              overflow: 'hidden',
            }}
          >
            <div>
              <span style={{ color: '#a855f7' }}>const</span>{' '}
              <span style={{ color: '#00d4ff' }}>developer</span> = {'{'}
              <br />
              {'  '}<span style={{ color: '#22c55e' }}>name</span>:{' '}
              <span style={{ color: '#fbbf24' }}>&apos;Rahul kumar&apos;</span>,
              <br />
              {'  '}<span style={{ color: '#22c55e' }}>skills</span>: [
              <span style={{ color: '#fbbf24' }}>&apos;React&apos;</span>,{' '}
              <span style={{ color: '#fbbf24' }}>&apos;Three.js&apos;</span>],
              <br />
              {'  '}<span style={{ color: '#22c55e' }}>passion</span>:{' '}
              <span style={{ color: '#fbbf24' }}>&apos;Creating&apos;</span>
              <br />
              {'}'};
            </div>
          </Html>
        ) : null}
      </group>
      
      {/* Keyboard */}
      <mesh position={[0, 0.12, 0.5]}>
        <boxGeometry args={[1.2, 0.08, 0.4]} />
        <meshStandardMaterial color="#16161d" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Keyboard Glow */}
      <pointLight position={[0, 0.2, 0.5]} color="#a855f7" intensity={0.5} distance={2} />
    </group>
  );
}

function ReactorCore({ lowPower }: { lowPower: boolean }) {
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (coreRef.current) {
      coreRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      coreRef.current.scale.set(scale, scale, scale);
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group position={[0, -0.5, -3]}>
      {/* Core Sphere */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.5, lowPower ? 1 : 2]} />
        <MeshDistortMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={2}
          distort={0.4}
          speed={3}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Rotating Ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[1, 0.05, 12, lowPower ? 48 : 80]} />
        <meshStandardMaterial 
          color="#a855f7" 
          emissive="#a855f7" 
          emissiveIntensity={1}
        />
      </mesh>
      
      {/* Energy Field */}
      <Sparkles
        count={lowPower ? 30 : 60}
        scale={3}
        size={2}
        speed={0.5}
        color="#00d4ff"
      />
      
      <pointLight color="#00d4ff" intensity={3} distance={8} />
    </group>
  );
}

function FloatingParticles({ count }: { count: number }) {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#00d4ff"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function Scene({ lowPower }: { lowPower: boolean }) {
  const orbSegments = lowPower ? 16 : 24;

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 1, 6]} fov={50} />
      <color attach="background" args={['#0a0a1a']} />
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
      
      {/* Background */}
      <Stars
        radius={80}
        depth={40}
        count={lowPower ? 900 : 1400}
        factor={3}
        saturation={0}
        fade
        speed={0.4}
      />
      
      {/* Main Elements */}
      <DeskSetup showHtml={!lowPower} />
      <ReactorCore lowPower={lowPower} />
      
      {/* Decorative Orbs */}
      <GlowingOrb position={[-3, 1, -1]} color="#a855f7" size={0.3} intensity={0.8} segments={orbSegments} />
      <GlowingOrb position={[3, 0.5, -2]} color="#00d4ff" size={0.25} intensity={0.6} segments={orbSegments} />
      {!lowPower ? (
        <GlowingOrb position={[-2, 2, 0]} color="#22c55e" size={0.2} intensity={0.5} segments={orbSegments} />
      ) : null}
      
      {/* Particles */}
      <FloatingParticles count={lowPower ? 70 : 120} />
      
      {/* Environment */}
      {!lowPower ? (
        <Suspense fallback={null}>
          <Environment preset="night" />
        </Suspense>
      ) : null}
      
      {/* Fog for depth */}
      <fog attach="fog" args={['#0a0a1a', 5, 25]} />
    </>
  );
}

type SceneErrorBoundaryProps = {
  children: ReactNode;
  fallback: ReactNode;
  onError?: () => void;
};

type SceneErrorBoundaryState = {
  hasError: boolean;
};

class SceneErrorBoundary extends Component<SceneErrorBoundaryProps, SceneErrorBoundaryState> {
  state: SceneErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onError?.();
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export default function HeroScene() {
  const [lowPower, setLowPower] = useState(false);
  const [webglFailed, setWebglFailed] = useState(false);
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const cores = navigator.hardwareConcurrency ?? 4;
    const memory = (navigator as any).deviceMemory ?? 4;
    setLowPower(prefersReducedMotion || cores <= 4 || memory <= 4);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: true }) ||
        canvas.getContext('webgl', { failIfMajorPerformanceCaveat: true }) ||
        canvas.getContext('experimental-webgl', { failIfMajorPerformanceCaveat: true });
      setWebglSupported(Boolean(gl));
    } catch {
      setWebglSupported(false);
    }
  }, []);

  const shouldRenderCanvas = webglSupported === true && !webglFailed;

  return (
    <div className="w-full h-screen relative">
      {shouldRenderCanvas ? (
        <SceneErrorBoundary
          fallback={null}
          onError={() => setWebglFailed(true)}
        >
          <Suspense fallback={null}>
            <Canvas
              gl={{
                antialias: false,
                alpha: true,
                powerPreference: lowPower ? 'low-power' : 'high-performance'
              }}
              dpr={lowPower ? [1, 1] : [1, 1.25]}
              performance={{ min: lowPower ? 0.3 : 0.5 }}
              style={{ background: 'transparent' }}
            >
              <Scene lowPower={lowPower} />
            </Canvas>
          </Suspense>
        </SceneErrorBoundary>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
      )}
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-background" />
    </div>
  );
}
