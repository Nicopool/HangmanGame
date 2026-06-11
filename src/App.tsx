import { useState, useEffect } from 'react';
import { FileSpreadsheet, Gamepad2, BarChart2, ShieldAlert } from 'lucide-react';
import Header from './components/Header';
import SettingsModal from './components/SettingsModal';
import HistoryDrawer from './components/HistoryDrawer';
import SetupScreen from './components/SetupScreen';
import PlayScreen from './components/PlayScreen';
import ResultsScreen from './components/ResultsScreen';
import { presetCategories } from './data/presets';
import { Language, GameMode, MatchStats, GlobalStats, CustomHint } from './types';

export default function App() {
  // Tabs: 'setup' | 'play' | 'results'
  const [activeTab, setActiveTab] = useState<'setup' | 'play' | 'results'>('setup');

  // App settings
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('hangman_lang');
    return (saved as Language) || 'en';
  });
  
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('hangman_sound');
    return saved !== 'false';
  });

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Match History
  const [matchHistory, setMatchHistory] = useState<MatchStats[]>(() => {
    const saved = localStorage.getItem('hangman_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.error('Error parsing match history', err);
      }
    }
    return [];
  });

  // Global Statistics State
  const [globalStats, setGlobalStats] = useState<GlobalStats>({
    winRate: 0,
    totalGames: 0,
    wins: 0,
    losses: 0,
    currentStreak: 0,
    maxStreak: 0,
    correctGuesses: 0,
    totalGuesses: 0,
  });

  // Active Game State
  const [activeGame, setActiveGame] = useState<{
    secretWord: string;
    hint1?: string;
    hint2?: string;
    hints?: CustomHint[];
    categoryName: string;
    mode: GameMode;
  } | null>(null);

  // Persist settings
  useEffect(() => {
    localStorage.setItem('hangman_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('hangman_sound', soundEnabled.toString());
  }, [soundEnabled]);

  // Sync match history to local storage & re-calculate statistics
  useEffect(() => {
    localStorage.setItem('hangman_history', JSON.stringify(matchHistory));
    
    // Core statistics recalculation logic
    if (matchHistory.length === 0) {
      setGlobalStats({
        winRate: 0,
        totalGames: 0,
        wins: 0,
        losses: 0,
        currentStreak: 0,
        maxStreak: 0,
        correctGuesses: 0,
        totalGuesses: 0,
      });
      return;
    }

    const total = matchHistory.length;
    const wins = matchHistory.filter((m) => m.status === 'won').length;
    const losses = total - wins;
    const winRate = Math.round((wins / total) * 100);

    // Calculate correct vs total keyboard guesses
    let correctGuesses = 0;
    let totalGuesses = 0;

    matchHistory.forEach((m) => {
      // Guessed letters array
      const guessed = m.guessedLetters || [];
      const normalizedWord = m.word
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toUpperCase();

      guessed.forEach((letter) => {
        totalGuesses++;
        if (normalizedWord.includes(letter)) {
          correctGuesses++;
        }
      });
    });

    // Calculate Streaks
    // Sort chronologically (oldest to newest) to track proper streaks
    // Our history appends new games, so index 0 is older, last index is newest.
    // Let's compute iteratively:
    let currStreak = 0;
    let maxStreak = 0;

    matchHistory.forEach((match) => {
      if (match.status === 'won') {
        currStreak++;
        if (currStreak > maxStreak) {
          maxStreak = currStreak;
        }
      } else {
        currStreak = 0;
      }
    });

    setGlobalStats({
      winRate,
      totalGames: total,
      wins,
      losses,
      currentStreak: currStreak,
      maxStreak,
      correctGuesses,
      totalGuesses,
    });
  }, [matchHistory]);

  // Active game session storage removed per refresh restart request

  // Form submit starts new match
  const handleStartGame = (params: {
    mode: GameMode;
    secretWord: string;
    hint1?: string;
    hint2?: string;
    hints?: CustomHint[];
    categoryName?: string;
  }) => {
    setActiveGame({
      secretWord: params.secretWord,
      hint1: params.hint1,
      hint2: params.hint2,
      hints: params.hints,
      categoryName: params.categoryName || (language === 'en' ? 'Custom Duel' : 'Duelo Personalizado'),
      mode: params.mode,
    });
    // Jump straight to the board
    setActiveTab('play');
  };

  // Add recorded stats on finish
  const handleGameFinished = (finishedStats: {
    word: string;
    category: string;
    status: 'won' | 'lost';
    livesRemaining: number;
    hintsUsed: number;
    durationSeconds: number;
    guessedLetters: string[];
  }) => {
    const newRecord: MatchStats = {
      id: Math.random().toString(36).substr(2, 9),
      word: finishedStats.word,
      category: finishedStats.category,
      status: finishedStats.status,
      livesRemaining: finishedStats.livesRemaining,
      hintsUsed: finishedStats.hintsUsed,
      durationSeconds: finishedStats.durationSeconds,
      guessedLetters: finishedStats.guessedLetters,
      date: new Date().toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMatchHistory((prev) => [...prev, newRecord]);
  };

  const handleResetStatistics = () => {
    setMatchHistory([]);
    setActiveGame(null);
    setActiveTab('setup');
    setSettingsOpen(false);
  };

  return (
    <div className="bg-[#f8f9fb] text-[#191c1e] min-h-screen flex flex-col font-sans antialiased pb-20 md:pb-8">
      {/* Dynamic Native Header */}
      <Header
        language={language}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenHistoryDrawer={() => setDrawerOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-grow pt-24 pb-8 px-4 flex items-center justify-center">
        <div className="w-full max-w-5xl flex items-center justify-center">
          {/* TAB 1: SETUP */}
          {activeTab === 'setup' && (
            <SetupScreen
              language={language}
              presetCategories={presetCategories}
              onStartGame={handleStartGame}
            />
          )}

          {/* TAB 2: PLAY */}
          {activeTab === 'play' && (
            activeGame ? (
              <PlayScreen
                language={language}
                secretWord={activeGame.secretWord}
                hint1={activeGame.hint1}
                hint2={activeGame.hint2}
                hints={activeGame.hints}
                categoryName={activeGame.categoryName}
                mode={activeGame.mode}
                soundEnabled={soundEnabled}
                onGameFinished={handleGameFinished}
                onNavigateToConfig={() => {
                  setActiveGame(null);
                  setActiveTab('setup');
                }}
              />
            ) : (
              /* Fallback setup guide if they land on play without active word */
              <div className="w-full max-w-md bg-white border border-[#E1E2E4] rounded-xl p-6 text-center space-y-4 shadow-sm" id="empty-play-fallback">
                <div className="p-3 bg-[#EBF2FF] text-[#003d9b] rounded-full w-fit mx-auto">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h2 className="font-sans font-bold text-[#091E42] text-lg">
                    {language === 'en' ? 'No Active Session' : 'Sin Partida Activa'}
                  </h2>
                  <p className="font-sans text-[#585f6a] text-xs leading-relaxed">
                    {language === 'en'
                      ? 'Please navigate to the setup screen or click the quick-launch button below to select a word and begin guessing.'
                      : 'Por favor ve a la pestaña de configuración para seleccionar una palabra clave y comenzar el juego.'}
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('setup')}
                  className="bg-[#003d9b] hover:bg-[#0040A0] text-white font-sans font-semibold text-xs px-5 py-2.5 rounded-lg active:scale-95 transition-all w-full cursor-pointer"
                  id="btn-fallback-setup-nav"
                >
                  {language === 'en' ? 'Start Setup' : 'Comenzar Configuración'}
                </button>
              </div>
            )
          )}

          {/* TAB 3: RESULTS (ANALYTICS) */}
          {activeTab === 'results' && (
            <ResultsScreen
              language={language}
              globalStats={globalStats}
              matchHistory={matchHistory}
              onStartNewGame={() => {
                setActiveGame(null);
                setActiveTab('setup');
              }}
            />
          )}
        </div>
      </main>

      {/* Side drawer launcher */}
      <HistoryDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        language={language}
        matchHistory={matchHistory}
      />

      {/* Settings Dialog Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        language={language}
        setLanguage={setLanguage}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onResetStats={handleResetStatistics}
      />

      {/* Floating Bottom Nav for Mobile Screens (Max-Width target md) */}
      <nav 
        className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-[#E1E2E4] z-30 flex items-center justify-around px-4 shadow-[0_-2px_10px_rgba(0,0,0,0.03)]"
        id="bottom-mobile-nav"
      >
        <button
          onClick={() => setActiveTab('setup')}
          className={`flex flex-col items-center justify-center p-1.5 transition-all text-[11px] font-semibold ${
            activeTab === 'setup' ? 'text-[#003d9b]' : 'text-[#737685] hover:text-[#585f6a]'
          }`}
          id="btn-nav-setup-mobile"
        >
          <FileSpreadsheet className="w-5 h-5 mb-0.5" />
          <span>{language === 'en' ? 'Setup' : 'Configurar'}</span>
        </button>

        <button
          onClick={() => setActiveTab('play')}
          className={`relative flex flex-col items-center justify-center p-1.5 transition-all text-[11px] font-semibold ${
            activeTab === 'play' ? 'text-[#003d9b]' : 'text-[#737685] hover:text-[#585f6a]'
          }`}
          id="btn-nav-play-mobile"
        >
          {activeGame && !['won', 'lost'].includes(activeTab) && (
            <span className="absolute top-1 right-2.5 w-2 h-2 rounded-full bg-[#ba1a1a] animate-pulse" />
          )}
          <Gamepad2 className="w-5 h-5 mb-0.5" />
          <span>{language === 'en' ? 'Play' : 'Jugar'}</span>
        </button>

        <button
          onClick={() => setActiveTab('results')}
          className={`flex flex-col items-center justify-center p-1.5 transition-all text-[11px] font-semibold ${
            activeTab === 'results' ? 'text-[#003d9b]' : 'text-[#737685] hover:text-[#585f6a]'
          }`}
          id="btn-nav-results-mobile"
        >
          <BarChart2 className="w-5 h-5 mb-0.5" />
          <span>{language === 'en' ? 'Results' : 'Resultados'}</span>
        </button>
      </nav>
    </div>
  );
}
