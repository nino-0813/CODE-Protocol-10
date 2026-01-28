
import React, { useState, useEffect } from 'react';
import { ChevronLeft, RefreshCw, Play, FastForward, Award, Lightbulb, Target, Zap } from 'lucide-react';

const ACTIONS = [
  { id: 'safe', name: '現状維持', color: 'text-blue-400', mean: 40 },
  { id: 'growth', name: 'スキルの強化', color: 'text-[#4ade80]', mean: 60 },
  { id: 'venture', name: '未踏の挑戦', color: 'text-purple-400', mean: 85 },
];

const QLearningTool: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [epsilon, setEpsilon] = useState(20);
  const [qValues, setQValues] = useState<Record<string, number>>({ safe: 0, growth: 0, venture: 0 });
  const [step, setStep] = useState(0);

  const runStep = () => {
    setStep(s => s + 1);
    const explore = Math.random() * 100 < epsilon;
    
    // Fix: Using reduce to find the key with the maximum value instead of sorting entries to avoid type inference issues with arithmetic operations (b[1]-a[1])
    const actionId = explore 
      ? ACTIONS[Math.floor(Math.random() * 3)].id 
      : Object.keys(qValues).reduce((a, b) => qValues[a] > qValues[b] ? a : b);

    const actionDef = ACTIONS.find(a => a.id === actionId)!;
    const reward = actionDef.mean + (Math.random() - 0.5) * 30;
    setQValues(prev => ({ ...prev, [actionId]: prev[actionId] + 0.1 * (reward - prev[actionId]) }));
  };

  const getVerdict = () => {
    if (epsilon > 50) return { text: "結論：迷走しています", color: "text-red-500", desc: "新しいことを試しすぎて、成果を刈り取る時間がありません。今は一つのことに集中すべきです。" };
    if (epsilon < 5) return { text: "結論：進化が止まっています", color: "text-yellow-500", desc: "過去の成功に固執し、未来のチャンスを見逃しています。あえてリスクを取る時間を作ってください。" };
    return { text: "結論：理想的な進化です", color: "text-[#4ade80]", desc: "現状の強みを活かしつつ、常に新しい可能性を探っています。TENが認める最も賢い戦略です。" };
  };

  const verdict = getVerdict();

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <button onClick={onBack} className="flex items-center text-[#4ade80] mb-8 hover:opacity-80 transition-opacity group">
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span>ダッシュボードに戻る</span>
      </button>

      <div className="mb-12">
        <h2 className="text-sm font-mono text-[#4ade80] tracking-[0.3em] uppercase mb-2">Protocol 08: Reinforcement Learning</h2>
        <h1 className="text-4xl font-bold text-white mb-4">人生の攻略レシピ（学習と実行）</h1>
        <p className="text-gray-400 text-lg italic">「いつまでも同じことを続けるべきか、新しい道を行くべきか？」</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5 space-y-10">
          <div className="bg-[#0a0a0a] p-8 rounded-3xl border border-white/5 shadow-2xl space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center"><label className="text-sm font-semibold text-gray-300">新しい挑戦をする割合 (探索率)</label><span className="text-xl font-mono text-[#4ade80]">{epsilon}%</span></div>
              <input type="range" min="0" max="100" value={epsilon} onChange={e => setEpsilon(Number(e.target.value))} className="w-full h-1 accent-[#4ade80] bg-[#1a1a1a] appearance-none rounded-lg" />
              <div className="flex justify-between text-[10px] text-gray-600 font-bold uppercase tracking-widest"><span>今を大事に</span><span>未来を探る</span></div>
            </div>
            <div className="flex gap-4">
              <button onClick={runStep} className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2"><Play className="w-3 h-3" /> 1日進める</button>
              <button onClick={() => { for(let i=0; i<30; i++) setTimeout(runStep, i*10); }} className="flex-1 bg-[#4ade80] text-black font-bold py-3 rounded-xl text-xs hover:shadow-[0_0_15px_#4ade80] transition-all">30日間シミュレート</button>
            </div>
          </div>
          <div className="p-4 bg-black border border-white/5 rounded-2xl flex items-center gap-4">
            <Lightbulb className="w-5 h-5 text-yellow-500 shrink-0" />
            <p className="text-[11px] text-gray-500 leading-tight">
              AIがゲームを攻略する際にも使われる数式です。「探索（未知）」と「利用（既知）」のバランスこそが、長期的な成功の鍵となります。
            </p>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="bg-[#0a0a0a] border border-white/5 rounded-[40px] p-10 shadow-2xl space-y-10">
            <h3 className="text-center text-[10px] text-gray-600 font-black uppercase tracking-[0.4em]">Life Strategy Score</h3>
            <div className="space-y-8">
              {ACTIONS.map(a => (
                <div key={a.id} className="space-y-2">
                  <div className="flex justify-between items-center"><span className="text-xs font-bold text-gray-400">{a.name}の重要度</span><span className={`font-mono font-bold ${a.color}`}>{qValues[a.id].toFixed(1)}</span></div>
                  <div className="h-3 w-full bg-black border border-white/5 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-500 ${a.color.replace('text', 'bg')}`} style={{ width: `${Math.min(100, (qValues[a.id]/100)*100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-[#4ade80]/5 border border-[#4ade80]/20 p-8 rounded-3xl space-y-4 relative overflow-hidden">
              <Target className="absolute -bottom-4 -right-4 w-24 h-24 text-[#4ade80]/5 rotate-12" />
              <h4 className={`text-2xl font-black ${verdict.color}`}>{verdict.text}</h4>
              <p className="text-gray-400 text-sm leading-relaxed italic">"{verdict.desc}"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QLearningTool;
