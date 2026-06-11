import { Menu, Settings, FileSpreadsheet, Gamepad2, BarChart2 } from 'lucide-react';
import { Language } from '../types';

interface HeaderProps {
  language: Language;
  activeTab: 'setup' | 'play' | 'results';
  setActiveTab: (tab: 'setup' | 'play' | 'results') => void;
  onOpenSettings: () => void;
  onOpenHistoryDrawer: () => void;
}

export default function Header({
  language,
  activeTab,
  setActiveTab,
  onOpenSettings,
  onOpenHistoryDrawer,
}: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-[#E1E2E4] z-40 shadow-sm">
      <div className="flex justify-between items-center h-full px-4 max-w-7xl mx-auto">
        {/* Left branding */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenHistoryDrawer}
            aria-label="Toggle History Drawer"
            className="text-[#003d9b] p-2 hover:bg-[#edeef0] transition-colors rounded-full flex items-center justify-center active:scale-95 duration-100"
            id="toggle-history-drawer"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-sans font-bold text-lg md:text-xl text-[#003d9b] tracking-tight">
            Hangman Pro
          </span>
        </div>

        {/* Desktop inline navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <button
            onClick={() => setActiveTab('setup')}
            className={`font-sans font-semibold text-sm flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors active:scale-95 ${
              activeTab === 'setup'
                ? 'text-[#003d9b] bg-[#edeef0]'
                : 'text-[#585f6a] hover:bg-[#edeef0]/60'
            }`}
            id="nav-setup-desktop"
          >
            <FileSpreadsheet className="w-4 h-4" />
            {language === 'en' ? 'Setup' : 'Configuración'}
          </button>
          <button
            onClick={() => setActiveTab('play')}
            className={`font-sans font-semibold text-sm flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors active:scale-95 ${
              activeTab === 'play'
                ? 'text-[#003d9b] bg-[#edeef0]'
                : 'text-[#585f6a] hover:bg-[#edeef0]/60'
            }`}
            id="nav-play-desktop"
          >
            <Gamepad2 className="w-4 h-4" />
            {language === 'en' ? 'Play' : 'Jugar'}
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`font-sans font-semibold text-sm flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors active:scale-95 ${
              activeTab === 'results'
                ? 'text-[#003d9b] bg-[#edeef0]'
                : 'text-[#585f6a] hover:bg-[#edeef0]/60'
            }`}
            id="nav-results-desktop"
          >
            <BarChart2 className="w-4 h-4" />
            {language === 'en' ? 'Results' : 'Resultados'}
          </button>
        </nav>

        {/* Right controls */}
        <button
          onClick={onOpenSettings}
          aria-label="Settings"
          className="text-[#003d9b] p-2 hover:bg-[#edeef0] transition-colors rounded-full flex items-center justify-center active:scale-95 duration-100"
          id="btn-settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
