import React, { useState, useEffect } from 'react';
import { ChevronLeft, Info, RefreshCw, BarChart2, CheckCircle2, AlertCircle } from 'lucide-react';

interface ConfidenceToolProps {
  onBack: () => void;
}

const ConfidenceTool: React.FC<ConfidenceToolProps> = ({ onBack }) => {
  const [sampleSize, setSampleSize] = useState<number>(100);
  const [successCount, setSuccessCount] = useState<number>(60);
  const [lowerBound, setLowerBound] = useState<number>(0);
  const [upperBound, setUpperBound] = useState<number>(0);
  const [marginOfError, setMarginOfError] = useState<number>(0);
  const [proportion, setProportion] = useState<number>(0);

  useEffect(() => {
    if (sampleSize <= 0) return;
    const p = successCount / sampleSize;
    setProportion(p * 100);
    const moe = 1.96 * Math.sqrt((p * (1 - p)) / sampleSize);
    setMarginOfError(moe * 100);
    setLowerBound(Math.max(0, (p - moe) * 100));
    setUpperBound(Math.min(100, (p + moe) * 100));
  }, [sampleSize, successCount]);

  const scenarios = [
    { label: 'アンケートの結果は本物？', n: 100, k: 55 },
    { label: '新機能のABテスト', n: 500, k: 300 },
    { label: '少人数の意見', n: 10, k: 8 },
  ];

  const getVerdict = () => {
    if (sampleSize < 30) return { text: "結論：信じるには早すぎる", color: "text-red-500", desc: "サンプルが少なすぎます。これはただの「誤差」である可能性が高いです。" };
    if (marginOfError > 10) return { text: "結論：目安程度にせよ", color: "text-yellow-400", desc: "傾向は見えますが、まだ数値が大きくブレる可能性があります。" };
    return { text: "結論：これは真実だ", color: "text-[#4ade80]", desc: "十分なデータです。この数値は現実を正しく反映していると判断できます。" };
  };

  const verdict = getVerdict();

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 px-0 sm:px-0">
      <button type="button" onClick={onBack} className="flex items-center gap-2 text-[#4ade80] mb-8 min-h-[44px] touch-manipulation hover:opacity-80 transition-opacity group -ml-1">
        <ChevronLeft className="w-5 h-5 shrink-0 group-hover:-translate-x-1 transition-transform" />
        <span>ダッシュボードに戻る</span>
      </button>

      <div className="mb-8 sm:mb-12 text-center lg:text-left">
        <h2 className="text-sm font-mono text-[#4ade80] tracking-[0.3em] uppercase mb-2">Protocol 03: Confidence Interval</h2>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 break-words">たまたまじゃない度チェック</h1>
        <p className="text-gray-400 text-base sm:text-lg italic break-words">「目の前の数字は、たまたま運が良かっただけか、それとも真実か？」</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        <div className="lg:col-span-5 space-y-8 lg:space-y-10">
          <div className="space-y-3">
            <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">よくある調査例</span>
            <div className="flex flex-wrap gap-2">
              {scenarios.map((s, i) => (
                <button type="button" key={i} onClick={() => { setSampleSize(s.n); setSuccessCount(s.k); }} className="min-h-[44px] px-4 py-3 sm:py-2 rounded-full text-xs text-left text-gray-400 bg-white/5 border border-white/10 hover:bg-[#4ade80]/10 transition-all touch-manipulation break-words max-w-full">{s.label}</button>
              ))}
            </div>
          </div>

          <div className="space-y-10 bg-[#0a0a0a] p-6 sm:p-10 rounded-3xl border border-white/5 shadow-2xl">
            <div className="space-y-4">
              <div className="flex flex-wrap justify-between items-center gap-2">
                <label className="text-sm font-semibold text-gray-300 shrink-0">調べた人数 (全体数)</label>
                <span className="text-xl font-mono text-[#4ade80]">{sampleSize}</span>
              </div>
              <input type="range" min="5" max="2000" step="5" value={sampleSize} onChange={(e) => setSampleSize(Number(e.target.value))} className="w-full h-2 sm:h-1 bg-[#1a1a1a] rounded-lg appearance-none cursor-pointer accent-[#4ade80] touch-manipulation py-2" aria-label="調べた人数" />
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap justify-between items-center gap-2">
                <label className="text-sm font-semibold text-gray-300 shrink-0">当てはまった人数 (成功数)</label>
                <span className="text-xl font-mono text-[#4ade80]">{successCount}</span>
              </div>
              <input type="range" min="0" max={sampleSize} value={successCount} onChange={(e) => setSuccessCount(Math.min(sampleSize, Number(e.target.value)))} className="w-full h-2 sm:h-1 bg-[#1a1a1a] rounded-lg appearance-none cursor-pointer accent-[#4ade80] touch-manipulation py-2" aria-label="当てはまった人数" />
            </div>

            <button onClick={() => setSampleSize(100) || setSuccessCount(60)} className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-gray-500 hover:bg-white/10 transition-colors">
              <RefreshCw className="w-3 h-3 mx-auto" />
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col justify-center">
          <div className="bg-[#0a0a0a] border border-white/5 rounded-[40px] p-12 shadow-2xl space-y-12">
            <div className="text-center">
              <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.4em] mb-4">Measured Ratio</p>
              <div className="text-8xl font-black text-white glow-text font-mono leading-none">
                {proportion.toFixed(1)}<span className="text-3xl">%</span>
              </div>
              <p className="text-gray-400 text-sm mt-6 font-bold tracking-widest uppercase">調査上の結果</p>
            </div>

            <div className="space-y-6">
              <div className="relative h-16 flex items-center px-4 bg-black/40 rounded-2xl border border-white/5">
                <div className="absolute inset-x-8 h-[2px] bg-white/5" />
                <div className="absolute h-3 bg-[#4ade80]/30 rounded-full border border-[#4ade80]/50 shadow-[0_0_15px_rgba(74,222,128,0.2)]" style={{ left: `${lowerBound}%`, width: `${upperBound - lowerBound}%` }} />
                <div className="absolute w-5 h-5 bg-[#4ade80] rounded-full shadow-[0_0_20px_#4ade80]" style={{ left: `calc(${proportion}% - 10px)` }} />
              </div>
              <div className="flex justify-between text-[10px] text-gray-600 font-mono tracking-tighter">
                <span>最悪の場合: {lowerBound.toFixed(1)}%</span>
                <span className="text-[#4ade80]">誤差範囲: ±{marginOfError.toFixed(1)}%</span>
                <span>最高の場合: {upperBound.toFixed(1)}%</span>
              </div>
            </div>

            <div className="bg-black/80 border border-white/5 p-8 rounded-3xl space-y-4">
              <h3 className={`text-2xl font-black ${verdict.color}`}>{verdict.text}</h3>
              <p className="text-gray-400 leading-relaxed italic">"{verdict.desc}"</p>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-yellow-500/5 rounded-xl border border-yellow-500/10">
              <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0" />
              <p className="text-[10px] text-gray-500 leading-tight italic">
                <strong>TENの教訓:</strong> 「80%の人が満足！」という広告も、調べたのが10人だけなら意味がありません。このツールで「本当の確かさ」を暴いてください。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfidenceTool;