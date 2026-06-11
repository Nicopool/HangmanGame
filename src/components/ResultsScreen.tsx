import { Trophy, Percent, Flame, Target, Calendar, Award, RotateCcw } from 'lucide-react';
import { Language, GlobalStats, MatchStats } from '../types';

interface ResultsScreenProps {
  language: Language;
  globalStats: GlobalStats;
  matchHistory: MatchStats[];
  onStartNewGame: () => void;
}

export default function ResultsScreen({
  language,
  globalStats,
  matchHistory,
  onStartNewGame,
}: ResultsScreenProps) {
  // Format duration
  const formatDuration = (sec: number) => {
    if (sec < 60) return `${sec}s`;
    const mins = Math.floor(sec / 60);
    const remainingSec = sec % 60;
    return `${mins}m ${remainingSec}s`;
  };

  // Accuracy calculation safety
  const accuracyPercent = globalStats.totalGuesses > 0
    ? Math.round((globalStats.correctGuesses / globalStats.totalGuesses) * 100)
    : 0;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6" id="results-dashboard">
      {/* Dynamic Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-xl border border-[#E1E2E4] shadow-xs">
        <div>
          <h1 className="font-sans font-bold text-xl md:text-2xl text-[#091E42] tracking-tight flex items-center gap-2">
            <Award className="w-6 h-6 text-[#003d9b]" />
            {language === 'en' ? 'Performance Dashboard' : 'Panel de Logros'}
          </h1>
          <p className="font-sans text-[#585f6a] text-xs md:text-sm">
            {language === 'en'
              ? 'Real-time metrics and historic training statistics.'
              : 'Métricas en tiempo real e historial estadístico de entrenamiento.'}
          </p>
        </div>
        <button
          onClick={onStartNewGame}
          className="bg-[#003d9b] hover:bg-[#0040A0] text-white font-sans font-semibold text-xs md:text-sm px-4 py-2.5 rounded-lg active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          id="btn-results-new-game"
        >
          <RotateCcw className="w-4 h-4" />
          {language === 'en' ? 'Configure New Game' : 'Nueva Partida'}
        </button>
      </div>

      {/* Grid statistics cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="stats-grid">
        {/* Card 1: Win Rate */}
        <div className="bg-white p-4 rounded-xl border border-[#E1E2E4] shadow-xs flex items-center gap-3">
          <div className="bg-[#EBF2FF] p-2.5 rounded-lg text-[#003d9b] shrink-0">
            <Percent className="w-5 h-5" />
          </div>
          <div>
            <p className="font-sans text-[10px] uppercase font-bold text-[#585f6a] tracking-wider leading-none">
              {language === 'en' ? 'Win Rate' : 'Porcentaje'}
            </p>
            <p className="font-sans font-bold text-xl text-[#091E42] mt-1 leading-none">
              {globalStats.winRate}%
            </p>
          </div>
        </div>

        {/* Card 2: Total Wins */}
        <div className="bg-white p-4 rounded-xl border border-[#E1E2E4] shadow-xs flex items-center gap-3">
          <div className="bg-[#E3FCEF] p-2.5 rounded-lg text-[#006644] shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <p className="font-sans text-[10px] uppercase font-bold text-[#585f6a] tracking-wider leading-none">
              {language === 'en' ? 'Wins' : 'Victorias'}
            </p>
            <p className="font-sans font-bold text-xl text-[#091E42] mt-1 leading-none">
              {globalStats.wins} <span className="text-xs font-normal text-[#585f6a]">/ {globalStats.totalGames}</span>
            </p>
          </div>
        </div>

        {/* Card 3: Current Streak */}
        <div className="bg-white p-4 rounded-xl border border-[#E1E2E4] shadow-xs flex items-center gap-3">
          <div className="bg-[#FFEBE6] p-2.5 rounded-lg text-[#BF2600] shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <p className="font-sans text-[10px] uppercase font-bold text-[#585f6a] tracking-wider leading-none">
              {language === 'en' ? 'Win Streak' : 'Racha Actual'}
            </p>
            <p className="font-sans font-bold text-xl text-[#091E42] mt-1 leading-none">
              {globalStats.currentStreak} <span className="text-xs font-normal text-[#585f6a]">max: {globalStats.maxStreak}</span>
            </p>
          </div>
        </div>

        {/* Card 4: Accuracy */}
        <div className="bg-white p-4 rounded-xl border border-[#E1E2E4] shadow-xs flex items-center gap-3">
          <div className="bg-[#ffebcc] p-2.5 rounded-lg text-[#b85c00] shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <p className="font-sans text-[10px] uppercase font-bold text-[#585f6a] tracking-wider leading-none">
              {language === 'en' ? 'Accuracy' : 'Precisión'}
            </p>
            <p className="font-sans font-bold text-xl text-[#091E42] mt-1 leading-none">
              {accuracyPercent}%
            </p>
          </div>
        </div>
      </div>

      {/* Match History Table */}
      <div className="bg-white rounded-xl border border-[#E1E2E4] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#E1E2E4] bg-[#f8f9fb]">
          <h3 className="font-sans font-bold text-sm text-[#091E42]">
            {language === 'en' ? 'Game Sessions History' : 'Historial de Partidas'}
          </h3>
        </div>

        {matchHistory.length === 0 ? (
          <div className="p-8 text-center" id="empty-history-placeholder">
            <Calendar className="w-8 h-8 text-[#c3c6d6] mx-auto mb-2" />
            <p className="font-sans text-sm text-[#585f6a] font-medium">
              {language === 'en' ? 'No matches played yet in this session.' : 'No hay partidas registradas en esta sesión.'}
            </p>
            <p className="font-sans text-xs text-[#737685] mt-1">
              {language === 'en' ? 'Go to the setup tab and challenge your mind!' : '¡Ve a la pestaña de configuración y desafía tu mente!'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans border-collapse" id="history-table">
              <thead>
                <tr className="border-b border-[#E1E2E4] text-[10px] uppercase font-bold text-[#585f6a] bg-[#f8f9fb]/50">
                  <th className="p-4">{language === 'en' ? 'Word' : 'Palabra'}</th>
                  <th className="p-4">{language === 'en' ? 'Category' : 'Categoría'}</th>
                  <th className="p-4">{language === 'en' ? 'Outcome' : 'Resultado'}</th>
                  <th className="p-4">{language === 'en' ? 'Lives Remain' : 'Vidas'}</th>
                  <th className="p-4">{language === 'en' ? 'Hints Used' : 'Pistas'}</th>
                  <th className="p-4">{language === 'en' ? 'Duration' : 'Duración'}</th>
                  <th className="p-4">{language === 'en' ? 'Date' : 'Fecha'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E1E2E4]/60 text-xs md:text-sm text-[#191c1e]">
                {matchHistory.map((match) => (
                  <tr key={match.id} className="hover:bg-[#f8f9fb] transition-colors">
                    <td className="p-4 font-bold tracking-wide uppercase text-[#091E42]">
                      {match.word}
                    </td>
                    <td className="p-4">
                      <span className="inline-block px-2 py-0.5 bg-[#edeef0] text-[#585f6a] roundedtext-[11px] font-semibold">
                        {match.category}
                      </span>
                    </td>
                    <td className="p-4 font-semibold">
                      {match.status === 'won' ? (
                        <span className="text-[#006644] bg-[#E3FCEF] px-2 py-0.5 rounded text-[11px] font-bold">
                          {language === 'en' ? 'WON' : 'VICTORIA'}
                        </span>
                      ) : (
                        <span className="text-[#BF2600] bg-[#FFEBE6] px-2 py-0.5 rounded text-[11px] font-bold">
                          {language === 'en' ? 'LOST' : 'DERROTA'}
                        </span>
                      )}
                    </td>
                    <td className="p-4 font-mono font-medium">
                      {match.status === 'won' ? `${match.livesRemaining}/6` : '0/6'}
                    </td>
                    <td className="p-4 font-mono font-medium">
                      {match.hintsUsed}
                    </td>
                    <td className="p-4 font-mono font-medium">
                      {formatDuration(match.durationSeconds)}
                    </td>
                    <td className="p-4 text-xs text-[#585f6a] whitespace-nowrap">
                      {match.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
