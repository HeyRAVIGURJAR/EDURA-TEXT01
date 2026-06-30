import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

export const StudyBuddyOrb = () => {
  const meshRef = useRef();
  const materialRef = useRef();
  
  // Track mouse position for interactive distortion
  const [hovered, setHovered] = useState(false);
  const targetScale = hovered ? 1.2 : 1;
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Smoothly animate scale on hover
    if (meshRef.current) {
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      
      // Rotate slowly over time
      meshRef.current.rotation.x = Math.sin(time / 4);
      meshRef.current.rotation.y = Math.cos(time / 4);
    }
    
    // Make distortion more aggressive when hovered
    if (materialRef.current) {
      materialRef.current.distort = THREE.MathUtils.lerp(
        materialRef.current.distort,
        hovered ? 0.6 : 0.4,
        0.1
      );
      materialRef.current.speed = THREE.MathUtils.lerp(
        materialRef.current.speed,
        hovered ? 5 : 2,
        0.1
      );
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        <sphereGeometry args={[1.5, 64, 64]} />
        <MeshDistortMaterial
          ref={materialRef}
          color="#8A2BE2"
          emissive="#06B6D4"
          emissiveIntensity={0.5}
          roughness={0.2}
          metalness={0.8}
          distort={0.4}
          speed={2}
          radius={1}
        />
      </mesh>
      
      {/* Floating particles around the orb */}
      <Sparkles
        count={50}
        scale={6}
        size={2}
        speed={0.4}
        opacity={0.5}
        color="#00BFFF"
      />
    </Float>
  );
};

export default StudyBuddyOrb;
