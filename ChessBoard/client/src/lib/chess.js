import { initialBoardSetup } from './chess-pieces';

export class Chess {
  constructor() {
    this.board = new Map();
    this.currentTurn = 'white';
    this.moveHistory = [];
    this.kings = { white: 'e1', black: 'e8' };
    this.inCheck = { white: false, black: false };
    this.setupBoard();
  }
  
  setupBoard() {
    initialBoardSetup.forEach(({ position, piece, color }) => {
      this.board.set(position, { 
        type: piece, 
        color: color
      });
    });
  }
  
  reset() {
    this.board.clear();
    this.currentTurn = 'white';
    this.moveHistory = [];
    this.kings = { white: 'e1', black: 'e8' };
    this.inCheck = { white: false, black: false };
    this.setupBoard();
  }
  
  getPieceAt(position) {
    return this.board.get(position);
  }
  
  move(from, to) {
    const piece = this.board.get(from);
    
    // Validate piece exists and it's the correct turn
    if (!piece || piece.color !== this.currentTurn) {
      return null;
    }
    
    // Check if the game is already over (checkmate/stalemate)
    const gameStatus = this.getGameStatus();
    if (gameStatus === "checkmate" || gameStatus === "stalemate") {
      return null;
    }
    
    // Check if move is valid
    const validMoves = this.getValidMoves(from);
    const isValidMove = validMoves.some(move => move.to === to);
    
    if (!isValidMove) {
      return null;
    }
    
    // Store captured piece if any
    const capturedPiece = this.board.get(to);
    let capturedPieceString;
    
    if (capturedPiece) {
      // Prevent king from being captured (this shouldn't happen in a valid chess game)
      if (capturedPiece.type === 'king') {
        return null;
      }
      capturedPieceString = `${capturedPiece.type}-${capturedPiece.color}`;
    }
    
    // Update king position if king is moving
    if (piece.type === 'king') {
      this.kings[piece.color] = to;
    }
    
    // Execute move
    this.board.delete(from);
    this.board.set(to, piece);
    
    // Check for pawn promotion (simplified - always queen)
    if (piece.type === 'pawn' && (to.endsWith('8') || to.endsWith('1'))) {
      this.board.set(to, { type: 'queen', color: piece.color });
    }
    
    // Create move record
    const move = {
      from,
      to,
      piece: piece.type,
      pieceColor: piece.color,
      capturedPiece: capturedPieceString
    };
    
    // Add to move history
    this.moveHistory.push(move);
    
    // Switch turn
    this.currentTurn = this.currentTurn === 'white' ? 'black' : 'white';
    
    // Update check status
    this.updateCheckStatus();
    
    // Check for checkmate
    move.resultingGameStatus = this.getGameStatus();
    
    return move;
  }
  
  undoLastMove() {
    if (this.moveHistory.length === 0) {
      return null;
    }
    
    const lastMove = this.moveHistory.pop();
    
    // Get the piece at the destination
    const piece = this.board.get(lastMove.to);
    
    if (!piece) {
      return null;
    }
    
    // If a king was moved, update its position
    if (piece.type === 'king') {
      this.kings[piece.color] = lastMove.from;
    }
    
    // Handle pawn promotion (reverting to pawn)
    if (lastMove.piece === 'pawn' && piece.type === 'queen') {
      this.board.set(lastMove.from, { type: 'pawn', color: piece.color });
    } else {
      this.board.set(lastMove.from, piece);
    }
    
    // Remove piece from destination
    this.board.delete(lastMove.to);
    
    // If a piece was captured, restore it
    if (lastMove.capturedPiece) {
      const [type, color] = lastMove.capturedPiece.split('-');
      this.board.set(lastMove.to, { 
        type, 
        color
      });
    }
    
    // Switch turn back
    this.currentTurn = this.currentTurn === 'white' ? 'black' : 'white';
    
    // Update check status
    this.updateCheckStatus();
    
    return lastMove;
  }
  
