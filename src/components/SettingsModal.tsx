import { X, Volume2, VolumeX, Languages, Trash2, ShieldCheck, Info } from 'lucide-react';
import { Language } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  onResetStats: () => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  language,
  setLanguage,
  soundEnabled,
  setSoundEnabled,
  onResetStats,
}: SettingsModalProps) {
  if (!isOpen) return null;

  const handleResetClick = () => {
    if (
      window.confirm(
        language === 'en'
          ? 'Are you sure you want to permanently delete all achievements and match history statistics?'
          : '¿Estás seguro de que deseas eliminar permanentemente todos tus logros y estadísticas de juego?'
      )
    ) {
      onResetStats();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-xl shadow-lg border border-[#E1E2E4] p-6 relative overflow-hidden"
        id="settings-modal-content"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-sans font-bold text-lg md:text-xl text-[#091E42] flex items-center gap-2">
            <Info className="w-5 h-5 text-[#003d9b]" />
            {language === 'en' ? 'Settings & Info' : 'Configuración e Info'}
          </h2>
          <button
            onClick={onClose}
            className="text-[#585f6a] hover:bg-[#edeef0] p-1.5 rounded-full transition-colors active:scale-90"
            id="btn-close-settings"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Language selection */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <Languages className="w-5 h-5 text-[#585f6a]" />
              <div>
                <p className="font-sans font-medium text-sm text-[#091E42]">
                  {language === 'en' ? 'Game Language' : 'Idioma del Juego'}
                </p>
                <p className="font-sans text-xs text-[#585f6a]">
                  {language === 'en' ? 'Affects keyboard and built-in preset words.' : 'Afecta al teclado y palabras integradas.'}
                </p>
              </div>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="text-xs font-semibold bg-[#f3f4f6] text-[#091E42] border border-[#c3c6d6] rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#003d9b] cursor-pointer"
              id="select-language"
            >
              <option value="en">English (A-Z)</option>
              <option value="es">Español (A-Z + Ñ)</option>
            </select>
          </div>

          <hr className="border-[#E1E2E4]/60" />

          {/* Sound Toggle */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-[#003d9b]" />
              ) : (
                <VolumeX className="w-5 h-5 text-[#585f6a]" />
              )}
              <div>
                <p className="font-sans font-medium text-sm text-[#091E42]">
                  {language === 'en' ? 'Sound Effects' : 'Efectos de Sonido'}
                </p>
                <p className="font-sans text-xs text-[#585f6a]">
                  {language === 'en' ? 'Enables beautiful synthesized feedback tones.' : 'Activa beeps sintetizados para cada acierto o error.'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                soundEnabled ? 'bg-[#003d9b]' : 'bg-[#c3c6d6]'
              }`}
              id="toggle-sounds"
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                  soundEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <hr className="border-[#E1E2E4]/60" />

          {/* Reset Stats */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <Trash2 className="w-5 h-5 text-[#ba1a1a]" />
              <div>
                <p className="font-sans font-medium text-sm text-[#091E42]">
                  {language === 'en' ? 'Clear Local Stats' : 'Restablecer Estadísticas'}
                </p>
                <p className="font-sans text-xs text-[#585f6a]">
                  {language === 'en' ? 'Wipes all match records and streaks from history.' : 'Elimina registros de partidas y rachas del navegador.'}
                </p>
              </div>
            </div>
            <button
              onClick={handleResetClick}
              className="px-3 py-1.5 border border-[#ba1a1a]/40 text-[#ba1a1a] hover:bg-[#ffdad6] active:scale-95 transition-all text-xs font-semibold rounded-md flex items-center gap-1.5"
              id="btn-reset-stats"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {language === 'en' ? 'Reset' : 'Borrar'}
            </button>
          </div>

          <hr className="border-[#E1E2E4]/60" />

          {/* Core Info & Design Spec */}
          <div className="bg-[#f8f9fb] p-3 rounded-lg border border-[#edeef0]">
            <div className="flex gap-2 items-start">
              <ShieldCheck className="w-4 h-4 text-[#003d9b] shrink-0 mt-0.5" />
              <div className="text-xs text-[#585f6a] space-y-1">
                <p className="font-semibold text-[#091E42]">
                  {language === 'en' ? 'Hangman Pro - Corporate Spec' : 'Ahorcado Pro - Especificación Corporativa'}
                </p>
                <p>
                  {language === 'en'
                    ? 'Built with reactive state, low-contrast modular outline borders, fluid responsive layout, and client-side persistence.'
                    : 'Diseño ultra-pulido con bordes de bajo contraste y ritmo matemático exacto de 4px para asegurar un juego profesional.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
