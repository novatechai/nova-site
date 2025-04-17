"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
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

export default function Home() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);

  return (
    <main className="flex flex-col items-center min-h-screen pt-20 pb-12 space-y-16 md:space-y-24 relative">
      {/* Cosmic atmosphere effects */}
      <div className="fixed inset-0 bg-dot-pattern opacity-20 pointer-events-none z-0"></div>
      <div className="fixed inset-0 bg-constellation opacity-30 pointer-events-none z-0"></div>
      
      {/* Hero section */}
      <section className="container px-4 mx-auto mt-6 z-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] items-center max-w-7xl mx-auto">
          <div className="flex flex-col space-y-6 md:space-y-8 order-2 lg:order-1">
            {/* Hero content - left side */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Nova AI Labs
                </h1>
              <p className="max-w-[600px] text-muted-foreground text-lg md:text-xl">
                Pioneering AI innovation with advanced custom RAG solutions, AI-integrated game development, and cutting-edge voice technology.
              </p>
            </div>
            
            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="group relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300">
                <span className="relative z-10">Get Started</span>
                <span className="absolute inset-0 bg-gradient-to-r from-primary/50 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md"></span>
                </Button>
              <Button size="lg" variant="outline" className="group relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                <span className="relative z-10">Learn More</span>
                <span className="absolute inset-0 bg-gradient-to-r from-muted/5 to-muted/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md"></span>
                </Button>
            </div>
                  </div>
          
          {/* Hero visual - right side */}
          <div className="h-[350px] sm:h-[450px] lg:h-[600px] w-full relative order-1 lg:order-2">
            <AnimatedHeroContent />
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="container px-4 mx-auto z-10">
        <div className="space-y-12 max-w-7xl mx-auto">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Our Solutions
            </h2>
            <p className="max-w-[700px] mx-auto text-muted-foreground md:text-lg">
              Discover our specialized AI services designed to transform your business and accelerate innovation.
              </p>
            </div>
          
          {/* Feature cards */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <Card className="group transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 overflow-hidden relative">
              <CardHeader>
                <div className="h-[120px] w-full mb-4">
                  <QuantumAI />
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
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </Card>
            
            {/* Feature 2 */}
            <Card className="group transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 overflow-hidden relative">
              <CardHeader>
                <div className="h-[120px] w-full mb-4">
                  <NebulaAnalytics />
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
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </Card>
            
            {/* Feature 3 */}
            <Card className="group transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 overflow-hidden relative">
              <CardHeader>
                <div className="h-[120px] w-full mb-4">
                  <OrbitLearning />
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
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </Card>
          </div>
        </div>
      </section>

      {/* Solutions section */}
      <section className="container px-4 mx-auto z-10">
        <div className="space-y-12 max-w-7xl mx-auto">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Advanced Technologies
            </h2>
            <p className="max-w-[700px] mx-auto text-muted-foreground md:text-lg">
              Our research-driven approach enables us to develop cutting-edge AI solutions for complex challenges.
              </p>
            </div>
          
          {/* Solution cards */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Solution 1 */}
            <Card className="group transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 overflow-hidden relative">
                    <CardHeader>
                <div className="h-[120px] w-full mb-4">
                  <InterstellarDeployment />
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
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                  </Card>
            
            {/* Solution 2 */}
            <Card className="group transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 overflow-hidden relative">
                    <CardHeader>
                <div className="h-[120px] w-full mb-4">
                  <StellarAssistants />
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
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                  </Card>
            
            {/* Solution 3 */}
            <Card className="group transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 overflow-hidden relative">
                    <CardHeader>
                <div className="h-[120px] w-full mb-4">
                  <PulsarInnovation />
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
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                  </Card>
            
            {/* Solution 4 */}
            <Card className="group transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 overflow-hidden relative">
                    <CardHeader>
                <div className="h-[120px] w-full mb-4">
                  <QuantumAI />
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
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                  </Card>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="container px-4 mx-auto z-10">
        <div className="max-w-7xl mx-auto bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-6 md:p-8 lg:p-12 rounded-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-constellation opacity-30 pointer-events-none"></div>
          <div className="relative z-10 space-y-6 md:space-y-8 max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter">
              Ready to Launch Your AI Journey?
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
              Join the next generation of AI-powered businesses and discover how Nova AI Labs can transform your operations.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="group relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300">
                <span className="relative z-10">Start Now</span>
                <span className="absolute inset-0 bg-gradient-to-r from-primary/50 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md"></span>
              </Button>
              <Button size="lg" variant="outline" className="group relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                <span className="relative z-10">Book a Demo</span>
                <span className="absolute inset-0 bg-gradient-to-r from-muted/5 to-muted/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md"></span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer section */}
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
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect width="4" height="12" x="2" y="9"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M12 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4"></path>
                  <path d="M16 2v4h4"></path>
                  <path d="M22 2 13.5 10.5"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Add the space animations */}
      <SpaceAnimations />
    </main>
  );
}
