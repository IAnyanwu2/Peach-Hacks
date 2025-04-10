import React from 'react';
import { getPieceImageUrl } from '../lib/chess-pieces';

export default function ChessPiece({ 
  piece, 
  color, 
  position, 
  isSelected,
  currentTurn,
  onPieceSelect
}) {
  const imageUrl = getPieceImageUrl(piece, color);
  const canMove = color === currentTurn;
  
  const handleDragStart = (e) => {
    if (!canMove) {
      e.preventDefault();
      return;
    }
    
    onPieceSelect(position);
    e.dataTransfer.setData('text/plain', position);
    e.dataTransfer.effectAllowed = 'move';
  };
  
  const handleDragEnd = () => {
    // Handled by board component
  };
  
  const handleClick = (e) => {
    onPieceSelect(position);
    e.stopPropagation();
  };

  return (
    <img
      src={imageUrl}
      className={`chess-piece ${isSelected ? 'selected' : ''}`}
      data-piece={piece}
      data-color={color}
      data-position={position}
      draggable={canMove}
      alt={`${color} ${piece}`}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      style={{
        cursor: canMove ? 'grab' : 'not-allowed',
        transition: 'transform 0.1s',
        userSelect: 'none',
        ...(isSelected && { 
          transform: 'scale(1.1)',
          filter: 'drop-shadow(0 0 4px rgba(255, 193, 7, 0.8))'
        })
      }}
    />
  );
}