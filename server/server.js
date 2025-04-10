const express = require('express');
const cors = require('cors');
const path = require('path');
const { spawn } = require('child_process');
const { createTournament, addParticipant, startTournament } = require('./tournapi');
require('dotenv').config();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running!');
});

// Stockfish Analysis
app.post('/api/analyze', (req, res) => {
  const { fen, depth } = req.body;

  const enginePath = path.join(
    'C:',
    'Users',
    'Ikean',
    'peach-hack',
    'engine',
    'stockfish-windows-x86-64-avx2.exe'
  );

  console.log('Starting Stockfish at:', enginePath);

  const stockfish = spawn(enginePath);
  let bestMove = '';

  stockfish.stdout.on('data', (data) => {
    const output = data.toString();
    console.log(output);

    if (output.includes('bestmove')) {
      bestMove = output.split('bestmove ')[1].split(' ')[0];
      stockfish.kill();
      return res.json({ bestMove });
    }
  });

  stockfish.stderr.on('data', (data) => {
    console.error(`Stockfish stderr: ${data}`);
  });

  stockfish.on('error', (err) => {
    console.error('Error starting Stockfish:', err);
    res.status(500).json({ error: 'Error starting Stockfish' });
  });

  stockfish.stdin.write('uci\n');
  stockfish.stdin.write('isready\n');
  stockfish.stdin.write(`position fen ${fen}\n`);
  stockfish.stdin.write(`go depth ${depth || 10}\n`);
});

// Tournament Routes
app.post('/tournament/create', createTournament);
app.post('/tournament/add-participant', addParticipant);
app.post('/tournament/start', startTournament);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