  getValidMoves(position) {
    const piece = this.board.get(position);
    
    if (!piece) {
      return [];
    }
    
    const potentialMoves = [];
    const [file, rank] = position.split('');
    const fileIndex = 'abcdefgh'.indexOf(file);
    const rankIndex = parseInt(rank) - 1;
    
    // Helper to check if position is on the board
    const isOnBoard = (f, r) => 
      f >= 0 && f < 8 && r >= 0 && r < 8;
    
    // Helper to get position from indices
    const getPosition = (f, r) => 
      `${'abcdefgh'[f]}${r + 1}`;
    
    // Helper to check if a square is empty or has enemy piece
    const isEmptyOrEnemy = (pos) => {
      const targetPiece = this.board.get(pos);
      return !targetPiece || targetPiece.color !== piece.color;
    };
    
    // Helper to add a move if valid
    const addMoveIfValid = (from, to) => {
      if (isOnBoard('abcdefgh'.indexOf(to[0]), parseInt(to[1]) - 1) && isEmptyOrEnemy(to)) {
        // Don't allow moves that capture a king
        const targetPiece = this.board.get(to);
        if (targetPiece && targetPiece.type === 'king') {
          return;
        }
        
        potentialMoves.push({
          from,
          to,
          piece: piece.type,
          pieceColor: piece.color,
          capturedPiece: targetPiece ? `${targetPiece.type}-${targetPiece.color}` : undefined
        });
      }
    };
    
    switch (piece.type) {
      case 'pawn': {
        const direction = piece.color === 'white' ? 1 : -1;
        const startRank = piece.color === 'white' ? 1 : 6;
        
        // Move forward one square
        if (isOnBoard(fileIndex, rankIndex + direction)) {
          const oneForward = getPosition(fileIndex, rankIndex + direction);
          if (!this.board.get(oneForward)) {
            addMoveIfValid(position, oneForward);
            
            // Move forward two squares from starting position
            if (rankIndex === startRank) {
              const twoForward = getPosition(fileIndex, rankIndex + (2 * direction));
              if (!this.board.get(twoForward)) {
                addMoveIfValid(position, twoForward);
              }
            }
          }
        }
        
        // Capture diagonally
        const captureOffsets = [[-1, direction], [1, direction]];
        for (const [fOffset, rOffset] of captureOffsets) {
          if (isOnBoard(fileIndex + fOffset, rankIndex + rOffset)) {
            const capturePos = getPosition(fileIndex + fOffset, rankIndex + rOffset);
            const targetPiece = this.board.get(capturePos);
            if (targetPiece && targetPiece.color !== piece.color) {
              addMoveIfValid(position, capturePos);
            }
          }
        }
        break;
      }
      
      case 'knight': {
        const knightMoves = [
          [-2, -1], [-2, 1], [-1, -2], [-1, 2],
          [1, -2], [1, 2], [2, -1], [2, 1]
        ];
        
        for (const [fOffset, rOffset] of knightMoves) {
          if (isOnBoard(fileIndex + fOffset, rankIndex + rOffset)) {
            const newPos = getPosition(fileIndex + fOffset, rankIndex + rOffset);
            addMoveIfValid(position, newPos);
          }
        }
        break;
      }
      
      case 'bishop': {
        const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
        
        for (const [fDir, rDir] of directions) {
          let f = fileIndex + fDir;
          let r = rankIndex + rDir;
          
          while (isOnBoard(f, r)) {
            const newPos = getPosition(f, r);
            const targetPiece = this.board.get(newPos);
            
            if (!targetPiece) {
              addMoveIfValid(position, newPos);
            } else {
              if (targetPiece.color !== piece.color) {
                addMoveIfValid(position, newPos);
              }
              break;
            }
            
            f += fDir;
            r += rDir;
          }
        }
        break;
      }
      
      case 'rook': {
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        
        for (const [fDir, rDir] of directions) {
          let f = fileIndex + fDir;
          let r = rankIndex + rDir;
          
          while (isOnBoard(f, r)) {
            const newPos = getPosition(f, r);
            const targetPiece = this.board.get(newPos);
            
            if (!targetPiece) {
              addMoveIfValid(position, newPos);
            } else {
              if (targetPiece.color !== piece.color) {
                addMoveIfValid(position, newPos);
              }
              break;
            }
            
            f += fDir;
            r += rDir;
          }
        }
        break;
      }
      
      case 'queen': {
        // Combine bishop and rook moves
        const directions = [
          [-1, -1], [-1, 0], [-1, 1],
          [0, -1], [0, 1],
          [1, -1], [1, 0], [1, 1]
        ];
        
        for (const [fDir, rDir] of directions) {
          let f = fileIndex + fDir;
          let r = rankIndex + rDir;
          
          while (isOnBoard(f, r)) {
            const newPos = getPosition(f, r);
            const targetPiece = this.board.get(newPos);
            
            if (!targetPiece) {
              addMoveIfValid(position, newPos);
            } else {
              if (targetPiece.color !== piece.color) {
                addMoveIfValid(position, newPos);
              }
              break;
            }
            
            f += fDir;
            r += rDir;
          }
        }
        break;
      }
      
      case 'king': {
        // King moves one square in any direction
        const directions = [
          [-1, -1], [-1, 0], [-1, 1],
          [0, -1], [0, 1],
          [1, -1], [1, 0], [1, 1]
        ];
        
        for (const [fDir, rDir] of directions) {
          if (isOnBoard(fileIndex + fDir, rankIndex + rDir)) {
            const newPos = getPosition(fileIndex + fDir, rankIndex + rDir);
            addMoveIfValid(position, newPos);
          }
        }
        break;
      }
    }
    
    // Filter out moves that would leave king in check
    const validMoves = [];
    for (const move of potentialMoves) {
      // Simulate the move
      const origBoard = new Map(this.board);
      const origKings = { ...this.kings };
      
      // Execute move temporarily
      this.board.delete(move.from);
      this.board.set(move.to, piece);
      
      // Update king position if moving king
      if (piece.type === 'king') {
        this.kings[piece.color] = move.to;
      }
      
      // Check if the move puts/leaves own king in check
      this.updateCheckStatus();
      const putsInCheck = this.inCheck[piece.color];
      
      // Restore the board
      this.board = origBoard;
      this.kings = origKings;
      this.updateCheckStatus();
      
      // If the move doesn't put king in check, it's valid
      if (!putsInCheck) {
        validMoves.push(move);
      }
    }
    
    return validMoves;
  }
  
