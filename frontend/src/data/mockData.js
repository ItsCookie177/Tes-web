// Mock data untuk development - akan diganti dengan data dari backend
export const mockGames = [
  {
    id: 1,
    title: "Tic-Tac-Toe",
    description: "Game klasik 3x3 yang mudah dimainkan. Siapa yang bisa membuat garis pertama menang!",
    path: "/tic-tac-toe",
    difficulty: "Mudah",
    players: "1-2",
    duration: "5 menit",
    rating: 4.2,
    category: "Strategi"
  },
  {
    id: 2,
    title: "Tetris",
    description: "Susun blok-blok yang jatuh dan buat garis horizontal untuk mendapat skor tinggi.",
    path: "/tetris",
    difficulty: "Sedang",
    players: "1",
    duration: "15 menit",
    rating: 4.7,
    category: "Puzzle"
  },
  {
    id: 3,
    title: "Catur",
    description: "Game strategi raja dari segala zaman. Asah kemampuan berpikir Anda!",
    path: "/chess",
    difficulty: "Sulit",
    players: "2",
    duration: "30 menit",
    rating: 4.5,
    category: "Strategi"
  },
  {
    id: 4,
    title: "Tebak Gambar",
    description: "Tebak kata dari gambar yang ditampilkan. Game seru untuk mengasah kreativitas!",
    path: "/tebak-gambar",
    difficulty: "Mudah",
    players: "1+",
    duration: "10 menit",
    rating: 4.3,
    category: "Trivia"
  },
  {
    id: 5,
    title: "Teka-Teki Geser",
    description: "Susun puzzle dengan menggeser kotak-kotak hingga membentuk gambar yang benar.",
    path: "/puzzle",
    difficulty: "Sedang",
    players: "1",
    duration: "20 menit",
    rating: 4.1,
    category: "Puzzle"
  },
  {
    id: 6,
    title: "Memory Cards",
    description: "Latih memori Anda dengan mencocokan kartu-kartu yang tersembunyi.",
    path: "/memory-cards",
    difficulty: "Mudah",
    players: "1",
    duration: "8 menit",
    rating: 4.4,
    category: "Memory"
  }
];

export const mockScores = [
  { id: 1, playerName: "Budi Santoso", game: "Tetris", score: 15420, date: "2025-01-15" },
  { id: 2, playerName: "Sari Wati", game: "Tic-Tac-Toe", score: 89, date: "2025-01-15" },
  { id: 3, playerName: "Ahmad Rahman", game: "Catur", score: 1250, date: "2025-01-14" },
  { id: 4, playerName: "Lisa Indah", game: "Tebak Gambar", score: 340, date: "2025-01-14" },
  { id: 5, playerName: "Rudi Habibie", game: "Puzzle", score: 780, date: "2025-01-13" }
];

export const mockPuzzleImages = [
  "Gajah", "Kucing", "Mobil", "Rumah", "Bunga", "Matahari", "Hujan", "Gunung"
];

export const mockRiddles = [
  {
    id: 1,
    question: "Aku punya mata tapi tidak bisa melihat. Aku apa?",
    answer: "jarum",
    hint: "Digunakan untuk menjahit"
  },
  {
    id: 2,
    question: "Semakin dimakan semakin banyak, apa itu?",
    answer: "lubang",
    hint: "Ada di tanah"
  },
  {
    id: 3,
    question: "Aku bisa terbang tanpa sayap, aku apa?",
    answer: "waktu",
    hint: "Selalu berjalan"
  }
];