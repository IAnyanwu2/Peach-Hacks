import React, { useState, useEffect } from "react";
import ChessPiece from "./ChessPiece";

export default function ChessBoard({ chess, currentTurn, onMove }) {
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [board, setBoard] = useState([]);

  useEffect(() => {
    renderBoard();
  }, [chess, selectedPiece, validMoves, currentTurn]);

  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  const renderBoard = () => {
    const newBoard = [];
    
    for (let rankIndex = 0; rankIndex < 8; rankIndex++) {
      const row = [];
      for (let fileIndex = 0; fileIndex < 8; fileIndex++) {
        const position = `${files[fileIndex]}${ranks[rankIndex]}`;
        const isLight = (fileIndex + rankIndex) % 2 === 0;
        const piece = chess.getPieceAt(position);
        const isValidMove = validMoves.includes(position);
        const isSelected = selectedPiece === position;
        
        row.push(
          <div 
            key={position}
            className={`board-square w-12 h-12 sm:w-16 sm:h-16 ${
              isLight ? "bg-chess-light" : "bg-chess-dark"
            } ${isValidMove ? "valid-move" : ""} relative`}
            data-square={position}
            onClick={() => handleSquareClick(position)}
          >
            {piece && (
              <ChessPiece
                piece={piece.type}
                color={piece.color}
                position={position}
                isSelected={isSelected}
                currentTurn={currentTurn}
                onPieceSelect={handlePieceSelect}
              />
            )}
          </div>
        );
      }
      newBoard.push(row);
    }
    
    setBoard(newBoard);
  };

  const handlePieceSelect = (position) => {
    // If a piece is already selected and this is a valid move position
    if (selectedPiece && validMoves.includes(position)) {
      // This is a capture move - just execute the move
      const move = chess.move(selectedPiece, position);
      if (move) {
        onMove(move);
        setSelectedPiece(null);
        setValidMoves([]);
      }
      return;
    }
  
    // Only allow selection of pieces that match the current turn
    if (chess.getPieceAt(position)?.color !== currentTurn) {
      return;
    }

    if (selectedPiece === position) {
      // Deselect piece
      setSelectedPiece(null);
      setValidMoves([]);
    } else {
      // Select piece and show valid moves
      setSelectedPiece(position);
      const moves = chess.getValidMoves(position);
      setValidMoves(moves.map(move => move.to));
    }
  };

  const handleSquareClick = (position) => {
    const clickedPiece = chess.getPieceAt(position);
    
    // If a piece is selected and clicking on another owned piece, select that piece instead
    if (clickedPiece && clickedPiece.color === currentTurn) {
      handlePieceSelect(position);
      return;
    }
    
    // If a piece is selected and clicking on a valid move square
    if (selectedPiece && validMoves.includes(position)) {
      const move = chess.move(selectedPiece, position);
      if (move) {
        onMove(move);
        setSelectedPiece(null);
        setValidMoves([]);
      }
    }
  };

  return (
    <div className="relative bg-white rounded-lg shadow-lg overflow-hidden" id="chessboard">
      <div className="absolute -top-6 left-0 w-full flex justify-around text-sm text-gray-600 font-medium">
        {files.map(file => (
          <span key={file}>{file}</span>
        ))}
      </div>
      <div className="absolute top-0 bottom-0 -left-6 flex flex-col justify-around text-sm text-gray-600 font-medium">
        {ranks.map(rank => (
          <span key={rank}>{rank}</span>
        ))}
      </div>
      <div className="grid grid-cols-8">
        {board.flat()}
      </div>
    </div>
  );
}