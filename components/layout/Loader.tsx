"use client"

import { Canvas } from "@react-three/fiber"
import { Suspense, useState, useEffect } from "react"
import { LoadingScene } from "../canvas/LoadingScene"

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
