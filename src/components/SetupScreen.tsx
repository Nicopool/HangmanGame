import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Lightbulb, HelpCircle, Play, Users, Sparkles, Plus, Trash2, Anchor } from 'lucide-react';
import { Language, GameMode, PresetCategory, Difficulty, CustomHint } from '../types';

interface SetupScreenProps {
  language: Language;
  presetCategories: PresetCategory[];
  onStartGame: (params: {
    mode: GameMode;
    secretWord: string;
    hint1?: string;
    hint2?: string;
    hints?: CustomHint[];
    categoryName?: string;
  }) => void;
}

export default function SetupScreen({
  language,
  presetCategories,
  onStartGame,
}: SetupScreenProps) {
  // Custom word state (1-vs-1 / VS mode) - Preconfigured with the Gemini Riddle
  const [customWord, setCustomWord] = useState('!@UTE6');
  const [showPassword, setShowPassword] = useState(false);
  const [hints, setHints] = useState<CustomHint[]>([
    {
      text: 'This is a special punctuation symbol. According to your conversion table, it replaces the lowercase letter \'l\' at the very beginning of the name.',
      anchorChar: '!',
    },
    {
      text: 'This is a digital symbol used universally in email addresses. It replaces the lowercase vowel \'a\' from the original name.',
      anchorChar: '@',
    },
    {
      text: 'This is a standard lowercase vowel. It is the third letter of the base name, and it does not change at all.',
      anchorChar: 'U',
    },
    {
      text: 'This is a standard lowercase consonant. It is the fourth letter of the base name, and it remains exactly the same.',
      anchorChar: 'T',
    },
    {
      text: 'This is a standard lowercase vowel. It is the last letter of the original 5-letter name, and it does not change.',
      anchorChar: 'E',
    },
    {
      text: 'This is a single digit added at the end. It is a number, specifically the last digit of the current year (2026).',
      anchorChar: '6',
    },
  ]);
  const [customWordError, setCustomWordError] = useState('');

  const handleCustomWordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.toUpperCase();
    // Allow A-Z, Spanish accented letters, numbers, and common signs/punctuation
    const filtered = rawVal.replace(/[^A-Z0-9ÁÉÍÓÚÜÑ\.\,\-\?\!\@\#\_\(\)\/\$\%\&\+\*\=\:\; ]/g, '');
    setCustomWord(filtered);
    setCustomWordError('');
  };

  const getUniqueChars = () => {
    const chars = new Set<string>();
    for (const char of customWord.toUpperCase()) {
      if (char.trim() && char !== ' ') {
        chars.add(char);
      }
    }
    return Array.from(chars);
  };

  const handleAddHint = () => {
    if (hints.length >= 6) return;
    setHints([...hints, { text: '', anchorChar: '' }]);
  };

  const handleRemoveHint = (index: number) => {
    if (hints.length <= 1) return;
    setHints(hints.filter((_, i) => i !== index));
  };

  const handleHintTextChange = (index: number, val: string) => {
    const nextHints = [...hints];
    nextHints[index].text = val;
    setHints(nextHints);
  };

  const handleHintAnchorChange = (index: number, val: string) => {
    const nextHints = [...hints];
    nextHints[index].anchorChar = val || undefined;
    setHints(nextHints);
  };

  const handleStartCustomGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (customWord.trim().length < 4) {
      setCustomWordError(
        language === 'en'
          ? 'Word must be at least 4 characters long.'
          : 'La palabra debe tener al menos 4 caracteres.'
      );
      return;
    }

    const filteredHints = hints
      .map((h) => ({ text: h.text.trim(), anchorChar: h.anchorChar }))
      .filter((h) => h.text.length > 0);

    onStartGame({
      mode: 'vs',
      secretWord: customWord.trim(),
      hint1: filteredHints[0]?.text || undefined,
      hint2: filteredHints[1]?.text || undefined,
      hints: filteredHints,
      categoryName: language === 'en' ? 'Custom Duel' : 'Duelo Personalizado',
    });
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-xl shadow-md border border-[#E1E2E4] p-6 md:p-8">
      {/* Title & Subtitle */}
      <div className="mb-6 text-center">
        <h1 className="font-sans font-bold text-2xl md:text-3xl text-[#091E42] mb-1.5 tracking-tight">
          {language === 'en' ? 'Game Configuration' : 'Configuración de Partida'}
        </h1>
        <p className="font-sans text-[#434654] text-sm md:text-base">
          {language === 'en'
            ? 'Define the parameters for the next professional session.'
            : 'Establece las reglas para la próxima ronda de entrenamiento.'}
        </p>
      </div>

      <form onSubmit={handleStartCustomGame} className="space-y-5">
        {/* Custom Word Input */}
        <div className="flex flex-col gap-1.5">
          <label className="font-sans font-semibold text-sm text-[#091E42]" htmlFor="secret-word">
            {language === 'en' ? 'Secret Word' : 'Palabra Secreta'}
          </label>
          <div className="relative border border-[#c3c6d6] rounded-lg flex items-center bg-white transition-all focus-within:border-[#003d9b] focus-within:ring-1 focus-within:ring-[#003d9b] overflow-hidden">
            <span className="text-[#737685] ml-3 shrink-0">
              <Lock className="w-4.5 h-4.5" />
            </span>
            <input
              className="w-full bg-transparent border-none text-[#191c1e] text-base py-3 px-3 placeholder:text-[#c3c6d6] focus:outline-none focus:ring-0"
              id="secret-word"
              placeholder={language === 'en' ? 'Enter the target word' : 'Escribe la palabra secreta'}
              type={showPassword ? 'text' : 'password'}
              value={customWord}
              onChange={handleCustomWordChange}
              required
            />
            <button
              aria-label="Toggle visibility"
              className="mr-3 text-[#737685] hover:text-[#003d9b] transition-colors focus:outline-none flex items-center justify-center p-1"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              id="btn-toggle-password-visibility"
            >
              {showPassword ? <Eye className="w-4.5 h-4.5" /> : <EyeOff className="w-4.5 h-4.5" />}
            </button>
          </div>
          
          {customWordError ? (
            <p className="font-sans text-xs text-[#ba1a1a] font-medium leading-normal" id="custom-word-error">
              {customWordError}
            </p>
          ) : (
            <p className="font-sans text-xs text-[#434654]">
              {language === 'en'
                ? 'Minimum 4 characters. Letters, numbers, and symbols are allowed.'
                : 'Mínimo 4 caracteres. Se admiten letras, números y signos/símbolos.'}
            </p>
          )}
        </div>

        <div className="w-full h-px bg-[#E1E2E4] my-2 opacity-60"></div>

        {/* Optional Hints */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-sans font-semibold text-sm text-[#091E42]">
              {language === 'en' ? 'Hints Configuration' : 'Configuración de Pistas'}
            </h2>
            <button
              type="button"
              disabled={hints.length >= 6}
              onClick={handleAddHint}
              className="text-xs font-semibold text-[#003d9b] bg-[#EBF2FF] hover:bg-[#003d9b]/15 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              id="btn-add-hint"
            >
              <Plus className="w-4 h-4" />
              {language === 'en' ? 'Add Hint' : 'Añadir Pista'} ({hints.length}/6)
            </button>
          </div>

          {hints.map((hint, index) => {
            const uniqueWordChars = getUniqueChars();
            return (
              <div key={index} className="bg-[#f8f9fb] p-3 rounded-lg border border-[#E1E2E4] space-y-2.5" id={`hint-container-${index}`}>
                <div className="flex items-center justify-between">
                  <span className="font-sans font-semibold text-xs text-[#585f6a]">
                    {language === 'en' ? `Hint #${index + 1}` : `Pista #${index + 1}`}
                  </span>
                  {hints.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveHint(index)}
                      className="text-[#ba1a1a] hover:bg-[#ba1a1a]/10 p-1 rounded-md transition-colors cursor-pointer"
                      title={language === 'en' ? 'Remove field' : 'Quitar campo'}
                      id={`btn-remove-hint-${index}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="border border-[#c3c6d6] rounded-lg flex items-center bg-white transition-all focus-within:border-[#003d9b] focus-within:ring-1 focus-within:ring-[#003d9b]">
                  <span className="text-[#737685] ml-3">
                    <Lightbulb className="w-4.5 h-4.5" />
                  </span>
                  <input
                    className="w-full bg-transparent border-none text-[#191c1e] text-sm py-2 px-3 placeholder:text-[#c3c6d6] focus:outline-none focus:ring-0"
                    placeholder={
                      language === 'en'
                        ? `Hint content (e.g. It is a tool)`
                        : `Contenido de la pista (ej. Es una herramienta)`
                    }
                    type="text"
                    value={hint.text}
                    onChange={(e) => handleHintTextChange(index, e.target.value)}
                    id={`hint-input-${index}`}
                  />
                </div>

                {/* Character Anchoring Option */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-0.5">
                  <span className="text-xs text-[#585f6a] flex items-center gap-1 font-sans">
                    <Anchor className="w-3.5 h-3.5 text-[#003d9b]" />
                    {language === 'en' ? 'Anchor to Character (Optional):' : 'Anclajar a un Carácter (Opcional):'}
                  </span>
                  <select
                    value={hint.anchorChar || ''}
                    onChange={(e) => handleHintAnchorChange(index, e.target.value)}
                    className="text-xs bg-white border border-[#c3c6d6] rounded px-2 py-1 text-[#191c1e] max-w-xs focus:border-[#003d9b] focus:outline-none font-mono cursor-pointer"
                    id={`hint-anchor-select-${index}`}
                  >
                    <option value="">
                      {language === 'en' ? '-- General Hint --' : '-- Pista General --'}
                    </option>
                    {uniqueWordChars.map((char) => (
                      <option key={char} value={char}>
                        {char}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action button */}
        <div className="pt-4 flex items-center justify-end">
          <button
            type="submit"
            className="bg-[#003d9b] hover:bg-[#0040A0] text-white font-sans font-semibold text-sm px-6 py-3 rounded-lg transition-colors cursor-pointer active:scale-98 shadow-sm flex items-center gap-2"
            id="btn-start-game-vs"
          >
            <Play className="w-4 h-4 fill-current" />
            {language === 'en' ? 'Start Game' : 'Iniciar Juego'}
          </button>
        </div>
      </form>
    </div>
  );
}
