"use client"

import { Canvas } from "@react-three/fiber"
import { Suspense } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useFrame, useThree } from "@react-three/fiber"
import { useRef } from "react"
import { RoundedBox } from "@react-three/drei"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import * as THREE from "three"

function FloatingCube() {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.8
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.2
    }
  })

  return (
    <RoundedBox ref={meshRef} args={[2, 2, 2]} radius={0.15} smoothness={4}>
      <meshStandardMaterial
        color="#ef4444"
        metalness={0.9}
        roughness={0.1}
      />
    </RoundedBox>
  )
}

function SimpleCamera() {
  const { camera } = useThree()
  
  useFrame((state) => {
    camera.position.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.3
    camera.position.y = Math.cos(state.clock.elapsedTime * 0.08) * 0.2
    camera.lookAt(0, 0, 0)
  })

  return null
}

function NotFoundScene() {
  return (
    <>
      <SimpleCamera />
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <directionalLight position={[-5, -5, -5]} intensity={0.5} />
      <FloatingCube />
      <EffectComposer>
        <Bloom intensity={0.5} luminanceThreshold={0.9} luminanceSmoothing={0.9} />
      </EffectComposer>
    </>
  )
}

export default function NotFound() {
  return (
    <div className="fixed inset-0 bg-[#050505] z-[999999] flex">
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 60 }}
          gl={{ antialias: true, alpha: false }}
          dpr={[1, 2]}
        >
          <color attach="background" args={["#050505"]} />
          <Suspense fallback={null}>
            <NotFoundScene />
          </Suspense>
        </Canvas>
      </div>
      
      <div className="relative z-10 flex flex-col items-center justify-center w-full pointer-events-none">
        <motion.h1 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-8xl font-bold text-white mb-2"
        >
          404
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-slate-400 text-lg mb-8"
        >
          Page not found
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link 
            href="/" 
            className="pointer-events-auto px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-slate-200 transition-colors"
          >
            Go Home
          </Link>
        </motion.div>
      </div>
    </div>
  )
}