"use client"

import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { Metadata } from "next"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Canvas, useFrame } from "@react-three/fiber"
import { Sphere, Box, Float, PerspectiveCamera, Stars, useTexture } from "@react-three/drei"
import * as THREE from "three"
import { ChevronLeft, CircleCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { Spinner } from "@/components/ui/spinner"

import { 
  ContactFormSchema, 
  ContactFormValues, 
  MeetingFormSchema, 
  MeetingFormValues,
  storeContactData,
  storeMeetingData
} from "@/lib/validators/contact-form"

// 3D Elements
const OrbitingSphere = ({ 
  radius = 0.2, 
  distance = 2, 
  speed = 0.5, 
  textureUrl = "/planet-texture.jpg",
  bumpMapUrl = "/planet-bump.jpg",
  cloudMapUrl = "/planet-clouds.png",
  ...props 
}) => {
  const meshRef = React.useRef<THREE.Group>(null)
  const textures = useTexture({
    map: textureUrl,
    bumpMap: bumpMapUrl,
    cloudMap: cloudMapUrl,
  })

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed
    if (meshRef.current) {
      meshRef.current.position.x = Math.sin(t) * distance
      meshRef.current.position.z = Math.cos(t) * distance
      meshRef.current.rotation.y = t * 0.5
      const cloudMesh = meshRef.current.children[1] as THREE.Mesh;
      if (cloudMesh) cloudMesh.rotation.y = t * 0.6;
    }
  })
  
  return (
    <group ref={meshRef} {...props}>
      <Sphere args={[radius, 32, 32]} >
        <meshStandardMaterial 
          map={textures.map} 
          bumpMap={textures.bumpMap}
          bumpScale={0.01}
          roughness={0.7} 
          metalness={0.1} 
        />
      </Sphere>
      <Sphere args={[radius * 1.01, 32, 32]} >
         <meshStandardMaterial
          map={textures.cloudMap}
          transparent={true}
          opacity={0.4}
          depthWrite={false} 
          side={THREE.DoubleSide}
        />
      </Sphere>
    </group>
  )
}

const FloatingCube = ({ size = 0.4, color = "#8b5cf6", ...props }) => {
  return (
    <Float
      speed={2}
      rotationIntensity={1}
      floatIntensity={1}
      {...props}
    >
      <Box args={[size, size, size]}>
        <meshStandardMaterial 
          color={color} 
          roughness={0.1} 
          metalness={0.9}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </Box>
    </Float>
  )
}

const SceneBackground = () => {
  return (
    <group>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50}/>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1.0} />
      <pointLight position={[-10, -10, -10]} color="#9333ea" intensity={0.7} />
      
      <Stars radius={100} depth={50} count={5000} factor={5} fade speed={1} />
      
      <OrbitingSphere distance={3} speed={0.2} radius={0.4} />
      <OrbitingSphere distance={2.5} speed={-0.3} radius={0.25} position={[0, 1, 0]} textureUrl="/planet-texture.jpg" />
      <OrbitingSphere distance={4} speed={0.1} radius={0.3} position={[0, -1, 0]} textureUrl="/planet-texture.jpg"/>
      
      <FloatingCube position={[2.5, -1, -1.5]} color="#8b5cf6"/>
      <FloatingCube position={[-2.5, 1, -2.5]} color="#a78bfa" size={0.3} />
      <FloatingCube position={[-1.5, -2, -1]} color="#c4b5fd" size={0.25} />
    </group>
  )
}

