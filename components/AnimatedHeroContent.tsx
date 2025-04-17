"use client";

import React, { useRef, Suspense, useState, useMemo, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, OrbitControls, useGLTF, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from 'three'; // Import THREE
// @ts-ignore - Assuming no types available for maath/random
import * as random from "maath/random/dist/maath-random.esm";

// Correct props interface for a mesh component
interface CosmicObjectProps extends Omit<React.ComponentProps<'mesh'>, 'children'> { 
  modelPath?: string;
}

// Safer version of inSphere that won't produce NaN values
function safeInSphere(array: Float32Array, radius: number = 1) {
  for (let i = 0; i < array.length; i += 3) {
    // Generate random coordinates in a cube
    const x = (Math.random() - 0.5) * 2;
    const y = (Math.random() - 0.5) * 2;
    const z = (Math.random() - 0.5) * 2;
    
    // Normalize to get a point on the unit sphere
    const normalizationFactor = 1 / Math.sqrt(x*x + y*y + z*z);
    
    // Scale by random factor to get points inside the sphere
    const scale = Math.cbrt(Math.random()) * radius;
    
    // Set values, checking for NaN
    array[i] = isNaN(x * normalizationFactor * scale) ? 0 : x * normalizationFactor * scale;
    array[i+1] = isNaN(y * normalizationFactor * scale) ? 0 : y * normalizationFactor * scale;
    array[i+2] = isNaN(z * normalizationFactor * scale) ? 0 : z * normalizationFactor * scale;
  }
  
  return array;
}

// Cosmic object (like a planet, star or galaxy core)
function CosmicObject({ modelPath = "path/to/your/cosmos_model.glb", ...props }: CosmicObjectProps) {
  const ref = useRef<THREE.Mesh>(null!);
  const [scene, setScene] = useState<THREE.Group | null>(null);

  // Rotation animation
  useFrame((state, delta) => {
    if (ref.current) {
      // Ensure delta is not NaN and is reasonable
      const safeDelta = isNaN(delta) || delta > 0.1 ? 0.01 : delta;
      ref.current.rotation.y += safeDelta * 0.1;
      ref.current.rotation.z += safeDelta * 0.05;
    }
  });

  // Placeholder geometry - a distorted sphere with galaxy-like material
  return (
    <mesh ref={ref} {...props} scale={props.scale || 1.5}>
      <sphereGeometry args={[1, 32, 32]} />
      <MeshDistortMaterial
        color="#5a45ff"
        attach="material"
        distort={0.4}
        speed={1}
        roughness={0.2}
        metalness={0.8}
      >
        {/* Add emissive glow */}
        <color attach="emissive" args={['#3311bb']} />
        <color attach="color" args={['#7766ff']} />
      </MeshDistortMaterial>
    </mesh>
  );
}

// Galaxy particle system - larger, more spread out
function GalaxyParticles() {
  const ref = useRef<THREE.Points>(null!);
  const isMobile = React.useMemo(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  }, []);
  
  // Create two particle systems for different colors with explicit sanitization
  const [galaxyCore] = useState(() => {
    const count = isMobile ? 1500 : 3000;
    // Use our safer function instead of random.inSphere
    return safeInSphere(new Float32Array(count * 3), 1.2);
  });
  
  const [galaxyOuter] = useState(() => {
    const count = isMobile ? 2500 : 5000;
    // Use our safer function instead of random.inSphere
    return safeInSphere(new Float32Array(count * 3), 3.5);
  });
  
  // Rotate the particle systems
  useFrame((state, delta) => {
    if (ref.current) {
      // Ensure delta is not NaN and is reasonable
      const safeDelta = isNaN(delta) || delta > 0.1 ? 0.01 : delta;
      ref.current.rotation.y += safeDelta * 0.03;
      ref.current.rotation.z += safeDelta * 0.01;
    }
  });

  // Create a spiral effect by manipulating positions
  const galaxySpiral = useMemo(() => {
    const count = isMobile ? 3500 : 7000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = Math.random() * 2.5 + 0.3;
      const spinAngle = radius * 5;
      const branchAngle = (i % 3) * ((2 * Math.PI) / 3);

      // Safe trig calculations
      let x = 0, y = 0, z = 0;
      try {
        x = Math.cos(branchAngle + spinAngle) * radius;
        y = (Math.random() - 0.5) * 0.3;
        z = Math.sin(branchAngle + spinAngle) * radius;
      } catch (e) {
        // Fallback if math fails
        x = 0;
        y = 0;
        z = 0;
      }

      positions[i3] = isNaN(x) ? 0 : x;
      positions[i3 + 1] = isNaN(y) ? 0 : y;
      positions[i3 + 2] = isNaN(z) ? 0 : z;
      
      // Color gradient from center (purple) to edge (blue)
      const distToCenter = Math.sqrt(x*x + z*z);
      const distFactor = Math.min(1, Math.max(0, distToCenter / 2.5));
      
      // Purple core to blue edges
      colors[i3] = 0.7 - distFactor * 0.3;     // R: 0.7 to 0.4
      colors[i3 + 1] = 0.3 + distFactor * 0.1; // G: 0.3 to 0.4
      colors[i3 + 2] = 0.9 - distFactor * 0.3; // B: 0.9 to 0.6
    }
    
    return { positions, colors };
  }, [isMobile]);

  return (
    <group>
      {/* Core bright particles */}
      <Points ref={ref} positions={galaxyCore} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#a880ff"
          size={0.02}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      
      {/* Outer dim particles */}
      <Points positions={galaxyOuter} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#4060ff"
          size={0.01}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      
      {/* Spiral arms with colors */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={galaxySpiral.positions.length / 3}
            array={galaxySpiral.positions}
            itemSize={3}
            args={[galaxySpiral.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            count={galaxySpiral.colors.length / 3}
            array={galaxySpiral.colors}
            itemSize={3}
            args={[galaxySpiral.colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.015}
          vertexColors
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

// Distant stars backdrop
function DistantStars() {
  const isMobile = React.useMemo(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  }, []);
  
  const [starField] = useState(() => {
    const count = isMobile ? 800 : 1500;
    // Use our safer function instead of random.inSphere
    return safeInSphere(new Float32Array(count * 3), 20);
  });
  
  return (
    <group>
      <Points positions={starField} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={isMobile ? 0.003 : 0.005}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

export function AnimatedHeroContent() {
  const [scale, setScale] = React.useState(1);
  const [hasError, setHasError] = React.useState(false);
  
  // Set scale based on screen size
  React.useEffect(() => {
    const handleResize = () => {
      setScale(window.innerWidth < 768 ? 0.7 : 1);
    };
    
    // Initial call
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Handle Three.js errors
  React.useEffect(() => {
    const originalConsoleError = console.error;
    
    // Override console.error to catch Three.js specific errors
    console.error = (...args) => {
      // Check if this is a THREE.BufferGeometry NaN error
      const errorString = args.join(' ');
      if (errorString.includes('THREE.BufferGeometry') && 
          errorString.includes('NaN')) {
        setHasError(true);
      }
      
      // Call original console.error
      originalConsoleError.apply(console, args);
    };
    
    return () => {
      // Restore original console.error when component unmounts
      console.error = originalConsoleError;
    };
  }, []);
  
  // Error boundary fallback
  if (hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-lg">
        <div className="text-center p-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-700"></div>
          <p className="text-white text-lg">Nova AI Labs</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'transparent' }}
        dpr={[0.8, 1.5]} // Reduce DPR for better performance
        performance={{ min: 0.3 }} // Lower minimum framerate for better performance
        onError={() => setHasError(true)}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Suspense fallback={null}>
          <CosmicObject position={[0, 0, 0]} scale={scale} />
          <GalaxyParticles />
          <DistantStars />
          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            autoRotate 
            autoRotateSpeed={0.3} // Reduce speed for better performance
            rotateSpeed={0.4}
          />
        </Suspense>
      </Canvas>
    </div>
  );
} 