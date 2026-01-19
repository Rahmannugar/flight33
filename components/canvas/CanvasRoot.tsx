"use client"

import { Canvas } from "@react-three/fiber"
import { Suspense, useEffect, useState } from "react"

export function CanvasRoot({ children }: { children?: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#0a0a0a"]} />
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
    </div>
  )
}
