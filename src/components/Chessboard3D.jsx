import { useRef, useEffect } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const Chessboard3D = ({ fen }) => {
  const gltf = useLoader(GLTFLoader, '/chess_board.glb'); // Path to model in public/
  const chessboardRef = useRef();

  useEffect(() => {
    // Optional: Update 3D scene based on new FEN here
  }, [fen]);

  return (
    <group ref={chessboardRef}>
      <primitive object={gltf.scene} />
    </group>
  );
};

export default Chessboard3D;