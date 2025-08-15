import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { toast } from '../../hooks/use-toast';
import { RefreshCw, Trophy, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [winner, setWinner] = useState(null);
  const [isDraw, setIsDraw] = useState(false);
  const [scores, setScores] = useState({ X: 0, O: 0 });

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ];

  const checkWinner = (currentBoard) => {
    for (let combination of winningCombinations) {
      const [a, b, c] = combination;
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return currentBoard[a];
      }
    }
    return null;
  };

  const handleSquareClick = (index) => {
    if (board[index] || winner || isDraw) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      setScores(prev => ({ ...prev, [gameWinner]: prev[gameWinner] + 1 }));
      toast({
        title: "🎉 Selamat!",
        description: `Pemain ${gameWinner} menang!`,
      });
    } else if (newBoard.every(square => square)) {
      setIsDraw(true);
      toast({
        title: "⚖️ Seri!",
        description: "Permainan berakhir seri!",
      });
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setIsDraw(false);
  };

  const resetScores = () => {
    setScores({ X: 0, O: 0 });
    resetGame();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tic-Tac-Toe</h1>
        <p className="text-gray-600">Game klasik 3x3 - Buat garis horizontal, vertikal, atau diagonal untuk menang!</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Game Board */}
        <div className="md:col-span-2">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="text-center">
              <div className="flex justify-between items-center mb-4">
                <Badge variant="outline" className="text-sm">
                  Giliran: <span className="font-bold ml-1">{currentPlayer}</span>
                </Badge>
                <div className="flex space-x-2">
                  <Button onClick={resetGame} variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset Game
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
              <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
                {board.map((square, index) => (
                  <button
                    key={index}
                    className={`
                      aspect-square bg-gray-100 hover:bg-gray-200 rounded-lg border-2 
                      flex items-center justify-center text-4xl font-bold
                      transition-all duration-200 transform hover:scale-105
                      ${square === 'X' ? 'text-blue-600 bg-blue-50 border-blue-200' : ''}
                      ${square === 'O' ? 'text-red-600 bg-red-50 border-red-200' : ''}
                      ${!square && !winner && !isDraw ? 'cursor-pointer' : 'cursor-not-allowed'}
                    `}
                    onClick={() => handleSquareClick(index)}
                    disabled={!!square || !!winner || isDraw}
                  >
                    {square}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Game Info */}
        <div>
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <span>Skor Pertandingan</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="font-semibold text-blue-700">Pemain X</span>
                  <Badge variant="secondary" className="text-lg">{scores.X}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span className="font-semibold text-red-700">Pemain O</span>
                  <Badge variant="secondary" className="text-lg">{scores.O}</Badge>
                </div>
                <Button onClick={resetScores} variant="outline" className="w-full">
                  Reset Skor
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Status */}
          {(winner || isDraw) && (
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-0 shadow-xl">
              <CardContent className="pt-6 text-center">
                {winner ? (
                  <div>
                    <div className="text-4xl mb-2">🎉</div>
                    <h3 className="text-xl font-bold text-green-700 mb-2">
                      Pemain {winner} Menang!
                    </h3>
                    <p className="text-gray-600">Selamat! Anda berhasil membuat garis!</p>
                  </div>
                ) : (
                  <div>
                    <div className="text-4xl mb-2">⚖️</div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">
                      Permainan Seri!
                    </h3>
                    <p className="text-gray-600">Papan penuh, tidak ada pemenang.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Rules */}
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Cara Bermain</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Pemain bergiliran menempatkan X dan O</li>
                <li>• Buat garis horizontal, vertikal, atau diagonal</li>
                <li>• Yang pertama membuat garis menang</li>
                <li>• Jika papan penuh tanpa garis, hasilnya seri</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TicTacToe;