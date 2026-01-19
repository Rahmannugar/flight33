"use client"

import { useFrame, useThree } from "@react-three/fiber"
import { useEffect, useRef } from "react"
import { RoundedBox } from "@react-three/drei"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import * as THREE from "three"
import { appStore } from "@/lib/store/appStore"

function RotatingCube() {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.8
    }
  })

  return (
    <RoundedBox ref={meshRef} args={[2, 2, 2]} radius={0.15} smoothness={4}>
      <meshStandardMaterial
        color="#ffffff"
        metalness={0.9}
        roughness={0.1}
        envMapIntensity={1}
      />
    </RoundedBox>
  )
}

function SimpleCamera() {
  const { camera } = useThree()

  useEffect(() => {
    camera.position.set(0, 0, 5)
    camera.lookAt(0, 0, 0)
  }, [camera])

  return null
}

export function LoadingScene() {
  const finishBoot = appStore((s) => s.finishBoot)

  useEffect(() => {
    const t = setTimeout(() => {
      finishBoot()
    }, 4500)

    return () => clearTimeout(t)
  }, [finishBoot])

  return (
    <>
      <SimpleCamera />
      
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <directionalLight position={[-5, -5, -5]} intensity={0.5} />
      
      <RotatingCube />
      
      <EffectComposer>
        <Bloom
          intensity={0.5}
          luminanceThreshold={0.9}
          luminanceSmoothing={0.9}
        />
      </EffectComposer>
    </>
  )
}
