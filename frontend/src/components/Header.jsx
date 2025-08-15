import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Home, Trophy, Gamepad2 } from 'lucide-react';

const Header = () => {
  const location = useLocation();

  return (
    <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <Gamepad2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">GameZone ID</h1>
              <p className="text-xs text-gray-500">Portal Game Indonesia</p>
            </div>
          </Link>

          <nav className="flex items-center space-x-4">
            <Link to="/">
              <Button 
                variant={location.pathname === '/' ? 'default' : 'ghost'}
                size="sm"
                className="flex items-center space-x-2"
              >
                <Home className="h-4 w-4" />
                <span>Beranda</span>
              </Button>
            </Link>
            <Link to="/leaderboard">
              <Button 
                variant={location.pathname === '/leaderboard' ? 'default' : 'ghost'}
                size="sm"
                className="flex items-center space-x-2"
              >
                <Trophy className="h-4 w-4" />
                <span>Papan Skor</span>
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;