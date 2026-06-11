export type Language = 'en' | 'es';
export type GameMode = 'solo' | 'vs';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameStatus = 'setup' | 'playing' | 'won' | 'lost';

export interface CustomHint {
  text: string;
  anchorChar?: string;
}

export interface PresetWord {
  word: string;
  hint1: string;
  hint2: string;
}

export interface PresetCategory {
  id: string;
  nameEn: string;
  nameEs: string;
  descriptionEn: string;
  descriptionEs: string;
  wordsEn: PresetWord[];
  wordsEs: PresetWord[];
}

export interface MatchStats {
  id: string;
  word: string;
  category: string;
  status: 'won' | 'lost';
  livesRemaining: number;
  hintsUsed: number;
  durationSeconds: number;
  date: string;
  guessedLetters: string[];
}

export interface GlobalStats {
  winRate: number;
  totalGames: number;
  wins: number;
  losses: number;
  currentStreak: number;
  maxStreak: number;
  correctGuesses: number;
  totalGuesses: number;
}
