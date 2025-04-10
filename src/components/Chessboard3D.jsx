import { useRef, useEffect } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const Chessboard3D = ({ fen, onPieceDrop }) => {
  const gltf = useLoader(GLTFLoader, '/chessboard/chess_board.glb'); // Your GLB file path
  const chessboardRef = useRef();

  useEffect(() => {
    // You can update the chessboard based on the FEN if necessary
    // Example: Translate pieces based on FEN, animate, etc.
  }, [fen]);

  return (
    <mesh ref={chessboardRef}>
      <primitive object={gltf.scene} />
    </mesh>
  );
};

export default Chessboard3D;