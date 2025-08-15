import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { toast } from '../../hooks/use-toast';
import { RefreshCw, Home, RotateCcw, Flag } from 'lucide-react';
import { Link } from 'react-router-dom';

const Chess = () => {
  // Initial chess board setup
  const initialBoard = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
  ];

  const [board, setBoard] = useState(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState('white');
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [moveHistory, setMoveHistory] = useState([]);
  const [capturedPieces, setCapturedPieces] = useState({ white: [], black: [] });
  const [gameStatus, setGameStatus] = useState('playing'); // playing, check, checkmate, stalemate
  const [winner, setWinner] = useState(null);

  // Chess piece symbols for display
  const pieceSymbols = {
    'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
    'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟'
  };

  const isWhitePiece = (piece) => piece && piece === piece.toUpperCase();
  const isBlackPiece = (piece) => piece && piece === piece.toLowerCase();

  // Convert row, col to chess notation
  const toChessNotation = (row, col) => {
    return String.fromCharCode(97 + col) + (8 - row);
  };

  // Get piece color
  const getPieceColor = (piece) => {
    if (!piece) return null;
    return isWhitePiece(piece) ? 'white' : 'black';
  };

  // Check if move is valid (simplified chess rules)
  const isValidMove = (fromRow, fromCol, toRow, toCol) => {
    const piece = board[fromRow][fromCol];
    if (!piece) return false;

    const rowDiff = toRow - fromRow;
    const colDiff = toCol - fromCol;
    const absRowDiff = Math.abs(rowDiff);
    const absColDiff = Math.abs(colDiff);

    // Check if destination has same color piece
    const destPiece = board[toRow][toCol];
    if (destPiece && getPieceColor(piece) === getPieceColor(destPiece)) {
      return false;
    }

    const pieceType = piece.toLowerCase();

    switch (pieceType) {
      case 'p': // Pawn
        const direction = isWhitePiece(piece) ? -1 : 1;
        const startRow = isWhitePiece(piece) ? 6 : 1;
        
        // Forward move
        if (colDiff === 0) {
          if (rowDiff === direction && !destPiece) return true;
          if (fromRow === startRow && rowDiff === 2 * direction && !destPiece && !board[fromRow + direction][fromCol]) return true;
        }
        // Capture diagonally
        if (absColDiff === 1 && rowDiff === direction && destPiece) return true;
        break;

      case 'r': // Rook
        if (rowDiff === 0 || colDiff === 0) {
          return isPathClear(fromRow, fromCol, toRow, toCol);
        }
        break;

      case 'n': // Knight
        if ((absRowDiff === 2 && absColDiff === 1) || (absRowDiff === 1 && absColDiff === 2)) {
          return true;
        }
        break;

      case 'b': // Bishop
        if (absRowDiff === absColDiff) {
          return isPathClear(fromRow, fromCol, toRow, toCol);
        }
        break;

      case 'q': // Queen
        if (rowDiff === 0 || colDiff === 0 || absRowDiff === absColDiff) {
          return isPathClear(fromRow, fromCol, toRow, toCol);
        }
        break;

      case 'k': // King
        if (absRowDiff <= 1 && absColDiff <= 1) {
          return true;
        }
        break;
    }

    return false;
  };

  // Check if path is clear for sliding pieces
  const isPathClear = (fromRow, fromCol, toRow, toCol) => {
    const rowStep = toRow === fromRow ? 0 : (toRow - fromRow) / Math.abs(toRow - fromRow);
    const colStep = toCol === fromCol ? 0 : (toCol - fromCol) / Math.abs(toCol - fromCol);

    let currentRow = fromRow + rowStep;
    let currentCol = fromCol + colStep;

    while (currentRow !== toRow || currentCol !== toCol) {
      if (board[currentRow][currentCol]) return false;
      currentRow += rowStep;
      currentCol += colStep;
    }

    return true;
  };

  // Get all possible moves for a piece
  const getPossibleMoves = (row, col) => {
    const moves = [];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (isValidMove(row, col, r, c)) {
          moves.push([r, c]);
        }
      }
    }
    return moves;
  };

  // Handle square click
  const handleSquareClick = (row, col) => {
    if (gameStatus !== 'playing') return;

    const piece = board[row][col];
    const pieceColor = getPieceColor(piece);

    // If no piece is selected
    if (!selectedSquare) {
      if (piece && pieceColor === currentPlayer) {
        setSelectedSquare([row, col]);
        setPossibleMoves(getPossibleMoves(row, col));
      }
      return;
    }

    const [selectedRow, selectedCol] = selectedSquare;

    // If clicking on the same square, deselect
    if (selectedRow === row && selectedCol === col) {
      setSelectedSquare(null);
      setPossibleMoves([]);
      return;
    }

    // If clicking on own piece, select new piece
    if (piece && pieceColor === currentPlayer) {
      setSelectedSquare([row, col]);
      setPossibleMoves(getPossibleMoves(row, col));
      return;
    }

    // Try to make a move
    if (isValidMove(selectedRow, selectedCol, row, col)) {
      makeMove(selectedRow, selectedCol, row, col);
    }

    setSelectedSquare(null);
    setPossibleMoves([]);
  };

  // Make a move
  const makeMove = (fromRow, fromCol, toRow, toCol) => {
    const newBoard = board.map(row => [...row]);
    const piece = newBoard[fromRow][fromCol];
    const capturedPiece = newBoard[toRow][toCol];

    // Move piece
    newBoard[toRow][toCol] = piece;
    newBoard[fromRow][fromCol] = null;

    // Record captured piece
    if (capturedPiece) {
      const captureColor = isWhitePiece(capturedPiece) ? 'white' : 'black';
      setCapturedPieces(prev => ({
        ...prev,
        [captureColor]: [...prev[captureColor], capturedPiece]
      }));
    }

    // Record move
    const moveNotation = `${toChessNotation(fromRow, fromCol)}-${toChessNotation(toRow, toCol)}`;
    setMoveHistory(prev => [...prev, {
      from: [fromRow, fromCol],
      to: [toRow, toCol],
      piece,
      captured: capturedPiece,
      notation: moveNotation,
      player: currentPlayer
    }]);

    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');

    toast({
      title: `${currentPlayer === 'white' ? 'Putih' : 'Hitam'} bergerak`,
      description: moveNotation,
    });

    // Simple win condition: if king is captured
    if (capturedPiece && capturedPiece.toLowerCase() === 'k') {
      setWinner(currentPlayer);
      setGameStatus('checkmate');
      toast({
        title: "🏆 Game Over!",
        description: `${currentPlayer === 'white' ? 'Putih' : 'Hitam'} menang!`,
      });
    }
  };

  // Reset game
  const resetGame = () => {
    setBoard(initialBoard);
    setCurrentPlayer('white');
    setSelectedSquare(null);
    setPossibleMoves([]);
    setMoveHistory([]);
    setCapturedPieces({ white: [], black: [] });
    setGameStatus('playing');
    setWinner(null);
    toast({
      title: "Game direset",
      description: "Permainan baru dimulai",
    });
  };

  // Surrender
  const surrender = () => {
    const winner = currentPlayer === 'white' ? 'black' : 'white';
    setWinner(winner);
    setGameStatus('surrender');
    toast({
      title: "Menyerah",
      description: `${winner === 'white' ? 'Putih' : 'Hitam'} menang!`,
    });
  };

  // Undo last move
  const undoMove = () => {
    if (moveHistory.length === 0) return;

    const lastMove = moveHistory[moveHistory.length - 1];
    const newBoard = board.map(row => [...row]);

    // Restore pieces
    newBoard[lastMove.from[0]][lastMove.from[1]] = lastMove.piece;
    newBoard[lastMove.to[0]][lastMove.to[1]] = lastMove.captured;

    // Restore captured pieces
    if (lastMove.captured) {
      const captureColor = isWhitePiece(lastMove.captured) ? 'white' : 'black';
      setCapturedPieces(prev => ({
        ...prev,
        [captureColor]: prev[captureColor].slice(0, -1)
      }));
    }

    setBoard(newBoard);
    setCurrentPlayer(lastMove.player);
    setMoveHistory(prev => prev.slice(0, -1));
    setSelectedSquare(null);
    setPossibleMoves([]);
    
    if (gameStatus !== 'playing') {
      setGameStatus('playing');
      setWinner(null);
    }
  };

  const isSquareSelected = (row, col) => {
    return selectedSquare && selectedSquare[0] === row && selectedSquare[1] === col;
  };

  const isSquarePossibleMove = (row, col) => {
    return possibleMoves.some(([r, c]) => r === row && c === col);
  };

  const getSquareColor = (row, col) => {
    const isLight = (row + col) % 2 === 0;
    let baseColor = isLight ? 'bg-amber-100' : 'bg-amber-800';

    if (isSquareSelected(row, col)) {
      baseColor = 'bg-blue-400';
    } else if (isSquarePossibleMove(row, col)) {
      baseColor = board[row][col] ? 'bg-red-300' : 'bg-green-300';
    }

    return baseColor;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Catur</h1>
        <p className="text-gray-600">Game strategi klasik - Kalahkan raja lawan untuk menang!</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Game Board */}
        <div className="lg:col-span-3">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <Badge variant={currentPlayer === 'white' ? 'default' : 'secondary'}>
                    Giliran: {currentPlayer === 'white' ? '♔ Putih' : '♚ Hitam'}
                  </Badge>
                  {gameStatus !== 'playing' && (
                    <Badge variant="destructive">
                      {gameStatus === 'checkmate' ? 'Skakmat' : gameStatus === 'surrender' ? 'Menyerah' : 'Game Over'}
                    </Badge>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button onClick={undoMove} variant="outline" size="sm" disabled={moveHistory.length === 0}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Undo
                  </Button>
                  <Button onClick={surrender} variant="outline" size="sm" disabled={gameStatus !== 'playing'}>
                    <Flag className="h-4 w-4 mr-2" />
                    Menyerah
                  </Button>
                  <Button onClick={resetGame} variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                  <Link to="/">
                    <Button variant="ghost" size="sm">
                      <Home className="h-4 w-4 mr-2" />
                      Beranda
                    </Button>
                  </Link>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="p-4 bg-amber-900 rounded-lg">
                {/* Column labels */}
                <div className="flex mb-2">
                  <div className="w-8"></div>
                  {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(col => (
                    <div key={col} className="w-12 h-6 flex items-center justify-center text-amber-100 font-semibold">
                      {col}
                    </div>
                  ))}
                </div>

                {board.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex">
                    {/* Row label */}
                    <div className="w-8 h-12 flex items-center justify-center text-amber-100 font-semibold">
                      {8 - rowIndex}
                    </div>
                    
                    {row.map((piece, colIndex) => (
                      <button
                        key={`${rowIndex}-${colIndex}`}
                        className={`
                          w-12 h-12 flex items-center justify-center text-2xl font-bold
                          transition-all duration-200 transform hover:scale-105
                          ${getSquareColor(rowIndex, colIndex)}
                          ${isSquareSelected(rowIndex, colIndex) ? 'ring-4 ring-blue-500' : ''}
                          ${isSquarePossibleMove(rowIndex, colIndex) ? 'ring-2 ring-green-500' : ''}
                          hover:brightness-110
                        `}
                        onClick={() => handleSquareClick(rowIndex, colIndex)}
                        disabled={gameStatus !== 'playing'}
                      >
                        {piece && pieceSymbols[piece]}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Game Info */}
        <div className="space-y-6">
          {/* Game Status */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle>Status Permainan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                {gameStatus === 'playing' ? (
                  <div>
                    <div className="text-3xl mb-2">
                      {currentPlayer === 'white' ? '♔' : '♚'}
                    </div>
                    <p className="font-semibold">
                      Giliran {currentPlayer === 'white' ? 'Putih' : 'Hitam'}
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="text-3xl mb-2">🏆</div>
                    <p className="font-semibold text-lg">
                      {winner === 'white' ? 'Putih' : 'Hitam'} Menang!
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {gameStatus === 'checkmate' ? 'Skakmat' : 'Menyerah'}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Captured Pieces */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle>Bidak Tertangkap</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Putih:</p>
                <div className="flex flex-wrap gap-1">
                  {capturedPieces.white.map((piece, index) => (
                    <span key={index} className="text-xl">{pieceSymbols[piece]}</span>
                  ))}
                  {capturedPieces.white.length === 0 && (
                    <span className="text-gray-400 text-sm">Belum ada</span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Hitam:</p>
                <div className="flex flex-wrap gap-1">
                  {capturedPieces.black.map((piece, index) => (
                    <span key={index} className="text-xl">{pieceSymbols[piece]}</span>
                  ))}
                  {capturedPieces.black.length === 0 && (
                    <span className="text-gray-400 text-sm">Belum ada</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Move History */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle>Riwayat Langkah</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {moveHistory.length === 0 ? (
                  <p className="text-gray-400 text-sm">Belum ada langkah</p>
                ) : (
                  moveHistory.slice(-10).map((move, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="font-mono">{move.notation}</span>
                      <div className="flex items-center space-x-2">
                        <span>{pieceSymbols[move.piece]}</span>
                        {move.captured && (
                          <span className="text-red-600">x{pieceSymbols[move.captured]}</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Rules */}
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Cara Bermain</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Klik bidak untuk memilih</li>
                <li>• Kotak hijau: gerakan valid</li>
                <li>• Kotak merah: dapat menangkap</li>
                <li>• Tujuan: tangkap raja lawan</li>
                <li>• Putih bergerak terlebih dahulu</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Chess;