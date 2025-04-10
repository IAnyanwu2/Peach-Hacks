import React from 'react';
import ReactDOM from 'react-dom/client';
import ChessGameApp from './ChessMoveApp'; // Import ChessGameApp

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChessGameApp />
  </React.StrictMode>
);