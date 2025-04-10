// Map piece types and colors to their local image URLs
const pieceImageUrls = {
  pawn: {
    white: '/images/Pawn.PNG',
    black: '/images/Pawn.PNG'
  },
  rook: {
    white: '/images/Rook.PNG',
    black: '/images/Rook.PNG'
  },
  knight: {
    white: '/images/Knight.PNG',
    black: '/images/Knight.PNG'
  },
  bishop: {
    white: '/images/Bishop.PNG',
    black: '/images/Bishop.PNG'
  },
  queen: {
    white: '/images/Queen.PNG',
    black: '/images/Queen.PNG'
  },
  king: {
    white: '/images/King.PNG',
    black: '/images/King.PNG'
  }
};

export function getPieceImageUrl(pieceType, pieceColor) {
  return pieceImageUrls[pieceType]?.[pieceColor] || '';
}

// Initial chess board setup
export const initialBoardSetup = [
  // Black pieces (top row)
  { position: 'a8', piece: 'rook', color: 'black' },
  { position: 'b8', piece: 'knight', color: 'black' },
  { position: 'c8', piece: 'bishop', color: 'black' },
  { position: 'd8', piece: 'queen', color: 'black' },
  { position: 'e8', piece: 'king', color: 'black' },
  { position: 'f8', piece: 'bishop', color: 'black' },
  { position: 'g8', piece: 'knight', color: 'black' },
  { position: 'h8', piece: 'rook', color: 'black' },

  // Black pawns
  { position: 'a7', piece: 'pawn', color: 'black' },
  { position: 'b7', piece: 'pawn', color: 'black' },
  { position: 'c7', piece: 'pawn', color: 'black' },
  { position: 'd7', piece: 'pawn', color: 'black' },
  { position: 'e7', piece: 'pawn', color: 'black' },
  { position: 'f7', piece: 'pawn', color: 'black' },
  { position: 'g7', piece: 'pawn', color: 'black' },
  { position: 'h7', piece: 'pawn', color: 'black' },

  // White pawns
  { position: 'a2', piece: 'pawn', color: 'white' },
  { position: 'b2', piece: 'pawn', color: 'white' },
  { position: 'c2', piece: 'pawn', color: 'white' },
  { position: 'd2', piece: 'pawn', color: 'white' },
  { position: 'e2', piece: 'pawn', color: 'white' },
  { position: 'f2', piece: 'pawn', color: 'white' },
  { position: 'g2', piece: 'pawn', color: 'white' },
  { position: 'h2', piece: 'pawn', color: 'white' },

  // White pieces (bottom row)
  { position: 'a1', piece: 'rook', color: 'white' },
  { position: 'b1', piece: 'knight', color: 'white' },
  { position: 'c1', piece: 'bishop', color: 'white' },
  { position: 'd1', piece: 'queen', color: 'white' },
  { position: 'e1', piece: 'king', color: 'white' },
  { position: 'f1', piece: 'bishop', color: 'white' },
  { position: 'g1', piece: 'knight', color: 'white' },
  { position: 'h1', piece: 'rook', color: 'white' }
];