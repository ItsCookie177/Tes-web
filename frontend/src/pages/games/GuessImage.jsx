import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { toast } from '../../hooks/use-toast';
import { RefreshCw, Home, Eye, EyeOff, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';

const GuessImage = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isActive, setIsActive] = useState(false);

  // Mock data - akan diganti dengan data dari backend
  const questions = [
    {
      id: 1,
      imageUrl: "🐘",
      answer: "gajah",
      hint: "Hewan besar dengan belalai panjang",
      description: "Hewan mamalia terbesar di darat"
    },
    {
      id: 2,
      imageUrl: "🐱",
      answer: "kucing",
      hint: "Hewan peliharaan yang suka ikan",
      description: "Hewan dengan kumis dan ekor panjang"
    },
    {
      id: 3,
      imageUrl: "🚗",
      answer: "mobil",
      hint: "Kendaraan beroda empat",
      description: "Alat transportasi di jalan raya"
    },
    {
      id: 4,
      imageUrl: "🏠",
      answer: "rumah",
      hint: "Tempat tinggal manusia",
      description: "Bangunan untuk tempat berlindung"
    },
    {
      id: 5,
      imageUrl: "🌸",
      answer: "bunga",
      hint: "Tumbuhan yang indah dan wangi",
      description: "Bagian tumbuhan yang berwarna-warni"
    },
    {
      id: 6,
      imageUrl: "☀️",
      answer: "matahari",
      hint: "Sumber cahaya di siang hari",
      description: "Bintang yang menerangi bumi"
    },
    {
      id: 7,
      imageUrl: "🌧️",
      answer: "hujan",
      hint: "Air yang turun dari langit",
      description: "Fenomena alam saat musim penghujan"
    },
    {
      id: 8,
      imageUrl: "⛰️",
      answer: "gunung",
      hint: "Daratan yang tinggi menjulang",
      description: "Bentuk alam yang lebih tinggi dari bukit"
    }
  ];

  const currentQ = questions[currentQuestion];

  // Timer
  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0 && !gameOver) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      nextQuestion(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, gameOver]);

  const startGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setUserAnswer('');
    setShowHint(false);
    setGameOver(false);
    setTimeLeft(30);
    setIsActive(true);
  };

  const checkAnswer = () => {
    if (!userAnswer.trim()) {
      toast({
        title: "Masukkan jawaban!",
        description: "Ketik jawaban Anda terlebih dahulu.",
      });
      return;
    }

    const isCorrect = userAnswer.toLowerCase().trim() === currentQ.answer.toLowerCase();
    
    if (isCorrect) {
      const points = showHint ? 5 : 10;
      setScore(prev => prev + points);
      toast({
        title: "🎉 Benar!",
        description: `+${points} poin! ${currentQ.description}`,
      });
      nextQuestion(true);
    } else {
      toast({
        title: "❌ Salah!",
        description: `Jawaban yang benar: ${currentQ.answer}`,
      });
      nextQuestion(false);
    }
  };

  const nextQuestion = (correct) => {
    if (currentQuestion + 1 >= questions.length) {
      setGameOver(true);
      setIsActive(false);
      toast({
        title: "Game Selesai!",
        description: `Skor akhir: ${score} dari ${questions.length * 10} poin`,
      });
    } else {
      setCurrentQuestion(prev => prev + 1);
      setUserAnswer('');
      setShowHint(false);
      setTimeLeft(30);
    }
  };

  const skipQuestion = () => {
    toast({
      title: "Dilewati",
      description: `Jawaban: ${currentQ.answer}`,
    });
    nextQuestion(false);
  };

  const toggleHint = () => {
    setShowHint(!showHint);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !gameOver && isActive) {
      checkAnswer();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tebak Gambar</h1>
        <p className="text-gray-600">Tebak kata dari emoji yang ditampilkan!</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Game Area */}
        <div className="md:col-span-2">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <Badge variant="outline">
                    Soal {currentQuestion + 1} / {questions.length}
                  </Badge>
                  {isActive && (
                    <Badge 
                      variant={timeLeft <= 10 ? "destructive" : "secondary"}
                      className="text-lg px-3 py-1"
                    >
                      ⏰ {timeLeft}s
                    </Badge>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button onClick={startGame} variant="outline" size="sm">
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
            <CardContent className="space-y-6">
              {!isActive && !gameOver ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎯</div>
                  <h3 className="text-xl font-semibold mb-4">Siap untuk bermain?</h3>
                  <Button onClick={startGame} className="bg-green-600 hover:bg-green-700 text-white">
                    <Eye className="h-4 w-4 mr-2" />
                    Mulai Tebak Gambar
                  </Button>
                </div>
              ) : gameOver ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎊</div>
                  <h3 className="text-xl font-semibold mb-2">Game Selesai!</h3>
                  <p className="text-gray-600 mb-4">
                    Skor akhir: <span className="font-bold text-blue-600">{score}</span> / {questions.length * 10}
                  </p>
                  <div className="flex justify-center space-x-4">
                    <Button onClick={startGame} className="bg-blue-600 hover:bg-blue-700">
                      Main Lagi
                    </Button>
                    <Link to="/leaderboard">
                      <Button variant="outline">
                        Lihat Ranking
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Image Display */}
                  <div className="text-center">
                    <div className="text-8xl mb-6 p-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
                      {currentQ.imageUrl}
                    </div>
                  </div>

                  {/* Hint */}
                  {showHint && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 text-yellow-800">
                        <Lightbulb className="h-5 w-5" />
                        <span className="font-medium">Petunjuk: {currentQ.hint}</span>
                      </div>
                    </div>
                  )}

                  {/* Answer Input */}
                  <div className="space-y-4">
                    <Input
                      placeholder="Ketik jawaban Anda..."
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="text-lg py-3"
                      disabled={gameOver}
                    />
                    
                    <div className="flex justify-center space-x-3">
                      <Button 
                        onClick={checkAnswer} 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                        disabled={!userAnswer.trim()}
                      >
                        Jawab
                      </Button>
                      <Button onClick={toggleHint} variant="outline">
                        {showHint ? <EyeOff className="h-4 w-4 mr-2" /> : <Lightbulb className="h-4 w-4 mr-2" />}
                        {showHint ? 'Sembunyikan' : 'Petunjuk'}
                      </Button>
                      <Button onClick={skipQuestion} variant="ghost">
                        Lewati
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div>
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl mb-6">
            <CardHeader>
              <CardTitle>Statistik</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Skor:</span>
                <Badge variant="secondary" className="text-lg">{score}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Progres:</span>
                <Badge variant="outline">
                  {currentQuestion + (gameOver ? 0 : 0)} / {questions.length}
                </Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${((currentQuestion + (gameOver ? 1 : 0)) / questions.length) * 100}%` 
                  }}
                />
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
                <li>• Lihat emoji dan tebak kata yang dimaksud</li>
                <li>• Jawaban benar = 10 poin</li>
                <li>• Gunakan petunjuk = 5 poin</li>
                <li>• Waktu terbatas 30 detik per soal</li>
                <li>• Ketik Enter untuk submit jawaban</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GuessImage;