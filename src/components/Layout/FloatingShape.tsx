import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type ShapeType = 'torus' | 'icosahedron' | 'octahedron' | 'torusKnot' | 'dodecahedron'
  | 'tetrahedron' | 'sphere' | 'cone' | 'torusKnot2' | 'torus2';

interface ShapeMeshProps {
  type: ShapeType;
  color: string;
  rotationSpeed: [number, number, number];
}

function ShapeMesh({ type, color, rotationSpeed }: ShapeMeshProps) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.x += delta * rotationSpeed[0];
    mesh.current.rotation.y += delta * rotationSpeed[1];
    mesh.current.rotation.z += delta * rotationSpeed[2];
  });

  return (
    <mesh ref={mesh}>
      {type === 'torus'        && <torusGeometry       args={[1, 0.38, 16, 80]} />}
      {type === 'torus2'       && <torusGeometry       args={[1, 0.15, 12, 60]} />}
      {type === 'icosahedron'  && <icosahedronGeometry  args={[1, 0]} />}
      {type === 'octahedron'   && <octahedronGeometry   args={[1, 0]} />}
      {type === 'torusKnot'   && <torusKnotGeometry    args={[0.7, 0.22, 120, 16]} />}
      {type === 'torusKnot2'  && <torusKnotGeometry    args={[0.6, 0.18, 100, 12, 3, 5]} />}
      {type === 'dodecahedron' && <dodecahedronGeometry args={[1, 0]} />}
      {type === 'tetrahedron'  && <tetrahedronGeometry  args={[1.1, 0]} />}
      {type === 'sphere'       && <sphereGeometry       args={[0.9, 12, 8]} />}
      {type === 'cone'         && <coneGeometry         args={[0.9, 1.8, 8, 1]} />}
      <meshBasicMaterial color={color} wireframe />
    </mesh>
  );
}

interface FloatingShapeProps {
  type: ShapeType;
  size?: number;
  color?: string;
  rotationSpeed?: [number, number, number];
  style?: React.CSSProperties;
}

export function FloatingShape({
  type,
  size = 130,
  color = '#E5C07B',
  rotationSpeed = [0.25, 0.4, 0.1],
  style = {},
}: FloatingShapeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Only mount the Canvas (and create a WebGL context) when in/near viewport.
  // This prevents exhausting the browser's WebGL context limit on mobile
  // (typically 8–16 total), which causes shapes to show as broken placeholders.
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '200px 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute max-sm:scale-50 max-sm:opacity-20"
      style={{ width: size, height: size, ...style }}
      aria-hidden="true"
    >
      {inView && (
        <Canvas
          frameloop="always"
          camera={{ position: [0, 0, 3.5], fov: 50 }}
          gl={{ antialias: false, alpha: true, powerPreference: 'default', failIfMajorPerformanceCaveat: false }}
          onCreated={({ gl }) => { gl.setClearColor(0x000000, 0); }}
          style={{ width: '100%', height: '100%' }}
        >
          <ShapeMesh type={type} color={color} rotationSpeed={rotationSpeed} />
        </Canvas>
      )}
    </div>
  );
}
