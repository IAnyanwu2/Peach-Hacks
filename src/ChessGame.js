import { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import Chessboard3D from './Chessboard3D'; // Import your 3D chessboard component
import { Canvas } from '@react-three/fiber';

function ChessGameApp() {
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [loading, setLoading] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

  // Fetch best move from the AI (backend or Stockfish API)
  const fetchBestMove = async (fen) => {
    try {
      const res = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fen, depth: 10 }), // send current FEN to the backend
      });

      const data = await res.json();
      return data.bestMove;
    } catch (err) {
      console.error('Error fetching best move:', err);
      return null;
    }
  };

  // Apply AI's move and update game state
  const makeAIMove = async () => {
    setLoading(true);
    const bestMove = await fetchBestMove(fen);
    if (bestMove) {
      const newGame = { ...game };
      newGame.move(bestMove);
      setGame(newGame);
      setFen(newGame.fen());
    }
    setLoading(false);
  };

  // Perform a move by the user
  const onPieceDrop = (newFen) => {
    const newGame = { ...game };
    newGame.load(newFen);
    setGame(newGame);
    setFen(newGame.fen());

    // Check if the game is over
    if (newGame.game_over()) {
      setGameOver(true);
      setWinner(newGame.turn() === 'w' ? 'Black' : 'White');
    } else {
      // Make AI move after the user move
      setTimeout(makeAIMove, 500);
    }
  };

  // Restart the game
  const restartGame = () => {
    setGame(new Chess());
    setFen(game.fen());
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

      {/* Render the 3D chessboard */}
      <Chessboard3D fen={fen} onPieceDrop={onPieceDrop} />

      {/* AI move button for testing (optional) */}
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