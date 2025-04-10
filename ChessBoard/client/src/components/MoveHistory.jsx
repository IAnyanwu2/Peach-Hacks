import React from 'react';

export default function MoveHistory({ moveHistory }) {
  return (
    <div className="divide-y">
      {moveHistory.map((move, index) => (
        <div 
          key={index} 
          className="move-history-item py-2 px-3 flex items-center"
          style={{
            backgroundColor: index % 2 === 0 ? 'rgba(0, 0, 0, 0.03)' : 'transparent'
          }}
        >
          <span className="font-medium text-gray-700 w-8">{index + 1}.</span>
          <span>{`${move.from} → ${move.to}`}</span>
        </div>
      ))}
      
      {moveHistory.length === 0 && (
        <div className="py-2 px-3 text-gray-500 italic">No moves yet</div>
      )}
    </div>
  );
}