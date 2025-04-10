import { Canvas } from '@react-three/fiber';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import React from 'react';

const Chessboard3D = () => {
  const gltf = useLoader(GLTFLoader, '/chess_board.glb');
  return (
    <primitive object={gltf.scene} scale={0.5} position={[0, 0, 0]} />
  );
};

export default function App() {
  return (
    <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 5, 5]} />
      <Chessboard3D />
    </Canvas>
  );
}