  updateCheckStatus() {
    // Reset check status
    this.inCheck = { white: false, black: false };
    
    // Check if kings are in check
    for (const color of ['white', 'black']) {
      const kingPos = this.kings[color];
      const oppositeColor = color === 'white' ? 'black' : 'white';
      
      // Check all opponent pieces
      for (const [pos, piece] of this.board.entries()) {
        if (piece.color === oppositeColor) {
          // Generate basic moves without checking for king safety to avoid infinite recursion
          const moves = this.generateBasicMoves(pos);
          if (moves.some(move => move.to === kingPos)) {
            this.inCheck[color] = true;
            break;
          }
        }
      }
    }
  }
  
  // Get basic moves without checking if they leave king in check
  generateBasicMoves(position) {
    const piece = this.board.get(position);
    
    if (!piece) {
      return [];
    }
    
    const moves = [];
    const [file, rank] = position.split('');
    const fileIndex = 'abcdefgh'.indexOf(file);
    const rankIndex = parseInt(rank) - 1;
    
    // Helper to check if position is on the board
    const isOnBoard = (f, r) => 
      f >= 0 && f < 8 && r >= 0 && r < 8;
    
    // Helper to get position from indices
    const getPosition = (f, r) => 
      `${'abcdefgh'[f]}${r + 1}`;
    
    // Helper to check if a square is empty or has enemy piece
    const isEmptyOrEnemy = (pos) => {
      const targetPiece = this.board.get(pos);
      return !targetPiece || targetPiece.color !== piece.color;
    };
    
    // Helper to add a move if valid
    const addMoveIfValid = (from, to) => {
      if (isOnBoard('abcdefgh'.indexOf(to[0]), parseInt(to[1]) - 1) && isEmptyOrEnemy(to)) {
        const targetPiece = this.board.get(to);
        moves.push({
          from,
          to,
          piece: piece.type,
          pieceColor: piece.color,
          capturedPiece: targetPiece ? `${targetPiece.type}-${targetPiece.color}` : undefined
        });
      }
    };
    
    // Generate moves based on piece type (same logic as getValidMoves)
    switch (piece.type) {
      case 'pawn': {
        const direction = piece.color === 'white' ? 1 : -1;
        const startRank = piece.color === 'white' ? 1 : 6;
        
        // Move forward one square
        if (isOnBoard(fileIndex, rankIndex + direction)) {
          const oneForward = getPosition(fileIndex, rankIndex + direction);
          if (!this.board.get(oneForward)) {
            addMoveIfValid(position, oneForward);
            
            // Move forward two squares from starting position
            if (rankIndex === startRank) {
              const twoForward = getPosition(fileIndex, rankIndex + (2 * direction));
              if (!this.board.get(twoForward)) {
                addMoveIfValid(position, twoForward);
              }
            }
          }
        }
        
        // Capture diagonally
        const captureOffsets = [[-1, direction], [1, direction]];
        for (const [fOffset, rOffset] of captureOffsets) {
          if (isOnBoard(fileIndex + fOffset, rankIndex + rOffset)) {
            const capturePos = getPosition(fileIndex + fOffset, rankIndex + rOffset);
            const targetPiece = this.board.get(capturePos);
            if (targetPiece && targetPiece.color !== piece.color) {
              addMoveIfValid(position, capturePos);
            }
          }
        }
        break;
      }
      
      case 'knight': {
        const knightMoves = [
          [-2, -1], [-2, 1], [-1, -2], [-1, 2],
          [1, -2], [1, 2], [2, -1], [2, 1]
        ];
        
        for (const [fOffset, rOffset] of knightMoves) {
          if (isOnBoard(fileIndex + fOffset, rankIndex + rOffset)) {
            const newPos = getPosition(fileIndex + fOffset, rankIndex + rOffset);
            addMoveIfValid(position, newPos);
          }
        }
        break;
      }
      
      case 'bishop': {
        const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
        
        for (const [fDir, rDir] of directions) {
          let f = fileIndex + fDir;
          let r = rankIndex + rDir;
          
          while (isOnBoard(f, r)) {
            const newPos = getPosition(f, r);
            const targetPiece = this.board.get(newPos);
            
            if (!targetPiece) {
              addMoveIfValid(position, newPos);
            } else {
              if (targetPiece.color !== piece.color) {
                addMoveIfValid(position, newPos);
              }
              break;
            }
            
            f += fDir;
            r += rDir;
          }
        }
        break;
      }
      
      case 'rook': {
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        
        for (const [fDir, rDir] of directions) {
          let f = fileIndex + fDir;
          let r = rankIndex + rDir;
          
          while (isOnBoard(f, r)) {
            const newPos = getPosition(f, r);
            const targetPiece = this.board.get(newPos);
            
            if (!targetPiece) {
              addMoveIfValid(position, newPos);
            } else {
              if (targetPiece.color !== piece.color) {
                addMoveIfValid(position, newPos);
              }
              break;
            }
            
            f += fDir;
            r += rDir;
          }
        }
        break;
      }
      
      case 'queen': {
        // Combine bishop and rook moves
        const directions = [
          [-1, -1], [-1, 0], [-1, 1],
          [0, -1], [0, 1],
          [1, -1], [1, 0], [1, 1]
        ];
        
        for (const [fDir, rDir] of directions) {
          let f = fileIndex + fDir;
          let r = rankIndex + rDir;
          
          while (isOnBoard(f, r)) {
            const newPos = getPosition(f, r);
            const targetPiece = this.board.get(newPos);
            
            if (!targetPiece) {
              addMoveIfValid(position, newPos);
            } else {
              if (targetPiece.color !== piece.color) {
                addMoveIfValid(position, newPos);
              }
              break;
            }
            
            f += fDir;
            r += rDir;
          }
        }
        break;
      }
      
      case 'king': {
        // King moves one square in any direction
        const directions = [
          [-1, -1], [-1, 0], [-1, 1],
          [0, -1], [0, 1],
          [1, -1], [1, 0], [1, 1]
        ];
        
        for (const [fDir, rDir] of directions) {
          if (isOnBoard(fileIndex + fDir, rankIndex + rDir)) {
            const newPos = getPosition(fileIndex + fDir, rankIndex + rDir);
            addMoveIfValid(position, newPos);
          }
        }
        break;
      }
    }
    
    return moves;
  }
  
