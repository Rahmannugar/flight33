"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { Suspense, useState, useEffect, useRef } from "react"
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion"
import { LoadingScene } from "../canvas/LoadingScene"

function ParallaxText() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const springConfig = { damping: 25, stiffness: 150 }
  const x = useSpring(mouseX, springConfig)
  const y = useSpring(mouseY, springConfig)
  
  const flightX = useTransform(x, [-1, 1], [-20, 20])
  const flightY = useTransform(y, [-1, 1], [-15, 15])
  const flightRotateY = useTransform(x, [-1, 1], [-5, 5])
  const flightRotateX = useTransform(y, [-1, 1], [5, -5])
  
  const numberX = useTransform(x, [-1, 1], [25, -25])
  const numberY = useTransform(y, [-1, 1], [20, -20])
  const numberRotateY = useTransform(x, [-1, 1], [8, -8])
  const numberRotateX = useTransform(y, [-1, 1], [-8, 8])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      
      mouseX.set((e.clientX - centerX) / centerX)
      mouseY.set((e.clientY - centerY) / centerY)
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <div 
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
      style={{ perspective: '1000px' }}
    >
      <div className="flex items-baseline text-6xl md:text-8xl font-bold tracking-tight">
        <motion.span 
          style={{ 
            x: flightX, 
            y: flightY,
            rotateY: flightRotateY,
            rotateX: flightRotateX,
            textShadow: '0 4px 8px rgba(0,0,0,0.3), 0 8px 16px rgba(0,0,0,0.2), 0 16px 32px rgba(0,0,0,0.1)'
          }}
          initial={{ opacity: 0, x: -100, rotateY: -20 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="text-white"
        >
          Flight
        </motion.span>
        <motion.span 
          style={{ 
            x: numberX, 
            y: numberY,
            rotateY: numberRotateY,
            rotateX: numberRotateX,
            textShadow: '0 4px 8px rgba(34,211,238,0.3), 0 8px 16px rgba(34,211,238,0.2), 0 16px 32px rgba(34,211,238,0.1)'
          }}
          initial={{ opacity: 0, x: 100, rotateY: 20 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
          className="text-cyan-400"
        >
          33
        </motion.span>
      </div>
    </div>
  )
}

export function LoadingScreen() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const duration = 4000
    const startTime = Date.now()
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const newProgress = Math.min(100, (elapsed / duration) * 100)
      setProgress(newProgress)
      
      if (newProgress >= 100) {
        clearInterval(interval)
      }
    }, 50)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 z-[9999] bg-[#050505]">
      <ParallaxText />
      
      <div className="absolute bottom-8 left-1/2 z-20 w-[90%] max-w-md -translate-x-1/2">
        <div className="mb-3 flex items-center justify-end text-sm font-medium tracking-wider">
          <span className="text-slate-300">{Math.floor(progress)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-800/50 backdrop-blur-sm">
          <div
            className="h-full rounded-full bg-gradient-to-r from-slate-200 to-white transition-all duration-100 ease-out"
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>
      </div>
      
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 60 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
      >
        <color attach="background" args={["#050505"]} />
        <Suspense fallback={null}>
          <LoadingScene />
        </Suspense>
      </Canvas>
    </div>
  )
}
