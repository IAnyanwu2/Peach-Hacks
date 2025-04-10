import React, { useState, useEffect } from "react";
import ChessBoard from "../components/ChessBoard";
import MoveHistory from "../components/MoveHistory";
import CapturedPieces from "../components/CapturedPieces";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";
import { useIsMobile } from "../hooks/use-mobile";
import { Chess } from "../lib/chess";

export default function ChessGame() {
  const isMobile = useIsMobile();
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [chess] = useState(() => new Chess());
  const [currentTurn, setCurrentTurn] = useState("white");
  const [gameStatus, setGameStatus] = useState(null);
  const [capturedPieces, setCapturedPieces] = useState({
    byWhite: [],
    byBlack: [],
  });
  const [moveHistory, setMoveHistory] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    // Update game status when turn changes
    const status = chess.getGameStatus();
    setGameStatus(status);
    
    if (status === "checkmate") {
      toast({
        title: "Checkmate!",
        description: `${currentTurn === "white" ? "Black" : "White"} wins the game.`,
        variant: "destructive",
      });
    } else if (status === "check") {
      toast({
        title: "Check!",
        description: `${currentTurn} is in check.`,
      });
    } else if (status === "stalemate") {
      toast({
        title: "Stalemate!",
        description: "The game is a draw.",
      });
    }
  }, [currentTurn, chess, toast]);

  const toggleMobileMenu = () => {
    setMobileMenuVisible(!mobileMenuVisible);
  };

  const newGame = () => {
    chess.reset();
    setCurrentTurn("white");
    setGameStatus(null);
    setCapturedPieces({ byWhite: [], byBlack: [] });
    setMoveHistory([]);
    
    toast({
      title: "New Game Started",
      description: "White moves first.",
    });
  };

  const undoMove = () => {
    if (moveHistory.length === 0) {
      toast({
        title: "Cannot Undo",
        description: "No moves to undo.",
        variant: "destructive",
      });
      return;
    }

    const undoneMove = chess.undoLastMove();
    if (undoneMove) {
      const newHistory = [...moveHistory];
      newHistory.pop();
      setMoveHistory(newHistory);
      
      // Update captured pieces
      if (undoneMove.capturedPiece) {
        const newCaptured = { ...capturedPieces };
        if (undoneMove.pieceColor === "white") {
          newCaptured.byWhite.pop();
        } else {
          newCaptured.byBlack.pop();
        }
        setCapturedPieces(newCaptured);
      }

      // Switch turn
      setCurrentTurn(currentTurn === "white" ? "black" : "white");
      
      toast({
        title: "Move Undone",
        description: `Undid move from ${undoneMove.from} to ${undoneMove.to}`,
      });
    }
  };

  const handleMove = (move) => {
    setMoveHistory([...moveHistory, move]);
    
    // Update captured pieces
    if (move.capturedPiece) {
      const newCaptured = { ...capturedPieces };
      if (move.pieceColor === "white") {
        newCaptured.byWhite.push(move.capturedPiece);
      } else {
        newCaptured.byBlack.push(move.capturedPiece);
      }
      setCapturedPieces(newCaptured);
    }
    
    // Update game status
    if (move.resultingGameStatus) {
      setGameStatus(move.resultingGameStatus);
    }
    
    // Switch turn
    setCurrentTurn(currentTurn === "white" ? "black" : "white");
    
    // Show notifications for special game states
    if (move.resultingGameStatus === "checkmate") {
      toast({
        title: "Checkmate!",
        description: `${currentTurn === "white" ? "White" : "Black"} wins the game.`,
        variant: "destructive",
      });
    } else if (move.resultingGameStatus === "check") {
      toast({
        title: "Check!",
        description: `${currentTurn === "white" ? "Black" : "White"} king is in check.`,
      });
    } else if (move.resultingGameStatus === "stalemate") {
      toast({
        title: "Stalemate!",
        description: "The game is a draw.",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-primary text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-serif font-bold">Chess Game</h1>
          <div className="hidden md:flex items-center space-x-4">
            <Button 
              onClick={newGame}
              className="px-4 py-2 bg-accent text-primary font-medium rounded hover:bg-opacity-90 transition"
            >
              New Game
            </Button>
            <Button 
              onClick={undoMove}
              variant="outline"
              className="px-4 py-2 border border-white/50 rounded hover:bg-white/10 transition"
            >
              Undo Move
            </Button>
          </div>
          <Button 
            variant="ghost" 
            className="md:hidden text-white" 
            onClick={toggleMobileMenu}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`md:hidden bg-primary/95 text-white p-4 shadow-md ${mobileMenuVisible ? '' : 'hidden'}`}>
        <div className="flex flex-col space-y-3">
          <Button 
            onClick={newGame}
            className="px-4 py-2 bg-accent text-primary font-medium rounded hover:bg-opacity-90 transition"
          >
            New Game
          </Button>
          <Button 
            onClick={undoMove}
            variant="outline"
            className="px-4 py-2 border border-white/50 rounded hover:bg-white/10 transition"
          >
            Undo Move
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Game Board Section */}
          <div className="flex flex-col items-center">
            {/* Turn & Status Indicator */}
            <div className="mb-4 text-center bg-white p-3 rounded-lg shadow-md w-full max-w-md">
              {gameStatus === "checkmate" ? (
                <div className="text-center">
                  <p className="font-serif text-xl text-destructive font-bold">Checkmate!</p>
                  <p className="font-serif text-lg mt-1">
                    <span className="font-bold capitalize">
                      {currentTurn === "white" ? "Black" : "White"}
                    </span> wins the game!
                  </p>
                </div>
              ) : gameStatus === "stalemate" ? (
                <div className="text-center">
                  <p className="font-serif text-xl text-amber-600 font-bold">Stalemate!</p>
                  <p className="font-serif text-lg mt-1">The game is a draw</p>
                </div>
              ) : (
                <div>
                  <p className="font-serif text-lg">
                    <span className="font-medium text-primary">Current Turn:</span>
                    <span className="ml-2 font-bold capitalize">{currentTurn}</span>
                  </p>
                  {gameStatus === "check" && (
                    <div className="mt-1 text-sm font-semibold text-destructive">
                      King is in check! You must move out of check.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Chess Board */}
            <ChessBoard 
              chess={chess} 
              currentTurn={currentTurn} 
              onMove={handleMove}
            />

            {/* Mobile Game Info (visible only on small screens) */}
            {isMobile && (
              <div className="mt-6 w-full lg:hidden">
                <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                  <h2 className="font-serif text-xl font-bold text-primary mb-2">Captured Pieces</h2>
                  <CapturedPieces capturedPieces={capturedPieces} />
                </div>

                {/* Mobile Move History */}
                <div className="bg-white rounded-lg shadow-md p-4">
                  <h2 className="font-serif text-xl font-bold text-primary mb-2">Move History</h2>
                  <div className="max-h-36 overflow-y-auto">
                    <MoveHistory moveHistory={moveHistory} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Game Info Sidebar (desktop only) */}
          <div className="hidden lg:block lg:w-80">
            {/* Captured Pieces */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <h2 className="font-serif text-xl font-bold text-primary mb-3">Captured Pieces</h2>
              <CapturedPieces capturedPieces={capturedPieces} />
            </div>
            
            {/* Move History */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="font-serif text-xl font-bold text-primary mb-3">Move History</h2>
              <div className="max-h-96 overflow-y-auto">
                <MoveHistory moveHistory={moveHistory} />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-white text-center p-3 mt-8">
        <p className="text-sm">&copy; {new Date().getFullYear()} Chess Game | Built with HTML, CSS & JavaScript</p>
      </footer>
    </div>
  );
}