  getGameStatus() {
    const currentColor = this.currentTurn;
    
    // Check if the current player is in check
    if (this.inCheck[currentColor]) {
      // Check if there are any valid moves that can get out of check
      let hasValidMoves = false;
      
      for (const [pos, piece] of this.board.entries()) {
        if (piece.color === currentColor) {
          // Try each move and see if it gets out of check
          const moves = this.getValidMoves(pos);
          
          for (const move of moves) {
            // Simulate the move
            const origBoard = new Map(this.board);
            const origKings = { ...this.kings };
            
            // Execute move temporarily
            const capturedPiece = this.board.get(move.to);
            this.board.delete(move.from);
            this.board.set(move.to, piece);
            
            // Update king position if moving king
            if (piece.type === 'king') {
              this.kings[piece.color] = move.to;
            }
            
            // Check if still in check after move
            this.updateCheckStatus();
            const stillInCheck = this.inCheck[currentColor];
            
            // Restore the board
            this.board = origBoard;
            this.kings = origKings;
            this.updateCheckStatus();
            
            if (!stillInCheck) {
              hasValidMoves = true;
              break;
            }
          }
          
          if (hasValidMoves) {
            break;
          }
        }
      }
      
      return !hasValidMoves ? "checkmate" : "check";
    }
    
    // Check for stalemate (no valid moves but not in check)
    let hasValidMoves = false;
    
    for (const [pos, piece] of this.board.entries()) {
      if (piece.color === currentColor) {
        const moves = this.getValidMoves(pos);
        
        for (const move of moves) {
          // Simulate the move
          const origBoard = new Map(this.board);
          const origKings = { ...this.kings };
          
          // Execute move temporarily
          const capturedPiece = this.board.get(move.to);
          this.board.delete(move.from);
          this.board.set(move.to, piece);
          
          // Update king position if moving king
          if (piece.type === 'king') {
            this.kings[piece.color] = move.to;
          }
          
          // Check if the move puts us in check
          this.updateCheckStatus();
          const putsInCheck = this.inCheck[currentColor];
          
          // Restore the board
          this.board = origBoard;
          this.kings = origKings;
          this.updateCheckStatus();
          
          if (!putsInCheck) {
            hasValidMoves = true;
            break;
          }
        }
        
        if (hasValidMoves) {
          break;
        }
      }
    }
    
    return !hasValidMoves ? "stalemate" : null;
  }
}