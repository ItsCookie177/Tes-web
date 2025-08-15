import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import Homepage from "./pages/Homepage";
import TicTacToe from "./pages/games/TicTacToe";
import Tetris from "./pages/games/Tetris";
import Chess from "./pages/games/Chess";
import GuessImage from "./pages/games/GuessImage";
import Puzzle from "./pages/games/Puzzle";
import Leaderboard from "./pages/Leaderboard";
import Header from "./components/Header";

function App() {
  return (
    <div className="App min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/tic-tac-toe" element={<TicTacToe />} />
          <Route path="/tetris" element={<Tetris />} />
          <Route path="/chess" element={<Chess />} />
          <Route path="/tebak-gambar" element={<GuessImage />} />
          <Route path="/puzzle" element={<Puzzle />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;