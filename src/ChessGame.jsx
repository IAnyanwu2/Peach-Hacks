import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Chess } from 'chess.js';
import Chessboard3D from './components/Chessboard3D';

function ChessGameApp() {
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [loading, setLoading] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

  const fetchBestMove = async (fen) => {
    try {
      const res = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fen, depth: 10 }),
      });

      const data = await res.json();
      return data.bestMove;
    } catch (err) {
      console.error('Error fetching best move:', err);
      return null;
    }
  };

  const makeAIMove = async () => {
    setLoading(true);
    const bestMove = await fetchBestMove(fen);
    if (bestMove) {
      const newGame = new Chess(game.fen()); // Safer clone
      newGame.move(bestMove);
      setGame(newGame);
      setFen(newGame.fen());
    }
    setLoading(false);
  };

  const onPieceDrop = (newFen) => {
    const newGame = new Chess();
    newGame.load(newFen);
    setGame(newGame);
    setFen(newGame.fen());

    if (newGame.game_over()) {
      setGameOver(true);
      setWinner(newGame.turn() === 'w' ? 'Black' : 'White');
    } else {
      setTimeout(makeAIMove, 500);
    }
  };

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

      <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />
        <Chessboard3D fen={fen} onPieceDrop={onPieceDrop} />
        <OrbitControls />
      </Canvas>

      <button
        onClick={makeAIMove}
        disabled={loading || gameOver}
        className="ai-move-btn"
      >
        {loading ? 'AI is thinking...' : 'Make AI Move'}
      </button>
    </div>
  );
}

export default ChessGameApp;