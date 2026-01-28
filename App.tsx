import React, { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { Menu } from 'lucide-react';
import { AppView } from './types';
import { EQUATIONS } from './constants';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import EquationCard from './components/EquationCard';
import BayesianTool from './components/BayesianTool';
import BettingTool from './components/BettingTool';
import ConfidenceTool from './components/ConfidenceTool';
import MarkovTool from './components/MarkovTool';
import PageRankTool from './components/PageRankTool';
import MarketTool from './components/MarketTool';
import CorrelationTool from './components/CorrelationTool';
import QLearningTool from './components/QLearningTool';
import GradientTool from './components/GradientTool';
import IfThenTool from './components/IfThenTool';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCardClick = (id: string) => {
    const map: Record<string, AppView> = {
      bayesian: 'bayesian-tool',
      logistic: 'betting-tool',
      confidence: 'confidence-tool',
      markov: 'markov-tool',
      pagerank: 'pagerank-tool',
      market: 'market-tool',
      correlation: 'correlation-tool',
      qlearning: 'qlearning-tool',
      gradient: 'gradient-tool',
      ifthen: 'ifthen-tool'
    };
    if (map[id]) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setView(map[id]);
    }
  };

  const renderContent = () => {
    switch (view) {
      case 'dashboard':
        return (
          <div className="animate-in fade-in zoom-in-95 duration-1000">
            <Header />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {EQUATIONS.map((eq) => (
                <EquationCard 
                  key={eq.id} 
                  equation={eq} 
                  onClick={() => handleCardClick(eq.id)}
                />
              ))}
            </div>
            <footer className="mt-40 mb-10 text-center text-gray-800 text-[9px] tracking-[0.8em] uppercase font-mono opacity-50">
              <p>Wake up, Neo... The Ten is watching you. © 2024</p>
            </footer>
          </div>
        );
      case 'bayesian-tool': return <div className="pt-10"><BayesianTool onBack={() => setView('dashboard')} /></div>;
      case 'betting-tool': return <div className="pt-10"><BettingTool onBack={() => setView('dashboard')} /></div>;
      case 'confidence-tool': return <div className="pt-10"><ConfidenceTool onBack={() => setView('dashboard')} /></div>;
      case 'markov-tool': return <div className="pt-10"><MarkovTool onBack={() => setView('dashboard')} /></div>;
      case 'pagerank-tool': return <div className="pt-10"><PageRankTool onBack={() => setView('dashboard')} /></div>;
      case 'market-tool': return <div className="pt-10"><MarketTool onBack={() => setView('dashboard')} /></div>;
      case 'correlation-tool': return <div className="pt-10"><CorrelationTool onBack={() => setView('dashboard')} /></div>;
      case 'qlearning-tool': return <div className="pt-10"><QLearningTool onBack={() => setView('dashboard')} /></div>;
      case 'gradient-tool': return <div className="pt-10"><GradientTool onBack={() => setView('dashboard')} /></div>;
      case 'ifthen-tool': return <div className="pt-10"><IfThenTool onBack={() => setView('dashboard')} /></div>;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] selection:bg-[#4ade80] selection:text-black flex flex-col lg:flex-row relative">
      <Analytics />
      {/* スマホのみ：メニュー開くボタン */}
      <button
        type="button"
        onClick={() => setMobileMenuOpen(true)}
        className="fixed top-4 left-4 z-[102] lg:hidden flex items-center justify-center w-12 h-12 rounded-xl bg-black/80 border border-white/10 text-[#4ade80] hover:bg-[#4ade80]/10 hover:border-[#4ade80]/30 transition-colors touch-manipulation"
        aria-label="メニューを開く"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Global Sidebar（スマホではドロワー） */}
      <Sidebar
        currentView={view}
        onNavigate={(v) => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setView(v);
          setMobileMenuOpen(false);
        }}
        isMobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area（スマホは全幅、PCはサイドバー分よける） */}
      <main className="flex-1 min-w-0 lg:ml-16 relative">
        {/* Decorative elements for 'intellectual thrill' */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-[#4ade80]/[0.015] rounded-full blur-[150px] -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-[#4ade80]/[0.01] rounded-full blur-[120px] translate-y-1/3 -translate-x-1/4" />
          {/* Subtle horizontal data line */}
          <div className="absolute top-1/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-12 lg:px-16 pt-20 pb-12 lg:pt-12 max-w-[1400px]">
          {renderContent()}
        </div>
      </main>

      {/* Persistent Technical Overlays（スマホは左端から、PCはサイドバー右端から） */}
      <div className="fixed top-0 left-0 lg:left-16 right-0 h-1 bg-gradient-to-r from-[#4ade80]/40 via-transparent to-transparent z-[110]" />
      
      {/* Dynamic technical stats at bottom-right */}
      <div className="fixed bottom-8 right-8 pointer-events-none opacity-40 z-50 hidden xl:block">
        <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest text-right leading-relaxed bg-[#050505]/80 backdrop-blur p-4 rounded-lg border border-white/5">
          <div className="flex justify-between gap-6 mb-1">
            <span className="text-gray-700">SESSION:</span>
            <span className="text-[#4ade80]">#948-AXQ</span>
          </div>
          <div className="flex justify-between gap-6 mb-1">
            <span className="text-gray-700">LATENCY:</span>
            <span className="text-[#4ade80]">8.2ms</span>
          </div>
          <div className="flex justify-between gap-6">
            <span className="text-gray-700">COORD:</span>
            <span className="text-[#4ade80]">35.6° N, 139.7° E</span>
          </div>
        </div>
      </div>

      {/* Corner UI Brackets */}
      <div className="fixed top-6 right-6 w-12 h-12 border-t border-r border-[#4ade80]/20 pointer-events-none hidden lg:block" />
      <div className="fixed bottom-6 left-[calc(4rem+1.5rem)] w-12 h-12 border-b border-l border-[#4ade80]/20 pointer-events-none hidden lg:block" />
    </div>
  );
};

export default App;
