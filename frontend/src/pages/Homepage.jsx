import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Play, Users, Clock, Star } from 'lucide-react';
import { mockGames } from '../data/mockData';

const Homepage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Selamat Datang di <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">GameZone ID</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Koleksi game seru dalam bahasa Indonesia. Mainkan catur, tetris, tic-tac-toe, tebak gambar, dan banyak lagi!
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>1,234+ Pemain</span>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="h-4 w-4" />
            <span>15+ Game</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>24/7 Online</span>
          </div>
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {mockGames.map((game) => (
          <Card key={game.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-2">
                <Badge 
                  variant={game.difficulty === 'Mudah' ? 'secondary' : game.difficulty === 'Sedang' ? 'default' : 'destructive'}
                  className="text-xs"
                >
                  {game.difficulty}
                </Badge>
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <Users className="h-4 w-4" />
                  <span>{game.players}</span>
                </div>
              </div>
              <CardTitle className="text-xl text-gray-900 group-hover:text-blue-600 transition-colors">
                {game.title}
              </CardTitle>
              <CardDescription className="text-gray-600 leading-relaxed">
                {game.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>⏱️ ~{game.duration}</span>
                  <span>⭐ {game.rating}/5</span>
                </div>
                <Link to={game.path}>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0">
                    <Play className="h-4 w-4 mr-2" />
                    Main
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stats Section */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Statistik Game Hari Ini</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">1,234</div>
            <div className="text-gray-600">Game Dimainkan</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">567</div>
            <div className="text-gray-600">Pemain Aktif</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">89</div>
            <div className="text-gray-600">Skor Tertinggi</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">15</div>
            <div className="text-gray-600">Game Tersedia</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;