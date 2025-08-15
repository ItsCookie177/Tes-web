import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Trophy, Medal, Award, Home, Star, Clock, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockScores } from '../data/mockData';

const Leaderboard = () => {
  const [selectedGame, setSelectedGame] = useState('all');

  // Mock leaderboard data - akan diganti dengan data dari backend
  const leaderboardData = {
    tetris: [
      { rank: 1, name: "Budi Santoso", score: 15420, date: "2025-01-15", moves: null, time: "12:34" },
      { rank: 2, name: "Sari Dewi", score: 12800, date: "2025-01-15", moves: null, time: "15:22" },
      { rank: 3, name: "Ahmad Rahman", score: 11200, date: "2025-01-14", moves: null, time: "18:45" },
      { rank: 4, name: "Lisa Indah", score: 9850, date: "2025-01-14", moves: null, time: "21:12" },
      { rank: 5, name: "Rudi Habibie", score: 8900, date: "2025-01-13", moves: null, time: "14:33" }
    ],
    "tic-tac-toe": [
      { rank: 1, name: "Lisa Indah", score: 95, date: "2025-01-15", moves: null, time: null },
      { rank: 2, name: "Ahmad Rahman", score: 89, date: "2025-01-15", moves: null, time: null },
      { rank: 3, name: "Sari Dewi", score: 84, date: "2025-01-14", moves: null, time: null },
      { rank: 4, name: "Budi Santoso", score: 78, date: "2025-01-14", moves: null, time: null },
      { rank: 5, name: "Rudi Habibie", score: 72, date: "2025-01-13", moves: null, time: null }
    ],
    "tebak-gambar": [
      { rank: 1, name: "Sari Dewi", score: 80, date: "2025-01-15", moves: null, time: "05:23" },
      { rank: 2, name: "Lisa Indah", score: 75, date: "2025-01-15", moves: null, time: "06:12" },
      { rank: 3, name: "Ahmad Rahman", score: 70, date: "2025-01-14", moves: null, time: "07:45" },
      { rank: 4, name: "Budi Santoso", score: 65, date: "2025-01-14", moves: null, time: "08:33" },
      { rank: 5, name: "Rudi Habibie", score: 60, date: "2025-01-13", moves: null, time: "09:22" }
    ],
    puzzle: [
      { rank: 1, name: "Ahmad Rahman", score: 950, date: "2025-01-15", moves: 45, time: "03:22" },
      { rank: 2, name: "Lisa Indah", score: 890, date: "2025-01-15", moves: 52, time: "04:15" },
      { rank: 3, name: "Sari Dewi", score: 820, date: "2025-01-14", moves: 58, time: "05:33" },
      { rank: 4, name: "Budi Santoso", score: 780, date: "2025-01-14", moves: 64, time: "06:12" },
      { rank: 5, name: "Rudi Habibie", score: 720, date: "2025-01-13", moves: 72, time: "07:45" }
    ]
  };

  const gameNames = {
    all: "Semua Game",
    tetris: "Tetris",
    "tic-tac-toe": "Tic-Tac-Toe",
    "tebak-gambar": "Tebak Gambar",
    puzzle: "Puzzle Geser"
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getRankBadge = (rank) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-white";
      case 3:
        return "bg-gradient-to-r from-amber-400 to-amber-600 text-white";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getAllScores = () => {
    const allScores = [];
    Object.entries(leaderboardData).forEach(([game, scores]) => {
      scores.forEach(score => {
        allScores.push({ ...score, game: gameNames[game] });
      });
    });
    return allScores.sort((a, b) => b.score - a.score).slice(0, 10);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🏆 Papan Peringkat
        </h1>
        <p className="text-gray-600">Lihat skor tertinggi dari para pemain terbaik!</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <Star className="h-5 w-5 text-yellow-500" />
          <span className="text-gray-600">Pemain terbaik minggu ini</span>
        </div>
        <Link to="/">
          <Button variant="ghost">
            <Home className="h-4 w-4 mr-2" />
            Kembali ke Beranda
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-8">
          <TabsTrigger value="all">Semua</TabsTrigger>
          <TabsTrigger value="tetris">Tetris</TabsTrigger>
          <TabsTrigger value="tic-tac-toe">Tic-Tac-Toe</TabsTrigger>
          <TabsTrigger value="tebak-gambar">Tebak Gambar</TabsTrigger>
          <TabsTrigger value="puzzle">Puzzle</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <span>Skor Tertinggi Semua Game</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getAllScores().map((player, index) => (
                  <div
                    key={`${player.name}-${player.game}-${index}`}
                    className={`
                      flex items-center justify-between p-4 rounded-lg border-2 transition-all
                      ${index < 3 ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200 bg-gray-50'}
                    `}
                  >
                    <div className="flex items-center space-x-4">
                      {getRankIcon(index + 1)}
                      <div>
                        <p className="font-semibold text-gray-900">{player.name}</p>
                        <p className="text-sm text-gray-500">{player.game} • {player.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant="secondary" className="text-sm">
                        {player.game}
                      </Badge>
                      <Badge className={getRankBadge(index + 1)}>
                        {player.score.toLocaleString()} poin
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {Object.entries(leaderboardData).map(([gameKey, scores]) => (
          <TabsContent key={gameKey} value={gameKey}>
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    <span>Peringkat {gameNames[gameKey]}</span>
                  </div>
                  <Badge variant="outline">{scores.length} Pemain</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scores.map((player, index) => (
                    <div
                      key={`${player.name}-${index}`}
                      className={`
                        flex items-center justify-between p-4 rounded-lg border-2 transition-all hover:shadow-md
                        ${player.rank === 1 ? 'border-yellow-200 bg-gradient-to-r from-yellow-50 to-amber-50' : 
                          player.rank === 2 ? 'border-gray-200 bg-gradient-to-r from-gray-50 to-slate-50' :
                          player.rank === 3 ? 'border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50' :
                          'border-gray-200 bg-gray-50'}
                      `}
                    >
                      <div className="flex items-center space-x-4">
                        {getRankIcon(player.rank)}
                        <div>
                          <p className="font-semibold text-gray-900">{player.name}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>📅 {player.date}</span>
                            {player.time && (
                              <span className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>{player.time}</span>
                              </span>
                            )}
                            {player.moves && (
                              <span className="flex items-center space-x-1">
                                <Target className="h-3 w-3" />
                                <span>{player.moves} langkah</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Badge className={getRankBadge(player.rank)}>
                        {player.score.toLocaleString()} poin
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Achievement Section */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-0 shadow-xl mt-8">
        <CardHeader>
          <CardTitle className="text-center">🎯 Pencapaian Minggu Ini</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-blue-600">1,234</div>
              <div className="text-gray-600">Total Game Dimainkan</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-purple-600">567</div>
              <div className="text-gray-600">Pemain Aktif</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-green-600">15,420</div>
              <div className="text-gray-600">Skor Tertinggi</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Leaderboard;