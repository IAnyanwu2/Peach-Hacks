import React from 'react';
import { getPieceImageUrl } from '../lib/chess-pieces';

export default function CapturedPieces({ capturedPieces }) {
  return (
    <div className="flex justify-between">
      <div>
        <h3 className="text-sm font-medium text-gray-600 mb-1">By White</h3>
        <div className="flex flex-wrap gap-1">
          {capturedPieces.byWhite.map((piece, index) => {
            const [type, color] = piece.split('-');
            return (
              <img
                key={`white-captured-${index}`}
                src={getPieceImageUrl(type, color)}
                className="captured-piece"
                alt={`Captured ${color} ${type}`}
                style={{
                  width: '24px',
                  height: '24px',
                  opacity: 0.7
                }}
              />
            );
          })}
          {capturedPieces.byWhite.length === 0 && (
            <span className="text-xs text-gray-500 italic">None</span>
          )}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-600 mb-1">By Black</h3>
        <div className="flex flex-wrap gap-1">
          {capturedPieces.byBlack.map((piece, index) => {
            const [type, color] = piece.split('-');
            return (
              <img
                key={`black-captured-${index}`}
                src={getPieceImageUrl(type, color)}
                className="captured-piece"
                alt={`Captured ${color} ${type}`}
                style={{
                  width: '24px',
                  height: '24px',
                  opacity: 0.7
                }}
              />
            );
          })}
          {capturedPieces.byBlack.length === 0 && (
            <span className="text-xs text-gray-500 italic">None</span>
          )}
        </div>
      </div>
    </div>
  );
}