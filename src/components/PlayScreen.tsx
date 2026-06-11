import React, { useState, useEffect, useRef } from 'react';
import { Heart, CheckCircle2, AlertCircle, XCircle, Lightbulb, RotateCcw, ArrowRight, Volume2, VolumeX, Anchor } from 'lucide-react';
import { Language, GameMode, CustomHint } from '../types';
import { playSound } from '../utils/audio';

interface PlayScreenProps {
  language: Language;
  secretWord: string;
  hint1?: string;
  hint2?: string;
  hints?: CustomHint[];
  categoryName?: string;
  mode: GameMode;
  soundEnabled: boolean;
  onGameFinished: (stats: {
    word: string;
    category: string;
    status: 'won' | 'lost';
    livesRemaining: number;
    hintsUsed: number;
    durationSeconds: number;
    guessedLetters: string[];
  }) => void;
  onNavigateToConfig: () => void;
}

export default function PlayScreen({
  language,
  secretWord,
  hint1,
  hint2,
  hints,
  categoryName,
  mode,
  soundEnabled,
  onGameFinished,
  onNavigateToConfig,
}: PlayScreenProps) {
  // Normalize the secret word: uppercase, trimmed, replace special characters or accent marks optionally
  // But let's keep original format with accent marks for display, and handle matching without accents!
  const normalizeChar = (c: string) => {
    return c
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase();
  };

  const wordLetters = secretWord.split('');
  const normalizedWordLetters = wordLetters.map(normalizeChar);

  // Consolidate hints list (up to 6 hints)
  const hintsList: CustomHint[] = React.useMemo(() => {
    if (hints && hints.length > 0) {
      return hints;
    }
    const list: CustomHint[] = [];
    if (hint1) list.push({ text: hint1 });
    if (hint2) list.push({ text: hint2 });
    return list;
  }, [hints, hint1, hint2]);

  // States
  const [guessedLetters, setGuessedLetters] = useState<string[]>(() => {
    const savedWord = localStorage.getItem('hangman_active_word');
    if (savedWord === secretWord) {
      const saved = localStorage.getItem('hangman_guessed_letters');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return [];
  });

  const [lives, setLives] = useState<number>(() => {
    const savedWord = localStorage.getItem('hangman_active_word');
    if (savedWord === secretWord) {
      const saved = localStorage.getItem('hangman_lives');
      if (saved !== null) {
        return parseInt(saved, 10);
      }
    }
    return 6;
  });

  const [hintsRevealed, setHintsRevealed] = useState<number>(() => {
    const savedWord = localStorage.getItem('hangman_active_word');
    if (savedWord === secretWord) {
      const saved = localStorage.getItem('hangman_hints_revealed');
      if (saved !== null) {
        return parseInt(saved, 10);
      }
    }
    return 0;
  });

  const [gameEnded, setGameEnded] = useState<'won' | 'lost' | null>(() => {
    const savedWord = localStorage.getItem('hangman_active_word');
    if (savedWord === secretWord) {
      const saved = localStorage.getItem('hangman_game_ended');
      if (saved === 'won' || saved === 'lost') {
        return saved;
      }
    }
    return null;
  });
  
  // Timer state
  const [timeSpent, setTimeSpent] = useState<number>(() => {
    const savedWord = localStorage.getItem('hangman_active_word');
    if (savedWord === secretWord) {
      const saved = localStorage.getItem('hangman_time_spent');
      if (saved !== null) {
        return parseInt(saved, 10);
      }
    }
    return 0;
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('hangman_active_word', secretWord);
  }, [secretWord]);

  useEffect(() => {
    localStorage.setItem('hangman_guessed_letters', JSON.stringify(guessedLetters));
  }, [guessedLetters]);

  useEffect(() => {
    localStorage.setItem('hangman_lives', lives.toString());
  }, [lives]);

  useEffect(() => {
    localStorage.setItem('hangman_hints_revealed', hintsRevealed.toString());
  }, [hintsRevealed]);

  useEffect(() => {
    if (gameEnded) {
      localStorage.setItem('hangman_game_ended', gameEnded);
    } else {
      localStorage.removeItem('hangman_game_ended');
    }
  }, [gameEnded]);

  useEffect(() => {
    localStorage.setItem('hangman_time_spent', timeSpent.toString());
  }, [timeSpent]);

  const handleNavigateToConfig = () => {
    localStorage.removeItem('hangman_active_word');
    localStorage.removeItem('hangman_guessed_letters');
    localStorage.removeItem('hangman_lives');
    localStorage.removeItem('hangman_hints_revealed');
    localStorage.removeItem('hangman_game_ended');
    localStorage.removeItem('hangman_time_spent');
    onNavigateToConfig();
  };

  // Status feedback banners
  const [feedback, setFeedback] = useState<{
    text: string;
    type: 'success' | 'error' | 'warning' | null;
  }>({ text: '', type: null });

  // Keyboard definition depending on language
  // Spanish keyboard includes Ñ
  const getKeyboardLettersRows = () => {
    const row1 = 'QWERTYUIOP'.split('');
    const row2 = language === 'es' ? 'ASDFGHJKLÑ'.split('') : 'ASDFGHJKL'.split('');
    const row3 = 'ZXCVBNM'.split('');
    return [row1, row2, row3];
  };

  const getKeyboardLetters = () => {
    const rows = getKeyboardLettersRows();
    return [...rows[0], ...rows[1], ...rows[2]];
  };

  const lettersList = getKeyboardLetters();
  const numbersList = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
  const symbolsList = ['.', ',', '-', '_', '?', '!', '@', '#', '$', '%', '&', '+', '*', '=', '/', '(', ')', ':', ';'];

  // Start Timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [secretWord]);

  // Handle letter guess logic
  const makeGuess = (letter: string) => {
    if (gameEnded) return;

    const normalizedLetter = normalizeChar(letter);
    if (guessedLetters.includes(normalizedLetter)) {
      setFeedback({
        text: language === 'en' ? 'Letter already chosen!' : '¡Esa letra ya fue elegida!',
        type: 'warning',
      });
      return;
    }

    // Add to guessed list
    const newGuessed = [...guessedLetters, normalizedLetter];
    setGuessedLetters(newGuessed);

    // Check if letter exists in normalized word
    const isCorrect = normalizedWordLetters.includes(normalizedLetter);

    if (isCorrect) {
      playSound('correct', soundEnabled);
      setFeedback({
        text: language === 'en' ? 'Correct guess!' : '¡Acierto correcto!',
        type: 'success',
      });

      // Check if won
      const hasWon = normalizedWordLetters.every(
        (char) => char === ' ' || newGuessed.includes(char)
      );

      if (hasWon) {
        handleGameEnd('won', newGuessed);
      }
    } else {
      playSound('wrong', soundEnabled);
      const newLives = lives - 1;
      setLives(newLives);

      setFeedback({
        text: language === 'en' ? 'Incorrect guess!' : '¡Fallo incorrecto!',
        type: 'error',
      });

      if (newLives <= 0) {
        handleGameEnd('lost', newGuessed);
      }
    }
  };

  const handleGameEnd = (status: 'won' | 'lost', currentGuessed: string[]) => {
    setGameEnded(status);
    playSound(status === 'won' ? 'win' : 'lose', soundEnabled);
    if (timerRef.current) clearInterval(timerRef.current);

    // Call state callback to register result
    onGameFinished({
      word: secretWord,
      category: categoryName || (language === 'en' ? 'Custom Game' : 'Partida Personalizada'),
      status,
      livesRemaining: status === 'won' ? lives : 0,
      hintsUsed: hintsRevealed,
      durationSeconds: timeSpent,
      guessedLetters: currentGuessed,
    });
  };

  const handleUseHint = () => {
    if (gameEnded) return;
    if (hintsRevealed < hintsList.length) {
      setHintsRevealed((prev) => prev + 1);
    } else {
      setFeedback({
        text: language === 'en' ? 'No more hints available!' : '¡No hay más pistas disponibles!',
        type: 'warning',
      });
    }
  };

  // Keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameEnded) return;
      
      // Ignore keydown if interactive fields are focused
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.tagName === 'SELECT'
      ) {
        return;
      }

      const key = e.key.toUpperCase();
      if (lettersList.includes(key) || numbersList.includes(key) || symbolsList.includes(key)) {
        makeGuess(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [guessedLetters, gameEnded, lettersList, numbersList, symbolsList, lives]);

  const renderKey = (keyChar: string) => {
    const normLet = normalizeChar(keyChar);
    const hasBeenGuessed = guessedLetters.includes(normLet);
    const isCorrectInWord = normalizedWordLetters.includes(normLet);

    let btnClass = '';
    if (hasBeenGuessed && isCorrectInWord) {
      btnClass = 'bg-[#003d9b] text-white hover:bg-[#002f7a] shadow-xs cursor-default';
    } else if (hasBeenGuessed && !isCorrectInWord) {
      btnClass = 'bg-[#edeef0] text-[#737685] opacity-40 cursor-not-allowed border border-[#edeef0]';
    } else {
      btnClass = 'bg-white border border-[#c3c6d6] hover:border-[#003d9b] hover:shadow-[0_4px_12px_rgba(9,30,66,0.08)] active:scale-95 text-[#091E42] hover:bg-[#EBF2FF] active:bg-[#003d9b]/10 cursor-pointer';
    }

    return (
      <button
        key={keyChar}
        onClick={() => makeGuess(keyChar)}
        disabled={hasBeenGuessed}
        className={`h-9 md:h-11 rounded font-sans font-bold text-xs md:text-sm flex items-center justify-center transition-all focus:outline-none select-none ${btnClass}`}
        id={`key-${keyChar}`}
      >
        {keyChar}
      </button>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col items-center justify-start gap-6 lg:flex-row lg:items-start lg:justify-center lg:gap-8">
      {/* Left/Top: Hangman Area Card */}
      <section 
        className="w-full max-w-[400px] aspect-square bg-[#EBECF0] rounded-xl border border-[#E1E2E4] flex items-center justify-center relative shadow-[inset_0_4px_12px_rgba(9,30,66,0.04)]"
        id="hangman-drawing-section"
      >
        <div className="absolute top-4 right-4 flex items-center gap-1.5 text-[#585f6a]">
          <Heart className={`w-4.5 h-4.5 text-[#ba1a1a] ${lives <= 1 ? 'animate-pulse' : ''}`} fill="#ba1a1a" />
          <span className="font-sans font-semibold text-xs md:text-sm">
            {language === 'en' ? `Lives: ${lives}/6` : `Vidas: ${lives}/6`}
          </span>
        </div>

        {categoryName && (
          <div className="absolute top-4 left-4">
            <span className="inline-block bg-[#003d9b]/10 text-[#003d9b] font-sans font-semibold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full">
              {categoryName}
            </span>
          </div>
        )}

        {/* Dynamic Stylized Hangman Graphic drawing (as defined in setup rules) */}
        <svg
          className="w-2/3 h-2/3 stroke-[#003d9b]"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3.5"
          viewBox="0 0 200 200"
          id="hangman-svg"
        >
          {/* Base - Always visible */}
          <path d="M20 180 L180 180" className="transition-all duration-300" />
          
          {/* Pole - Always visible */}
          <path d="M60 180 L60 20" className="transition-all duration-300" />
          
          {/* Top Bar - Always visible */}
          <path d="M60 20 L140 20" className="transition-all duration-300" />
          
          {/* Rope - Always visible (styled with a custom color/weight if wanted, but using stroke) */}
          <path d="M140 20 L140 45" stroke="#314368" strokeWidth="2" className="transition-all duration-300" />

          {/* Head - Visible at <= 5 lives */}
          {lives <= 5 && (
            <circle cx="140" cy="60" r="15" className="transition-all duration-300 stroke-[#003d9b]" fill="none" />
          )}

          {/* Body - Visible at <= 4 lives */}
          {lives <= 4 && (
            <path d="M140 75 L140 120" className="transition-all duration-300" />
          )}

          {/* Left Arm - Visible at <= 3 lives */}
          {lives <= 3 && (
            <path d="M140 90 L115 105" className="transition-all duration-300" />
          )}

          {/* Right Arm - Visible at <= 2 lives */}
          {lives <= 2 && (
            <path d="M140 90 L165 105" className="transition-all duration-300" />
          )}

          {/* Left Leg - Visible at <= 1 lives */}
          {lives <= 1 && (
            <path d="M140 120 L115 150" className="transition-all duration-300" />
          )}

          {/* Right Leg / Face details - Visible at <= 0 lives */}
          {lives <= 0 && (
            <>
              <path d="M140 120 L165 150" className="transition-all duration-300" />
              {/* Little X eyes on the head to show it is absolute game over */}
              <path d="M135 56 L139 60" strokeWidth="1.5" />
              <path d="M139 56 L135 60" strokeWidth="1.5" />
              <path d="M141 56 L145 60" strokeWidth="1.5" />
              <path d="M145 56 L141 60" strokeWidth="1.5" />
            </>
          )}
        </svg>

        {timeSpent > 0 && !gameEnded && (
          <div className="absolute bottom-3 right-4 text-[11px] font-mono text-[#585f6a]">
            {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
          </div>
        )}
      </section>

      {/* Right/Bottom: Guessing Area */}
      <section className="w-full max-w-[620px] flex flex-col gap-5" id="guessing-section">
        {/* Toast / Visual Feedback Banner */}
        <div 
          className={`w-full py-2.5 px-4 rounded-lg border flex items-center justify-center gap-2 transition-all duration-300 ${
            feedback.type === 'success'
              ? 'bg-[#E3FCEF] text-[#006644] border-[#006644]/20 opacity-100 translate-y-0'
              : feedback.type === 'error'
              ? 'bg-[#FFEBE6] text-[#BF2600] border-[#BF2600]/20 opacity-100 translate-y-0'
              : feedback.type === 'warning'
              ? 'bg-[#FFF0B3] text-[#172B4D] border-[#FFE380]/40 opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-2 pointer-events-none'
          }`}
          id="feedback-toast"
        >
          {feedback.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#006644]" />}
          {feedback.type === 'error' && <XCircle className="w-4 h-4 text-[#BF2600]" />}
          {feedback.type === 'warning' && <AlertCircle className="w-4 h-4 text-[#FFAB00]" />}
          <span className="font-sans font-semibold text-xs md:text-sm">
            {feedback.text || 'Placeholder'}
          </span>
        </div>

        {/* Word Display Slots */}
        <div className="flex flex-col items-center gap-4 bg-white p-5 rounded-xl border border-[#E1E2E4] shadow-xs">
          {/* Find which unique characters are currently anchored to a revealed hint */}
          {(() => {
            const activeAnchorChars = hintsList
              .slice(0, hintsRevealed)
              .map((h) => normalizeChar(h.anchorChar || ''))
              .filter(Boolean);

            return (
              <div className="flex gap-2.5 flex-wrap justify-center py-4" id="word-slots-container">
                {wordLetters.map((char, index) => {
                  const matchedNormalized = normalizedWordLetters[index];
                  const isSpace = char === ' ';
                  const isGuessed = guessedLetters.includes(matchedNormalized);
                  const isAnchoredActive = activeAnchorChars.includes(matchedNormalized) && !isGuessed;
                  
                  if (isSpace) {
                    return (
                      <div 
                        key={index} 
                        className="w-5 md:w-8" 
                        aria-hidden="true" 
                      />
                    );
                  }

                  return (
                    <div
                      key={index}
                      className={`flex flex-col items-center justify-end h-12 md:h-16 w-8 md:w-11 border-b-2 pb-1 text-center font-sans tracking-tight transition-all duration-300 ${
                        isAnchoredActive
                          ? 'border-[#f59e0b] bg-[#fffbeb] shadow-[0_4px_12px_rgba(245,158,11,0.15)] animate-pulse border-b-[3px] rounded-t-md px-1'
                          : 'border-[#c3c6d6]'
                      }`}
                      id={`slot-${index}`}
                    >
                      <span
                        className={`font-sans font-bold text-xl md:text-2xl text-[#091E42] transition-all duration-200 ${
                          isGuessed || gameEnded ? 'opacity-100 transform scale-100' : 'opacity-0 transform scale-90'
                        } ${!isGuessed && gameEnded === 'lost' ? 'text-[#ba1a1a]/70' : ''}`}
                      >
                        {char}
                      </span>
                    </div>
                  );
                })}
              </div>
            );
          })()}

          {/* Hint Area */}
          <div className="w-full flex flex-col items-center" id="hint-area">
            {hintsList.length > 0 && !gameEnded && (
              <button
                onClick={handleUseHint}
                className="flex items-center gap-1.5 text-[#003d9b] bg-[#EBF2FF] hover:bg-[#003d9b]/15 px-4 py-2 rounded-full transition-colors font-sans font-semibold text-xs md:text-sm cursor-pointer"
                id="btn-use-hint"
              >
                <Lightbulb className="w-4 h-4" />
                {hintsRevealed === 0
                  ? (language === 'en' ? 'Use Hint' : 'Usar Pista')
                  : hintsRevealed < hintsList.length
                  ? (language === 'en' ? `Reveal Hint #${hintsRevealed + 1}` : `Revelar Pista #${hintsRevealed + 1}`)
                  : (language === 'en' ? 'No more hints' : 'Sin más pistas')}
                <span className="text-[10px] bg-[#003d9b]/15 px-1.5 py-0.5 rounded-full ml-1 font-bold">
                  {hintsRevealed}/{hintsList.length}
                </span>
              </button>
            )}

            {/* Revealed hints box */}
            {hintsRevealed > 0 && (
              <div className="mt-4 w-full bg-[#f8f9fb] p-3.5 rounded-lg border border-[#E1E2E4] text-left space-y-3 max-w-sm" id="revealed-hints-box">
                {hintsList.slice(0, hintsRevealed).map((hint, idx) => {
                  const hasAnchor = hint.anchorChar && hint.anchorChar.trim().length > 0;
                  return (
                    <div key={idx} className={`space-y-1 ${idx > 0 ? 'pt-2.5 border-t border-[#E1E2E4]/60' : ''}`}>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-sans font-bold text-[10px] text-[#003d9b] uppercase tracking-wider">
                          {language === 'en' ? `Hint #${idx + 1}` : `Pista #${idx + 1}`}:
                        </span>
                        {hasAnchor && (
                          <span className="font-sans font-bold text-[9px] text-[#b45309] bg-[#fffbeb] px-1.5 py-0.5 rounded border border-[#f59e0b]/30 flex items-center gap-1 shrink-0">
                            <Anchor className="w-2.5 h-2.5" />
                            {language === 'en' ? 'Anchored' : 'Anclado'}
                          </span>
                        )}
                      </div>
                      <p className="font-sans text-xs text-[#091E42]">{hint.text}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Keyboard Area or Game Outcomes */}
        {gameEnded ? (
          <div className="bg-white border border-[#E1E2E4] rounded-xl p-6 shadow-md text-center space-y-4 animate-scale-in">
            {gameEnded === 'won' ? (
              <div className="space-y-1">
                <h3 className="font-sans font-bold text-xl md:text-2xl text-[#006644]">
                  {language === 'en' ? 'Congratulations!' : '¡Felicitaciones!'}
                </h3>
                <p className="font-sans text-[#434654] text-xs md:text-sm">
                  {language === 'en' 
                    ? `You successfully deciphered the secret word in ${timeSpent} seconds!` 
                    : `¡Has descifrado con éxito la palabra secreta en ${timeSpent} segundos!`}
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <h3 className="font-sans font-bold text-xl md:text-2xl text-[#ba1a1a]">
                  {language === 'en' ? 'Game Over' : 'Fin de Partida'}
                </h3>
                <p className="font-sans text-[#434654] text-xs md:text-sm">
                  {language === 'en'
                    ? `No attempts remaining. The secret word was: `
                    : `Te quedaste sin vidas. La palabra secreta era: `}
                  <strong className="text-[#091E42] tracking-wide uppercase">{secretWord}</strong>
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-2">
              <button
                onClick={handleNavigateToConfig}
                className="px-5 py-2.5 border border-[#c3c6d6] hover:bg-[#edeef0] text-[#091E42] font-sans font-semibold text-xs md:text-sm rounded-lg transition-colors cursor-pointer"
                id="btn-play-again-config"
              >
                {language === 'en' ? 'New Configuration' : 'Nueva Configuración'}
              </button>
            </div>
          </div>
        ) : (
          /* Complete Keyboard Area */
          <div className="bg-white p-4 rounded-xl border border-[#E1E2E4] shadow-xs flex flex-col gap-4">
            {/* Numbers Row */}
            <div className="space-y-1">
              <span className="font-sans font-bold text-[10px] text-[#737685] uppercase tracking-wider block">
                {language === 'en' ? 'Numbers' : 'Números'}
              </span>
              <div className="grid grid-cols-10 gap-1 md:gap-1.5" id="keyboard-numbers">
                {numbersList.map((num) => renderKey(num))}
              </div>
            </div>

            {/* QWERTY Letters Rows */}
            <div className="space-y-1">
              <span className="font-sans font-bold text-[10px] text-[#737685] uppercase tracking-wider block">
                {language === 'en' ? 'Letters' : 'Letras'}
              </span>
              <div className="flex flex-col gap-1 md:gap-1.5" id="keyboard-letters">
                {getKeyboardLettersRows().map((row, rIdx) => (
                  <div 
                    key={rIdx} 
                    className="grid gap-1 md:gap-1.5" 
                    style={{
                      gridTemplateColumns: `repeat(${row.length}, minmax(0, 1fr))`
                    }}
                  >
                    {row.map((letter) => renderKey(letter))}
                  </div>
                ))}
              </div>
            </div>

            {/* Symbols Grid */}
            <div className="space-y-1">
              <span className="font-sans font-bold text-[10px] text-[#737685] uppercase tracking-wider block">
                {language === 'en' ? 'Symbols' : 'Símbolos'}
              </span>
              <div className="grid grid-cols-7 sm:grid-cols-10 gap-1 md:gap-1.5" id="keyboard-symbols">
                {symbolsList.map((symbol) => renderKey(symbol))}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
