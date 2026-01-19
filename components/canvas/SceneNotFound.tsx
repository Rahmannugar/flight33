"use client"

import { useFrame, useThree } from "@react-three/fiber"
import { useRef } from "react"
import { RoundedBox } from "@react-three/drei"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import * as THREE from "three"

function FloatingShapes() {
  const group1 = useRef<THREE.Mesh>(null!)
  const group2 = useRef<THREE.Mesh>(null!)
  const group3 = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    
    if (group1.current) {
      group1.current.position.y = Math.sin(t * 0.8) * 0.3
      group1.current.rotation.x = t * 0.3
      group1.current.rotation.y = t * 0.5
    }
    if (group2.current) {
      group2.current.position.y = Math.sin(t * 0.6 + 1) * 0.4
      group2.current.rotation.x = t * 0.4
      group2.current.rotation.z = t * 0.3
    }
    if (group3.current) {
      group3.current.position.y = Math.sin(t * 0.7 + 2) * 0.35
      group3.current.rotation.y = t * 0.6
      group3.current.rotation.z = t * 0.2
    }
  })

  return (
    <>
      <RoundedBox ref={group1} args={[0.8, 0.8, 0.8]} radius={0.1} position={[-2.5, 0, -1]}>
        <meshStandardMaterial color="#22d3ee" metalness={0.9} roughness={0.1} />
      </RoundedBox>
      
      <RoundedBox ref={group2} args={[1, 1, 1]} radius={0.1} position={[0, 0, 0]}>
        <meshStandardMaterial color="#ffffff" metalness={0.9} roughness={0.1} />
      </RoundedBox>
      
      <RoundedBox ref={group3} args={[0.6, 0.6, 0.6]} radius={0.08} position={[2.5, 0.2, -0.5]}>
        <meshStandardMaterial color="#22d3ee" metalness={0.9} roughness={0.1} />
      </RoundedBox>
    </>
  )
}

function SimpleCamera() {
  const { camera } = useThree()
  
  useFrame((state) => {
    const t = state.clock.elapsedTime
    camera.position.x = Math.sin(t * 0.1) * 0.5
    camera.position.y = Math.cos(t * 0.08) * 0.3
    camera.lookAt(0, 0, 0)
  })

  return null
}

export function SceneNotFound() {
  return (
    <>
      <SimpleCamera />
      
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <directionalLight position={[-5, -5, -5]} intensity={0.5} />
      
      <FloatingShapes />
      
      <EffectComposer>
        <Bloom
          intensity={0.5}
          luminanceThreshold={0.8}
          luminanceSmoothing={0.9}
        />
      </EffectComposer>
    </>
  )
}