export default function ContactPage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [timeSlot, setTimeSlot] = React.useState<string>("")
  const [step, setStep] = React.useState<"details" | "calendar" | "success">("details")
  const [formType, setFormType] = React.useState<"meeting" | "message">("meeting")
  const [successData, setSuccessData] = React.useState<{ date?: string; timeSlot?: string }>({})

  // Meeting form with validation
  const meetingForm = useForm<ContactFormValues>({
    resolver: zodResolver(ContactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      subject: "",
      message: "",
    },
  })

  // Message form with validation
  const messageForm = useForm<ContactFormValues>({
    resolver: zodResolver(ContactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      subject: "",
      message: "",
    },
  })

  // Mock available time slots
  const availableTimeSlots = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", 
    "11:00 AM", "11:30 AM", "1:00 PM", "1:30 PM", 
    "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", 
    "4:00 PM", "4:30 PM"
  ]

  const onTabChange = (value: string) => {
    setFormType(value as "meeting" | "message")
  }

  const onMeetingDetailsSubmit = (data: ContactFormValues) => {
    // Move to calendar selection
    setStep("calendar")
  }

  const onMeetingSubmit = () => {
    if (!date || !timeSlot) return
    
    // Get form data
    const formData = meetingForm.getValues()
    
    // Format date for storage
    const formattedDate = format(date, "PPP")
    
    // Create meeting data
    const meetingData: MeetingFormValues = {
      ...formData,
      date: formattedDate,
      timeSlot,
    }
    
    // Store data
    storeMeetingData(meetingData)
    
    // Save for success screen
    setSuccessData({ date: formattedDate, timeSlot })
    
    // Show success screen
    setStep("success")
  }

  const onMessageSubmit = (data: ContactFormValues) => {
    // Store contact form data
    storeContactData(data)
    
    // Show success screen
    setSuccessData({})
    setStep("success")
  }

  const resetForms = () => {
    meetingForm.reset()
    messageForm.reset()
    setDate(new Date())
    setTimeSlot("")
    setStep("details")
  }

  return (
    <div className="relative min-h-screen overflow-hidden pt-28 pb-16 bg-gradient-to-b from-black via-blue-950/30 to-purple-950/20">
      {/* Enhanced 3D Scene Background */}
      <div className="absolute inset-0 z-0 opacity-80">
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 10], fov: 50 }}>
          <SceneBackground />
        </Canvas>
      </div>
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]"></div>
      
      {/* Content */}
      <div className="container relative z-10 px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-14">
            <motion.h1 
              className="text-5xl sm:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Contact Nova Labs
            </motion.h1>
            <motion.div
              className="w-24 h-1.5 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto my-6 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: 96 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            />
            <motion.p 
              className="mt-4 text-xl text-gray-300 max-w-xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Schedule a meeting or send us a message. We're here to help you navigate the future of AI.
            </motion.p>
          </div>

          <AnimatePresence mode="wait">
            {step === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="relative bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-transparent p-12 rounded-2xl text-center backdrop-blur-md border border-white/10 shadow-2xl"
              >
                <div className="absolute inset-0 bg-grid-pattern opacity-10 rounded-2xl pointer-events-none"></div>
                
                <motion.div 
                  className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500/30 to-purple-600/30 rounded-full flex items-center justify-center mb-8 backdrop-blur-sm shadow-lg shadow-purple-500/20"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1, rotateZ: 360 }}
                  transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <path d="M20 6L9 17l-5-5"></path>
                  </svg>
                </motion.div>
                
                {formType === "meeting" ? (
                  <>
                    <motion.h2 
                      className="text-3xl font-bold mb-3 text-gradient-blue-purple"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                    >
                      Meeting Scheduled
                    </motion.h2>
                    <motion.p 
                      className="text-xl text-muted-foreground mb-8"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      We've reserved your slot for <span className="text-primary font-medium">{successData.date}</span> at <span className="text-primary font-medium">{successData.timeSlot}</span>.
                      <br />You'll receive a confirmation email shortly.
                    </motion.p>
                  </>
                ) : (
                  <>
                    <motion.h2 
                      className="text-3xl font-bold mb-3 text-gradient-blue-purple"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                    >
                      Message Sent
                    </motion.h2>
                    <motion.p 
                      className="text-xl text-muted-foreground mb-8"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      Thank you for reaching out. <br />
                      We'll get back to you as soon as possible.
                    </motion.p>
                  </>
                )}
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <Button 
                    onClick={resetForms}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg shadow-primary/20 relative overflow-hidden group"
                    size="lg"
                  >
                    <span className="relative z-10">
                      {formType === "meeting" ? "Schedule Another Meeting" : "Send Another Message"}
                    </span>
                    <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                  </Button>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <Card className="font-grotesk border-white/20 shadow-2xl bg-black/40 backdrop-blur-xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-transparent pointer-events-none"></div>
                  <div className="absolute -bottom-48 -right-48 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
                  <div className="absolute -top-48 -left-48 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
                  
                  <Tabs defaultValue="meeting" className="w-full" onValueChange={onTabChange}>
                    <TabsList className="w-full grid grid-cols-2 bg-black/40 p-1.5 mb-4">
                      <TabsTrigger 
                        value="meeting" 
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-md py-3 transition-all duration-300 font-medium"
                      >
                        Schedule a Meeting
                      </TabsTrigger>
                      <TabsTrigger 
                        value="message" 
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-md py-3 transition-all duration-300 font-medium"
                      >
                        Send a Message
                      </TabsTrigger>
                    </TabsList>
                    
                    <AnimatePresence mode="wait">
                      <TabsContent value="meeting" key="meeting">
                        <motion.div
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.3 }}
                        >
                          <CardHeader className="pb-4">
                            <CardTitle className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                              Schedule a Meeting
                            </CardTitle>
                            <CardDescription className="text-lg text-gray-300">
                              Book a time to speak with our AI experts about your project needs.
                            </CardDescription>
                          </CardHeader>
                          
                          <CardContent>
                            <AnimatePresence mode="wait">
                              {step === "details" && (
                                <motion.div 
                                  key="details"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0, x: -20 }}
                                  transition={{ duration: 0.4 }}
                                  className="space-y-6"
                                >
                                  <Form {...meetingForm}>
                                    <form onSubmit={meetingForm.handleSubmit(onMeetingDetailsSubmit)} className="space-y-6">
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                          control={meetingForm.control}
                                          name="name"
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel className="text-sm font-medium text-gray-200 pl-1">Full Name</FormLabel>
                                              <FormControl>
                                                <Input 
                                                  placeholder="Your name" 
                                                  {...field} 
                                                  className="h-12 font-grotesk"
                                                />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                        <FormField
                                          control={meetingForm.control}
                                          name="email"
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel className="text-sm font-medium text-gray-200 pl-1">Email</FormLabel>
                                              <FormControl>
                                                  <Input 
                                                    type="email" 
                                                    placeholder="Your email" 
                                                    {...field} 
                                                    className="h-12 font-grotesk"
                                                  />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                        <FormField
                                          control={meetingForm.control}
                                          name="company"
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel className="text-sm font-medium text-gray-200 pl-1">Company</FormLabel>
                                              <FormControl>
                                                  <Input 
                                                    placeholder="Your company" 
                                                    {...field} 
                                                    className="h-12 font-grotesk"
                                                  />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                        <FormField
                                          control={meetingForm.control}
                                          name="subject"
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel className="text-sm font-medium text-gray-200 pl-1">Meeting Topic</FormLabel>
                                              <FormControl>
                                                <Select 
                                                  onValueChange={field.onChange} 
                                                  defaultValue={field.value}
                                                >
                                                    <SelectTrigger className="h-12 font-grotesk">
                                                      <SelectValue placeholder="Select topic" />
                                                    </SelectTrigger>
                                                  <SelectContent className="font-grotesk bg-background/95 backdrop-blur-md border-white/10">
                                                    <SelectItem value="general">General Inquiry</SelectItem>
                                                    <SelectItem value="nova-rag">Nova RAG Solutions</SelectItem>
                                                    <SelectItem value="novaplay">NovaPlay Game Development</SelectItem>
                                                    <SelectItem value="novavoice">NovaVoice Technology</SelectItem>
                                                    <SelectItem value="ai-agents">AI Agents Framework</SelectItem>
                                                    <SelectItem value="tech-services">Technology Services</SelectItem>
                                                  </SelectContent>
                                                </Select>
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                        
                                        <FormField
                                          control={meetingForm.control}
                                          name="message"
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel className="text-sm font-medium text-gray-200 pl-1">Additional Information</FormLabel>
                                              <FormControl>
                                                  <Textarea 
                                                    placeholder="Tell us more about your project or inquiry" 
                                                    rows={4} 
                                                    {...field} 
                                                    className="resize-none font-grotesk"
                                                  />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                      </div>
                                      
                                      <motion.div 
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="relative mt-10"
                                      >
                                        <Button 
                                          type="submit" 
                                          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 h-14 mt-2 shadow-xl shadow-purple-500/20 relative overflow-hidden group rounded-xl font-medium text-lg"
                                        >
                                          <span className="relative z-10 flex items-center">
                                            Next: Choose Time Slot
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 group-hover:translate-x-1 transition-transform">
                                              <path d="M5 12h14"></path>
                                              <path d="m12 5 7 7-7 7"></path>
                                            </svg>
                                          </span>
                                          <span className="absolute inset-0 bg-white/20 translate-y-12 group-hover:translate-y-0 transition-transform duration-300"></span>
                                        </Button>
                                      </motion.div>
                                    </form>
                                  </Form>
                                </motion.div>
                              )}
                              {step === "calendar" && (
                                <motion.div 
                                  key="calendar"
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -20 }}
                                  transition={{ duration: 0.4 }}
                                  className="space-y-8"
                                >
                                  <div className="flex flex-col lg:flex-row gap-8">
                                    <motion.div 
                                      className="flex-1 bg-background/40 p-6 rounded-xl backdrop-blur-md border border-white/10 relative overflow-hidden"
                                      whileHover={{ scale: 1.01 }}
                                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                    >
                                      <h3 className="font-medium mb-4 text-gradient-blue-purple text-lg">
                                        Select a Date
                                      </h3>
                                      <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        disabled={(date) => {
                                          // Disable weekends and past dates
                                          const today = new Date();
                                          today.setHours(0, 0, 0, 0); // Ensure comparison is date-only
                                          return date < today || 
                                            date.getDay() === 0 || 
                                            date.getDay() === 6
                                        }}
                                      />
                                      <div className="absolute -bottom-24 -right-24 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-full blur-2xl"></div>
                                    </motion.div>
                                    
                                    <motion.div 
                                      className="flex-1 bg-background/40 p-6 rounded-xl backdrop-blur-md border border-white/10 relative overflow-hidden"
                                      whileHover={{ scale: 1.01 }}
                                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                    >
                                      <h3 className="font-medium mb-4 text-gradient-blue-purple text-lg">
                                        Available Time Slots {date && `for ${format(date, "PPP")}`}
                                      </h3>
                                      <div className="grid grid-cols-2 gap-2">
                                        {availableTimeSlots.map((slot, index) => (
                                          <motion.div
                                            key={slot}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05, duration: 0.3 }}
                                          >
                                            <Button
                                              key={slot}
                                              variant={timeSlot === slot ? "default" : "outline"}
                                              className={`justify-start border-white/10 w-full ${
                                                timeSlot === slot 
                                                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white" 
                                                  : "bg-background/30 hover:bg-background/50"
                                              }`}
                                              onClick={() => setTimeSlot(slot)}
                                            >
                                              {slot}
                                            </Button>
                                          </motion.div>
                                        ))}
                                      </div>
                                      <div className="absolute -bottom-24 -left-24 w-40 h-40 bg-gradient-to-br from-purple-600/10 to-blue-500/10 rounded-full blur-2xl"></div>
                                    </motion.div>
                                  </div>
                                  
                                  <div className="flex justify-between">
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                      <Button 
                                        variant="outline" 
                                        onClick={() => setStep("details")}
                                        className="border-white/10 bg-background/30 hover:bg-background/50 group"
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 group-hover:-translate-x-1 transition-transform">
                                          <path d="m15 18-6-6 6-6"/>
                                        </svg>
                                        Back
                                      </Button>
                                    </motion.div>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                      <Button 
                                        onClick={onMeetingSubmit}
                                        disabled={!date || !timeSlot}
                                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 px-8 shadow-lg shadow-primary/20 relative overflow-hidden group"
                                      >
                                        <span className="relative z-10">Schedule Meeting</span>
                                        <span className="absolute inset-0 bg-white/20 translate-y-12 group-hover:translate-y-0 transition-transform duration-300"></span>
                                      </Button>
                                    </motion.div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </CardContent>
                        </motion.div>
                      </TabsContent>
                      
                      <TabsContent value="message" key="message">
                        <motion.div
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.3 }}
                        >
                          <CardHeader className="pb-4">
                            <CardTitle className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                              Send a Message
                            </CardTitle>
                            <CardDescription className="text-lg text-gray-300">
                              Send us a message and we'll get back to you as soon as possible.
                            </CardDescription>
                          </CardHeader>
                          
                          <CardContent>
                            <Form {...messageForm}>
                              <form onSubmit={messageForm.handleSubmit(onMessageSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <FormField
                                    control={messageForm.control}
                                    name="name"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                          <Input
                                            placeholder="Your name"
                                            autoComplete="name"
                                            {...field}
                                            className="font-grotesk"
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={messageForm.control}
                                    name="email"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                          <Input
                                            type="email"
                                            placeholder="Your email"
                                            autoComplete="email"
                                            {...field}
                                            className="font-grotesk"
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={messageForm.control}
                                    name="subject"
                                    render={({ field }) => (
                                      <FormItem className="md:col-span-2">
                                        <FormLabel>Subject</FormLabel>
                                        <Select
                                          onValueChange={field.onChange}
                                          defaultValue={field.value}
                                        >
                                          <FormControl>
                                            <SelectTrigger className="font-grotesk">
                                              <SelectValue placeholder="Select a subject" />
                                            </SelectTrigger>
                                          </FormControl>
                                          <SelectContent className="font-grotesk">
                                            <SelectItem value="inquiry">
                                              General Inquiry
                                            </SelectItem>
                                            <SelectItem value="quote">
                                              Request a Quote
                                            </SelectItem>
                                            <SelectItem value="feedback">
                                              Feedback
                                            </SelectItem>
                                            <SelectItem value="other">
                                              Other
                                            </SelectItem>
                                          </SelectContent>
                                        </Select>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={messageForm.control}
                                    name="message"
                                    render={({ field }) => (
                                      <FormItem className="md:col-span-2">
                                        <FormLabel>Message</FormLabel>
                                        <FormControl>
                                          <Textarea
                                            placeholder="Your message..."
                                            className="min-h-32 resize-none font-grotesk"
                                            {...field}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <div className="md:col-span-2 flex justify-end mt-auto">
                                    <Button
                                      type="submit"
                                      className="w-full md:w-auto"
                                      disabled={
                                        messageForm.formState.isSubmitting ||
                                        !messageForm.formState.isValid
                                      }
                                    >
                                      {messageForm.formState.isSubmitting ? (
                                        <>
                                          <Spinner className="mr-2 h-4 w-4 animate-spin" />
                                          Sending...
                                        </>
                                      ) : (
                                        "Send Message"
                                      )}
                                    </Button>
                                  </div>
                              </form>
                            </Form>
                          </CardContent>
                        </motion.div>
                      </TabsContent>
                    </AnimatePresence>
                  </Tabs>
                  
                  <CardFooter className="flex justify-between border-t border-white/20 p-6">
                    <div className="text-xs text-gray-400">
                      Your data will be processed according to our Privacy Policy.
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative p-6 bg-card/60 backdrop-blur-md rounded-xl border border-white/10 shadow-xl overflow-hidden group"
              whileHover={{ y: -5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-primary/5 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500 group-hover:duration-200"></div>
              
              <motion.div 
                className="rounded-full bg-gradient-to-br from-blue-500/20 to-primary/20 w-14 h-14 flex items-center justify-center mb-6 relative"
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </motion.div>
              <h3 className="font-semibold text-xl mb-2 text-gradient-blue-purple">Contact Us</h3>
              <p className="text-muted-foreground mb-4">Have questions? Our team is here to help.</p>
              <motion.a 
                href="mailto:contact@gonova.com" 
                className="inline-flex items-center text-primary hover:text-blue-400 transition-colors"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                contact@gonova.com
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </motion.a>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative p-6 bg-card/60 backdrop-blur-md rounded-xl border border-white/10 shadow-xl overflow-hidden group"
              whileHover={{ y: -5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-primary/5 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500 group-hover:duration-200"></div>
              
              <motion.div 
                className="rounded-full bg-gradient-to-br from-blue-500/20 to-primary/20 w-14 h-14 flex items-center justify-center mb-6 relative"
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 16v-4"></path>
                  <path d="M12 8h.01"></path>
                </svg>
              </motion.div>
              <h3 className="font-semibold text-xl mb-2 text-gradient-blue-purple">Support</h3>
              <p className="text-muted-foreground mb-4">Need technical support or have questions about our products?</p>
              <motion.a 
                href="mailto:support@gonova.com" 
                className="inline-flex items-center text-primary hover:text-blue-400 transition-colors"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                support@gonova.com
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </motion.a>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="relative p-6 bg-card/60 backdrop-blur-md rounded-xl border border-white/10 shadow-xl overflow-hidden group"
              whileHover={{ y: -5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-primary/5 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500 group-hover:duration-200"></div>
              
              <motion.div 
                className="rounded-full bg-gradient-to-br from-blue-500/20 to-primary/20 w-14 h-14 flex items-center justify-center mb-6 relative"
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </motion.div>
              <h3 className="font-semibold text-xl mb-2 text-gradient-blue-purple">Location</h3>
              <p className="text-muted-foreground mb-4">Visit our headquarters</p>
              <address className="not-italic text-muted-foreground">
                123 AI Innovation Center<br />
                Silicon Valley, CA 94043<br />
                United States
              </address>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 