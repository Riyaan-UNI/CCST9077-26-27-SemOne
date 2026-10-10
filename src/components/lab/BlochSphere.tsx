import { Canvas } from '@react-three/fiber';
import { Line, OrbitControls, Sphere } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';

interface BlochSphereProps {
  /** Bloch vector components, each in [-1, 1]. */
  x: number;
  y: number;
  z: number;
}

/**
 * A lazy-loaded 3D Bloch sphere. three.js is heavy, so this module is only
 * fetched when the viewer asks for the "going deeper" view.
 */
export default function BlochSphere({ x, y, z }: BlochSphereProps) {
  const end = useMemo(() => new THREE.Vector3(x, y, z).multiplyScalar(0.98), [x, y, z]);

  return (
    <div className="h-[22rem] w-full overflow-hidden rounded-2xl border border-line bg-[#070b09]">
      <Canvas camera={{ position: [2.4, 1.6, 2.4], fov: 42 }} dpr={[1, 2]}>
        <ambientLight intensity={1.1} />
        <directionalLight position={[4, 6, 4]} intensity={1.4} />

        {/* wireframe unit sphere */}
        <Sphere args={[1, 32, 24]}>
          <meshBasicMaterial color="#1f3b2c" wireframe transparent opacity={0.55} />
        </Sphere>

        {/* axes */}
        <Line points={[[-1.2, 0, 0], [1.2, 0, 0]]} color="#3b5c4a" lineWidth={1} />
        <Line points={[[0, -1.2, 0], [0, 1.2, 0]]} color="#3b5c4a" lineWidth={1} />
        <Line points={[[0, 0, -1.2], [0, 0, 1.2]]} color="#3b5c4a" lineWidth={1} />

        {/* |0> and |1> poles */}
        <mesh position={[0, 1.06, 0]}>
          <sphereGeometry args={[0.055, 16, 16]} />
          <meshBasicMaterial color="#39ff14" />
        </mesh>
        <mesh position={[0, -1.06, 0]}>
          <sphereGeometry args={[0.055, 16, 16]} />
          <meshBasicMaterial color="#5be3ff" />
        </mesh>

        {/* the state vector */}
        <Line points={[[0, 0, 0], [end.x, end.y, end.z]]} color="#39ff14" lineWidth={3} />
        <mesh position={[end.x, end.y, end.z]}>
          <sphereGeometry args={[0.07, 18, 18]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>

        <OrbitControls enablePan={false} autoRotate autoRotateSpeed={0.7} minDistance={2} maxDistance={5} />
      </Canvas>
    </div>
  );
}
