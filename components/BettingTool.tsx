import React, { useState, useEffect } from 'react';
import { ChevronLeft, RefreshCw, Target, Zap, AlertCircle, ShieldAlert, TrendingUp, Wallet, Coins } from 'lucide-react';

interface BettingToolProps {
  onBack: () => void;
}

const SCENARIOS = [
  { label: '手堅いインデックス投資', p: 60, o: 1.1, b: 1000000, desc: '長期的な成長を、数学的な確信を持って支える。' },
  { label: '高配当のベンチャー投資', p: 15, o: 8.0, b: 500000, desc: '低い勝率を、高いリターンが正当化できるか？' },
  { label: '自分のスキルへの賭け', p: 75, o: 2.0, b: 100000, desc: '高い勝率は、大胆な資金投入の免罪符となる。' },
];

const BettingTool: React.FC<BettingToolProps> = ({ onBack }) => {
  const [bankroll, setBankroll] = useState<number>(1000000);
  const [winProb, setWinProb] = useState<number>(55);
  const [odds, setOdds] = useState<number>(2.0);
  const [kellyFraction, setKellyFraction] = useState<number>(0);
  const [expectedValue, setExpectedValue] = useState<number>(0);

  useEffect(() => {
    const p = winProb / 100;
    const q = 1 - p;
    const b = odds - 1; // 純粋な利益率
    const ev = (p * b) - q;
    setExpectedValue(ev);
    
    // ケリー基準公式: f = (bp - q) / b
    const f = b > 0 ? (b * p - q) / b : 0;
    setKellyFraction(Math.max(0, f));
  }, [winProb, odds]);

  const betAmount = Math.floor(bankroll * kellyFraction);

  const getVerdict = () => {
    if (expectedValue <= 0) return { 
      text: "結論：撤退せよ。この賭けに期待値はない。", 
      color: "text-red-500", 
      bg: "bg-red-500/10",
      border: "border-red-500/30",
      status: "PROTOCOL VIOLATION",
      desc: "数学的な優位性がゼロ、あるいはマイナスです。資金を投じることは『自殺』と同義。TENの規律に従い、直ちに手を引け。" 
    };
    if (kellyFraction > 0.4) return { 
      text: "結論：勝負の時だ。数学的優位性を確認。", 
      color: "text-[#4ade80]", 
      bg: "bg-[#4ade80]/10",
      border: "border-[#4ade80]/30",
      status: "OPTIMAL EDGE FOUND",
      desc: `全資金の ${Math.round(kellyFraction * 100)}% を投入せよ。確実な利得を最大化するための、最も賢明な「暴力」だ。` 
    };
    return { 
      text: "結論：少額での実行を許可。", 
      color: "text-blue-400", 
      bg: "bg-blue-400/10",
      border: "border-blue-400/30",
      status: "CONSERVATIVE GROWTH",
      desc: "期待値はプラスですが、まだ脆弱です。リスクを最小限に抑え、次の大きな波（エッジ）を待て。" 
    };
  };

  const verdict = getVerdict();
  const isViolation = expectedValue <= 0;

  const loadScenario = (s: typeof SCENARIOS[0]) => {
    setWinProb(s.p);
    setOdds(s.o);
    setBankroll(s.b);
  };

  return (
    <div className={`max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 transition-colors ${isViolation ? 'bg-red-950/5' : ''}`}>
      <button type="button" onClick={onBack} className="flex items-center gap-2 text-[#4ade80] mb-8 min-h-[44px] touch-manipulation hover:opacity-80 transition-opacity group -ml-1">
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span>ダッシュボードに戻る</span>
      </button>

      <div className="mb-8 sm:mb-12">
        <h2 className="text-xs sm:text-sm font-mono text-[#4ade80] tracking-[0.3em] uppercase mb-2">Protocol 02: Kelly Criterion</h2>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 break-words">資産増幅エンジン</h1>
        <p className="text-gray-400 text-sm sm:text-lg italic break-words">「破産を回避し、数学的優位性を最短で利益に変える」</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12">
        {/* Input Panel */}
        <div className="lg:col-span-5 space-y-6 sm:space-y-8">
          <div className="space-y-3">
            <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest flex items-center gap-2">
              <Zap className="w-3 h-3" /> シチュエーションを選択
            </span>
            <div className="flex flex-col gap-2">
              {SCENARIOS.map((s, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => loadScenario(s)}
                  className="p-3 sm:p-4 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl text-left hover:bg-[#4ade80]/10 hover:border-[#4ade80]/30 transition-all group touch-manipulation min-h-[44px]"
                >
                  <div className="text-[11px] sm:text-xs font-bold text-white group-hover:text-[#4ade80] mb-0.5 break-words">{s.label}</div>
                  <div className="text-[9px] sm:text-[10px] text-gray-500 italic leading-tight line-clamp-2">{s.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className={`bg-[#0a0a0a] p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border transition-all duration-500 shadow-2xl space-y-6 sm:space-y-8 md:space-y-10 ${isViolation ? 'border-red-500/50' : 'border-white/5'}`}>
            {/* Bankroll Input */}
            <div className="space-y-2 sm:space-y-4">
              <div className="flex justify-between items-center gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 shrink-0" />
                  <label className="text-xs sm:text-sm font-semibold text-gray-300 truncate">今の軍資金 (Bankroll)</label>
                </div>
              </div>
              <div className="relative">
                <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 font-mono text-gray-600 text-sm sm:text-base">¥</span>
                <input
                  type="number"
                  value={bankroll}
                  onChange={e => setBankroll(Number(e.target.value))}
                  className="w-full bg-black border border-white/10 rounded-lg sm:rounded-xl py-3 sm:py-4 pl-8 sm:pl-10 pr-3 sm:pr-4 text-base sm:text-xl font-mono text-white outline-none focus:border-[#4ade80] transition-colors touch-manipulation"
                />
              </div>
            </div>

            {/* Win Probability Slider */}
            <div className="space-y-2 sm:space-y-4">
              <div className="flex flex-wrap justify-between items-center gap-1">
                <label className="text-xs sm:text-sm font-semibold text-gray-300">勝負の勝率 (Probability)</label>
                <span className="text-lg sm:text-xl font-mono text-[#4ade80]">{winProb}%</span>
              </div>
              <input type="range" min="0" max="100" value={winProb} onChange={e => setWinProb(Number(e.target.value))} className="w-full h-2 sm:h-1 accent-[#4ade80] bg-[#1a1a1a] appearance-none rounded-lg touch-manipulation py-1" aria-label="勝率" />
              <div className="flex justify-between text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                <span>敗北濃厚</span>
                <span>確変状態</span>
              </div>
            </div>

            {/* Odds Input */}
            <div className="space-y-2 sm:space-y-4">
              <div className="flex flex-wrap justify-between items-center gap-1">
                <label className="text-xs sm:text-sm font-semibold text-gray-300">リターン倍率 (Odds)</label>
                <span className="text-lg sm:text-xl font-mono text-[#4ade80]">{odds.toFixed(2)}倍</span>
              </div>
              <input type="range" min="1.1" max="10.0" step="0.1" value={odds} onChange={e => setOdds(Number(e.target.value))} className="w-full h-2 sm:h-1 accent-[#4ade80] bg-[#1a1a1a] appearance-none rounded-lg touch-manipulation py-1" aria-label="倍率" />
              <div className="flex justify-between text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                <span>低配当</span>
                <span>高配当</span>
              </div>
            </div>

            <button type="button" onClick={() => { setWinProb(55); setOdds(2.0); setBankroll(1000000); }} className="w-full py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-[11px] sm:text-xs text-gray-500 hover:bg-white/10 transition-colors flex items-center justify-center gap-2 touch-manipulation min-h-[44px]">
              <RefreshCw className="w-3 h-3" /> 規律を再設定
            </button>
          </div>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className={`w-full bg-[#0a0a0a] border border-white/5 rounded-2xl sm:rounded-[30px] lg:rounded-[40px] p-5 sm:p-8 lg:p-12 shadow-2xl relative overflow-hidden transition-all duration-700 ${isViolation ? 'shadow-[0_0_60px_rgba(239,68,68,0.2)] border-red-500/30' : ''}`}>
            {isViolation && (
              <div className="absolute inset-0 bg-red-500/5 animate-pulse pointer-events-none" />
            )}
            
            <div className="relative z-10 flex flex-col items-center gap-6 sm:gap-8 lg:gap-12">
              <div className="text-center w-full">
                <p className="text-gray-600 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] mb-2 sm:mb-4">Optimal Bet Amount</p>
                
                {isViolation ? (
                  <div className="flex flex-col items-center gap-1 sm:gap-2 animate-bounce">
                    <ShieldAlert className="w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-red-500 mb-1 sm:mb-2" />
                    <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-red-500 font-mono tracking-tighter">¥ 0</div>
                    <div className="text-red-500 font-black text-[10px] sm:text-xs uppercase tracking-widest bg-red-500/10 px-3 sm:px-4 py-1 rounded-full border border-red-500/30">DO NOT BET</div>
                  </div>
                ) : (
                  <div className="space-y-2 sm:space-y-4">
                    <div className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-[#4ade80] glow-text font-mono leading-none tracking-tighter">
                      <span className="text-2xl sm:text-3xl lg:text-4xl align-top mr-1 sm:mr-2 text-gray-600">¥</span>
                      {betAmount.toLocaleString()}
                    </div>
                    <div className="flex justify-center items-center gap-2 sm:gap-4 text-gray-500">
                      <div className="h-[1px] w-6 sm:w-12 bg-gray-800" />
                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest">全資金の {Math.round(kellyFraction * 100)}%</span>
                      <div className="h-[1px] w-6 sm:w-12 bg-gray-800" />
                    </div>
                  </div>
                )}
              </div>

              {/* Stack Visualizer */}
              <div className="w-full max-w-sm h-20 sm:h-24 lg:h-32 flex items-end justify-center gap-0.5 sm:gap-1">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`flex-1 transition-all duration-1000 ease-out rounded-sm ${isViolation ? 'bg-red-900/20' : i / 20 < kellyFraction ? 'bg-[#4ade80] shadow-[0_0_10px_#4ade80]' : 'bg-white/5'}`}
                    style={{ 
                      height: `${isViolation ? 5 : 20 + Math.random() * 80}%`,
                      opacity: isViolation ? 0.2 : i / 20 < kellyFraction ? 1 : 0.1
                    }}
                  />
                ))}
              </div>

              {/* Verdict Dossier */}
              <div className={`w-full ${verdict.bg} ${verdict.border} border p-4 sm:p-6 md:p-10 rounded-2xl sm:rounded-[24px] lg:rounded-[30px] space-y-2 sm:space-y-4 relative overflow-hidden group shadow-lg transition-colors`}>
                <div className="absolute top-0 right-0 p-4 sm:p-8 opacity-5">
                  <Target className={`w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 ${isViolation ? 'text-red-500' : 'text-[#4ade80]'}`} />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-1 sm:mb-2">
                    {isViolation ? <ShieldAlert className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 shrink-0" /> : <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-[#4ade80] shrink-0" />}
                    <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest ${isViolation ? 'text-red-500' : 'text-[#4ade80]'}`}>{verdict.status}</span>
                  </div>
                  <h3 className={`text-base sm:text-xl lg:text-2xl font-black mb-2 sm:mb-4 ${verdict.color} break-words`}>{verdict.text}</h3>
                  <p className="text-gray-300 leading-relaxed italic text-xs sm:text-sm lg:text-lg">"{verdict.desc}"</p>
                </div>
              </div>

              <div className="w-full grid grid-cols-2 gap-2 sm:gap-4">
                <div className="p-3 sm:p-4 bg-white/5 rounded-xl sm:rounded-2xl border border-white/5 flex flex-col items-center">
                  <span className="text-[8px] sm:text-[9px] text-gray-600 uppercase mb-0.5 sm:mb-1">期待利益率 (Edge)</span>
                  <span className={`text-base sm:text-lg lg:text-xl font-mono font-bold ${expectedValue > 0 ? 'text-[#4ade80]' : 'text-red-500'}`}>
                    {(expectedValue * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="p-3 sm:p-4 bg-white/5 rounded-xl sm:rounded-2xl border border-white/5 flex flex-col items-center">
                  <span className="text-[8px] sm:text-[9px] text-gray-600 uppercase mb-0.5 sm:mb-1">リスク対効果</span>
                  <span className="text-base sm:text-lg lg:text-xl font-mono font-bold text-white">
                    {expectedValue > 0 ? (odds / (1 - winProb/100)).toFixed(2) : '0.00'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 sm:mt-8 p-4 sm:p-6 bg-black border border-white/5 rounded-2xl sm:rounded-3xl flex items-start gap-3 sm:gap-5 w-full">
            <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 shrink-0 mt-0.5 sm:mt-1" />
            <div className="space-y-1 sm:space-y-2 min-w-0">
              <p className="text-xs sm:text-sm text-gray-400 font-bold underline decoration-[#4ade80]/30 underline-offset-4">TENの規律指令:</p>
              <p className="text-[10px] sm:text-[11px] text-gray-500 leading-relaxed italic break-words">
                数学は感情を持ちません。あなたが「いける」と思ったとき、数式が「ダメだ」と言うなら、数式が正解です。ケリー基準を守ることは、単なる投資戦略ではなく、この狂った世界で生き残るための最低限の『規律』です。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BettingTool;