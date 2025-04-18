"use client";

import React, { useRef, Suspense, useState, useMemo, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, OrbitControls, useGLTF, MeshDistortMaterial, useTexture } from "@react-three/drei";
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

// Advanced planet object with realistic features
function CosmicObject({ modelPath = "path/to/your/cosmos_model.glb", ...props }: CosmicObjectProps) {
  const planetRef = useRef<THREE.Group>(null!);
  const atmosphereRef = useRef<THREE.Mesh>(null!);
  const cloudRef = useRef<THREE.Mesh>(null!);
  const ringsRef = useRef<THREE.Mesh>(null!);
  
  // Load planet textures
  const textures = useTexture({
    map: '/planet-texture.jpg',
    bumpMap: '/planet-bump.jpg',
    cloudMap: '/planet-clouds.png',
  });

  // Create a gradient for planet surface
  const planetMaterial = useMemo(() => {
    // Create planet surface material with texture fallback
    try {
      return new THREE.MeshStandardMaterial({
        map: textures.map || null,
        bumpMap: textures.bumpMap || null,
        bumpScale: 0.05,
        color: new THREE.Color("#5a7eff"), // Brighter blue for tech feel
        metalness: 0.6, // More metallic look
        roughness: 0.3, // Smoother, more tech-like surface
        emissive: new THREE.Color("#1a3fff"), // Add blue glow
        emissiveIntensity: 0.2, // Subtle emission
      });
    } catch (e) {
      // Fallback if textures fail to load
      return new THREE.MeshStandardMaterial({
        color: new THREE.Color("#5a7eff"),
        metalness: 0.6,
        roughness: 0.3,
        emissive: new THREE.Color("#1a3fff"),
        emissiveIntensity: 0.2,
      });
    }
  }, [textures]);

  // Create atmosphere material
  const atmosphereMaterial = useMemo(() => {
    return new THREE.MeshPhongMaterial({
      color: new THREE.Color("#7fc5ff"), // Brighter, tech-blue atmosphere
      transparent: true,
      opacity: 0.4,
      side: THREE.BackSide,
      emissive: new THREE.Color("#00a8ff"), // Cyan emission for tech feel
      emissiveIntensity: 0.5,
      shininess: 100, // High shininess for tech-like sheen
    });
  }, []);

  // Create clouds material - less natural, more tech grid pattern
  const cloudMaterial = useMemo(() => {
    try {
      return new THREE.MeshStandardMaterial({
        map: textures.cloudMap || null,
        transparent: true,
        opacity: 0.35, // More transparent
        color: new THREE.Color("#c0f0ff"), // Bright cyan-white
        emissive: new THREE.Color("#80e0ff"), // Glowing effect
        emissiveIntensity: 0.3,
      });
    } catch (e) {
      // Fallback cloud material with no texture
      return new THREE.MeshStandardMaterial({
        transparent: true,
        opacity: 0.35,
        color: new THREE.Color("#c0f0ff"),
        emissive: new THREE.Color("#80e0ff"),
        emissiveIntensity: 0.3,
      });
    }
  }, [textures]);

  // Create rings material - more tech-like, glowing rings
  const ringsMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color("#a0c8ff"), // Brighter blue
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide,
      emissive: new THREE.Color("#40a0ff"), // Glowing effect
      emissiveIntensity: 0.5,
      metalness: 0.8,
      roughness: 0.2,
    });
  }, []);

  // Data grid effect for tech look
  const gridMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color("#ffffff"),
      wireframe: true,
      transparent: true,
      opacity: 0.1,
    });
  }, []);

  // Rotation animation
  useFrame((state, delta) => {
    // Ensure delta is not NaN and is reasonable
    const safeDelta = isNaN(delta) || delta > 0.1 ? 0.01 : delta;
    
    if (planetRef.current) {
      planetRef.current.rotation.y += safeDelta * 0.1;
    }
    
    if (cloudRef.current) {
      cloudRef.current.rotation.y += safeDelta * 0.15; // Clouds rotate slightly faster
    }
    
    if (ringsRef.current) {
      ringsRef.current.rotation.z += safeDelta * 0.05;
      // Pulse the ring brightness for tech effect
      const pulseFactor = Math.sin(state.clock.elapsedTime * 0.5) * 0.1 + 0.9;
      if (ringsRef.current.material) {
        (ringsRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.5 * pulseFactor;
      }
    }
  });

  return (
    <group ref={planetRef} position={props.position} rotation={props.rotation} scale={props.scale || 1.5}>
      {/* Planet body */}
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        {planetMaterial && <primitive object={planetMaterial} attach="material" />}
      </mesh>
      
      {/* Tech grid overlay */}
      <mesh>
        <sphereGeometry args={[1.01, 24, 24]} />
        {gridMaterial && <primitive object={gridMaterial} attach="material" />}
      </mesh>
      
      {/* Atmospheric glow effect */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[1.15, 32, 32]} />
        {atmosphereMaterial && <primitive object={atmosphereMaterial} attach="material" />}
      </mesh>
      
      {/* Cloud layer */}
      <mesh ref={cloudRef}>
        <sphereGeometry args={[1.02, 48, 48]} />
        {cloudMaterial && <primitive object={cloudMaterial} attach="material" />}
      </mesh>
      
      {/* Planetary rings */}
      <mesh ref={ringsRef} rotation={[Math.PI / 3, 0, 0]}>
        <ringGeometry args={[1.4, 2.2, 128]} />
        {ringsMaterial && <primitive object={ringsMaterial} attach="material" />}
      </mesh>
      
      {/* Inner glow core */}
      <mesh>
        <sphereGeometry args={[0.92, 32, 32]} />
        <meshBasicMaterial color="#60a0ff" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

// Galaxy particle system with tech-inspired patterns
function GalaxyParticles() {
  const ref = useRef<THREE.Points>(null!);
  const techGridRef = useRef<THREE.Points>(null!);
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
  
  // Create tech grid points - data-like visualization
  const [techGrid] = useState(() => {
    const count = isMobile ? 200 : 400;
    const positions = new Float32Array(count * 3);
    
    // Create grid-like pattern for data visualization effect
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = 2 + Math.random() * 2;
      const angle = Math.random() * Math.PI * 2;
      
      // Grid-like distribution with slight randomization
      positions[i3] = Math.cos(angle) * radius;
      positions[i3 + 1] = (Math.floor(Math.random() * 8) - 4) * 0.3; // Stepped y-positions
      positions[i3 + 2] = Math.sin(angle) * radius;
    }
    
    return positions;
  });
  
  // Rotate the particle systems
  useFrame((state, delta) => {
    // Ensure delta is not NaN and is reasonable
    const safeDelta = isNaN(delta) || delta > 0.1 ? 0.01 : delta;
    
    if (ref.current) {
      ref.current.rotation.y += safeDelta * 0.03;
      ref.current.rotation.z += safeDelta * 0.01;
    }
    
    if (techGridRef.current) {
      // Counter-rotate tech grid for interesting visual effect
      techGridRef.current.rotation.y -= safeDelta * 0.02;
      
      // Pulse the size of tech particles
      const material = techGridRef.current.material as THREE.PointsMaterial;
      if (material) {
        const pulse = Math.sin(state.clock.elapsedTime * 0.8) * 0.015 + 0.03;
        material.size = pulse;
      }
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
      
      // Color gradient from center (bright cyan) to edge (tech blue)
      const distToCenter = Math.sqrt(x*x + z*z);
      const distFactor = Math.min(1, Math.max(0, distToCenter / 2.5));
      
      // Cyan core to blue edges - tech color scheme
      colors[i3] = 0.4 + (1 - distFactor) * 0.4;     // R: 0.8 to 0.4
      colors[i3 + 1] = 0.7 + (1 - distFactor) * 0.3; // G: 1.0 to 0.7
      colors[i3 + 2] = 1.0;                          // B: always high
    }
    
    return { positions, colors };
  }, [isMobile]);

  return (
    <group>
      {/* Core bright particles */}
      <Points ref={ref} positions={galaxyCore} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#90d0ff" // Brighter, more tech blue
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
          color="#50a0ff" // Tech blue
          size={0.01}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      
      {/* Tech data grid - digital visualization effect */}
      <Points ref={techGridRef} positions={techGrid} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#80ffff" // Bright cyan for tech effect
          size={0.03}
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

// Tech-enhanced space backdrop
function DistantStars() {
  const starsRef = useRef<THREE.Points>(null!);
  const isMobile = React.useMemo(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  }, []);
  
  // Create standard star field
  const [starField] = useState(() => {
    const count = isMobile ? 800 : 1500;
    // Use our safer function instead of random.inSphere
    return safeInSphere(new Float32Array(count * 3), 20);
  });
  
  // Create a digital network effect
  const [networkLines] = useState(() => {
    const count = isMobile ? 100 : 200;
    const positions = new Float32Array(count * 6); // Each line has 2 points (start and end)
    
    for (let i = 0; i < count; i++) {
      const i6 = i * 6;
      
      // Create lines that appear to connect stars
      const radius = 4 + Math.random() * 12;
      const theta1 = Math.random() * Math.PI * 2;
      const theta2 = theta1 + (Math.random() * 0.5 - 0.25); // Connected point nearby
      const phi1 = Math.random() * Math.PI;
      const phi2 = phi1 + (Math.random() * 0.5 - 0.25); // Connected point nearby
      
      // First point
      positions[i6] = radius * Math.sin(phi1) * Math.cos(theta1);
      positions[i6 + 1] = radius * Math.cos(phi1);
      positions[i6 + 2] = radius * Math.sin(phi1) * Math.sin(theta1);
      
      // Second point
      positions[i6 + 3] = radius * Math.sin(phi2) * Math.cos(theta2);
      positions[i6 + 4] = radius * Math.cos(phi2);
      positions[i6 + 5] = radius * Math.sin(phi2) * Math.sin(theta2);
    }
    
    return positions;
  });
  
  // Animation for sparkle effect
  useFrame((state, delta) => {
    if (starsRef.current) {
      const material = starsRef.current.material as THREE.PointsMaterial;
      
      // Create subtle twinkling/pulsing effect for tech stars
      if (material) {
        const pulse = Math.sin(state.clock.elapsedTime * 0.5) * 0.0005 + 0.005;
        material.size = isMobile ? (0.003 + pulse) : (0.005 + pulse);
      }
    }
  });
  
  return (
    <group>
      {/* Main star field */}
      <Points ref={starsRef} positions={starField} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#c0e8ff" // Brighter, tech blue tint
          size={isMobile ? 0.003 : 0.005}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      
      {/* Network connection lines for tech effect */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={networkLines.length / 3}
            array={networkLines}
            itemSize={3}
            args={[networkLines, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial 
          color="#3080ff" 
          transparent 
          opacity={0.15} 
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
      
      {/* Bright tech nodes at some intersections */}
      <Points positions={networkLines.slice(0, networkLines.length / 4)} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#60c0ff"
          size={isMobile ? 0.005 : 0.008}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
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
        {/* Enhanced lighting setup */}
        <ambientLight intensity={0.3} /> {/* Increased ambient light */}
        <pointLight position={[10, 10, 10]} intensity={1.2} color="#d0e8ff" /> {/* Brighter main light */}
        <directionalLight 
          position={[5, 3, 5]} 
          intensity={1.2}
          castShadow 
          color="#e0f0ff"
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <spotLight 
          position={[-5, 5, 5]} 
          angle={0.15} 
          penumbra={1} 
          intensity={0.6} 
          color="#a0d0ff"
          castShadow
        />
        
        {/* Add tech accent lights */}
        <pointLight position={[-3, -2, 2]} intensity={0.8} color="#40a0ff" /> {/* Tech blue accent */}
        <pointLight position={[2, -3, -3]} intensity={0.6} color="#90c0ff" /> {/* Secondary tech accent */}
        
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