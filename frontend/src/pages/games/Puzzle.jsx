import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { toast } from '../../hooks/use-toast';
import { RefreshCw, Home, Shuffle, Trophy, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Puzzle = () => {
  const [gridSize, setGridSize] = useState(3);
  const [tiles, setTiles] = useState([]);
  const [emptyTile, setEmptyTile] = useState(8);
  const [moves, setMoves] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [bestScore, setBestScore] = useState(localStorage.getItem('puzzleBestScore') || null);

  // Initialize puzzle
  const initializePuzzle = () => {
    const size = gridSize * gridSize;
    const initialTiles = Array.from({ length: size - 1 }, (_, i) => i + 1);
    initialTiles.push(0); // Empty tile
    
    setTiles(initialTiles);
    setEmptyTile(size - 1);
    setMoves(0);
    setIsComplete(false);
    setTimeElapsed(0);
    setGameStarted(false);
  };

  // Shuffle tiles
  const shuffleTiles = () => {
    const shuffled = [...tiles];
    const size = gridSize * gridSize;
    
    // Perform random valid moves to ensure solvability
    let currentEmpty = emptyTile;
    
    for (let i = 0; i < 1000; i++) {
      const possibleMoves = getValidMoves(currentEmpty);
      const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      
      // Swap
      [shuffled[currentEmpty], shuffled[randomMove]] = [shuffled[randomMove], shuffled[currentEmpty]];
      currentEmpty = randomMove;
    }
    
    setTiles(shuffled);
    setEmptyTile(currentEmpty);
    setMoves(0);
    setIsComplete(false);
    setTimeElapsed(0);
    setGameStarted(true);
    
    toast({
      title: "Puzzle diacak!",
      description: "Susun kembali angka 1-8 secara berurutan",
    });
  };

  // Get valid moves for empty tile
  const getValidMoves = (emptyIndex) => {
    const moves = [];
    const row = Math.floor(emptyIndex / gridSize);
    const col = emptyIndex % gridSize;
    
    // Up
    if (row > 0) moves.push(emptyIndex - gridSize);
    // Down
    if (row < gridSize - 1) moves.push(emptyIndex + gridSize);
    // Left
    if (col > 0) moves.push(emptyIndex - 1);
    // Right
    if (col < gridSize - 1) moves.push(emptyIndex + 1);
    
    return moves;
  };

  // Handle tile click
  const handleTileClick = (index) => {
    if (!gameStarted || isComplete) return;
    
    const validMoves = getValidMoves(emptyTile);
    
    if (validMoves.includes(index)) {
      const newTiles = [...tiles];
      
      // Swap clicked tile with empty tile
      [newTiles[emptyTile], newTiles[index]] = [newTiles[index], newTiles[emptyTile]];
      
      setTiles(newTiles);
      setEmptyTile(index);
      setMoves(prev => prev + 1);
      
      // Check if puzzle is complete
      checkCompletion(newTiles);
    }
  };

  // Check if puzzle is complete
  const checkCompletion = (currentTiles) => {
    const targetOrder = Array.from({ length: gridSize * gridSize - 1 }, (_, i) => i + 1);
    targetOrder.push(0);
    
    const isComplete = currentTiles.every((tile, index) => tile === targetOrder[index]);
    
    if (isComplete) {
      setIsComplete(true);
      setGameStarted(false);
      
      const score = Math.max(1000 - moves * 10 - timeElapsed, 100);
      
      // Update best score
      if (!bestScore || score > parseInt(bestScore)) {
        setBestScore(score);
        localStorage.setItem('puzzleBestScore', score.toString());
        toast({
          title: "🏆 Rekor Baru!",
          description: `Skor terbaik: ${score} poin!`,
        });
      } else {
        toast({
          title: "🎉 Selamat!",
          description: `Puzzle selesai dalam ${moves} langkah dan ${timeElapsed} detik!`,
        });
      }
    }
  };

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (gameStarted && !isComplete) {
      interval = setInterval(() => {
        setTimeElapsed(time => time + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, isComplete]);

  // Initialize on component mount and grid size change
  useEffect(() => {
    initializePuzzle();
  }, [gridSize]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateScore = () => {
    return Math.max(1000 - moves * 10 - timeElapsed, 100);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Teka-Teki Geser</h1>
        <p className="text-gray-600">Susun angka 1-8 secara berurutan dengan menggeser kotak!</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Game Board */}
        <div className="md:col-span-2">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <Badge variant="outline">
                    {moves} Langkah
                  </Badge>
                  {gameStarted && (
                    <Badge variant="secondary" className="text-lg">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatTime(timeElapsed)}
                    </Badge>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button onClick={shuffleTiles} variant="outline" size="sm">
                    <Shuffle className="h-4 w-4 mr-2" />
                    Acak
                  </Button>
                  <Button onClick={initializePuzzle} variant="outline" size="sm">
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
            <CardContent>
              <div className="flex justify-center">
                <div 
                  className={`
                    grid gap-2 p-4 bg-gray-100 rounded-xl border-2 border-gray-200
                    ${gridSize === 3 ? 'grid-cols-3 w-80' : 'grid-cols-4 w-96'}
                  `}
                >
                  {tiles.map((tile, index) => (
                    <button
                      key={index}
                      className={`
                        aspect-square rounded-lg border-2 flex items-center justify-center
                        text-2xl font-bold transition-all duration-200 transform
                        ${tile === 0 
                          ? 'bg-transparent border-transparent cursor-default' 
                          : `bg-white border-gray-300 hover:border-blue-400 hover:bg-blue-50 
                             hover:scale-105 cursor-pointer shadow-sm hover:shadow-md
                             ${getValidMoves(emptyTile).includes(index) 
                               ? 'border-green-300 bg-green-50' 
                               : ''}`
                        }
                      `}
                      onClick={() => handleTileClick(index)}
                      disabled={tile === 0 || isComplete}
                    >
                      {tile !== 0 && tile}
                    </button>
                  ))}
                </div>
              </div>
              
              {!gameStarted && !isComplete && (
                <div className="text-center mt-6">
                  <p className="text-gray-600 mb-4">Klik "Acak" untuk memulai permainan</p>
                </div>
              )}
              
              {isComplete && (
                <div className="text-center mt-6 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
                  <div className="text-4xl mb-2">🎊</div>
                  <h3 className="text-xl font-bold text-green-700 mb-2">
                    Puzzle Selesai!
                  </h3>
                  <p className="text-gray-600">
                    Diselesaikan dalam <span className="font-semibold">{moves} langkah</span> dan{' '}
                    <span className="font-semibold">{formatTime(timeElapsed)}</span>
                  </p>
                  <p className="text-lg font-semibold text-blue-600 mt-2">
                    Skor: {calculateScore()} poin
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Stats and Controls */}
        <div>
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <span>Statistik</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Langkah:</span>
                <Badge variant="secondary" className="text-lg">{moves}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Waktu:</span>
                <Badge variant="outline">{formatTime(timeElapsed)}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Skor Saat Ini:</span>
                <Badge variant="outline">{gameStarted ? calculateScore() : 0}</Badge>
              </div>
              {bestScore && (
                <div className="flex justify-between items-center">
                  <span>Skor Terbaik:</span>
                  <Badge className="bg-yellow-500">{bestScore}</Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Difficulty */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl mb-6">
            <CardHeader>
              <CardTitle>Tingkat Kesulitan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button
                  onClick={() => setGridSize(3)}
                  variant={gridSize === 3 ? "default" : "outline"}
                  className="w-full"
                  disabled={gameStarted}
                >
                  Mudah (3x3)
                </Button>
                <Button
                  onClick={() => setGridSize(4)}
                  variant={gridSize === 4 ? "default" : "outline"}
                  className="w-full"
                  disabled={gameStarted}
                >
                  Sulit (4x4)
                </Button>
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
                <li>• Klik kotak yang bisa digeser (berwarna hijau)</li>
                <li>• Susun angka 1-8 secara berurutan</li>
                <li>• Kotak kosong harus di pojok kanan bawah</li>
                <li>• Semakin sedikit langkah, semakin tinggi skor</li>
                <li>• Waktu juga mempengaruhi skor akhir</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Puzzle;