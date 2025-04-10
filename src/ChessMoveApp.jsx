import { useState } from 'react';
import { Chess } from 'chess.js';

const chess = new Chess();

const ChessMoveApp = () => {
  const [fen, setFen] = useState(chess.fen()); // Use chess.js FEN
  const [bestMove, setBestMove] = useState(null);
  const [loading, setLoading] = useState(false);

  const validateAndFetchBestMove = async () => {
    // Use chess.js to validate the position or move
    if (!chess.validate_fen(fen)) {
      console.error('Invalid FEN');
      return;
    }

    setLoading(true);
    try {
      // Fetch the best move from the backend API
      const res = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fen: fen,  // Send current FEN
          depth: 10, // Depth for analysis (can be dynamic)
        }),
      });

      const data = await res.json();
      setBestMove(data.bestMove); // Set the best move from the response
    } catch (error) {
      console.error('Error fetching best move:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Chess AI - Best Move</h1>

      <div>
        <label>
          FEN Position:
          <input
            type="text"
            value={fen}
            onChange={(e) => setFen(e.target.value)}
            className="p-2 border rounded"
          />
        </label>
      </div>

      <button
        onClick={validateAndFetchBestMove}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 mt-4 rounded"
      >
        {loading ? 'Loading...' : 'Get Best Move'}
      </button>

      {bestMove && (
        <div className="mt-4">
          <strong>Best Move:</strong> {bestMove}
        </div>
      )}
    </div>
  );
};

export default ChessMoveApp;
