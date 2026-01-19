"use client"

import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  
  uniform float uTime;
  uniform float uSpeed;
  uniform float uAmplitude;
  uniform vec2 uMouse;

  // Simplex 2D noise
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vUv = uv;
    
    vec3 pos = position;
    
    float noiseFreq = 3.5;
    float noiseAmp = uAmplitude; 
    vec3 noisePos = vec3(pos.x * noiseFreq + uTime * uSpeed, pos.y * noiseFreq + uTime * uSpeed, pos.z);
    
    float n = snoise(pos.xy * 2.0 + vec2(uTime * uSpeed * 0.5));
    
    // Distort Z based on noise
    pos.z += n * noiseAmp;
    
    // Add mouse interaction
    float dist = distance(uv, uMouse);
    float mouseEffect = smoothstep(0.5, 0.0, dist) * 0.2;
    pos.z += mouseEffect;

    vPosition = pos;
    vNormal = normal;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const fragmentShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;

  uniform vec3 uColor;
  uniform float uTime;
  
  void main() {
    // Reconstruct normal from derivatives for sharp edges look
    vec3 dx = dFdx(vPosition);
    vec3 dy = dFdy(vPosition);
    vec3 normal = normalize(cross(dx, dy));

    vec3 lightDir = normalize(vec3(0.5, 0.5, 1.0));
    float diff = max(dot(normal, lightDir), 0.0);
    
    vec3 viewDir = normalize(vec3(0.0, 0.0, 1.0) - vPosition);
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
    
    // Iridescence / Chrome effect
    float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 2.0);
    
    vec3 color = uColor * (0.2 + 0.8 * diff);
    color += vec3(0.8) * spec;
    color += uColor * fresnel * 0.5;
    
    // Tone mappingish
    gl_FragColor = vec4(color, 1.0);
  }
`

interface LiquidChromeProps {
  baseColor?: [number, number, number]
  speed?: number
  amplitude?: number
  interactive?: boolean
}

const ChromeMesh: React.FC<LiquidChromeProps> = ({ baseColor = [0.1, 0.1, 0.1], speed = 0.5, amplitude = 0.5, interactive = false }) => {
  const meshRef = useRef<THREE.Mesh>(null)
  
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(...baseColor) },
      uSpeed: { value: speed },
      uAmplitude: { value: amplitude },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) }
    }),
    [baseColor, speed, amplitude]
  )

  useFrame((state) => {
    if (meshRef.current) {
        // @ts-ignore
      meshRef.current.material.uniforms.uTime.value = state.clock.getElapsedTime()
      // @ts-ignore
      meshRef.current.material.uniforms.uColor.value.setRGB(...baseColor)
      // @ts-ignore
      meshRef.current.material.uniforms.uSpeed.value = speed
       // @ts-ignore
      meshRef.current.material.uniforms.uAmplitude.value = amplitude
      
      if (interactive) {
          const { x, y } = state.pointer
           // @ts-ignore
          meshRef.current.material.uniforms.uMouse.value.set(x * 0.5 + 0.5, y * 0.5 + 0.5)
      }
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <planeGeometry args={[2, 2, 128, 128]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

export default function LiquidChrome(props: LiquidChromeProps) {
  return (
    <Canvas camera={{ position: [0, 0, 1] }} dpr={[1, 2]}>
      <ChromeMesh {...props} />
    </Canvas>
  )
}
