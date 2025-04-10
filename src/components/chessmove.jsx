import { useState } from 'react';

const getBestMove = async (useWasm) => {
  if (useWasm) {
    const stockfish = window.Stockfish(); // Assuming the WASM engine is globally available

    stockfish.postMessage('uci');
    stockfish.postMessage('isready');
    stockfish.onmessage = (event) => {
      const data = event.data;
      if (data.includes('bestmove')) {
        const move = data.split('bestmove ')[1].split(' ')[0];
        console.log('WASM Best Move:', move);
      }
    };

    stockfish.postMessage('position fen rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1');
    stockfish.postMessage('go depth 10');
  } else {
    const res = await fetch('http://localhost:5000/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
        depth: 10,
      }),
    });

    const data = await res.json();
    console.log('Node.js Best Move:', data.bestMove);
  }
};

const ChessMoveFetcher = () => {
  const [useWasm, setUseWasm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGetBestMove = () => {
    setLoading(true);
    getBestMove(useWasm)
      .then(() => setLoading(false))
      .catch((err) => {
        console.error('Error getting move:', err);
        setLoading(false);
      });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Chess AI</h1>
      <div>
        <label>
          Use WASM Stockfish?
          <input
            type="checkbox"
            checked={useWasm}
            onChange={() => setUseWasm((prev) => !prev)}
          />
        </label>
      </div>
      <button
        onClick={handleGetBestMove}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 mt-4 rounded"
      >
        {loading ? 'Loading...' : 'Get Best Move'}
      </button>
    </div>
  );
};

export default ChessMoveFetcher;