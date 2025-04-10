import { useState } from 'react';

const ChessMoveApp = ({ onMove, fen }) => {  // Accept fen as a prop
  const [bestMove, setBestMove] = useState(null);
  const [loading, setLoading] = useState(false);

  const validateAndFetchBestMove = async () => {
    // Check if FEN is provided
    if (!fen) {
      console.error('FEN is required');
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
          fen: fen,  // Send the current FEN as a prop
          depth: 10, // Depth for analysis (can be dynamic)
        }),
      });

      const data = await res.json();
      setBestMove(data.bestMove); // Set the best move from the response
      onMove(data.bestMove);  // Call onMove callback to update the parent component's state
    } catch (error) {
      console.error('Error fetching best move:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      {/* Removed the duplicate heading here */}
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
