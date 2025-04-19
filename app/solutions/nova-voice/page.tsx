"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useInView, useSpring, MotionValue } from "motion/react";
import { useRef, useEffect, useState } from "react";
import { ArrowRight, Mic, Headphones, Globe, MessageSquare, Radio, Play, Languages, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, OrbitControls, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from 'three';
import { useMediaQuery } from "@/app/hooks/useMediaQuery";

// Animated card component with scroll-triggered animation
const AnimatedCard = ({ children, index = 0, className = "", delay = 0.1 }: {
  children: React.ReactNode;
  index?: number;
  className?: string;
  delay?: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ 
        duration: 0.5, 
        delay: delay + index * 0.1,
        ease: [0.22, 1, 0.36, 1] 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Sound Wave 3D Model Component
function SoundWaveModel() {
  const waveRef = useRef<THREE.Group>(null!);
  
  // Create animated wave points
  const WavePoints = () => {
    const points = useRef<THREE.Points>(null!);
    
    // Generate initial wave pattern
    const count = 3000; // Increased point count
    const [positions] = useState(() => {
      const positions = new Float32Array(count * 3);
      
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        // Create a more spherical distribution
        const phi = Math.acos(-1 + (2 * i) / count);
        const theta = Math.sqrt(count * Math.PI) * phi;
        
        const x = 4 * Math.sin(phi) * Math.cos(theta);
        const y = 4 * Math.sin(phi) * Math.sin(theta);
        const z = 4 * Math.cos(phi);
        
        positions[i3] = x;
        positions[i3 + 1] = y;
        positions[i3 + 2] = z;
      }
      
      return positions;
    });
    
    // Animate wave points
    useFrame((state) => {
      const positionArray = points.current.geometry.attributes.position.array as Float32Array;
      const time = state.clock.elapsedTime;
      
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const x = positionArray[i3];
        const y = positionArray[i3 + 1];
        const z = positionArray[i3 + 2];
        
        // Create more complex wave-like movements
        const distFromCenter = Math.sqrt(x * x + z * z);
        const waveHeight = Math.sin(distFromCenter - time * 2) * 0.3;
        const waveFreq = Math.sin(time * 3 + distFromCenter * 5) * 0.05;
        const additionalWave = Math.cos(time * 2 + x * 3) * 0.1;
        
        // Apply a compound wave pattern
        positionArray[i3 + 1] = y + waveHeight + waveFreq + additionalWave;
        // Add subtle horizontal motion
        positionArray[i3] = x + Math.sin(time + y) * 0.05;
        positionArray[i3 + 2] = z + Math.cos(time + x) * 0.05;
      }
      
      points.current.geometry.attributes.position.needsUpdate = true;
    });
    
    return (
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          color="#60b5ff"
          transparent
          opacity={0.8}
          depthWrite={false}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
    );
  };
  
  // Sound pulse effect with additional ripples
  const SoundPulse = () => {
    const pulseRef = useRef<THREE.Mesh>(null!);
    const rippleRefs = useRef<THREE.Mesh[]>([]);
    
    useFrame((state) => {
      const time = state.clock.elapsedTime;
      
      // Main pulse animation
      if (pulseRef.current) {
        pulseRef.current.scale.set(
          1 + Math.sin(time * 2) * 0.3,
          1 + Math.sin(time * 2) * 0.3,
          1 + Math.sin(time * 2) * 0.3
        );
        
        // Pulse opacity
        if (pulseRef.current.material) {
          (pulseRef.current.material as THREE.MeshStandardMaterial).opacity = 
            0.2 + Math.sin(time * 2) * 0.15;
          (pulseRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 
            0.5 + Math.sin(time * 3) * 0.2;
        }
      }
      
      // Ripple animations
      rippleRefs.current.forEach((ripple, i) => {
        if (ripple) {
          const rippleTime = time * 0.7 + i * 1.5;
          const scale = (Math.sin(rippleTime * 0.8) + 1) * 0.5 + 0.5;
          ripple.scale.set(scale, scale, scale);
          
          // Fade out as they expand
          if (ripple.material) {
            (ripple.material as THREE.MeshBasicMaterial).opacity = 
              Math.max(0, 0.5 - scale * 0.25);
          }
        }
      });
    });
    
    return (
      <group>
        {/* Main pulse sphere */}
        <mesh ref={pulseRef}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial
            color="#5dabf9"
            transparent
            opacity={0.3}
            emissive="#2a7fff"
            emissiveIntensity={0.5}
          />
        </mesh>
        
        {/* Ripple rings */}
        {[0, 1, 2].map((i) => (
          <mesh 
            key={i} 
            ref={(el) => {
              if (el) rippleRefs.current[i] = el;
            }}
          >
            <ringGeometry args={[0.8, 0.85, 64]} />
            <meshBasicMaterial
              color="#4a99ff"
              transparent
              opacity={0.3}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
        
        {/* Inner glow */}
        <mesh>
          <sphereGeometry args={[0.45, 24, 24]} />
          <meshBasicMaterial
            color="#80c4ff"
            transparent
            opacity={0.2}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>
    );
  };
  
  // Frequency bars visualization
  const FrequencyBars = () => {
    const groupRef = useRef<THREE.Group>(null!);
    const numBars = 32; // Increased number of bars
    const barWidth = 0.04;
    const spacing = 0.02;
    const totalWidth = numBars * (barWidth + spacing);
    const startX = -totalWidth / 2 + barWidth / 2;
    
    useFrame((state) => {
      const time = state.clock.elapsedTime;
      
      if (groupRef.current) {
        for (let i = 0; i < numBars; i++) {
          const bar = groupRef.current.children[i] as THREE.Mesh;
          if (bar) {
            // Create more complex audio amplitude visualization
            // Use multiple wave functions to create more realistic pattern
            const frequency1 = Math.sin(time * 5 + i * 0.2) * 0.5 + 0.5;
            const frequency2 = Math.cos(time * 3 + i * 0.3) * 0.3 + 0.3;
            const frequency3 = Math.sin(time * 7 + i * 0.15) * 0.2 + 0.2;
            
            // Combine patterns for a more dynamic feel
            const combinedFreq = (frequency1 + frequency2 + frequency3) / 3;
            // Add a natural falloff pattern toward the edges
            const position = i / numBars;
            const falloff = Math.sin(position * Math.PI);
            
            bar.scale.y = 0.1 + combinedFreq * falloff * 1.2;
            
            // Update color based on frequency with more blues/purples
            const hue = 0.6 + (combinedFreq * 0.15); // Blue to purple range
            const saturation = 0.7 + combinedFreq * 0.3;
            const lightness = 0.5 + combinedFreq * 0.2;
            
            if (bar.material) {
              (bar.material as THREE.MeshStandardMaterial).color.setHSL(hue, saturation, lightness);
              (bar.material as THREE.MeshStandardMaterial).emissive.setHSL(hue, 0.9, lightness * 0.6);
              (bar.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.5 + combinedFreq * 0.5;
            }
          }
        }
      }
    });
    
    return (
      <group ref={groupRef} position={[0, -0.5, 0]} rotation={[0, 0, 0]}>
        {Array.from({ length: numBars }).map((_, i) => (
          <mesh key={i} position={[startX + i * (barWidth + spacing), 0, 0]}>
            <boxGeometry args={[barWidth, 0.5, barWidth]} />
            <meshStandardMaterial
              color="#4287f5"
              emissive="#2a7fff"
              emissiveIntensity={0.5}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
        ))}
      </group>
    );
  };
  
  // Circular frequency ring
  const FrequencyRing = () => {
    const ringRef = useRef<THREE.Mesh>(null!);
    const segments = 48;
    const innerRadius = 1.2;
    const outerRadius = 1.3;
    
    // Custom oscillating geometry
    useFrame((state) => {
      const time = state.clock.elapsedTime;
      
      if (ringRef.current) {
        const geometry = ringRef.current.geometry as THREE.RingGeometry;
        const position = geometry.attributes.position;
        const vector = new THREE.Vector3();
        
        // Manipulate vertex positions for a wave effect along the ring
        for (let i = 0; i < position.count; i++) {
          vector.fromBufferAttribute(position, i);
          const angle = Math.atan2(vector.y, vector.x);
          const radius = vector.length();
          const targetRadius = radius < (innerRadius + outerRadius) / 2 ? 
            innerRadius + Math.sin(angle * 8 + time * 3) * 0.05 : 
            outerRadius + Math.sin(angle * 8 + time * 3) * 0.05;
          
          const normalized = vector.normalize();
          vector.multiplyScalar(targetRadius);
          
          position.setXYZ(i, vector.x, vector.y, vector.z);
        }
        
        position.needsUpdate = true;
      }
    });
    
    return (
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[innerRadius, outerRadius, segments]} />
        <meshStandardMaterial
          color="#3d80ff"
          emissive="#2a5cff"
          emissiveIntensity={0.6}
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>
    );
  };
  
  // VU Meter visualization
  const VUMeter = () => {
    const meterRef = useRef<THREE.Group>(null!);
    const numSegments = 16;
    const segmentWidth = 0.08;
    const segmentHeight = 0.04;
    const segmentSpacing = 0.01;
    const totalWidth = numSegments * (segmentWidth + segmentSpacing);
    const startX = -totalWidth / 2 + segmentWidth / 2;
    
    useFrame((state) => {
      const time = state.clock.elapsedTime;
      // Simulated audio level
      const audioLevel = (Math.sin(time * 1.5) + 1) / 2; // 0 to 1
      
      if (meterRef.current) {
        for (let i = 0; i < numSegments; i++) {
          const segment = meterRef.current.children[i] as THREE.Mesh;
          const segmentLevel = i / numSegments;
          
          // Segment lights up if audio level exceeds its threshold
          const isActive = audioLevel >= segmentLevel;
          
          if (segment && segment.material) {
            // Color transitions from green to yellow to red
            let hue = 0.3 - (segmentLevel * 0.3); // 0.3 (green) to 0 (red)
            let saturation = 0.9;
            let lightness = isActive ? 0.6 : 0.2;
            let emissiveIntensity = isActive ? 0.8 : 0.1;
            
            (segment.material as THREE.MeshStandardMaterial).color.setHSL(hue, saturation, lightness);
            (segment.material as THREE.MeshStandardMaterial).emissive.setHSL(hue, 1, lightness * 0.7);
            (segment.material as THREE.MeshStandardMaterial).emissiveIntensity = emissiveIntensity;
          }
        }
      }
    });
    
    return (
      <group ref={meterRef} position={[0, 0.8, 0]} rotation={[0, 0, 0]}>
        {Array.from({ length: numSegments }).map((_, i) => (
          <mesh key={i} position={[startX + i * (segmentWidth + segmentSpacing), 0, 0]}>
            <boxGeometry args={[segmentWidth, segmentHeight, segmentHeight]} />
            <meshStandardMaterial
              color="#4caf50"
              emissive="#4caf50"
              emissiveIntensity={0.5}
              metalness={0.5}
              roughness={0.3}
            />
          </mesh>
        ))}
      </group>
    );
  };
  
  // Main component rotation with additional movement
  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    
    if (waveRef.current) {
      // Base rotation
      waveRef.current.rotation.y += delta * 0.1;
      
      // Add gentle floating motion
      waveRef.current.position.y = Math.sin(time * 0.5) * 0.1;
      
      // Add subtle breathing scale
      const breathScale = 1 + Math.sin(time * 0.3) * 0.02;
      waveRef.current.scale.set(breathScale, breathScale, breathScale);
    }
  });
  
  return (
    <group ref={waveRef}>
      <WavePoints />
      <SoundPulse />
      <FrequencyBars />
      <FrequencyRing />
      <VUMeter />
    </group>
  );
}

// Use the same scroll animation hook from the main page
const useScrollAnimation = (start = 0, end = 1) => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [start, start + 0.5], [0, 1]);
  const y = useTransform(scrollYProgress, [start, end], [100, 0]);
  const scale = useTransform(scrollYProgress, [start, end], [0.8, 1]);
  
  return { targetRef, opacity, y, scale, scrollYProgress };
};

function useMotionValue(value: number) {
  return new MotionValue(value);
}

// Feature Card Component
const FeatureCard = ({ title, description, icon, index }: { 
  title: string; 
  description: string; 
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <AnimatedCard 
      index={index} 
      className="relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow transition-all hover:shadow-lg hover:-translate-y-1"
    >
      <CardHeader className="pb-2">
        <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </AnimatedCard>
  );
};

export default function NovaVoice() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  
  // Animation values for features section heading
  const featuresAnimation = useScrollAnimation(0, 0.5);
  const solutionsAnimation = useScrollAnimation(0.3, 0.7);
  
  // Background parallax effect
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.2, 0.7, 1], [0.2, 0.3, 0.4, 0.2]);

  // Features data
  const features = [
    {
      title: "Streaming ASR",
      description: "Real-time automatic speech recognition with high accuracy for instant transcription of speech.",
      icon: <Mic className="h-6 w-6" />
    },
    {
      title: "Translation",
      description: "Seamless voice translation across multiple languages for global communication.",
      icon: <Globe className="h-6 w-6" />
    },
    {
      title: "Prompt to Audio",
      description: "Generate high-quality audio content from text prompts with customizable styles.",
      icon: <Play className="h-6 w-6" />
    },
    {
      title: "Audio Generation for Video",
      description: "Create perfect audio narration and soundtracks tailored to your video content.",
      icon: <Radio className="h-6 w-6" />
    },
    {
      title: "AI Calling Agents",
      description: "Deploy intelligent voice agents that can conduct natural conversations for business applications.",
      icon: <PhoneCall className="h-6 w-6" />
    },
    {
      title: "High-Quality TTS",
      description: "Premium text-to-speech with customizable voices that sound remarkably human.",
      icon: <Headphones className="h-6 w-6" />
    },
    {
      title: "Speech to Response Speech",
      description: "End-to-end conversational systems that respond to speech with natural-sounding speech.",
      icon: <MessageSquare className="h-6 w-6" />
    },
    {
      title: "Voice Cloning",
      description: "Recreate any voice with just a short sample, maintaining natural intonation and emotion.",
      icon: <Languages className="h-6 w-6" />
    }
  ];

  const isMobile = useMediaQuery("(max-width: 640px)");

  return (
    <main className="flex flex-col items-center min-h-screen pt-20 pb-12 space-y-16 md:space-y-24 relative">
      {/* Cosmic atmosphere effects with parallax */}
      <motion.div 
        className="fixed inset-0 bg-dot-pattern opacity-20 pointer-events-none z-0"
        style={{ y: bgY, opacity: bgOpacity }}
      ></motion.div>
      <motion.div 
        className="fixed inset-0 bg-constellation opacity-30 pointer-events-none z-0"
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, -50]) }}
      ></motion.div>
      
      {/* Hero section */}
      <section className="container px-4 mx-auto mt-6 md:mt-10 z-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] items-center max-w-7xl mx-auto">
          <motion.div 
            className="flex flex-col space-y-4 md:space-y-8 order-2 lg:order-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {/* Hero content - left side */}
            <div className="space-y-3 md:space-y-4">
              <motion.h1 
                className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tighter"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                Nova Voice
              </motion.h1>
              <motion.p 
                className="max-w-[600px] text-muted-foreground text-base md:text-lg lg:text-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                Advanced voice AI technology powering the next generation of audio experiences, from real-time speech recognition to ultra-realistic voice generation.
              </motion.p>
            </div>
            
            {/* CTA buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-3 md:gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              <Button size="lg" className="group relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 w-full sm:w-auto">
                <span className="relative z-10">Try Demo</span>
                <span className="absolute inset-0 bg-gradient-to-r from-primary/50 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md"></span>
              </Button>
              <Button size="lg" variant="outline" className="group relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 w-full sm:w-auto">
                <span className="relative z-10">Contact Us</span>
                <span className="absolute inset-0 bg-gradient-to-r from-muted/5 to-muted/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md"></span>
              </Button>
            </motion.div>
          </motion.div>
          
          {/* Hero visual - right side */}
          <motion.div 
            className="h-[250px] xs:h-[300px] sm:h-[350px] md:h-[400px] lg:h-[500px] w-full relative order-1 lg:order-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="w-full h-full">
              <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#2a7fff" />
                <SoundWaveModel />
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
              </Canvas>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features section */}
      <motion.section 
        ref={featuresAnimation.targetRef}
        className="container px-4 mx-auto z-10 relative"
        style={{ 
          opacity: featuresAnimation.opacity,
          y: featuresAnimation.y 
        }}
      >
        <div className="space-y-12 max-w-7xl mx-auto">
          <motion.div className="space-y-4 text-center">
            <motion.h2 
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Voice AI Features
            </motion.h2>
            <motion.p 
              className="max-w-[700px] mx-auto text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Explore our comprehensive suite of voice AI technologies for every audio need
            </motion.p>
          </motion.div>
          
          <div className="grid gap-4 sm:gap-6 grid-cols-1 xs:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                index={index}
              />
            ))}
          </div>
        </div>
      </motion.section>
      
      {/* Detailed Services Section */}
      <section className="container px-4 mx-auto z-10 relative mt-16">
        <div className="space-y-16 max-w-7xl mx-auto">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Our Voice AI Technologies
            </h2>
            <p className="max-w-[700px] mx-auto text-muted-foreground">
              Explore the cutting-edge capabilities of Nova Voice's comprehensive voice AI platform
            </p>
          </div>
          
          {/* Streaming ASR */}
          <div className="grid gap-8 md:gap-12 lg:grid-cols-2 items-center">
            <AnimatedCard className="space-y-4 md:space-y-6 order-2 lg:order-1">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Mic className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight">Streaming Automatic Speech Recognition</h3>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Our state-of-the-art ASR system converts spoken language into text with exceptional accuracy and minimal latency, even in challenging acoustic environments.
                </p>
                
                <div className="space-y-2">
                  <h4 className="font-semibold">Key Capabilities:</h4>
                  <ul className="space-y-1">
                    <li className="flex gap-2 items-start">
                      <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-1" />
                      <p><span className="font-medium">Real-time transcription</span> with industry-leading word error rates below 5%</p>
                    </li>
                    <li className="flex gap-2 items-start">
                      <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-1" />
                      <p><span className="font-medium">Multi-speaker diarization</span> to identify who said what in conversations</p>
                    </li>
                    <li className="flex gap-2 items-start">
                      <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-1" />
                      <p><span className="font-medium">Domain-specific vocabulary</span> and customization for specialized terminology</p>
                    </li>
                    <li className="flex gap-2 items-start">
                      <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-1" />
                      <p><span className="font-medium">Background noise suppression</span> for clear transcription in noisy environments</p>
                    </li>
                    <li className="flex gap-2 items-start">
                      <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-1" />
                      <p><span className="font-medium">Punctuation and formatting</span> applied automatically to improve readability</p>
                    </li>
                  </ul>
                </div>
                
                <div className="border-t pt-4">
                  <Button variant="outline" className="gap-2">
                    Learn More <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </AnimatedCard>
            <AnimatedCard className="bg-gradient-to-br from-primary/5 to-primary/10 border rounded-xl p-6 h-full order-1 lg:order-2">
              <div className="aspect-video rounded-lg bg-card overflow-hidden relative border shadow-md">
                <div className="absolute inset-0 flex flex-col">
                  <div className="bg-card/80 border-b p-2 flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-xs font-medium">Nova Voice ASR Demo</div>
                  </div>
                  <div className="flex-1 p-4 flex flex-col justify-end space-y-3">
                    <div className="flex gap-2 items-start">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                        <Mic className="h-4 w-4" />
                      </div>
                      <div className="bg-primary/10 rounded-xl p-3 text-sm">
                        "Today's meeting will focus on the second quarter financial results. As you can see from the slides, our revenue increased by 24% compared to last year."
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <div className="h-2 bg-primary/20 rounded-full w-3/4 relative overflow-hidden">
                        <motion.div 
                          className="absolute inset-y-0 left-0 bg-primary"
                          initial={{ width: "0%" }}
                          animate={{ width: ["0%", "100%", "0%"] }}
                          transition={{ 
                            duration: 3, 
                            repeat: Infinity,
                            ease: "linear" 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedCard>
          </div>
          
          {/* Text-to-Speech */}
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <AnimatedCard className="bg-gradient-to-br from-primary/5 to-primary/10 border rounded-xl p-6 h-full">
              <div className="aspect-video rounded-lg bg-card overflow-hidden relative border shadow-md">
                <div className="absolute inset-0 flex flex-col">
                  <div className="bg-card/80 border-b p-2 flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-xs font-medium">Nova Voice TTS Demo</div>
                  </div>
                  <div className="flex-1 p-4 flex flex-col justify-center items-center space-y-6">
                    <div className="text-sm text-center max-w-md">
                      "Welcome to Nova Voice. Our advanced AI technology delivers ultra-realistic speech synthesis with natural intonation and emotion."
                    </div>
                    <div className="flex gap-4">
                      <div className="bg-primary/10 rounded-full p-2 text-primary">
                        <Play className="h-5 w-5" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="h-2 bg-muted rounded-full relative overflow-hidden w-48">
                          <motion.div 
                            className="absolute inset-y-0 left-0 bg-primary"
                            initial={{ width: "0%" }}
                            animate={{ width: "65%" }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>01:34</span>
                          <span>02:45</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 w-full">
                      <div className="bg-muted/50 p-2 rounded text-xs text-center">Sarah (Professional)</div>
                      <div className="bg-primary/20 p-2 rounded text-xs text-center font-medium">Michael (Casual)</div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedCard>
            <AnimatedCard className="space-y-6">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Headphones className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight">High-Quality Text-to-Speech</h3>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Our TTS technology generates ultra-realistic speech that's virtually indistinguishable from human voices, with fine-grained control over tone, emotion, and style.
                </p>
                
                <div className="space-y-2">
                  <h4 className="font-semibold">Key Capabilities:</h4>
                  <ul className="space-y-1">
                    <li className="flex gap-2 items-start">
                      <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-1" />
                      <p><span className="font-medium">Expressive speech</span> with natural prosody, emphasis, and emotional range</p>
                    </li>
                    <li className="flex gap-2 items-start">
                      <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-1" />
                      <p><span className="font-medium">100+ pre-built voices</span> across multiple languages, accents, and demographics</p>
                    </li>
                    <li className="flex gap-2 items-start">
                      <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-1" />
                      <p><span className="font-medium">SSML support</span> for precise control over pronunciation and delivery</p>
                    </li>
                    <li className="flex gap-2 items-start">
                      <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-1" />
                      <p><span className="font-medium">Voice customization</span> including pitch, pace, volume, and tone adjustment</p>
                    </li>
                    <li className="flex gap-2 items-start">
                      <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-1" />
                      <p><span className="font-medium">Ultra-low latency</span> for real-time applications and interactive systems</p>
                    </li>
                  </ul>
                </div>
                
                <div className="border-t pt-4">
                  <Button variant="outline" className="gap-2">
                    Learn More <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </AnimatedCard>
          </div>
          
          {/* Voice Cloning */}
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <AnimatedCard className="space-y-6 order-2 lg:order-1">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Languages className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight">Voice Cloning & Personalization</h3>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Create a perfect digital replica of any voice with just a short audio sample. Our proprietary voice cloning technology captures the unique characteristics that make each voice special.
                </p>
                
                <div className="space-y-2">
                  <h4 className="font-semibold">Key Capabilities:</h4>
                  <ul className="space-y-1">
                    <li className="flex gap-2 items-start">
                      <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-1" />
                      <p><span className="font-medium">Rapid cloning</span> with as little as 30 seconds of reference audio</p>
                    </li>
                    <li className="flex gap-2 items-start">
                      <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-1" />
                      <p><span className="font-medium">Voice preservation</span> for future content creation and posterity</p>
                    </li>
                    <li className="flex gap-2 items-start">
                      <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-1" />
                      <p><span className="font-medium">Cross-lingual synthesis</span> - speak any language with your voice</p>
                    </li>
                    <li className="flex gap-2 items-start">
                      <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-1" />
                      <p><span className="font-medium">Style transfer</span> to adapt voices for different contexts and emotions</p>
                    </li>
                    <li className="flex gap-2 items-start">
                      <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-1" />
                      <p><span className="font-medium">Ethical safeguards</span> with consent verification and watermarking</p>
                    </li>
                  </ul>
                </div>
                
                <div className="border-t pt-4">
                  <Button variant="outline" className="gap-2">
                    Learn More <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </AnimatedCard>
            <AnimatedCard className="bg-gradient-to-br from-primary/5 to-primary/10 border rounded-xl p-6 h-full order-1 lg:order-2">
              <div className="aspect-video rounded-lg bg-card overflow-hidden relative border shadow-md">
                <div className="absolute inset-0 flex flex-col">
                  <div className="bg-card/80 border-b p-2 flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-xs font-medium">Voice Cloning Interface</div>
                  </div>
                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="text-sm font-medium">1. Upload voice sample</div>
                      <div className="border-2 border-dashed border-muted rounded-lg p-4 text-center">
                        <Button variant="outline" size="sm" className="gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-upload"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                          Select File
                        </Button>
                        <div className="text-xs text-muted-foreground mt-2">MP3, WAV or M4A (max. 10MB)</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="text-sm font-medium">2. Train voice model</div>
                      <div className="flex justify-center">
                        <div className="h-2 bg-primary/20 rounded-full w-3/4 relative overflow-hidden">
                          <motion.div 
                            className="absolute inset-y-0 left-0 bg-primary"
                            initial={{ width: "0%" }}
                            animate={{ width: "85%" }}
                          />
                        </div>
                      </div>
                      <div className="text-xs text-center text-muted-foreground">Training: 85% complete</div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="text-sm font-medium">3. Preview and adjust</div>
                      <div className="flex gap-3 items-center">
                        <div className="bg-primary/10 rounded-full p-2 text-primary">
                          <Play className="h-4 w-4" />
                        </div>
                        <div className="text-xs">Your cloned voice saying: "This is my digital voice twin."</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedCard>
          </div>
          
          {/* AI Calling Agents */}
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <AnimatedCard className="bg-gradient-to-br from-primary/5 to-primary/10 border rounded-xl p-6 h-full">
              <div className="aspect-video rounded-lg bg-card overflow-hidden relative border shadow-md">
                <div className="absolute inset-0 flex flex-col">
                  <div className="bg-card/80 border-b p-2 flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-xs font-medium">AI Calling Agent Dashboard</div>
                  </div>
                  <div className="flex-1 flex flex-col p-4">
                    <div className="flex-1 flex flex-col gap-3">
                      <div className="flex gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                          <PhoneCall className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="bg-muted p-2 rounded-lg text-xs">
                            Hello, this is Nova AI calling to confirm your appointment for tomorrow at 2:00 PM. Will you be able to make it?
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 justify-end">
                        <div className="flex-1">
                          <div className="bg-primary/10 p-2 rounded-lg text-xs">
                            Yes, I'll be there. But can you remind me where your office is located?
                          </div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                          <PhoneCall className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="bg-muted p-2 rounded-lg text-xs">
                            Certainly! Our office is located at 123 Business Avenue, Suite 400. There's parking available in the building garage. Would you like me to send this information to your email or phone?
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-center">
                        <div className="h-1 bg-primary/20 rounded-full w-3/5 relative overflow-hidden">
                          <motion.div 
                            className="absolute inset-y-0 left-0 bg-primary"
                            initial={{ width: "0%" }}
                            animate={{ width: ["0%", "100%", "0%"] }}
                            transition={{ 
                              duration: 2, 
                              repeat: Infinity,
                              ease: "linear" 
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t pt-3 mt-2 flex justify-between">
                      <div className="flex gap-1 items-center text-xs text-muted-foreground">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-brain-circuit"><path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0-1.32 4.24 3 3 0 0 0 .34 5.58 2.5 2.5 0 0 0 2.96 3.08 2.5 2.5 0 0 0 4.91.05L12 20V4.5Z"/><path d="M16 8V5c0-1.1.9-2 2-2"/><path d="M12 13h4"/><path d="M12 18h6a2 2 0 0 1 2 2v1"/><path d="M12 8h8"/><path d="M20.5 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z"/><path d="M16.5 13a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z"/><path d="M20.5 21a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z"/><path d="M18.5 3a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z"/></svg>
                        <span>AI Confidence: 97%</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="h-7 text-xs">Take Over</Button>
                        <Button size="sm" className="h-7 text-xs">End Call</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedCard>
            <AnimatedCard className="space-y-6">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <PhoneCall className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight">AI Calling Agents</h3>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Our conversational AI agents can handle complex phone interactions naturally and efficiently, powered by advanced natural language understanding and human-like voice synthesis.
                </p>
                
                <div className="space-y-2">
                  <h4 className="font-semibold">Key Capabilities:</h4>
                  <ul className="space-y-1">
                    <li className="flex gap-2 items-start">
                      <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-1" />
                      <p><span className="font-medium">Context awareness</span> to maintain coherent, natural conversations</p>
                    </li>
                    <li className="flex gap-2 items-start">
                      <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-1" />
                      <p><span className="font-medium">Emotion recognition</span> to understand and respond to customer sentiment</p>
                    </li>
                    <li className="flex gap-2 items-start">
                      <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-1" />
                      <p><span className="font-medium">Intent classification</span> for accurate problem resolution</p>
                    </li>
                    <li className="flex gap-2 items-start">
                      <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-1" />
                      <p><span className="font-medium">Human handoff detection</span> for complex issues requiring human assistance</p>
                    </li>
                    <li className="flex gap-2 items-start">
                      <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-1" />
                      <p><span className="font-medium">Multi-channel integration</span> with CRM and knowledge management systems</p>
                    </li>
                  </ul>
                </div>
                
                <div className="border-t pt-4">
                  <Button variant="outline" className="gap-2">
                    Learn More <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </section>
      
      {/* Use Cases section */}
      <motion.section 
        ref={solutionsAnimation.targetRef}
        className="container px-4 mx-auto z-10 relative"
        style={{ 
          opacity: solutionsAnimation.opacity,
          y: solutionsAnimation.y 
        }}
      >
        <div className="space-y-12 max-w-7xl mx-auto">
          <motion.div className="space-y-4 text-center">
            <motion.h2 
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Industry Solutions
            </motion.h2>
            <motion.p 
              className="max-w-[700px] mx-auto text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              See how Nova Voice is transforming industries with cutting-edge audio AI
            </motion.p>
          </motion.div>
          
          <Tabs defaultValue="entertainment" className="w-full">
            <TabsList className="grid w-full max-w-xl mx-auto grid-cols-2 xs:grid-cols-4 gap-1 xs:gap-0">
              <TabsTrigger value="entertainment" className="text-xs md:text-sm">Entertainment</TabsTrigger>
              <TabsTrigger value="business" className="text-xs md:text-sm">Business</TabsTrigger>
              <TabsTrigger value="healthcare" className="text-xs md:text-sm">Healthcare</TabsTrigger>
              <TabsTrigger value="education" className="text-xs md:text-sm">Education</TabsTrigger>
            </TabsList>
            <TabsContent value="entertainment" className="mt-8">
              <div className="grid gap-6 lg:gap-8 lg:grid-cols-2 items-center">
                <AnimatedCard className="space-y-4 md:space-y-6 order-2 lg:order-1">
                  <h3 className="text-2xl font-bold">Entertainment & Media</h3>
                  <ul className="space-y-3">
                    <li className="flex gap-2 items-start">
                      <ArrowRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <p>Voice cloning for actors to preserve their voice or speak in other languages</p>
                    </li>
                    <li className="flex gap-2 items-start">
                      <ArrowRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <p>Automated dubbing and localization for global content delivery</p>
                    </li>
                    <li className="flex gap-2 items-start">
                      <ArrowRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <p>Voice-driven interactive characters for games and virtual experiences</p>
                    </li>
                    <li className="flex gap-2 items-start">
                      <ArrowRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <p>Audio generation for podcasts, audiobooks, and digital content</p>
                    </li>
                  </ul>
                </AnimatedCard>
                <AnimatedCard className="overflow-hidden rounded-xl">
                  <div className="aspect-video w-full rounded-xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 opacity-90"></div>
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQnPSIyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9IndhdmUiIHg9IjAiIHk9IjAiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNMCAwTDUwIDI1TDEwMCAwTDE1MCAyNUwyMDAgMFYyMDBMMTUwIDE3NUwxMDAgMjAwTDUwIDE3NUwwIDIwMFoiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjIiIHN0cm9rZS13aWR0aD0iMiIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCN3YXZlKSIvPjwvc3ZnPg==')] bg-repeat opacity-20"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="px-6 py-4 rounded-lg bg-black/40 backdrop-blur-md text-white text-sm font-medium">
                        Entertainment & Media Voice AI
                      </div>
                    </div>
                  </div>
                </AnimatedCard>
              </div>
            </TabsContent>
            <TabsContent value="business" className="mt-8">
              <div className="grid gap-6 lg:gap-8 lg:grid-cols-2 items-center">
                <AnimatedCard className="space-y-4 md:space-y-6 order-2 lg:order-1">
                  <h3 className="text-2xl font-bold">Business & Customer Service</h3>
                  <ul className="space-y-3">
                    <li className="flex gap-2 items-start">
                      <ArrowRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <p>AI-powered call centers with natural, conversational agents</p>
                    </li>
                    <li className="flex gap-2 items-start">
                      <ArrowRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <p>Real-time meeting transcription and multi-language translation</p>
                    </li>
                    <li className="flex gap-2 items-start">
                      <ArrowRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <p>Voice-based authentication and security systems</p>
                    </li>
                    <li className="flex gap-2 items-start">
                      <ArrowRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <p>Automated outbound calling for appointment reminders and notifications</p>
                    </li>
                  </ul>
                </AnimatedCard>
                <AnimatedCard className="overflow-hidden rounded-xl">
                  <div className="aspect-video w-full rounded-xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 opacity-90"></div>
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQnPSIyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9IndhdmUiIHg9IjAiIHk9IjAiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNMCAwTDUwIDI1TDEwMCAwTDE1MCAyNUwyMDAgMFYyMDBMMTUwIDE3NUwxMDAgMjAwTDUwIDE3NUwwIDIwMFoiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjIiIHN0cm9rZS13aWR0aD0iMiIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCN3YXZlKSIvPjwvc3ZnPg==')] bg-repeat opacity-20"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="px-6 py-4 rounded-lg bg-black/40 backdrop-blur-md text-white text-sm font-medium">
                        Business & Customer Service Voice AI
                      </div>
                    </div>
                  </div>
                </AnimatedCard>
              </div>
            </TabsContent>
            <TabsContent value="healthcare" className="mt-8">
              <div className="grid gap-6 lg:gap-8 lg:grid-cols-2 items-center">
                <AnimatedCard className="space-y-4 md:space-y-6 order-2 lg:order-1">
                  <h3 className="text-2xl font-bold">Healthcare</h3>
                  <ul className="space-y-3">
                    <li className="flex gap-2 items-start">
                      <ArrowRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <p>Voice-based medical assistants for patient interactions</p>
                    </li>
                    <li className="flex gap-2 items-start">
                      <ArrowRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <p>Automated medical dictation and clinical documentation</p>
                    </li>
                    <li className="flex gap-2 items-start">
                      <ArrowRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <p>Voice-based symptom analysis and preliminary diagnosis</p>
                    </li>
                    <li className="flex gap-2 items-start">
                      <ArrowRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <p>Personalized voice companions for elderly care and mental health</p>
                    </li>
                  </ul>
                </AnimatedCard>
                <AnimatedCard className="overflow-hidden rounded-xl">
                  <div className="aspect-video w-full rounded-xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-400 via-blue-500 to-indigo-600 opacity-90"></div>
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQnPSIyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9IndhdmUiIHg9IjAiIHk9IjAiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNMCAwTDUwIDI1TDEwMCAwTDE1MCAyNUwyMDAgMFYyMDBMMTUwIDE3NUwxMDAgMjAwTDUwIDE3NUwwIDIwMFoiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjIiIHN0cm9rZS13aWR0aD0iMiIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCN3YXZlKSIvPjwvc3ZnPg==')] bg-repeat opacity-20"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="px-6 py-4 rounded-lg bg-black/40 backdrop-blur-md text-white text-sm font-medium">
                        Healthcare Voice AI
                      </div>
                    </div>
                  </div>
                </AnimatedCard>
              </div>
            </TabsContent>
            <TabsContent value="education" className="mt-8">
              <div className="grid gap-6 lg:gap-8 lg:grid-cols-2 items-center">
                <AnimatedCard className="space-y-4 md:space-y-6 order-2 lg:order-1">
                  <h3 className="text-2xl font-bold">Education</h3>
                  <ul className="space-y-3">
                    <li className="flex gap-2 items-start">
                      <ArrowRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <p>Interactive voice-based learning assistants</p>
                    </li>
                    <li className="flex gap-2 items-start">
                      <ArrowRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <p>Language learning tools with pronunciation feedback</p>
                    </li>
                    <li className="flex gap-2 items-start">
                      <ArrowRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <p>Accessibility tools for students with reading or writing challenges</p>
                    </li>
                    <li className="flex gap-2 items-start">
                      <ArrowRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <p>Audio content generation for educational materials</p>
                    </li>
                  </ul>
                </AnimatedCard>
                <AnimatedCard className="overflow-hidden rounded-xl">
                  <div className="aspect-video w-full rounded-xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 opacity-90"></div>
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQnPSIyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9IndhdmUiIHg9IjAiIHk9IjAiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNMCAwTDUwIDI1TDEwMCAwTDE1MCAyNUwyMDAgMFYyMDBMMTUwIDE3NUwxMDAgMjAwTDUwIDE3NUwwIDIwMFoiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjIiIHN0cm9rZS13aWR0aD0iMiIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCN3YXZlKSIvPjwvc3ZnPg==')] bg-repeat opacity-20"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="px-6 py-4 rounded-lg bg-black/40 backdrop-blur-md text-white text-sm font-medium">
                        Education Voice AI
                      </div>
                    </div>
                  </div>
                </AnimatedCard>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </motion.section>

      {/* Demo section */}
      <section className="container px-4 mx-auto z-10 mt-16">
        <div className="max-w-5xl mx-auto bg-card rounded-xl border shadow-lg overflow-hidden">
          <div className="p-8 md:p-12 space-y-6">
            <h2 className="text-3xl font-bold tracking-tighter">Experience Nova Voice</h2>
            <p className="text-muted-foreground">Try our interactive demo to see the power of our voice AI in action.</p>
            
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
              <Button className="h-auto py-4 text-base justify-start px-4 sm:px-6 space-x-3 sm:space-x-4 bg-primary/10 hover:bg-primary/20 text-primary hover:text-primary border-2 border-primary/20">
                <Mic className="h-6 w-6 sm:h-8 sm:w-8 shrink-0" />
                <div className="text-left">
                  <div className="font-semibold">Try Voice Clone</div>
                  <div className="text-xs sm:text-sm opacity-80">Clone any voice in seconds</div>
                </div>
              </Button>
              <Button className="h-auto py-4 text-base justify-start px-4 sm:px-6 space-x-3 sm:space-x-4 bg-primary/10 hover:bg-primary/20 text-primary hover:text-primary border-2 border-primary/20">
                <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 shrink-0" />
                <div className="text-left">
                  <div className="font-semibold">Voice Assistant</div>
                  <div className="text-xs sm:text-sm opacity-80">Talk with our AI assistant</div>
                </div>
              </Button>
            </div>
            
            <div className="pt-6">
              <Button size="lg" className="w-full sm:w-auto">
                Schedule a Custom Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials section */}
      <section className="container px-4 mx-auto z-10 mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-10">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Trusted by Industry Leaders</h2>
            <p className="text-muted-foreground max-w-[700px] mx-auto">
              See how our customers are transforming their businesses with Nova Voice
            </p>
          </div>
          
          <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <AnimatedCard key={i} index={i-1} className="bg-card border p-4 md:p-6 rounded-xl shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    {i === 1 ? 'NT' : i === 2 ? 'GS' : 'VM'}
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {i === 1 ? 'NetTech Solutions' : i === 2 ? 'GlobalStream Media' : 'VoiceMed Health'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {i === 1 ? 'CTO' : i === 2 ? 'Content Director' : 'Head of Innovation'}
                    </p>
                  </div>
                </div>
                <blockquote className="text-muted-foreground">
                  "{i === 1 
                    ? 'Nova Voice transformed our customer service with AI agents that sound completely natural. Our satisfaction scores increased by 27% while reducing costs.'
                    : i === 2 
                      ? 'We\'ve cut our localization time by 80% using the voice translation technology. We can now release content in 12 languages simultaneously.'
                      : 'The speech-to-text accuracy for medical terminology is remarkable. Our clinicians save hours every day on documentation.'}"
                </blockquote>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="container px-4 mx-auto z-10 mt-16">
        <div className="max-w-5xl mx-auto rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-background border shadow-xl overflow-hidden">
          <div className="p-8 md:p-12 text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">Ready to transform your audio experience?</h2>
            <p className="text-muted-foreground max-w-[600px] mx-auto">
              Join the next generation of voice AI technology and unlock new possibilities for your business.
            </p>
            <div className="flex flex-col xs:flex-row gap-3 md:gap-4 justify-center pt-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 w-full xs:w-auto">
                Get Started Now
              </Button>
              <Button size="lg" variant="outline" className="w-full xs:w-auto">
                Talk to an Expert
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Technical Specifications Section */}
      <section className="container px-4 mx-auto z-10 mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-10">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Technical Specifications
            </h2>
            <p className="text-muted-foreground max-w-[700px] mx-auto">
              Our voice AI platform is built with cutting-edge technology to deliver exceptional performance and flexibility
            </p>
          </div>
          
          <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-6 md:mt-8">
            {/* Performance Metrics Card */}
            <AnimatedCard className="border rounded-xl p-4 md:p-6 bg-card space-y-3 md:space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>
                Performance Metrics
              </h3>
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Speech Recognition Accuracy</span>
                    <span className="font-medium">98.6%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full">
                    <div className="h-full bg-primary rounded-full" style={{ width: '98.6%' }}></div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">TTS Naturalness Score (MOS)</span>
                    <span className="font-medium">4.8/5</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full">
                    <div className="h-full bg-primary rounded-full" style={{ width: '96%' }}></div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Latency (End-to-End)</span>
                    <span className="font-medium">85ms</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full">
                    <div className="h-full bg-primary rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Voice Cloning Similarity</span>
                    <span className="font-medium">95.2%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full">
                    <div className="h-full bg-primary rounded-full" style={{ width: '95.2%' }}></div>
                  </div>
                </div>
              </div>
            </AnimatedCard>
            
            {/* Technology Stack Card */}
            <AnimatedCard className="border rounded-xl p-4 md:p-6 bg-card space-y-3 md:space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M20 17a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2"/><path d="M14 13h2"/><path d="M20 17H4a2 2 0 1 0 0 4h16a2 2 0 1 0 0-4Z"/><path d="M12 17v4"/></svg>
                Technology Stack
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2H2v10h10V2Z"/><path d="M22 12h-10v10h10V12Z"/><path d="M12 12H2v10h10V12Z"/><path d="M22 2h-10v10h10V2Z"/></svg>
                  </div>
                  <div>
                    <div className="font-medium text-sm">Transformer Architecture</div>
                    <div className="text-xs text-muted-foreground">Self-attention based models</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 4.5a1.5 1.5 0 1 0-3 0c0 .9.9 2.1 1.5 3 .6-.9 1.5-2.1 1.5-3Z"/><path d="M19.5 12a1.5 1.5 0 1 0 0-3c-.9 0-2.1.9-3 1.5.9.6 2.1 1.5 3 1.5Z"/><path d="M12 19.5a1.5 1.5 0 1 0 3 0c0-.9-.9-2.1-1.5-3-.6.9-1.5 2.1-1.5 3Z"/><path d="M4.5 12a1.5 1.5 0 1 0 0 3c.9 0 2.1-.9 3-1.5-.9-.6-2.1-1.5-3-1.5Z"/><path d="M16.8 16.8a1.5 1.5 0 1 0 2.1-2.1c-.7-.6-2.3-.9-3.4-.5.4 1.1.7 2.7.5 3.4.4-.2.8-.5 1.1-.8"/><path d="M7.2 7.2a1.5 1.5 0 1 0-2.1 2.1c.6.7 2.2.9 3.4.5-.5-1.1-.7-2.7-.5-3.4-.4.2-.8.5-1.1.8"/><path d="M7.2 16.8a1.5 1.5 0 1 0 2.1 2.1c.7-.6.9-2.2.5-3.4-1.1.5-2.7.7-3.4.5.2.4.4.8.8 1.1"/><path d="M16.8 7.2a1.5 1.5 0 1 0-2.1-2.1c-.7.6-.9 2.3-.5 3.4 1.1-.4 2.7-.7 3.4-.5-.2-.4-.5-.8-.8-1.1"/></svg>
                  </div>
                  <div>
                    <div className="font-medium text-sm">Neural Vocoder</div>
                    <div className="text-xs text-muted-foreground">HiFi-GAN + WaveNet hybrid</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="10" height="14" x="3" y="8" rx="2"/><path d="M5 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2h-2.4"/><path d="M8 18h.01"/></svg>
                  </div>
                  <div>
                    <div className="font-medium text-sm">API & SDK</div>
                    <div className="text-xs text-muted-foreground">RESTful + Real-time WebSockets</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                  </div>
                  <div>
                    <div className="font-medium text-sm">Custom ML Models</div>
                    <div className="text-xs text-muted-foreground">Domain-specific fine-tuning</div>
                  </div>
                </div>
              </div>
            </AnimatedCard>
            
            {/* Integration Options Card */}
            <AnimatedCard className="border rounded-xl p-4 md:p-6 bg-card space-y-3 md:space-y-4 md:col-span-2 lg:col-span-1">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 4v6a2 2 0 0 0 2 2h4.3a2 2 0 0 0 1.6-.8l2.7-3.2a2 2 0 0 0 0-2.4L20 2.8a2 2 0 0 0-1.6-.8H14a2 2 0 0 0-2 2Z"/><path d="M12 20v-6a2 2 0 0 0-2-2H5.7a2 2 0 0 0-1.6.8L1.3 15.9a2 2 0 0 0 0 2.4L4 21.2a2 2 0 0 0 1.6.8H10a2 2 0 0 0 2-2Z"/></svg>
                Integration Options
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Supported Platforms</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="px-3 py-2 bg-muted/50 rounded text-xs text-center flex items-center justify-center">Web</div>
                    <div className="px-3 py-2 bg-muted/50 rounded text-xs text-center flex items-center justify-center">iOS</div>
                    <div className="px-3 py-2 bg-muted/50 rounded text-xs text-center flex items-center justify-center">Android</div>
                    <div className="px-3 py-2 bg-muted/50 rounded text-xs text-center flex items-center justify-center">Windows</div>
                    <div className="px-3 py-2 bg-muted/50 rounded text-xs text-center flex items-center justify-center">macOS</div>
                    <div className="px-3 py-2 bg-muted/50 rounded text-xs text-center flex items-center justify-center">Linux</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Implementation Options</h4>
                  <ul className="space-y-1">
                    <li className="flex gap-1.5 items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>
                      <span className="text-xs">Cloud API (Low code)</span>
                    </li>
                    <li className="flex gap-1.5 items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>
                      <span className="text-xs">Edge deployment (On-device)</span>
                    </li>
                    <li className="flex gap-1.5 items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>
                      <span className="text-xs">Hybrid (Edge + Cloud)</span>
                    </li>
                    <li className="flex gap-1.5 items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>
                      <span className="text-xs">Private cloud deployment</span>
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Developer Tools</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="px-3 py-2 bg-primary/10 rounded text-xs text-center">REST API</div>
                    <div className="px-3 py-2 bg-primary/10 rounded text-xs text-center">WebSockets</div>
                    <div className="px-3 py-2 bg-primary/10 rounded text-xs text-center">React SDK</div>
                    <div className="px-3 py-2 bg-primary/10 rounded text-xs text-center">Mobile SDKs</div>
                  </div>
                </div>
              </div>
            </AnimatedCard>
          </div>
          
          {/* Technical Features List */}
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="font-semibold mb-4">Advanced Features</h3>
              <ul className="space-y-2">
                <li className="flex gap-2 items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mt-0.5"><path d="m9 11-6 6v3h9l3-3"/><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/></svg>
                  <div>
                    <p className="font-medium text-sm">Multi-speaker separation</p>
                    <p className="text-xs text-muted-foreground">Distinguish between different speakers even in overlapping conversations</p>
                  </div>
                </li>
                <li className="flex gap-2 items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mt-0.5"><path d="m9 11-6 6v3h9l3-3"/><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/></svg>
                  <div>
                    <p className="font-medium text-sm">Noise cancellation</p>
                    <p className="text-xs text-muted-foreground">Advanced algorithms to filter out background noise and focus on speech</p>
                  </div>
                </li>
                <li className="flex gap-2 items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mt-0.5"><path d="m9 11-6 6v3h9l3-3"/><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/></svg>
                  <div>
                    <p className="font-medium text-sm">Accent adaptation</p>
                    <p className="text-xs text-muted-foreground">Recognition systems that adapt to regional accents and speech patterns</p>
                  </div>
                </li>
                <li className="flex gap-2 items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mt-0.5"><path d="m9 11-6 6v3h9l3-3"/><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/></svg>
                  <div>
                    <p className="font-medium text-sm">Voice authentication</p>
                    <p className="text-xs text-muted-foreground">Biometric voice verification with anti-spoofing measures</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Compliance & Security</h3>
              <ul className="space-y-2">
                <li className="flex gap-2 items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mt-0.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
                  <div>
                    <p className="font-medium text-sm">Data encryption</p>
                    <p className="text-xs text-muted-foreground">End-to-end encryption for all voice data in transit and at rest</p>
                  </div>
                </li>
                <li className="flex gap-2 items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mt-0.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
                  <div>
                    <p className="font-medium text-sm">Privacy compliance</p>
                    <p className="text-xs text-muted-foreground">GDPR, HIPAA, CCPA, and SOC 2 compliant</p>
                  </div>
                </li>
                <li className="flex gap-2 items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mt-0.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
                  <div>
                    <p className="font-medium text-sm">Voice watermarking</p>
                    <p className="text-xs text-muted-foreground">Inaudible watermarks to identify AI-generated content</p>
                  </div>
                </li>
                <li className="flex gap-2 items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mt-0.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
                  <div>
                    <p className="font-medium text-sm">Audit trails</p>
                    <p className="text-xs text-muted-foreground">Comprehensive logging of all operations for compliance purposes</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 