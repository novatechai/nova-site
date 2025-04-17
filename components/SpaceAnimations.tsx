import React from "react";
import { motion } from "framer-motion";

export function FloatingOrbit() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div 
        className="absolute w-[500px] h-[500px] border border-indigo-500/20 rounded-full"
        style={{ top: "50%", left: "50%", x: "-50%", y: "-50%" }}
        animate={{
          rotate: 360
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <motion.div 
        className="absolute w-[400px] h-[400px] border border-purple-500/20 rounded-full"
        style={{ top: "50%", left: "50%", x: "-50%", y: "-50%" }}
        animate={{
          rotate: -360
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <motion.div 
        className="absolute w-[300px] h-[300px] border border-pink-500/20 rounded-full"
        style={{ top: "50%", left: "50%", x: "-50%", y: "-50%" }}
        animate={{
          rotate: 360
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
}

export function FloatingPlanets() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Planet 1 */}
      <motion.div 
        className="absolute w-4 h-4 rounded-full bg-indigo-500"
        style={{ top: "30%", left: "25%" }}
        animate={{
          y: [0, -20, 0],
          opacity: [0.6, 1, 0.6]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Planet 2 */}
      <motion.div 
        className="absolute w-6 h-6 rounded-full bg-purple-500"
        style={{ top: "60%", left: "70%" }}
        animate={{
          y: [0, 30, 0],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Planet 3 */}
      <motion.div 
        className="absolute w-3 h-3 rounded-full bg-pink-500"
        style={{ top: "20%", left: "80%" }}
        animate={{
          y: [0, 15, 0],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
}

export function StarField() {
  // Generate random stars
  const stars = Array.from({ length: 50 }).map((_, i) => {
    const size = Math.random() * 2 + 1;
    return {
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: size,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2
    };
  });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size
          }}
          animate={{
            opacity: [0.2, 0.8, 0.2]
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

export function PulsatingGlow() {
  return (
    <motion.div
      className="absolute inset-0 bg-gradient-radial from-indigo-900/20 to-transparent"
      animate={{
        opacity: [0.3, 0.6, 0.3]
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
}

export function OrbitalParticle({ 
  radius = 150,
  duration = 12,
  size = 3,
  color = "bg-indigo-500",
  delay = 0,
  clockwise = true
}) {
  return (
    <motion.div
      className={`absolute rounded-full ${color}`}
      style={{ 
        width: size, 
        height: size,
        top: "50%", 
        left: "50%", 
        x: radius, 
        y: 0 
      }}
      animate={{
        rotate: clockwise ? 360 : -360
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "linear",
        delay
      }}
    />
  );
}

export function OrbitalSystem() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <OrbitalParticle radius={120} duration={8} color="bg-indigo-500" clockwise={true} />
        <OrbitalParticle radius={120} duration={8} color="bg-indigo-500" clockwise={true} delay={4} />
        
        <OrbitalParticle radius={180} duration={15} color="bg-purple-500" clockwise={false} />
        <OrbitalParticle radius={180} duration={15} color="bg-purple-500" clockwise={false} delay={5} />
        <OrbitalParticle radius={180} duration={15} color="bg-purple-500" clockwise={false} delay={10} />
        
        <OrbitalParticle radius={240} duration={20} color="bg-pink-500" clockwise={true} />
        <OrbitalParticle radius={240} duration={20} color="bg-pink-500" clockwise={true} delay={6.7} />
        <OrbitalParticle radius={240} duration={20} color="bg-pink-500" clockwise={true} delay={13.3} />
      </div>
    </div>
  );
}

// Default export combining all animation components
export default function SpaceAnimations() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <FloatingOrbit />
      <FloatingPlanets />
      <StarField />
      <PulsatingGlow />
      <OrbitalSystem />
    </div>
  );
} 