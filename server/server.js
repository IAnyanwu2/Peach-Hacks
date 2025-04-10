const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
const port = 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Route to handle AI move requests
app.post('/api/analyze', (req, res) => {
  const { fen, depth } = req.body;

  // Path to Stockfish executable (change it if necessary)
  const enginePath = path.join('C:', 'Users', 'Ikean', 'peach-hack', 'engine', 'stockfish-windows-x86-64-avx2.exe');  console.log('Starting Stockfish at:', enginePath);
  const stockfish = spawn(enginePath);

  let bestMove = '';

  // Listen for data from Stockfish
  stockfish.stdout.on('data', (data) => {
    const output = data.toString();
    console.log(output); // Log output for debugging

    // Extract the best move from Stockfish's output
    if (output.includes('bestmove')) {
      bestMove = output.split('bestmove ')[1].split(' ')[0];
      stockfish.kill(); // Stop Stockfish once we get the best move
      return res.json({ bestMove }); // Send the best move as response
    }
  });

  // Error handling if Stockfish fails to start
  stockfish.on('error', (err) => {
    console.error('Error starting Stockfish:', err);
    res.status(500).json({ error: 'Error starting Stockfish' });
  });

  // Send Stockfish commands
  stockfish.stdin.write('uci\n'); // Initialize Stockfish
  stockfish.stdin.write('isready\n'); // Check if it's ready
  stockfish.stdin.write(`position fen ${fen}\n`); // Set the position based on FEN
  stockfish.stdin.write(`go depth ${depth || 10}\n`); // Start the analysis to a specific depth (default: 10)
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});