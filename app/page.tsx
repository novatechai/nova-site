"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useInView, useSpring, MotionValue } from "motion/react";
import { useRef, useEffect, useState } from "react";
import { ArrowRight, Rocket, Database, BarChart3, Globe, MessageSquare, Star, Zap, Orbit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatedHeroContent } from "@/components/AnimatedHeroContent";
import { 
  QuantumAI, 
  NebulaAnalytics, 
  OrbitLearning, 
  InterstellarDeployment, 
  StellarAssistants, 
  PulsarInnovation 
} from "@/components/SpaceAssets";
// @ts-ignore
import SpaceAnimations from "../components/SpaceAnimations";

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

// Interactive floating card with parallax effect
const FloatingCard = ({ children, index = 0, className = "" }: {
  children: React.ReactNode;
  index?: number;
  className?: string;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setMousePosition({
        x: (e.clientX - rect.left) / rect.width - 0.5,
        y: (e.clientY - rect.top) / rect.height - 0.5,
      });
    }
  };
  
  // Create motion values for rotation
  const xMotionValue = useMotionValue(0);
  const yMotionValue = useMotionValue(0);
  
  const rotateX = useTransform(
    xMotionValue,
    [-0.5, 0.5],
    [10, -10]
  );
  
  const rotateY = useTransform(
    yMotionValue,
    [-0.5, 0.5],
    [-10, 10]
  );
  
  const springConfig = { damping: 15, stiffness: 150 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);
  
  // Update motion values based on mouse position
  useEffect(() => {
    if (isHovered) {
      xMotionValue.set(mousePosition.y);
      yMotionValue.set(mousePosition.x);
    } else {
      xMotionValue.set(0);
      yMotionValue.set(0);
    }
  }, [mousePosition, isHovered, xMotionValue, yMotionValue]);
  
  return (
    <AnimatedCard index={index} className={className}>
      <motion.div
        ref={cardRef}
        className="h-full"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          perspective: 1000,
          transformStyle: "preserve-3d",
        }}
      >
        <motion.div
          style={{
            rotateX: springRotateX,
            rotateY: springRotateY,
            transformStyle: "preserve-3d",
          }}
          className="h-full w-full transition-all duration-100"
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatedCard>
  );
};

// Create a custom hook to manage scroll-linked animations
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

