
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, RefreshCw, Play, Pause, Zap, Mountain, Target, TrendingDown, Info, HelpCircle } from 'lucide-react';

const SCENARIOS = [
  {
    name: '新商品の価格設定',
    x: -1.8,
    rate: 0.1,
    desc: '「高すぎて売れない」か「安すぎて赤字」か。利益が最大になる（損失が最小になる）絶妙な価格を探り当てます。',
    xLabel: '今の価格設定 (高め)',
    targetLabel: '利益最大化'
  },
  {
    name: 'ダイエットの目標設定',
    x: 1.5,
    rate: 0.05,
    desc: '「過酷すぎて挫折」か「緩すぎて効果なし」か。無理なく続けられて最も効率が良いペースを見極めます。',
    xLabel: '今の負荷 (低め)',
    targetLabel: '理想の習慣'
  },
  {
    name: 'スキルの学習負荷',
    x: 0.5,
    rate: 0.2,
    desc: '「難しすぎてパニック」か「簡単すぎて退屈」か。脳が最も活性化するフロー状態の難易度へ調整します。',
    xLabel: '今の難易度 (普通)',
    targetLabel: 'フロー状態'
  }
];

const GradientTool: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [learningRate, setLearningRate] = useState<number>(0.1);
  const [initialX, setInitialX] = useState<number>(-1.8);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [currentX, setCurrentX] = useState<number>(initialX);
  const [history, setHistory] = useState<number[]>([initialX]);
  const [stepCount, setStepCount] = useState<number>(0);
  const [activeScenario, setActiveScenario] = useState(SCENARIOS[0]);
  const timerRef = useRef<number | null>(null);

  // 損失関数 (谷の形)
  const f = (x: number) => Math.pow(x, 4) - 2 * Math.pow(x, 2) + 0.5 * x;
  // 勾配 (傾き)
  const df = (x: number) => 4 * Math.pow(x, 3) - 4 * x + 0.5;

  const reset = () => {
    setIsAnimating(false);
    setCurrentX(initialX);
    setHistory([initialX]);
    setStepCount(0);
    if (timerRef.current) window.clearInterval(timerRef.current);
  };

  useEffect(() => { reset(); }, [initialX]);

  const step = () => {
    setCurrentX(prevX => {
      const gradient = df(prevX);
      const nextX = prevX - learningRate * gradient;
      
      // 発散防止 or 収束判定
      if (Math.abs(nextX) > 2.2 || Math.abs(nextX - prevX) < 0.0001) {
        setIsAnimating(false);
        return prevX;
      }
      
      setHistory(prevHistory => [...prevHistory, nextX]);
      setStepCount(prevCount => prevCount + 1);
      return nextX;
    });
  };

  useEffect(() => {
    if (isAnimating) {
      timerRef.current = window.setInterval(step, 100);
    } else if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) window.clearInterval(timerRef.current); };
  }, [isAnimating, learningRate]);

  const getCanvasX = (x: number) => (x + 2.5) * (100 / 5);
  const getCanvasY = (y: number) => 100 - (y + 2.5) * (100 / 7);

  const getVerdict = () => {
    if (learningRate > 0.45) return { text: "司令：歩幅が大きすぎます", color: "text-red-500", desc: "改善の意欲が強すぎて、正解（谷底）を飛び越えて反対側の崖にぶつかっています。これではいつまでも目標に辿り着けません。" };
    if (learningRate < 0.03) return { text: "司令：慎重すぎます", color: "text-yellow-500", desc: "一歩が小さすぎて、変化が起きていません。現状維持という名の停滞です。もう少し大胆な改善を取り入れてください。" };
    if (Math.abs(df(currentX)) < 0.1) return { text: "司令：そこが最適解です", color: "text-[#4ade80]", desc: "今の状態が、エラー（損失）が最も少ない「正解」の地点です。ここを維持し、成果を最大化してください。" };
    return { text: "司令：最適化の途上です", color: "text-blue-400", desc: "現在、正しい方向に進んでいます。迷わず改善を続け、谷の底（目標）を目指してください。" };
  };

  const verdict = getVerdict();

  const loadScenario = (s: typeof SCENARIOS[0]) => {
    setActiveScenario(s);
    setInitialX(s.x);
    setLearningRate(s.rate);
    reset();
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <button onClick={onBack} className="flex items-center text-[#4ade80] mb-8 hover:opacity-80 transition-opacity group">
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span>ダッシュボードに戻る</span>
      </button>

      <div className="mb-12">
        <h2 className="text-sm font-mono text-[#4ade80] tracking-[0.3em] uppercase mb-2">Protocol 09: Learning Optimization</h2>
        <h1 className="text-4xl font-bold text-white mb-4">最短ルート見極め術</h1>
        <p className="text-gray-400 text-lg italic">「暗闇の中で谷底（正解）へ辿り着くための、最も賢い歩き方を計算する」</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5 space-y-8">
          {/* Scenarios Selection */}
          <div className="space-y-3">
            <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest flex items-center gap-2">
              <Info className="w-3 h-3" /> 状況に合わせたシミュレーション
            </span>
            <div className="flex flex-col gap-2">
              {SCENARIOS.map((s, i) => (
                <button 
                  key={i} 
                  onClick={() => loadScenario(s)} 
                  className={`px-4 py-3 rounded-xl text-xs text-left transition-all border ${activeScenario.name === s.name ? 'bg-[#4ade80]/10 border-[#4ade80] text-[#4ade80]' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
                >
                  <div className="font-bold mb-1">{s.name}</div>
                  <div className="text-[10px] opacity-60 leading-tight">{s.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#0a0a0a] p-8 rounded-3xl border border-white/5 shadow-2xl space-y-10">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-gray-300">改善のスピード (歩幅)</label>
                <span className="text-xl font-mono text-[#4ade80]">{learningRate.toFixed(2)}</span>
              </div>
              <input type="range" min="0.01" max="0.6" step="0.01" value={learningRate} onChange={e => setLearningRate(Number(e.target.value))} className="w-full h-1 accent-[#4ade80] bg-[#1a1a1a] appearance-none rounded-lg" />
              <div className="flex justify-between text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                <span>慎重 (少しずつ)</span>
                <span>大胆 (一気に)</span>
              </div>
              <p className="text-[10px] text-gray-500 italic leading-relaxed">一回の試行錯誤で、どれくらい大きく自分（パラメータ）を変えるか。大きすぎると失敗を飛び越えてしまいます。</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-gray-300">現状の悩みレベル (スタート地点)</label>
                <span className="text-xl font-mono text-gray-500">{initialX.toFixed(2)}</span>
              </div>
              <input type="range" min="-2.1" max="2.1" step="0.1" value={initialX} onChange={e => setInitialX(Number(e.target.value))} className="w-full h-1 accent-gray-500 bg-[#1a1a1a] appearance-none rounded-lg" />
              <p className="text-[10px] text-gray-500 italic">自分が今どの位置にいるか。谷（正解）の左側にいるか右側にいるかを設定します。</p>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setIsAnimating(!isAnimating)} 
                className={`flex-1 py-4 font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${isAnimating ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-[#4ade80] text-black hover:shadow-[0_0_20px_#4ade80]'}`}
              >
                {isAnimating ? <><Pause className="w-4 h-4" /> 一時停止</> : <><Play className="w-4 h-4" /> 最適化を開始せよ</>}
              </button>
              <button onClick={reset} className="p-4 bg-white/5 border border-white/10 text-gray-400 rounded-xl hover:bg-white/10 transition-colors">
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col justify-center items-center">
          <div className="w-full bg-[#0a0a0a] border border-white/5 rounded-[40px] p-10 shadow-2xl space-y-10 relative overflow-hidden">
             <Mountain className="absolute -top-12 -right-12 w-64 h-64 text-[#4ade80]/5 rotate-12" />
             
             <div className="text-center relative z-10">
                <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.4em] mb-4">Error Minimization Visualization</p>
                <div className="flex justify-around items-end">
                  <div className="text-center">
                    <div className="text-5xl font-black text-white glow-text font-mono leading-none">
                      {Math.abs(f(currentX)).toFixed(3)}
                    </div>
                    <div className="text-[10px] text-[#4ade80] font-bold uppercase tracking-widest mt-2">現在の「無駄・エラー」</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-black text-gray-600 font-mono leading-none">
                      {stepCount}
                    </div>
                    <div className="text-[10px] text-gray-700 font-bold uppercase tracking-widest mt-2">試行回数 (STEP)</div>
                  </div>
                </div>
             </div>

             {/* Graph Visualization */}
             <div className="aspect-video w-full border border-white/5 bg-black/40 rounded-[30px] overflow-hidden relative">
               <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                 {/* 谷の形状曲線 */}
                 <path 
                  d={(() => { 
                    let p = `M 0 ${getCanvasY(f(-2.5))}`; 
                    for(let x=-2.5;x<=2.5;x+=0.1) p+=` L ${getCanvasX(x)} ${getCanvasY(f(x))}`; 
                    return p; 
                  })()} 
                  fill="none" stroke="#4ade80" strokeWidth="0.5" strokeOpacity="0.2" 
                />
                
                {/* 軌跡 */}
                <path 
                  d={(() => { 
                    if (history.length < 2) return "";
                    let p = `M ${getCanvasX(history[0])} ${getCanvasY(f(history[0]))}`; 
                    history.forEach(h => p+=` L ${getCanvasX(h)} ${getCanvasY(f(h))}`); 
                    return p; 
                  })()} 
                  fill="none" stroke="#4ade80" strokeWidth="1" strokeDasharray="2,2" 
                />
                
                {/* 現在地点のドット */}
                <circle cx={getCanvasX(currentX)} cy={getCanvasY(f(currentX))} r="2.5" fill="#4ade80" className="shadow-[0_0_20px_#4ade80] transition-all duration-300" />
               </svg>
               
               {/* Label Overlay */}
               <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 bg-black/60 rounded-full border border-white/5 text-[9px] text-gray-400 font-mono">
                 <Target className="w-3 h-3 text-[#4ade80]" /> TARGET: {activeScenario.targetLabel}
               </div>
               <div className="absolute bottom-4 right-4 text-[9px] text-gray-700 font-mono tracking-widest">
                 FAILURES (MINIMIZE ME)
               </div>
             </div>

             {/* Verdict Box */}
             <div className="bg-black/60 border border-white/10 p-8 rounded-3xl space-y-4 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity">
                  <Zap className="w-24 h-24 text-[#4ade80]" />
               </div>
               <div className="relative z-10">
                 <h3 className={`text-2xl font-black mb-3 ${verdict.color}`}>{verdict.text}</h3>
                 <p className="text-gray-300 leading-relaxed italic text-lg">"{verdict.desc}"</p>
               </div>
             </div>

             <div className="p-4 bg-black/40 border border-white/5 rounded-2xl flex items-center gap-4">
                <HelpCircle className="w-5 h-5 text-gray-600 shrink-0" />
                <p className="text-[10px] text-gray-500 leading-tight">
                  <strong>勾配降下法とは:</strong> 複雑な問題を解く際、一度に正解を出すのは不可能です。この数式は、今の場所の「傾き」を見て、少しずつ失敗が減る方向へ進むためのナビゲーターです。
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradientTool;
