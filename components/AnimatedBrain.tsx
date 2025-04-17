"use client";

import React, { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from 'three';

// Placeholder component for the actual 3D model
// Replace 'path/to/your/brain_model.glb' with the actual path to your GLB file
function BrainModel({ modelPath = "path/to/your/brain_model.glb", ...props }) {
  const ref = useRef<THREE.Mesh>(null);
  // const { scene } = useGLTF(modelPath); // Uncomment when model is available

  // Basic rotation animation
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.3;
    }
  });

  // Placeholder geometry until model is loaded
  return (
    <mesh ref={ref} {...props} scale={1.5}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="#5a67d8" wireframe />
      {/* <primitive object={scene} /> */}{/* Uncomment when model is available */}
    </mesh>
  );
}

// Preload the model if needed
// useGLTF.preload('path/to/your/brain_model.glb'); // Uncomment when model is available

export function AnimatedBrain() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <Suspense fallback={null}> {/* Suspense for model loading */}
        <BrainModel />
      </Suspense>
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1.0} />
    </Canvas>
  );
} 