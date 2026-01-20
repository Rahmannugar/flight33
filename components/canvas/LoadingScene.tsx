"use client"

import { useFrame, useThree } from "@react-three/fiber"
import { useEffect, useRef, useMemo } from "react"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import * as THREE from "three"
import { appStore } from "@/lib/store/appStore"

interface Particle {
  x: number
  y: number
  z: number
  speed: number
  color: THREE.Color
}

function WarpTunnel() {
  const count = 400
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const lightRef = useRef<THREE.Group>(null!)
  
  const particles = useMemo(() => {
    const temp: Particle[] = []
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2
        const radius = 2 + Math.random() * 15
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius
        const z = (Math.random() - 0.5) * 100
        const speed = Math.random() * 0.5 + 0.2
        const color = Math.random() > 0.5 ? new THREE.Color("#06b6d4") : new THREE.Color("#ffffff")
        temp.push({ x, y, z, speed, color })
    }
    return temp
  }, [])

  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame((state) => {
    particles.forEach((p, i) => {
        p.z += p.speed * 2 
        
        if (p.z > 20) p.z = -80

        dummy.position.set(p.x, p.y, p.z)
        
        dummy.scale.z = p.speed * 50
        dummy.scale.x = 0.05
        dummy.scale.y = 0.05
        
        dummy.updateMatrix()
        meshRef.current.setMatrixAt(i, dummy.matrix)
        meshRef.current.setColorAt(i, p.color)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true
    
    if (lightRef.current) {
        lightRef.current.rotation.z = state.clock.elapsedTime * 0.1
    }
  })

  return (
    <group ref={lightRef}> 
       <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
         <boxGeometry args={[1, 1, 1]} />
         <meshBasicMaterial toneMapped={false} />
       </instancedMesh>
    </group>
  )
}

function SimpleCamera() {
  const { camera } = useThree()

  useEffect(() => {
    camera.position.set(0, 0, 10)
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
      
      <color attach="background" args={["#000000"]} />
      <fog attach="fog" args={["#000000", 5, 50]} /> 

      <WarpTunnel />
      
      <EffectComposer>
        <Bloom
          intensity={2}
          luminanceThreshold={0.1} 
          luminanceSmoothing={0.9}
        />
      </EffectComposer>
    </>
  )
}
