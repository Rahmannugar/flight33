"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { Float, Stars, Sphere } from "@react-three/drei"
import * as THREE from "three"

function Particles({ count = 2000 }) {
  const mesh = useRef<THREE.Points>(null!)
  
  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = THREE.MathUtils.randFloatSpread(360) 
      const phi = THREE.MathUtils.randFloatSpread(360) 

      const x = 20 * Math.sin(theta) * Math.cos(phi)
      const y = 20 * Math.sin(theta) * Math.sin(phi)
      const z = 20 * Math.cos(theta)
      
      temp[i * 3] = x
      temp[i * 3 + 1] = y
      temp[i * 3 + 2] = z
    }
    return temp
  }, [count])

  useFrame((state, delta) => {
    mesh.current.rotation.x -= delta / 10
    mesh.current.rotation.y -= delta / 15
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#5EB1EF"
        sizeAttenuation={true}
        transparent
        opacity={0.8}
      />
    </points>
  )
}

function FloatingGlobe() {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <Sphere args={[2, 64, 64]} scale={1}>
            <meshStandardMaterial
                color="#1e293b"
                roughness={0.7}
                metalness={0.5}
                wireframe
                transparent
                opacity={0.3}
            />
        </Sphere>
        <Sphere args={[1.98, 64, 64]} scale={1}>
             <meshStandardMaterial
                color="#000000"
            />
        </Sphere>
    </Float>
  )
}

export function HeroScene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <Particles />
      <FloatingGlobe />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
    </>
  )
}
