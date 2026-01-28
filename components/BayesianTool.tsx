import React, { useState, useEffect } from 'react';
import { ChevronLeft, Info, RefreshCw, Lightbulb, CheckCircle } from 'lucide-react';

interface BayesianToolProps {
  onBack: () => void;
}

const BayesianTool: React.FC<BayesianToolProps> = ({ onBack }) => {
  const [prior, setPrior] = useState<number>(50);
  const [likelihood, setLikelihood] = useState<number>(80);
  const [falsePositive, setFalsePositive] = useState<number>(10);
  const [posterior, setPosterior] = useState<number>(0);

  useEffect(() => {
    const pA = prior / 100;
    const pBA = likelihood / 100;
    const pBNotA = falsePositive / 100;
    const numerator = pBA * pA;
    const denominator = (pBA * pA) + (pBNotA * (1 - pA));
    setPosterior(denominator === 0 ? 0 : (numerator / denominator) * 100);
  }, [prior, likelihood, falsePositive]);

  const scenarios = [
    { label: 'LINEの返信が遅いのは脈なし？', p: 40, l: 70, f: 30 },
    { label: 'このネットニュースはデマ？', p: 20, l: 90, f: 10 },
    { label: '自分のビジネスは成功する？', p: 30, l: 80, f: 40 },
  ];

  const getVerdict = () => {
    if (posterior > 80) return { text: "結論：信じて動け", color: "text-[#4ade80]", desc: "確信度は極めて高いです。疑う時間は終わり、行動すべき時です。" };
    if (posterior > 50) return { text: "結論：可能性あり", color: "text-yellow-400", desc: "五分五分よりは高いですが、まだ油断は禁物。もう一つ証拠を探しましょう。" };
    return { text: "結論：今は静観せよ", color: "text-red-500", desc: "確信度は低いです。その証拠にはあまり価値がないか、もともとの見立てが甘すぎます。" };
  };

  const verdict = getVerdict();

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 px-0 sm:px-0">
      <button type="button" onClick={onBack} className="flex items-center gap-2 text-[#4ade80] mb-8 min-h-[44px] touch-manipulation hover:opacity-80 transition-opacity group -ml-1">
        <ChevronLeft className="w-5 h-5 shrink-0 group-hover:-translate-x-1 transition-transform" />
        <span>ダッシュボードに戻る</span>
      </button>

      <div className="mb-8 sm:mb-12">
        <h2 className="text-sm font-mono text-[#4ade80] tracking-[0.3em] uppercase mb-2">Protocol 01: Bayesian Update</h2>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 break-words">確信度アップデート計算機</h1>
        <p className="text-gray-400 text-base sm:text-lg italic break-words">「新しい情報を見て、自分の『自信』を数学的に書き換える」</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        <div className="lg:col-span-5 space-y-8 lg:space-y-10">
          {/* Scenario Buttons */}
          <div className="space-y-3">
            <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">シミュレーションを選択</span>
            <div className="flex flex-wrap gap-2">
              {scenarios.map((s, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => { setPrior(s.p); setLikelihood(s.l); setFalsePositive(s.f); }}
                  className="min-h-[44px] px-4 py-3 sm:py-2 rounded-full text-xs sm:text-left text-gray-400 bg-white/5 border border-white/10 hover:bg-[#4ade80]/10 hover:text-[#4ade80] hover:border-[#4ade80]/30 transition-all touch-manipulation break-words max-w-full"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-8 bg-[#0a0a0a] p-6 sm:p-8 rounded-3xl border border-white/5 shadow-2xl">
            <div className="space-y-4">
              <div className="flex flex-wrap justify-between items-center gap-2">
                <label className="text-sm font-semibold text-gray-300 shrink-0">もともとの自信 (事前確率)</label>
                <span className="text-xl font-mono text-[#4ade80]">{prior}%</span>
              </div>
              <input type="range" min="0" max="100" value={prior} onChange={(e) => setPrior(Number(e.target.value))} className="w-full h-2 sm:h-1 bg-[#1a1a1a] rounded-lg appearance-none cursor-pointer accent-[#4ade80] touch-manipulation py-2" aria-label="事前確率" />
              <p className="text-[10px] text-gray-600">証拠を見る前に「それが本当だ」と思っていた確率</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-gray-300">本物ならこうなる確率 (再現率)</label>
                <span className="text-xl font-mono text-[#4ade80]">{likelihood}%</span>
              </div>
              <input type="range" min="0" max="100" value={likelihood} onChange={(e) => setLikelihood(Number(e.target.value))} className="w-full h-2 sm:h-1 bg-[#1a1a1a] rounded-lg appearance-none cursor-pointer accent-[#4ade80] touch-manipulation py-2" aria-label="再現率" />
              <p className="text-[10px] text-gray-600">もし仮説が正しければ、その証拠が出る確率</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-gray-300">嘘でもこうなる確率 (偽陽性率)</label>
                <span className="text-xl font-mono text-[#4ade80]">{falsePositive}%</span>
              </div>
              <input type="range" min="0" max="100" value={falsePositive} onChange={(e) => setFalsePositive(Number(e.target.value))} className="w-full h-2 sm:h-1 bg-[#1a1a1a] rounded-lg appearance-none cursor-pointer accent-[#4ade80] touch-manipulation py-2" aria-label="偽陽性率" />
              <p className="text-[10px] text-gray-600">もし仮説が間違っていても、偶然その証拠が出てしまう確率</p>
            </div>

            <button onClick={() => setPrior(50) || setLikelihood(80) || setFalsePositive(10)} className="w-full py-3 flex justify-center items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs text-gray-500 transition-colors">
              <RefreshCw className="w-3 h-3" /> 数値をリセット
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col justify-center items-center gap-10">
          <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="50%" cy="50%" r="42%" className="stroke-[#1a1a1a] fill-none" strokeWidth="15" />
              <circle cx="50%" cy="50%" r="42%" className="stroke-[#4ade80] fill-none transition-all duration-1000 ease-out" strokeWidth="15" strokeDasharray="264" strokeDashoffset={264 - (264 * posterior) / 100} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Updated Confidence</p>
              <div className="text-8xl font-black text-white glow-text font-mono leading-none">
                {Math.round(posterior)}<span className="text-3xl">%</span>
              </div>
              <p className="text-[#4ade80] text-sm mt-4 font-bold tracking-widest">修正後の確信度</p>
            </div>
          </div>

          <div className="w-full max-w-lg space-y-6">
            <div className="bg-[#0a0a0a] border border-[#4ade80]/30 p-8 rounded-3xl shadow-[0_0_30px_rgba(74,222,128,0.1)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <CheckCircle className="w-20 h-20 text-[#4ade80]" />
              </div>
              <div className="relative z-10">
                <h3 className={`text-2xl font-black mb-3 ${verdict.color}`}>{verdict.text}</h3>
                <p className="text-gray-300 leading-relaxed italic">"{verdict.desc}"</p>
              </div>
            </div>

            <div className="p-4 bg-black/80 rounded-xl border border-white/5 flex items-center gap-4">
              <Lightbulb className="w-5 h-5 text-yellow-500 shrink-0" />
              <p className="text-[11px] text-gray-500 leading-tight">
                <strong>TENのアドバイス:</strong> 人間は「証拠そのもののインパクト」に目を奪われ、もともとの確率を忘れがちです。この数式を使えば、感情的なパニックを回避できます。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BayesianTool;