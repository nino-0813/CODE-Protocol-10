import React, { useState, useEffect } from 'react';
import { ChevronLeft, RefreshCw, Thermometer, TrendingDown, TrendingUp, Zap, HelpCircle, Target, Activity } from 'lucide-react';

const SCENARIOS = [
  { label: '暴落パニック (例: 〇〇ショック)', price: 60, fair: 100, vol: 80, hint: '実力はあるのに、みんなが怖がって投げ売りしている状態。' },
  { label: '熱狂バブル (例: 仮想通貨ブーム)', price: 180, fair: 90, vol: 90, hint: '中身がないのに、乗り遅れる恐怖でみんなが買い漁っている状態。' },
  { label: '平常運転 (例: 安定企業株)', price: 105, fair: 100, vol: 15, hint: '価格と価値が一致しており、落ち着いた値動き。' },
];

const MarketTool: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [marketPrice, setMarketPrice] = useState(100);
  const [fairValue, setFairValue] = useState(100);
  const [volatility, setVolatility] = useState(20);
  const [heatScore, setHeatScore] = useState(50);

  useEffect(() => {
    // 熱狂度の計算ロジック
    const deviation = ((marketPrice - fairValue) / fairValue) * 100;
    // 乖離が大きいほど、そしてボラティリティが高いほど極端なスコアになる
    let score = 50 + (deviation * (1 + volatility / 50));
    setHeatScore(Math.max(0, Math.min(100, score)));
  }, [marketPrice, fairValue, volatility]);

  const getVerdict = () => {
    if (heatScore > 80) return { 
      text: "結論：売り時（熱狂のピーク）", 
      color: "text-red-500", 
      bg: "bg-red-500/10",
      border: "border-red-500/30",
      desc: "市場は完全に『浮かれて』います。本来の価値を無視したバブル状態です。TENの司令：大衆がもっと上がると信じている今こそ、あなたは静かに出口へ向かえ。" 
    };
    if (heatScore < 20) return { 
      text: "結論：買い時（パニックの底）", 
      color: "text-[#4ade80]", 
      bg: "bg-[#4ade80]/10",
      border: "border-[#4ade80]/30",
      desc: "市場は『恐怖』に支配されています。良い物までもが安く投げ売りされています。TENの司令：みんなが怖がっている今こそ、冷徹に買い叩け。絶好のチャンスだ。" 
    };
    return { 
      text: "結論：待機（平常時）", 
      color: "text-gray-400", 
      bg: "bg-white/5",
      border: "border-white/10",
      desc: "適正な価格です。パニックも熱狂も起きていません。無理に動く必要はありません。次の大きな波（歪み）が来るまで牙を研いで待て。" 
    };
  };

  const verdict = getVerdict();

  const loadScenario = (s: typeof SCENARIOS[0]) => {
    setMarketPrice(s.price);
    setFairValue(s.fair);
    setVolatility(s.vol);
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <button type="button" onClick={onBack} className="flex items-center gap-2 text-[#4ade80] mb-8 min-h-[44px] touch-manipulation hover:opacity-80 transition-opacity group -ml-1">
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span>ダッシュボードに戻る</span>
      </button>

      <div className="mb-8 sm:mb-12">
        <h2 className="text-xs sm:text-sm font-mono text-[#4ade80] tracking-[0.3em] uppercase mb-2">Protocol 06: Market Volatility</h2>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 break-words">パニック・チェッカー</h1>
        <p className="text-gray-400 text-sm sm:text-lg italic break-words">「価格と価値の『歪み』を、大衆の感情から割り出す」</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12">
        {/* Controls */}
        <div className="lg:col-span-5 space-y-6 sm:space-y-8">
          <div className="space-y-3">
            <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest flex items-center gap-2">
              <Zap className="w-3 h-3" /> 現実のマーケットを再現
            </span>
            <div className="grid grid-cols-1 gap-2">
              {SCENARIOS.map((s, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => loadScenario(s)}
                  className="p-3 min-h-[44px] bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-left hover:bg-[#4ade80]/10 hover:border-[#4ade80]/30 transition-all group touch-manipulation"
                >
                  <div className="text-[11px] sm:text-xs font-bold text-white group-hover:text-[#4ade80] mb-0.5 break-words">{s.label}</div>
                  <div className="text-[9px] sm:text-[10px] text-gray-500 italic line-clamp-2">{s.hint}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#0a0a0a] p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-white/5 shadow-2xl space-y-6 sm:space-y-10">
            {/* Price Input */}
            <div className="space-y-2 sm:space-y-4">
              <div className="flex flex-wrap justify-between items-center gap-1">
                <div className="flex items-center gap-2 min-w-0">
                  <label className="text-xs sm:text-sm font-semibold text-gray-300 shrink-0">今の値段 (市場価格)</label>
                  <div className="group relative">
                    <HelpCircle className="w-3 h-3 text-gray-600" />
                    <div className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-black border border-white/10 text-[9px] text-gray-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                      取引所やお店で、今実際に売られている価格を入力します。
                    </div>
                  </div>
                </div>
                <span className="text-lg sm:text-xl font-mono text-white">{marketPrice}</span>
              </div>
              <input type="range" min="10" max="200" value={marketPrice} onChange={e => setMarketPrice(Number(e.target.value))} className="w-full h-2 sm:h-1 accent-[#4ade80] bg-[#1a1a1a] appearance-none rounded-lg touch-manipulation py-1" aria-label="市場価格" />
            </div>

            {/* Fair Value Input */}
            <div className="space-y-2 sm:space-y-4">
              <div className="flex flex-wrap justify-between items-center gap-1">
                <div className="flex items-center gap-2 min-w-0">
                  <label className="text-xs sm:text-sm font-semibold text-gray-300 shrink-0">本来の価値 (理論値)</label>
                  <div className="group relative">
                    <HelpCircle className="w-3 h-3 text-gray-600" />
                    <div className="absolute bottom-full left-0 mb-2 w-56 p-2 bg-black border border-white/10 text-[9px] text-gray-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                      「本来いくらが妥当か？」の基準。<br/>
                      - 過去1年の平均価格<br/>
                      - 作るのにかかったコスト<br/>
                      などを参考に決めましょう。
                    </div>
                  </div>
                </div>
                <span className="text-lg sm:text-xl font-mono text-gray-500">{fairValue}</span>
              </div>
              <input type="range" min="10" max="200" value={fairValue} onChange={e => setFairValue(Number(e.target.value))} className="w-full h-2 sm:h-1 accent-gray-600 bg-[#1a1a1a] appearance-none rounded-lg touch-manipulation py-1" aria-label="理論値" />
              <div className="flex justify-between text-[9px] text-gray-600 font-bold uppercase tracking-widest px-1">
                <span>割安 (お買い得)</span>
                <span>割高 (ぼったくり)</span>
              </div>
            </div>

            {/* Volatility Input */}
            <div className="space-y-2 sm:space-y-4">
              <div className="flex flex-wrap justify-between items-center gap-1">
                <div className="flex items-center gap-2 min-w-0">
                  <label className="text-xs sm:text-sm font-semibold text-gray-300 shrink-0">値動きの激しさ (ボラティリティ)</label>
                  <div className="group relative">
                    <HelpCircle className="w-3 h-3 text-gray-600" />
                    <div className="absolute bottom-full left-0 mb-2 w-56 p-2 bg-black border border-white/10 text-[9px] text-gray-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                      1日で何%くらい動いていますか？<br/>
                      - 1%以下：凪 (安定)<br/>
                      - 5%以上：荒波 (危険)<br/>
                      - 10%以上：嵐 (パニック)
                    </div>
                  </div>
                </div>
                <span className="text-lg sm:text-xl font-mono text-[#4ade80]">{volatility}%</span>
              </div>
              <input type="range" min="0" max="100" value={volatility} onChange={e => setVolatility(Number(e.target.value))} className="w-full h-2 sm:h-1 accent-[#4ade80] bg-[#1a1a1a] appearance-none rounded-lg touch-manipulation py-1" aria-label="ボラティリティ" />
              <div className="flex justify-between text-[9px] text-gray-600 font-bold uppercase tracking-widest px-1">
                <span>静か</span>
                <span>超激しい</span>
              </div>
            </div>

            <button type="button" onClick={() => { setMarketPrice(100); setFairValue(100); setVolatility(20); }} className="w-full py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-[11px] sm:text-xs text-gray-500 hover:bg-white/10 transition-colors flex items-center justify-center gap-2 touch-manipulation min-h-[44px]">
              <RefreshCw className="w-3 h-3" /> 数値をリセット
            </button>
          </div>
        </div>

        {/* Visualization */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full bg-[#0a0a0a] border border-white/5 rounded-2xl sm:rounded-[30px] lg:rounded-[40px] p-5 sm:p-8 lg:p-12 shadow-2xl relative overflow-hidden flex flex-col items-center">
            
            <div className="w-full flex flex-col md:flex-row gap-8 sm:gap-12 lg:gap-16 items-center relative z-10">
              {/* Thermometer Gauge Container */}
              <div className="relative flex items-center h-48 sm:h-64 lg:h-80 px-2 sm:px-4">
                {/* Labels to the LEFT of the thermometer to avoid clashing with the center */}
                <div className="flex flex-col justify-between h-full py-1 sm:py-2 mr-3 sm:mr-6 text-right w-14 sm:w-24">
                  <div className="text-[8px] sm:text-[10px] font-bold text-red-500 uppercase tracking-[0.15em] sm:tracking-[0.2em] leading-tight">Frenzy<br/>(熱狂)</div>
                  <div className="text-[8px] sm:text-[10px] font-bold text-gray-600 uppercase tracking-[0.15em] sm:tracking-[0.2em] leading-tight">Neutral</div>
                  <div className="text-[8px] sm:text-[10px] font-bold text-blue-500 uppercase tracking-[0.15em] sm:tracking-[0.2em] leading-tight">Panic<br/>(恐怖)</div>
                </div>

                <div className="relative w-8 sm:w-10 lg:w-12 h-full flex flex-col items-center">
                  <div className="w-6 sm:w-7 lg:w-8 h-full bg-black border border-white/10 rounded-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-600 via-[#4ade80] to-red-600 opacity-20" />
                    <div 
                      className="absolute bottom-0 w-full transition-all duration-1000 ease-out"
                      style={{ 
                        height: `${heatScore}%`,
                        background: heatScore > 60 ? '#ef4444' : heatScore < 40 ? '#2563eb' : '#4ade80',
                        boxShadow: `0 0 20px ${heatScore > 60 ? '#ef4444' : heatScore < 40 ? '#2563eb' : '#4ade80'}`
                      }}
                    />
                  </div>
                  <div 
                    className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-full -mt-6 sm:-mt-7 lg:-mt-8 border-2 sm:border-4 border-black transition-all duration-1000 shadow-2xl z-10"
                    style={{ 
                      background: heatScore > 60 ? '#ef4444' : heatScore < 40 ? '#2563eb' : '#4ade80'
                    }}
                  />
                </div>
              </div>

              {/* Main Index Display and Verdict */}
              <div className="flex-1 space-y-4 sm:space-y-6 lg:space-y-8 text-center md:text-left flex flex-col justify-center w-full">
                <div className="mb-2 sm:mb-4">
                  <p className="text-gray-600 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] mb-2 sm:mb-4">Market Frenzy Index</p>
                  <div className={`text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black glow-text font-mono leading-none ${heatScore > 60 ? 'text-red-500' : heatScore < 40 ? 'text-blue-500' : 'text-white'}`}>
                    {Math.round(heatScore)}<span className="text-xl sm:text-2xl lg:text-3xl">°</span>
                  </div>
                </div>

                <div className={`${verdict.bg} ${verdict.border} border p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl space-y-2 sm:space-y-4 relative overflow-hidden group shadow-lg min-h-[100px] sm:min-h-[140px] lg:min-h-[160px] flex flex-col justify-center`}>
                  <div className="relative z-10">
                    <h3 className={`text-base sm:text-xl lg:text-2xl font-black mb-2 sm:mb-3 ${verdict.color} break-words`}>{verdict.text}</h3>
                    <p className="text-gray-300 text-xs sm:text-sm lg:text-lg leading-relaxed italic break-words">"{verdict.desc}"</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Stats */}
            <div className="w-full mt-6 sm:mt-8 lg:mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6 relative z-10">
              <div className="p-3 sm:p-4 lg:p-6 bg-white/5 rounded-xl sm:rounded-2xl lg:rounded-3xl border border-white/5 flex flex-col">
                <span className="text-[8px] sm:text-[9px] text-gray-600 uppercase font-black tracking-widest mb-1 sm:mb-2">現在の価格乖離</span>
                <div className="flex items-center gap-2 sm:gap-3">
                  {marketPrice > fairValue ? <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 shrink-0" /> : <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-[#4ade80] shrink-0" />}
                  <span className={`text-xl sm:text-2xl lg:text-3xl font-mono font-bold ${marketPrice > fairValue ? 'text-red-500' : 'text-[#4ade80]'}`}>
                    {Math.abs(((marketPrice - fairValue) / fairValue) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="p-3 sm:p-4 lg:p-6 bg-white/5 rounded-xl sm:rounded-2xl lg:rounded-3xl border border-white/5 flex flex-col">
                <span className="text-[8px] sm:text-[9px] text-gray-600 uppercase font-black tracking-widest mb-1 sm:mb-2">パニック係数</span>
                <div className="flex items-center gap-2 sm:gap-3">
                  <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 shrink-0" />
                  <span className="text-xl sm:text-2xl lg:text-3xl font-mono font-bold text-white">
                    x{((volatility / 20) + 1).toFixed(1)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 lg:mt-12 p-4 sm:p-5 lg:p-6 bg-black border border-white/5 rounded-2xl sm:rounded-3xl flex items-start gap-3 sm:gap-5 w-full relative z-10">
              <Target className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 shrink-0 mt-0.5 sm:mt-1" />
              <div className="space-y-1 sm:space-y-2 min-w-0">
                <p className="text-xs sm:text-sm text-gray-400 font-bold underline decoration-[#4ade80]/30 underline-offset-4">TENの意思決定アドバイス:</p>
                <p className="text-[9px] sm:text-[11px] text-gray-500 leading-relaxed italic break-words">
                  「価格」はあなたが払うもの。「価値」はあなたが手に入れるもの。この2つが大きくズレ、さらにそこに大衆の「感情（激しい値動き）」が加わった時、数学的なお宝が生まれます。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketTool;