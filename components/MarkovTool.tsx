
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Info, RefreshCw, Activity, ArrowRightLeft, TrendingUp, Lightbulb, CheckCircle } from 'lucide-react';

interface MarkovToolProps {
  onBack: () => void;
}

const SCENARIOS = [
  { 
    label: '仕事の「やる気」は続く？', 
    a: '集中モード', 
    b: 'ダラダラ', 
    paa: 80, 
    pba: 20,
    insight: '一度集中すると続きますが、一度切れるとなかなか戻れないタイプです。'
  },
  { 
    label: 'ダイエットの継続率', 
    a: '節制中', 
    b: '暴飲暴食', 
    paa: 60, 
    pba: 40,
    insight: '誘惑に負けやすいですが、立ち直りも早い「リバウンド」警戒型です。'
  },
  { 
    label: 'SNSの「バズ」の波', 
    a: '注目状態', 
    b: '通常営業', 
    paa: 30, 
    pba: 10,
    insight: '注目されるのは稀で、すぐに忘れ去られるシビアな世界です。'
  },
];

const MarkovTool: React.FC<MarkovToolProps> = ({ onBack }) => {
  const [stateAName, setStateAName] = useState('好調・成功');
  const [stateBName, setStateBName] = useState('不調・停滞');
  const [pAA, setPAA] = useState<number>(70);
  const [pBA, setPBA] = useState<number>(30);
  const [stationaryA, setStationaryA] = useState<number>(0);
  const [stationaryB, setStationaryB] = useState<number>(0);
  const [simHistory, setSimHistory] = useState<number[]>([]);

  useEffect(() => {
    const pAB = (100 - pAA) / 100;
    const pBA_val = pBA / 100;
    const denominator = pBA_val + pAB;
    if (denominator === 0) {
      setStationaryA(pAA > 0 ? 100 : 0);
      setStationaryB(pAA > 0 ? 0 : 100);
    } else {
      const piA = pBA_val / denominator;
      setStationaryA(piA * 100);
      setStationaryB((1 - piA) * 100);
    }
  }, [pAA, pBA]);

  const runSimulation = () => {
    let currentState = 0;
    const history: number[] = [0];
    for (let i = 0; i < 40; i++) {
      const rand = Math.random() * 100;
      if (currentState === 0) {
        if (rand > pAA) currentState = 1;
      } else {
        if (rand < pBA) currentState = 0;
      }
      history.push(currentState);
    }
    setSimHistory(history);
  };

  useEffect(() => {
    runSimulation();
  }, [pAA, pBA]);

  const getVerdict = () => {
    if (stationaryA > 75) return { text: "結論：あなたは「成功者」です", color: "text-[#4ade80]", desc: "人生の大半を好調な状態で過ごせます。今の「波に乗る力」を信じて突き進んでください。" };
    if (stationaryA > 40) return { text: "結論：波の激しい人生", color: "text-yellow-400", desc: "好調と不調が交互に訪れます。不調の時にいかに「再起する力」を高めるかが鍵です。" };
    return { text: "結論：抜本的な改善が必要", color: "text-red-500", desc: "今のままでは「停滞」があなたの定位置になります。環境か習慣を大きく変えるべきです。" };
  };

  const verdict = getVerdict();

  const loadScenario = (s: typeof SCENARIOS[0]) => {
    setStateAName(s.a);
    setStateBName(s.b);
    setPAA(s.paa);
    setPBA(s.pba);
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <button type="button" onClick={onBack} className="flex items-center gap-2 text-[#4ade80] mb-8 min-h-[44px] touch-manipulation hover:opacity-80 transition-opacity group -ml-1">
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span>ダッシュボードに戻る</span>
      </button>

      <div className="mb-8 sm:mb-12">
        <h2 className="text-xs sm:text-sm font-mono text-[#4ade80] tracking-[0.3em] uppercase mb-2">Protocol 04: Future State Prediction</h2>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 break-words">将来の幸福配分チェッカー</h1>
        <p className="text-gray-400 text-sm sm:text-lg italic break-words">「一時的な成功ではなく、人生全体でどれくらい『いい状態』にいられるか？」</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12">
        <div className="lg:col-span-5 space-y-6 sm:space-y-10">
          <div className="space-y-3">
            <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">よくある悩みの例</span>
            <div className="flex flex-wrap gap-2">
              {SCENARIOS.map((s, i) => (
                <button type="button" key={i} onClick={() => loadScenario(s)} className="min-h-[44px] px-3 sm:px-4 py-2.5 sm:py-2 bg-white/5 border border-white/10 rounded-full text-[11px] sm:text-xs text-gray-400 hover:bg-[#4ade80]/10 hover:text-[#4ade80] transition-all touch-manipulation break-words">{s.label}</button>
              ))}
            </div>
          </div>

          <div className="space-y-6 sm:space-y-10 bg-[#0a0a0a] p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-white/5 shadow-2xl">
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              <div className="space-y-1 sm:space-y-2">
                <label className="text-[9px] sm:text-[10px] uppercase text-gray-600 tracking-widest font-bold">良い状態の名前</label>
                <input type="text" value={stateAName} onChange={(e) => setStateAName(e.target.value)} className="w-full bg-black border border-[#222] rounded px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-[#4ade80] outline-none touch-manipulation" />
              </div>
              <div className="space-y-1 sm:space-y-2">
                <label className="text-[9px] sm:text-[10px] uppercase text-gray-600 tracking-widest font-bold">悪い状態の名前</label>
                <input type="text" value={stateBName} onChange={(e) => setStateBName(e.target.value)} className="w-full bg-black border border-[#222] rounded px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-400 outline-none touch-manipulation" />
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div className="space-y-2 sm:space-y-4">
                <div className="flex flex-wrap justify-between items-center gap-1">
                  <label className="text-xs sm:text-sm font-semibold text-gray-300 shrink-0">波に乗る力 (維持力)</label>
                  <span className="text-lg sm:text-xl font-mono text-[#4ade80]">{pAA}%</span>
                </div>
                <input type="range" min="0" max="100" value={pAA} onChange={(e) => setPAA(Number(e.target.value))} className="w-full h-2 sm:h-1 bg-[#1a1a1a] rounded-lg appearance-none cursor-pointer accent-[#4ade80] touch-manipulation py-1" aria-label="維持力" />
                <p className="text-[9px] sm:text-[10px] text-gray-600">「{stateAName}」の時、次にまた「{stateAName}」でいられる確率</p>
              </div>

              <div className="space-y-2 sm:space-y-4">
                <div className="flex flex-wrap justify-between items-center gap-1">
                  <label className="text-xs sm:text-sm font-semibold text-gray-300 shrink-0">再起する力 (回復力)</label>
                  <span className="text-lg sm:text-xl font-mono text-[#4ade80]">{pBA}%</span>
                </div>
                <input type="range" min="0" max="100" value={pBA} onChange={(e) => setPBA(Number(e.target.value))} className="w-full h-2 sm:h-1 bg-[#1a1a1a] rounded-lg appearance-none cursor-pointer accent-[#4ade80] touch-manipulation py-1" aria-label="回復力" />
                <p className="text-[9px] sm:text-[10px] text-gray-600">「{stateBName}」の時、次に「{stateAName}」に這い上がれる確率</p>
              </div>
            </div>

            <button type="button" onClick={() => setPAA(70) || setPBA(30)} className="w-full py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-[11px] sm:text-xs text-gray-500 hover:bg-white/10 transition-colors flex items-center justify-center gap-2 touch-manipulation min-h-[44px]">
              <RefreshCw className="w-3 h-3" /> 数値を初期化
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col justify-center items-center">
          <div className="w-full max-w-2xl bg-[#0a0a0a] border border-white/5 rounded-2xl sm:rounded-[30px] lg:rounded-[40px] p-5 sm:p-8 lg:p-10 shadow-2xl space-y-6 sm:space-y-8 lg:space-y-12">
            <div className="text-center">
              <p className="text-gray-600 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] mb-2 sm:mb-4">Long-term Happiness Allocation</p>
              <div className="flex items-center justify-center gap-4 sm:gap-8 lg:gap-12">
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white glow-text font-mono">{stationaryA.toFixed(1)}%</div>
                  <div className="text-[9px] sm:text-[10px] text-[#4ade80] font-bold uppercase tracking-widest mt-1 sm:mt-2 break-words">{stateAName}でいる確率</div>
                </div>
                <ArrowRightLeft className="text-gray-800 w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 shrink-0" />
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-700 font-mono">{stationaryB.toFixed(1)}%</div>
                  <div className="text-[9px] sm:text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-1 sm:mt-2 break-words">{stateBName}でいる確率</div>
                </div>
              </div>
              
              <div className="mt-4 sm:mt-6 lg:mt-8 h-3 sm:h-4 w-full flex rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-[#4ade80] shadow-[0_0_10px_#4ade80] transition-all duration-1000" style={{ width: `${stationaryA}%` }} />
                <div className="h-full bg-white/5 transition-all duration-1000" style={{ width: `${stationaryB}%` }} />
              </div>
            </div>

            <div className="bg-black/80 border border-white/5 p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl space-y-2 sm:space-y-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2 sm:p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-[#4ade80]" />
              </div>
              <div className="relative z-10">
                <h3 className={`text-base sm:text-xl lg:text-2xl font-black mb-2 sm:mb-3 ${verdict.color} break-words`}>{verdict.text}</h3>
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed italic break-words">"{verdict.desc}"</p>
              </div>
            </div>

            <div className="space-y-2 sm:space-y-4">
              <div className="text-[9px] sm:text-[10px] text-gray-600 font-bold uppercase tracking-widest text-center">人生のシミュレーション（40日間）</div>
              <div className="grid grid-cols-10 gap-1 sm:gap-2">
                {simHistory.map((s, i) => (
                  <div key={i} className={`aspect-square rounded-sm border ${s === 0 ? 'bg-[#4ade80] border-[#4ade80]/50 shadow-[0_0_8px_rgba(74,222,128,0.3)]' : 'bg-transparent border-white/10'}`} />
                ))}
              </div>
              <p className="text-[8px] sm:text-[9px] text-gray-700 text-center uppercase tracking-widest break-words">※緑色が「{stateAName}」、黒色が「{stateBName}」の状態を示します。</p>
            </div>

            <div className="p-3 sm:p-4 bg-black rounded-lg sm:rounded-xl border border-white/5 flex items-center gap-3 sm:gap-4">
              <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 shrink-0 mt-0.5" />
              <p className="text-[9px] sm:text-[11px] text-gray-500 leading-tight break-words min-w-0">
                <strong>TENの視点:</strong> ほとんどの人間は、今の「調子」が永遠に続くと錯覚します。しかし現実はこの連鎖のように、確率に支配されています。定常分布を知ることは、未来を予測することと同義です。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkovTool;
