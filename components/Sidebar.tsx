
import React from 'react';
import { LayoutDashboard, ChevronRight, Binary, Lock, X } from 'lucide-react';
import { EQUATIONS } from '../constants';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, isMobileOpen, onMobileClose }) => {
  const handleNav = (view: AppView) => {
    onNavigate(view);
    onMobileClose?.();
  };

  const getToolViewId = (id: string): AppView => {
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
    return map[id];
  };

  return (
    <>
      {/* スマホ用オーバーレイ：ドロワー開時のみ */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[98] lg:hidden"
          onClick={onMobileClose}
          aria-hidden
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 h-screen w-16 hover:w-64 transition-all duration-300 ease-out z-[100] group sidebar-glass overflow-hidden flex flex-col
          max-lg:w-72 max-lg:-translate-x-full max-lg:shadow-2xl max-lg:shadow-black/50
          ${isMobileOpen ? 'max-lg:translate-x-0' : ''}
        `}
      >
        {/* スマホのみ：閉じるボタン */}
        <div className="lg:hidden flex items-center justify-between h-14 px-4 border-b border-white/5 flex-shrink-0">
          <span className="text-[10px] font-mono text-[#4ade80] uppercase tracking-wider">CODE Protocol 10</span>
          <button type="button" onClick={onMobileClose} className="p-2 -m-2 text-gray-500 hover:text-white touch-manipulation" aria-label="メニューを閉じる">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Brand / Home */}
        <button
          type="button"
          onClick={() => handleNav('dashboard')}
          className={`flex items-center h-14 w-full px-5 transition-all duration-300 touch-manipulation ${currentView === 'dashboard' ? 'text-[#4ade80] bg-[#4ade80]/10' : 'text-gray-500 hover:text-[#4ade80] hover:bg-white/5'}`}
        >
          <LayoutDashboard className={`w-6 h-6 shrink-0 transition-transform ${currentView === 'dashboard' ? 'scale-110 glow-text' : ''}`} />
          <span className="ml-5 font-bold tracking-[0.3em] uppercase text-[10px] opacity-0 group-hover:opacity-100 max-lg:opacity-100 transition-opacity whitespace-nowrap font-mono">
            ダッシュボードに戻る
          </span>
        </button>

        <div className="flex-1 overflow-y-auto custom-scrollbar py-4">
          <div className="px-5 mb-4 opacity-0 group-hover:opacity-100 max-lg:opacity-100 transition-opacity">
            <span className="text-[9px] text-gray-700 font-black uppercase tracking-[0.4em] flex items-center gap-2">
              <Binary className="w-3 h-3" />
              Active_Protocols
            </span>
          </div>

          {EQUATIONS.map((eq) => {
            const viewId = getToolViewId(eq.id);
            const isActive = currentView === viewId;

            return (
              <button
                type="button"
                key={eq.id}
                onClick={() => eq.isAvailable && handleNav(viewId)}
                disabled={!eq.isAvailable}
                className={`
                  w-full flex items-center min-h-[48px] px-5 py-3 transition-all relative border-l-[3px] touch-manipulation
                  ${!eq.isAvailable ? 'opacity-20 cursor-not-allowed bg-black/40' : 'hover:bg-[#4ade80]/5 active:bg-[#4ade80]/10'}
                  ${isActive ? 'text-[#4ade80] border-[#4ade80] bg-[#4ade80]/10' : 'text-gray-500 border-transparent hover:text-white'}
                `}
              >
                <div className="w-6 h-6 flex items-center justify-center shrink-0">
                  {!eq.isAvailable ? (
                    <Lock className="w-3 h-3 text-gray-700" />
                  ) : (
                    <span className={`font-mono text-xs font-bold transition-all ${isActive ? 'scale-125 glow-text' : ''}`}>
                      {eq.number}
                    </span>
                  )}
                </div>
                <div className="ml-5 flex flex-col items-start opacity-0 group-hover:opacity-100 max-lg:opacity-100 transition-all duration-300 overflow-hidden min-w-0 flex-1 text-left">
                  <span className="text-[11px] font-bold whitespace-nowrap sm:whitespace-normal tracking-wider truncate max-w-full">{eq.title}</span>
                  <span className="text-[9px] text-gray-600 whitespace-nowrap font-mono hidden sm:inline">
                    {eq.isAvailable ? `PROTOCOL_${eq.number}_ACTIVE` : 'ENCRYPTED_LOCKED'}
                  </span>
                </div>
                {isActive && (
                  <div className="ml-auto opacity-0 group-hover:opacity-100 max-lg:opacity-100 animate-pulse shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#4ade80] shadow-[0_0_8px_#4ade80]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer Info：PCのみホバーで表示、スマホは常に非表示で軽量化 */}
        <div className="p-5 border-t border-white/5 opacity-0 group-hover:opacity-100 max-lg:hidden transition-opacity bg-black/40">
          <div className="text-[9px] text-gray-600 font-mono space-y-1">
            <div className="flex justify-between">
              <span>SIG_STATUS:</span>
              <span className="text-[#4ade80]">ENCRYPTED</span>
            </div>
            <div className="flex justify-between">
              <span>UPLINK:</span>
              <span className="text-[#4ade80]">STABLE</span>
            </div>
            <div className="mt-2 pt-2 border-t border-white/5 text-[8px] text-gray-700">
              ROOT_ACCESS: GRANTED
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
