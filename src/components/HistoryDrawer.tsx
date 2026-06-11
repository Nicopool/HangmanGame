import { X, Clock, Heart } from 'lucide-react';
import { Language, MatchStats } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  matchHistory: MatchStats[];
}

export default function HistoryDrawer({
  isOpen,
  onClose,
  language,
  matchHistory,
}: HistoryDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-start">
      {/* Absolute Backdrop */}
      <div
        className="absolute inset-0 bg-black/35 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Slideout Container */}
      <div 
        className="relative flex flex-col w-full max-w-xs h-full bg-white shadow-xl border-r border-[#E1E2E4] p-5 z-10 animate-slide-in"
        id="history-drawer-content"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b border-[#E1E2E4] pb-4">
          <div>
            <h2 className="font-sans font-bold text-[#091E42] text-sm md:text-base leading-tight">
              Activity History
            </h2>
            <p className="font-sans text-xs text-[#585f6a]">
              {language === 'en' ? 'Track your recent plays' : 'Tus partidas recientes'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#585f6a] hover:bg-[#edeef0] p-1.5 rounded-full transition-colors active:scale-90"
            id="btn-close-drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable contents */}
        <div className="flex-grow overflow-y-auto space-y-6">

          {/* Quick history list */}
          {matchHistory.length > 0 && (
            <div className="border-t border-[#E1E2E4] pt-5">
              <h3 className="font-sans font-bold text-xs text-[#585f6a] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#003d9b]" />
                {language === 'en' ? 'Recent Activity' : 'Partidas Recientes'}
              </h3>
              <div className="space-y-2">
                {matchHistory.slice(0, 5).map((match) => (
                  <div
                    key={match.id}
                    className="flex justify-between items-center p-2 rounded bg-[#f8f9fb] border border-[#E1E2E4]/40"
                  >
                    <div>
                      <p className="font-sans font-bold text-[11px] uppercase text-[#091E42] tracking-wide">
                        {match.word}
                      </p>
                      <p className="font-sans text-[10px] text-[#585f6a]">
                        {match.category}
                      </p>
                    </div>
                    {match.status === 'won' ? (
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-[9px] font-bold text-[#006644] bg-[#E3FCEF] px-1.5 py-0.5 rounded">
                          {language === 'en' ? 'WIN' : 'VICTORIA'}
                        </span>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 6 }).map((_, idx) => (
                            <Heart
                              key={idx}
                              className={`w-2 h-2 ${
                                idx < match.livesRemaining
                                  ? 'fill-[#ff4b72] stroke-[#ff2a55]'
                                  : 'fill-[#c3c6d6]/20 stroke-[#c3c6d6]'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-[9px] font-bold text-[#BF2600] bg-[#FFEBE6] px-1.5 py-0.5 rounded">
                          {language === 'en' ? 'LOSS' : 'DERROTA'}
                        </span>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 6 }).map((_, idx) => (
                            <Heart
                              key={idx}
                              className="w-2 h-2 fill-[#c3c6d6]/20 stroke-[#c3c6d6]"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="border-t border-[#E1E2E4] pt-4 mt-4 text-[10px] text-[#737685] font-mono leading-none flex items-center justify-between">
          <span>{language === 'en' ? 'VER 1.2.0' : 'VER 1.2.0'}</span>
          <span className="text-[#003d9b] font-semibold tracking-tight">HANGMAN PRO</span>
        </div>
      </div>
    </div>
  );
}
