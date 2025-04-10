import { useRef, useEffect, useState } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const Chessboard3D = ({ fen }) => {
  const gltf = useLoader(GLTFLoader, '/chess_board.glb'); // Your GLB file path
  const chessboardRef = useRef();

  useEffect(() => {
    // You might want to manipulate the pieces based on the new FEN here if needed.
    // If the pieces are part of the GLB and correctly positioned, you may not need any additional logic.
  }, [fen]);

  return (
    <mesh ref={chessboardRef}>
      <primitive object={gltf.scene} />
    </mesh>
  );
};

export default Chessboard3D;