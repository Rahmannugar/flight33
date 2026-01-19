"use client"

import { Canvas } from "@react-three/fiber"
import { Stars } from "@react-three/drei"
import { Suspense } from "react"

export function FlightsBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
       <Canvas camera={{ position: [0, 0, 1] }}>
           <Suspense fallback={null}>
               <Stars 
                  radius={100} 
                  depth={50} 
                  count={5000} 
                  factor={4} 
                  saturation={0} 
                  fade 
                  speed={1} 
                />
           </Suspense>
       </Canvas>
    </div>
  )
}
