import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Chess } from 'chess.js';
import Chessboard3D from './components/Chessboard3D';
import ChessMoveApp from './ChessMoveApp'; // Import ChessMoveApp

function ChessGameApp() {
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

  // Update the game state with the best move
  const handleMove = (bestMove) => {
    const newGame = new Chess(game.fen()); // Clone current game state
    newGame.move(bestMove);
    setGame(newGame);
    setFen(newGame.fen());

    if (newGame.game_over()) {
      setGameOver(true);
      setWinner(newGame.turn() === 'w' ? 'Black' : 'White');
    }
  };

  // Handle piece drop
  const onPieceDrop = (newFen) => {
    const newGame = new Chess();
    newGame.load(newFen);
    setGame(newGame);
    setFen(newGame.fen());

    if (newGame.game_over()) {
      setGameOver(true);
      setWinner(newGame.turn() === 'w' ? 'Black' : 'White');
    }
  };

  // Restart the game
  const restartGame = () => {
    const freshGame = new Chess();
    setGame(freshGame);
    setFen(freshGame.fen());
    setGameOver(false);
    setWinner(null);
  };

  return (
    <div className="app">
      <div className="game-info">
        <h1>Chess AI Game</h1>
        {gameOver && (
          <div>
            <p>Game Over</p>
            <p>Winner: {winner}</p>
            <button onClick={restartGame}>Restart</button>
          </div>
        )}
      </div>
      
      {/* Render the 3D Chessboard */}
      <Canvas camera={{ position: [0, 8, 31.8], fov: 60, near: 1, far: 60 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />
        <Chessboard3D fen={fen} onPieceDrop={onPieceDrop} />
      </Canvas>
      
      {/* Render ChessMoveApp (No need for an additional h1 here) */}
      <ChessMoveApp fen={fen} onMove={handleMove} />
    </div>
  );
}

export default ChessGameApp;  