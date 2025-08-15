import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { toast } from '../../hooks/use-toast';
import { Play, Pause, RefreshCw, Home, ArrowDown, RotateCw } from 'lucide-react';
import { Link } from 'react-router-dom';

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const EMPTY_CELL = 0;

// Tetris pieces shapes
const PIECES = {
  I: {
    shape: [[1, 1, 1, 1]],
    color: 'bg-cyan-400'
  },
  O: {
    shape: [[1, 1], [1, 1]],
    color: 'bg-yellow-400'
  },
  T: {
    shape: [[0, 1, 0], [1, 1, 1]],
    color: 'bg-purple-400'
  },
  S: {
    shape: [[0, 1, 1], [1, 1, 0]],
    color: 'bg-green-400'
  },
  Z: {
    shape: [[1, 1, 0], [0, 1, 1]],
    color: 'bg-red-400'
  },
  J: {
    shape: [[1, 0, 0], [1, 1, 1]],
    color: 'bg-blue-400'
  },
  L: {
    shape: [[0, 0, 1], [1, 1, 1]],
    color: 'bg-orange-400'
  }
};

const Tetris = () => {
  const [board, setBoard] = useState(() => 
    Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(EMPTY_CELL))
  );
  const [currentPiece, setCurrentPiece] = useState(null);
  const [nextPiece, setNextPiece] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [dropTime, setDropTime] = useState(1000);

  const createRandomPiece = useCallback(() => {
    const pieceTypes = Object.keys(PIECES);
    const randomType = pieceTypes[Math.floor(Math.random() * pieceTypes.length)];
    return {
      type: randomType,
      shape: PIECES[randomType].shape,
      color: PIECES[randomType].color
    };
  }, []);

  const rotatePiece = (piece) => {
    const rotated = piece[0].map((_, index) =>
      piece.map(row => row[index]).reverse()
    );
    return rotated;
  };

  const isValidPosition = useCallback((piece, pos, gameBoard) => {
    if (!piece) return false;
    
    return piece.every((row, dy) =>
      row.every((cell, dx) => {
        if (cell === 0) return true;
        
        const x = pos.x + dx;
        const y = pos.y + dy;
        
        return (
          x >= 0 &&
          x < BOARD_WIDTH &&
          y >= 0 &&
          y < BOARD_HEIGHT &&
          gameBoard[y][x] === EMPTY_CELL
        );
      })
    );
  }, []);

  const placePiece = useCallback((piece, pos, gameBoard) => {
    const newBoard = gameBoard.map(row => [...row]);
    
    piece.forEach((row, dy) => {
      row.forEach((cell, dx) => {
        if (cell) {
          const x = pos.x + dx;
          const y = pos.y + dy;
          if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
            newBoard[y][x] = 1;
          }
        }
      });
    });
    
    return newBoard;
  }, []);

  const clearLines = useCallback((gameBoard) => {
    const newBoard = gameBoard.filter(row => row.some(cell => cell === EMPTY_CELL));
    const clearedLines = BOARD_HEIGHT - newBoard.length;
    
    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(EMPTY_CELL));
    }
    
    return { board: newBoard, lines: clearedLines };
  }, []);

  const movePiece = useCallback((dx, dy, rotate = false) => {
    if (!currentPiece || gameOver) return;

    let newPiece = currentPiece.shape;
    if (rotate) {
      newPiece = rotatePiece(newPiece);
    }

    const newPos = { x: position.x + dx, y: position.y + dy };

    if (isValidPosition(newPiece, newPos, board)) {
      setPosition(newPos);
      if (rotate) {
        setCurrentPiece(prev => ({ ...prev, shape: newPiece }));
      }
    } else if (dy > 0) {
      // Piece can't move down, place it
      const newBoard = placePiece(currentPiece.shape, position, board);
      const { board: clearedBoard, lines: clearedLines } = clearLines(newBoard);
      
      setBoard(clearedBoard);
      setLines(prev => prev + clearedLines);
      setScore(prev => prev + (clearedLines * 100 * level));
      
      if (clearedLines > 0) {
        toast({
          title: `${clearedLines} baris terhapus!`,
          description: `+${clearedLines * 100 * level} poin`,
        });
      }

      // Check game over
      if (position.y <= 0) {
        setGameOver(true);
        setIsPlaying(false);
        toast({
          title: "Game Over!",
          description: `Skor akhir: ${score}`,
        });
        return;
      }

      // Spawn new piece
      setCurrentPiece(nextPiece);
      setNextPiece(createRandomPiece());
      setPosition({ x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 });
    }
  }, [currentPiece, position, board, gameOver, isValidPosition, placePiece, clearLines, nextPiece, createRandomPiece, level, score]);

  const drop = useCallback(() => {
    movePiece(0, 1);
  }, [movePiece]);

  const hardDrop = useCallback(() => {
    if (!currentPiece || gameOver) return;
    
    let newY = position.y;
    while (isValidPosition(currentPiece.shape, { ...position, y: newY + 1 }, board)) {
      newY++;
    }
    setPosition(prev => ({ ...prev, y: newY }));
    drop();
  }, [currentPiece, position, board, gameOver, isValidPosition, drop]);

  const startGame = () => {
    const firstPiece = createRandomPiece();
    const secondPiece = createRandomPiece();
    
    setCurrentPiece(firstPiece);
    setNextPiece(secondPiece);
    setPosition({ x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 });
    setBoard(Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(EMPTY_CELL)));
    setScore(0);
    setLevel(1);
    setLines(0);
    setGameOver(false);
    setIsPlaying(true);
  };

  const pauseGame = () => {
    setIsPlaying(!isPlaying);
  };

  // Game loop
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const interval = setInterval(() => {
      drop();
    }, dropTime);

    return () => clearInterval(interval);
  }, [isPlaying, gameOver, drop, dropTime]);

  // Level progression
  useEffect(() => {
    const newLevel = Math.floor(lines / 10) + 1;
    if (newLevel !== level) {
      setLevel(newLevel);
      setDropTime(Math.max(100, 1000 - (newLevel - 1) * 100));
    }
  }, [lines, level]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isPlaying || gameOver) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          movePiece(-1, 0);
          break;
        case 'ArrowRight':
          e.preventDefault();
          movePiece(1, 0);
          break;
        case 'ArrowDown':
          e.preventDefault();
          movePiece(0, 1);
          break;
        case 'ArrowUp':
          e.preventDefault();
          movePiece(0, 0, true);
          break;
        case ' ':
          e.preventDefault();
          hardDrop();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, gameOver, movePiece, hardDrop]);

  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);
    
    // Add current piece to display board
    if (currentPiece) {
      currentPiece.shape.forEach((row, dy) => {
        row.forEach((cell, dx) => {
          if (cell) {
            const x = position.x + dx;
            const y = position.y + dy;
            if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
              displayBoard[y][x] = 2; // Current piece
            }
          }
        });
      });
    }

    return displayBoard.map((row, y) => (
      <div key={y} className="flex">
        {row.map((cell, x) => (
          <div
            key={`${y}-${x}`}
            className={`
              w-6 h-6 border border-gray-300
              ${cell === 0 ? 'bg-gray-100' : 
                cell === 1 ? 'bg-gray-600' : 
                currentPiece ? currentPiece.color : 'bg-gray-400'}
            `}
          />
        ))}
      </div>
    ));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tetris</h1>
        <p className="text-gray-600">Susun blok dan hapus baris untuk mendapat skor tinggi!</p>
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        {/* Game Board */}
        <div className="md:col-span-2">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center space-x-4">
                {!isPlaying && !gameOver ? (
                  <Button onClick={startGame} className="bg-green-600 hover:bg-green-700">
                    <Play className="h-4 w-4 mr-2" />
                    Mulai
                  </Button>
                ) : (
                  <Button onClick={pauseGame} variant="outline">
                    {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                    {isPlaying ? 'Jeda' : 'Lanjut'}
                  </Button>
                )}
                <Button onClick={startGame} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Link to="/">
                  <Button variant="ghost">
                    <Home className="h-4 w-4 mr-2" />
                    Beranda
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                {renderBoard()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats and Controls */}
        <div className="md:col-span-2 space-y-6">
          {/* Score */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle>Statistik</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Skor:</span>
                <Badge variant="secondary" className="text-lg">{score.toLocaleString()}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Level:</span>
                <Badge variant="outline">{level}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Baris:</span>
                <Badge variant="outline">{lines}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Next Piece */}
          {nextPiece && (
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Blok Berikutnya</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <div className="grid gap-1">
                    {nextPiece.shape.map((row, y) => (
                      <div key={y} className="flex gap-1">
                        {row.map((cell, x) => (
                          <div
                            key={x}
                            className={`w-5 h-5 rounded-sm ${
                              cell ? nextPiece.color : 'bg-transparent'
                            }`}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Controls */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle>Kontrol</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => movePiece(-1, 0)}
                  disabled={!isPlaying || gameOver}
                >
                  ← Kiri
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => movePiece(1, 0)}
                  disabled={!isPlaying || gameOver}
                >
                  Kanan →
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => movePiece(0, 0, true)}
                  disabled={!isPlaying || gameOver}
                >
                  <RotateCw className="h-4 w-4 mr-2" />
                  Putar
                </Button>
                <Button 
                  variant="outline" 
                  onClick={hardDrop}
                  disabled={!isPlaying || gameOver}
                >
                  <ArrowDown className="h-4 w-4 mr-2" />
                  Jatuh
                </Button>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p><strong>Keyboard:</strong></p>
                <p>← → : Gerak kiri/kanan</p>
                <p>↑ : Putar blok</p>
                <p>↓ : Turun cepat</p>
                <p>Spasi : Jatuh langsung</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Tetris;