export default function Home() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  
  // Create refs for each section
  const featuresRef = useRef(null);
  const solutionsRef = useRef(null);
  const ctaRef = useRef(null);
  
  // Animation values for features section heading
  const featuresAnimation = useScrollAnimation(0, 0.5);
  const solutionsAnimation = useScrollAnimation(0.3, 0.7);
  
  // Background parallax effect
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.2, 0.7, 1], [0.2, 0.3, 0.4, 0.2]);

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
      <section className="container px-4 mx-auto mt-6 z-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] items-center max-w-7xl mx-auto">
          <motion.div 
            className="flex flex-col space-y-6 md:space-y-8 order-2 lg:order-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {/* Hero content - left side */}
            <div className="space-y-4">
              <motion.h1 
                className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                Nova AI Labs
              </motion.h1>
              <motion.p 
                className="max-w-[600px] text-muted-foreground text-lg md:text-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                Pioneering AI innovation with advanced custom RAG solutions, AI-integrated game development, and cutting-edge voice technology.
              </motion.p>
            </div>
            
            {/* CTA buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              <Button size="lg" className="group relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300">
                <span className="relative z-10">Get Started</span>
                <span className="absolute inset-0 bg-gradient-to-r from-primary/50 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md"></span>
              </Button>
              <Button size="lg" variant="outline" className="group relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                <span className="relative z-10">Learn More</span>
                <span className="absolute inset-0 bg-gradient-to-r from-muted/5 to-muted/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md"></span>
              </Button>
            </motion.div>
          </motion.div>
          
          {/* Hero visual - right side */}
          <motion.div 
            className="h-[350px] sm:h-[450px] lg:h-[600px] w-full relative order-1 lg:order-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <AnimatedHeroContent />
          </motion.div>
        </div>
      </section>

      {/* Features section with scroll animations */}
      <motion.section 
        ref={featuresRef}
        className="container px-4 mx-auto z-10 relative"
        style={{ 
          opacity: featuresAnimation.opacity,
          y: featuresAnimation.y 
        }}
      >
        <div className="space-y-12 max-w-7xl mx-auto">
          <motion.div 
            className="space-y-4 text-center"
            ref={featuresAnimation.targetRef}
          >
            <motion.h2 
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5 }}
            >
              Our Solutions
            </motion.h2>
            <motion.p 
              className="max-w-[700px] mx-auto text-muted-foreground md:text-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Discover our specialized AI services designed to transform your business and accelerate innovation.
            </motion.p>
          </motion.div>
          
          {/* Feature cards with staggered animation */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <FloatingCard index={0}>
              <Card className="group h-full transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 overflow-hidden relative">
                <CardHeader>
                  <div className="h-[120px] w-full mb-4 flex items-center justify-center">
                    <motion.div
                      whileHover={{ rotate: 5, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <QuantumAI />
                    </motion.div>
                  </div>
                  <CardTitle>Nova RAG</CardTitle>
                  <CardDescription>
                    Customized retrieval-augmented generation for organizations.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Our advanced RAG systems enable fast, deep research on company documents and various sources, available on-premises or in the cloud.</p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="group-hover:bg-primary/10 transition-all duration-300">Learn more</Button>
                </CardFooter>
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                ></motion.div>
              </Card>
            </FloatingCard>
            
            {/* Feature 2 */}
            <FloatingCard index={1}>
              <Card className="group h-full transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 overflow-hidden relative">
                <CardHeader>
                  <div className="h-[120px] w-full mb-4 flex items-center justify-center">
                    <motion.div
                      whileHover={{ rotate: -5, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <NebulaAnalytics />
                    </motion.div>
                  </div>
                  <CardTitle>NovaPlay</CardTitle>
                  <CardDescription>
                    Game studios focusing on AI-integrated game development.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Creating next-generation gaming experiences with advanced AI integration for more immersive and dynamic gameplay.</p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="group-hover:bg-primary/10 transition-all duration-300">Learn more</Button>
                </CardFooter>
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                ></motion.div>
              </Card>
            </FloatingCard>
            
            {/* Feature 3 */}
            <FloatingCard index={2}>
              <Card className="group h-full transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 overflow-hidden relative">
                <CardHeader>
                  <div className="h-[120px] w-full mb-4 flex items-center justify-center">
                    <motion.div
                      whileHover={{ rotate: 5, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <OrbitLearning />
                    </motion.div>
                  </div>
                  <CardTitle>NovaVoice</CardTitle>
                  <CardDescription>
                    Complete voice studio with advanced speech technologies.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Comprehensive voice solutions including text-to-speech, speech-to-text, interactive voice responses, and more.</p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="group-hover:bg-primary/10 transition-all duration-300">Learn more</Button>
                </CardFooter>
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                ></motion.div>
              </Card>
            </FloatingCard>
          </div>
        </div>
      </motion.section>

      {/* Solutions section with parallax and scroll effects */}
      <motion.section 
        ref={solutionsRef}
        className="container px-4 mx-auto z-10 relative"
        style={{ 
          opacity: solutionsAnimation.opacity,
          y: solutionsAnimation.y 
        }}
      >
        <div className="space-y-12 max-w-7xl mx-auto">
          <motion.div 
            className="space-y-4 text-center"
            ref={solutionsAnimation.targetRef}
          >
            <motion.h2 
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5 }}
            >
              Advanced Technologies
            </motion.h2>
            <motion.p 
              className="max-w-[700px] mx-auto text-muted-foreground md:text-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Our research-driven approach enables us to develop cutting-edge AI solutions for complex challenges.
            </motion.p>
          </motion.div>
          
          {/* Solution cards with scroll animation */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Solution 1 */}
            <AnimatedCard index={0}>
              <Card className="group transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 overflow-hidden relative h-full">
                <CardHeader>
                  <div className="h-[120px] w-full mb-4 flex items-center justify-center">
                    <motion.div
                      animate={{ 
                        y: [0, -5, 0], 
                        rotate: [0, 2, 0] 
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    >
                      <InterstellarDeployment />
                    </motion.div>
                  </div>
                  <CardTitle>Generative AI</CardTitle>
                  <CardDescription>
                    Custom generative AI solutions for diverse applications.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Our generative AI technologies create transformative solutions that adapt to your specific industry needs and business requirements.</p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="group-hover:bg-primary/10 transition-all duration-300">Learn more</Button>
                </CardFooter>
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-primary/5 to-transparent opacity-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                ></motion.div>
              </Card>
            </AnimatedCard>
            
            {/* Solution 2 */}
            <AnimatedCard index={1}>
              <Card className="group transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 overflow-hidden relative h-full">
                <CardHeader>
                  <div className="h-[120px] w-full mb-4 flex items-center justify-center">
                    <motion.div
                      animate={{ 
                        y: [0, -5, 0], 
                        rotate: [0, -2, 0]
                      }}
                      transition={{
                        duration: 3.5,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: 0.5
                      }}
                    >
                      <StellarAssistants />
                    </motion.div>
                  </div>
                  <CardTitle>AI Agents Framework</CardTitle>
                  <CardDescription>
                    State-of-the-art AI agent frameworks for advanced applications.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Our innovative agent frameworks enable sophisticated computer use and tool manipulation, creating autonomous systems that solve complex problems.</p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="group-hover:bg-primary/10 transition-all duration-300">Learn more</Button>
                </CardFooter>
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-primary/5 to-transparent opacity-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                ></motion.div>
              </Card>
            </AnimatedCard>
            
            {/* Solution 3 */}
            <AnimatedCard index={2}>
              <Card className="group transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 overflow-hidden relative h-full">
                <CardHeader>
                  <div className="h-[120px] w-full mb-4 flex items-center justify-center">
                    <motion.div
                      animate={{ 
                        y: [0, -5, 0],
                        rotate: [0, 2, 0]
                      }}
                      transition={{
                        duration: 4.2,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: 0.2
                      }}
                    >
                      <PulsarInnovation />
                    </motion.div>
                  </div>
                  <CardTitle>Custom Model Development</CardTitle>
                  <CardDescription>
                    Proprietary AI models built for specific use cases.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>We're actively developing our own specialized AI models designed to excel at specific tasks and outperform general-purpose solutions.</p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="group-hover:bg-primary/10 transition-all duration-300">Learn more</Button>
                </CardFooter>
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-primary/5 to-transparent opacity-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                ></motion.div>
              </Card>
            </AnimatedCard>
            
            {/* Solution 4 */}
            <AnimatedCard index={3}>
              <Card className="group transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 overflow-hidden relative h-full">
                <CardHeader>
                  <div className="h-[120px] w-full mb-4 flex items-center justify-center">
                    <motion.div
                      animate={{ 
                        y: [0, -5, 0],
                        rotate: [0, -2, 0]
                      }}
                      transition={{
                        duration: 3.8,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: 0.7
                      }}
                    >
                      <QuantumAI />
                    </motion.div>
                  </div>
                  <CardTitle>Technology Services</CardTitle>
                  <CardDescription>
                    Comprehensive technology consulting and implementation.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Our technology services complement our AI solutions, ensuring seamless integration and maximum value for your business.</p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="group-hover:bg-primary/10 transition-all duration-300">Learn more</Button>
                </CardFooter>
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-primary/5 to-transparent opacity-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                ></motion.div>
              </Card>
            </AnimatedCard>
          </div>
        </div>
      </motion.section>

      {/* CTA section with parallax and glow effect */}
      <motion.section 
        ref={ctaRef}
        className="container px-4 mx-auto z-10"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7 }}
      >
        <motion.div 
          className="max-w-7xl mx-auto bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-6 md:p-8 lg:p-12 rounded-2xl relative overflow-hidden"
          whileInView={{ scale: [0.95, 1] }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <motion.div
            className="absolute inset-0 bg-grid-pattern"
            animate={{
              backgroundPosition: ['0px 0px', '100px 100px'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: 'loop',
            }}
          ></motion.div>
          <div className="absolute inset-0 bg-constellation opacity-30 pointer-events-none"></div>
          <motion.div 
            className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-blue-500/20 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500"
            animate={{ 
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity,
            }}
          ></motion.div>
          <div className="relative z-10 space-y-6 md:space-y-8 max-w-3xl mx-auto text-center">
            <motion.h2 
              className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5 }}
            >
              Ready to Launch Your AI Journey?
            </motion.h2>
            <motion.p 
              className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Join the next generation of AI-powered businesses and discover how Nova AI Labs can transform your operations.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button size="lg" className="group relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300">
                <motion.span 
                  className="relative z-10"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >Start Now</motion.span>
                <span className="absolute inset-0 bg-gradient-to-r from-primary/50 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md"></span>
              </Button>
              <Button size="lg" variant="outline" className="group relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                <motion.span 
                  className="relative z-10"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >Book a Demo</motion.span>
                <span className="absolute inset-0 bg-gradient-to-r from-muted/5 to-muted/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md"></span>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </motion.section>

      {/* Footer section with subtle animation */}
      <footer className="container px-4 pt-12 mx-auto border-t">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Nova AI Labs</h3>
              <p className="text-sm text-muted-foreground">
                Pioneering the frontier of artificial intelligence.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Products</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Quantum AI</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Nebula Analytics</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Orbit Learning</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Solutions</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Interstellar Deployment</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Stellar Assistants</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pulsar Innovation</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center mt-12 py-6 border-t">
            <p className="text-sm text-muted-foreground">© 2023 Nova AI Labs. All rights reserved.</p>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <motion.a 
                href="#" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                whileHover={{ scale: 1.2, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </motion.a>
              <motion.a 
                href="#" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                whileHover={{ scale: 1.2, rotate: -5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect width="4" height="12" x="2" y="9"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </motion.a>
              <motion.a 
                href="#" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                whileHover={{ scale: 1.2, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M12 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4"></path>
                  <path d="M16 2v4h4"></path>
                  <path d="M22 2 13.5 10.5"></path>
                </svg>
              </motion.a>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Add the space animations */}
      <SpaceAnimations />
    </main>
  );
}
