"use client"

import * as React from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu, X, ChevronRight } from "lucide-react"

const solutions = [
  {
    title: "Nova RAG",
    href: "/solutions/nova-rag",
    description: "Customized retrieval-augmented generation for organizations with fast, deep research capabilities."
  },
  {
    title: "NovaPlay",
    href: "/solutions/novaplay",
    description: "Game studio specializing in AI-integrated game development for next-generation interactive experiences."
  },
  {
    title: "NovaVoice",
    href: "/solutions/nova-voice",
    description: "Complete voice studio offering TTS, speech-to-text, and interactive speech solutions."
  },
  {
    title: "Generative AI",
    href: "/solutions/generative-ai",
    description: "Custom generative AI solutions designed to transform your business operations and customer experiences."
  },
  {
    title: "AI Agents Framework",
    href: "/solutions/ai-agents",
    description: "State-of-the-art AI agent frameworks for computer use and advanced tool manipulation."
  },
  {
    title: "Technology Services",
    href: "/solutions/tech-services",
    description: "Comprehensive technology services to complement our AI solutions."
  },
]

const resources = [
  {
    title: "Blog",
    href: "/blog",
    description: "Industry insights, technology updates, and Nova Labs news."
  },
  {
    title: "Case Studies",
    href: "/case-studies",
    description: "Real-world examples of how our technology drives business success."
  },
  {
    title: "Documentation",
    href: "/docs",
    description: "Comprehensive guides and API references for developers."
  },
  {
    title: "Research Papers",
    href: "/research",
    description: "Our latest research contributions to the field of AI and technology."
  },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [solutionsOpen, setSolutionsOpen] = React.useState(false)
  const [resourcesOpen, setResourcesOpen] = React.useState(false)

  // Close mobile menu when window is resized to larger screen
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Prevent scrolling when mobile menu is open
  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
      // Auto-expand solution and resource sections when mobile menu opens
      setSolutionsOpen(true)
      setResourcesOpen(true)
    } else {
      document.body.style.overflow = 'unset'
      // Close the sections when mobile menu closes
      setSolutionsOpen(false)
      setResourcesOpen(false)
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="container flex h-16 max-w-7xl px-4 mx-auto items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <motion.div 
              className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-700"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            />
            <span className="font-bold text-xl inline-block">Nova Labs</span>
          </Link>
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {solutions.map((solution) => (
                      <ListItem
                        key={solution.title}
                        title={solution.title}
                        href={solution.href}
                      >
                        {solution.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {resources.map((resource) => (
                      <ListItem
                        key={resource.title}
                        title={resource.title}
                        href={resource.href}
                      >
                        {resource.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/about" legacyBehavior passHref>
                  <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                    About
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/contact" legacyBehavior passHref>
                  <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                    Contact
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 rounded-md hover:bg-background/30 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Button asChild size="lg" className="hidden md:flex">
            <Link href="/get-started">Get Started</Link>
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="fixed inset-0 z-50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Backdrop */}
            <motion.div 
              className="absolute inset-0 bg-background/70 backdrop-blur-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Menu panel */}
            <motion.div 
              className="absolute top-0 right-0 w-full max-w-sm h-screen bg-background/95 backdrop-blur-sm border-l border-border/50 shadow-2xl flex flex-col overflow-y-auto"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="p-6 flex items-center justify-between border-b border-border/30">
                <div className="flex items-center space-x-2">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-700" />
                  <span className="font-bold text-lg">Nova Labs</span>
                </div>
                <button 
                  className="p-2 rounded-full hover:bg-accent/50 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>
              
              <nav className="flex-1 px-6 py-8 space-y-8">
                {/* Solutions */}
                <div className="space-y-5">
                  <button 
                    className="flex items-center justify-between w-full text-left font-medium text-base"
                    onClick={() => setSolutionsOpen(!solutionsOpen)}
                  >
                    <span>Solutions</span>
                    <ChevronRight 
                      size={18} 
                      className={`transition-transform duration-300 ${solutionsOpen ? 'rotate-90' : ''}`}
                    />
                  </button>
                  
                  <AnimatePresence>
                    {solutionsOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <ul className="pl-4 space-y-4 py-2 border-l-2 border-blue-500/20">
                          {solutions.map((item) => (
                            <motion.li 
                              key={item.title}
                              initial={{ x: -10, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.1 }}
                            >
                              <Link 
                                href={item.href}
                                className="block py-1 text-muted-foreground hover:text-foreground transition-colors text-sm"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {item.title}
                              </Link>
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Resources */}
                <div className="space-y-5">
                  <button 
                    className="flex items-center justify-between w-full text-left font-medium text-base"
                    onClick={() => setResourcesOpen(!resourcesOpen)}
                  >
                    <span>Resources</span>
                    <ChevronRight 
                      size={18} 
                      className={`transition-transform duration-300 ${resourcesOpen ? 'rotate-90' : ''}`}
                    />
                  </button>
                  
                  <AnimatePresence>
                    {resourcesOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <ul className="pl-4 space-y-4 py-2 border-l-2 border-purple-500/20">
                          {resources.map((item) => (
                            <motion.li 
                              key={item.title}
                              initial={{ x: -10, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.1 }}
                            >
                              <Link 
                                href={item.href}
                                className="block py-1 text-muted-foreground hover:text-foreground transition-colors text-sm"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {item.title}
                              </Link>
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Direct links */}
                <div className="space-y-5 py-2">
                  <Link 
                    href="/about"
                    className="block font-medium hover:text-blue-500 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Link 
                    href="/contact"
                    className="block font-medium hover:text-blue-500 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Contact
                  </Link>
                </div>
              </nav>
              
              <div className="p-6 border-t border-border/30">
                <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white" size="lg">
                  <Link href="/get-started" onClick={() => setMobileMenuOpen(false)}>
                    Get Started
                  </Link>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
