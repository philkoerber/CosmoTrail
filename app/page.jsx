'use client'

import { Environment, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import dynamic from 'next/dynamic'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'

const View = dynamic(() => import('@/components/canvas/View').then((mod) => mod.View), {
  ssr: false,
  loading: () => (
    <div className='flex h-96 w-full flex-col items-center justify-center'>
      <svg className='-ml-1 mr-3 h-5 w-5 animate-spin text-black' fill='none' viewBox='0 0 24 24'>
        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
        <path
          className='opacity-75'
          fill='currentColor'
          d='M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
        />
      </svg>
    </div>
  ),
})

const Galaxy = () => {
  const map = useTexture('/texture.jpg')
  return (
    <mesh>
      <sphereGeometry args={[200, 32, 32]} />
      <meshStandardMaterial map={map} side={THREE.BackSide} />
    </mesh>
  )
}

const Sun = () => {
  return (
    <>
      <pointLight position={[0, 0, 0]} intensity={5} distance={100} color='#FFFF00' />
      <mesh>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial emissive='#FFFF00' emissiveIntensity={2} />
      </mesh>
    </>
  )
}

const Planet = ({ distance, velocity }) => {
  console.log(distance, velocity)
  const planetRef = useRef()
  const center = new THREE.Vector3(0, 0, 0)
  let angle = 0

  useFrame((state, delta) => {
    angle += delta * velocity * 2

    const radius = distance * 2
    const newPosition = new THREE.Vector3(
      center.x + radius * Math.cos(angle),
      planetRef.current.position.y,
      center.z + radius * Math.sin(angle),
    )

    planetRef.current.position.copy(newPosition)
  })

  return (
    <mesh position={[distance, 0, 0]} scale={0.6} ref={planetRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial />
    </mesh>
  )
}

const AmbientLight = () => {
  return (
    <Environment
      preset='night'
      background={false} // Disable the default background
      // Adjust lighting and reflection properties
      lighting={{
        ambientIntensity: 2,
        directIntensity: 1,
        shadowSize: 0.2,
        shadowBias: -0.001,
      }}
      // Adjust the sky properties
      sky={{
        turbidity: 0.8,
        rayleigh: 1,
        mieCoefficient: 0.005,
        mieDirectionalG: 0.8,
        inclination: 0.49, // Adjust the angle to control the horizon
        azimuth: 0.25, // Adjust the angle to control the direction of light
      }}
    />
  )
}

export default function Page() {
  return (
    <>
      <div className='relative'>
        <View orbit className='relative h-screen w-screen bg-slate-900'>
          <AmbientLight />
          <Galaxy />
          <Sun />
          <Planet distance={15} velocity={0.08} />
          <Planet distance={7} velocity={0.06} />
          <Planet distance={10} velocity={0.02} />
          <Planet distance={12} velocity={0.05} />
        </View>
      </div>
    </>
  )
}
