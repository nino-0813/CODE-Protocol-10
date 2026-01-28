import React, { useState, useMemo } from 'react';
import { ChevronLeft, RefreshCw, Plus, Trash2, Eye, Zap, Search, Fingerprint, Network, AlertCircle } from 'lucide-react';

interface DataPoint {
  id: string;
  x: number;
  y: number;
}

const PRESETS = [
  {
    name: 'SNSの「いいね」と買い物',
    xLabel: 'もらった「いいね」数',
    yLabel: '深夜のポチり金額 (円)',
    data: [
      { id: '1', x: 5, y: 12000 },
      { id: '2', x: 20, y: 5000 },
      { id: '3', x: 50, y: 2000 },
      { id: '4', x: 100, y: 500 },
      { id: '5', x: 2, y: 25000 },
    ],
    insight: '承認欲求が満たされない時、あなたの財布はストレスで口を開きます。'
  },
  {
    name: '残業時間と幸福度の反比例',
    xLabel: '月間残業時間 (h)',
    yLabel: '週末の幸福度 (100点満点)',
    data: [
      { id: '1', x: 10, y: 85 },
      { id: '2', x: 30, y: 60 },
      { id: '3', x: 60, y: 30 },
      { id: '4', x: 80, y: 15 },
      { id: '5', x: 100, y: 5 },
    ],
    insight: '「時間をお金に変える」という等価交換は、数学的にあなたの心を削っています。'
  },
  {
    name: 'コーヒー消費量とミス',
    xLabel: '飲んだ杯数',
    yLabel: '午後の致命的なミス (回)',
    data: [
      { id: '1', x: 1, y: 0 },
      { id: '2', x: 2, y: 1 },
      { id: '3', x: 4, y: 3 },
      { id: '4', x: 6, y: 8 },
      { id: '5', x: 8, y: 15 },
    ],
    insight: '覚醒剤（カフェイン）への依存は、ある一線を超えると「集中の崩壊」を招きます。'
  }
];

const CorrelationTool: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [dataPoints, setDataPoints] = useState<DataPoint[]>(PRESETS[0].data);
  const [xLabel, setXLabel] = useState(PRESETS[0].xLabel);
  const [yLabel, setYLabel] = useState(PRESETS[0].yLabel);
  const [newX, setNewX] = useState<string>('');
  const [newY, setNewY] = useState<string>('');

  const stats = useMemo(() => {
    if (dataPoints.length < 2) return { r: 0 };
    const n = dataPoints.length;
    const xSum = dataPoints.reduce((acc, p) => acc + p.x, 0);
    const ySum = dataPoints.reduce((acc, p) => acc + p.y, 0);
    const xMean = xSum / n;
    const yMean = ySum / n;
    let num = 0, denX = 0, denY = 0;
    dataPoints.forEach(p => {
      const dx = p.x - xMean, dy = p.y - yMean;
      num += dx * dy;
      denX += dx * dx;
      denY += dy * dy;
    });
    const den = Math.sqrt(denX * denY);
    return { r: den === 0 ? 0 : num / den };
  }, [dataPoints]);

  const getVerdict = () => {
    const r = stats.r;
    const absR = Math.abs(r);
    if (absR > 0.8) return { 
      status: "完全同期 (FULLY SYNCED)", 
      color: "text-red-500", 
      border: "border-red-500/30",
      bg: "bg-red-500/5",
      desc: r > 0 ? "一方が増えればもう一方も増える。もはや逃げ場のない「運命の鎖」で繋がれています。" : "一方が増えればもう一方は確実に減る。完璧なシーソーの関係。システムはあなたの次の一手を100%予言できます。" 
    };
    if (absR > 0.4) return { 
      status: "行動パターン検出 (PATTERN FOUND)", 
      color: "text-orange-400", 
      border: "border-orange-400/30",
      bg: "bg-orange-400/5",
      desc: "緩やかな繋がりがあります。あなたの無意識が、この2つを関連付けて行動しています。プロファイリングは容易です。" 
    };
    return { 
      status: "解析不能な自由 (UNPREDICTABLE)", 
      color: "text-[#4ade80]", 
      border: "border-[#4ade80]/30",
      bg: "bg-[#4ade80]/5",
      desc: "この2つの行動に、数学的な糸は見当たりません。あなたはまだ、システムの監視をすり抜ける『自由な不確定要素』です。" 
    };
  };

  const verdict = getVerdict();
  const sortedPoints = [...dataPoints].sort((a, b) => a.x - b.x);
  const xMax = Math.max(...dataPoints.map(p => p.x), 1) * 1.1;
  const yMax = Math.max(...dataPoints.map(p => p.y), 1) * 1.1;

  const loadScenario = (s: typeof PRESETS[0]) => {
    setDataPoints(s.data);
    setXLabel(s.xLabel);
    setYLabel(s.yLabel);
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <button onClick={onBack} className="flex items-center text-[#4ade80] mb-8 hover:opacity-80 transition-opacity group">
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span>ダッシュボードに戻る</span>
      </button>

      <div className="mb-12">
        <h2 className="text-sm font-mono text-[#4ade80] tracking-[0.3em] uppercase mb-2">Protocol 07: Behavior Linkage</h2>
        <h1 className="text-4xl font-bold text-white mb-4">欲望プロファイラー</h1>
        <p className="text-gray-400 text-lg italic">「一見無関係な行動の裏に潜む、あなたを操る『同期率』を暴く」</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Control Panel */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-3">
            <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest flex items-center gap-2">
              <Search className="w-3 h-3" /> プロファイリングの型を選択
            </span>
            <div className="flex flex-col gap-2">
              {PRESETS.map((p, i) => (
                <button 
                  key={i} 
                  onClick={() => loadScenario(p)} 
                  className={`p-4 border rounded-2xl text-left transition-all group ${xLabel === p.xLabel ? 'bg-[#4ade80]/10 border-[#4ade80] text-[#4ade80]' : 'bg-white/5 border-white/10 text-gray-500 hover:text-gray-300'}`}
                >
                  <div className="text-xs font-bold mb-1">{p.name}</div>
                  <div className="text-[10px] opacity-60 italic leading-tight">{p.insight}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#0a0a0a] p-8 rounded-3xl border border-white/5 shadow-2xl space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Fingerprint className="w-4 h-4 text-[#4ade80]" />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">行動データの入力</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] text-gray-600 font-bold uppercase">{xLabel}</label>
                <input value={newX} onChange={e => setNewX(e.target.value)} placeholder="0" className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-[#4ade80]" type="number" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] text-gray-600 font-bold uppercase">{yLabel}</label>
                <input value={newY} onChange={e => setNewY(e.target.value)} placeholder="0" className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-[#4ade80]" type="number" />
              </div>
            </div>
            <button onClick={() => {if(newX && newY){setDataPoints([...dataPoints, {id: Date.now().toString(), x: Number(newX), y: Number(newY)}]); setNewX(''); setNewY('');}}} className="w-full py-4 bg-[#4ade80] text-black font-black rounded-2xl text-xs hover:shadow-[0_0_20px_#4ade80] transition-all flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> 証拠データを刻印せよ
            </button>
            
            <div className="max-h-40 overflow-y-auto custom-scrollbar space-y-2 pr-2">
              {dataPoints.map(p => (
                <div key={p.id} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5 text-[10px] text-gray-500 font-mono group">
                  <span className="group-hover:text-gray-300 transition-colors">X: {p.x} → Y: {p.y}</span>
                  <button onClick={() => setDataPoints(dataPoints.filter(d => d.id !== p.id))} className="text-gray-800 hover:text-red-500 transition-colors"><Trash2 className="w-3 h-3" /></button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Output Panel */}
        <div className="lg:col-span-7">
          <div className="bg-[#0a0a0a] border border-white/5 rounded-[40px] p-10 shadow-2xl space-y-10 flex flex-col items-center">
            
            <div className="text-center">
              <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.4em] mb-4">Synchronization rate</p>
              <div className="text-9xl font-black text-white glow-text font-mono leading-none flex items-baseline">
                {Math.abs(stats.r).toFixed(3)}
              </div>
              <p className="text-[#4ade80] text-[10px] font-bold mt-4 uppercase tracking-[0.3em]">
                {stats.r > 0 ? "正の連動関係" : stats.r < 0 ? "負の反比例関係" : "無相関"}
              </p>
            </div>

            {/* Pattern Visualization */}
            <div className="relative aspect-video w-full border border-white/5 bg-black/60 rounded-[30px] overflow-hidden p-10 group shadow-inner">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Connecting lines to emphasize pattern */}
                <path 
                  d={(() => { 
                    if (sortedPoints.length < 2) return "";
                    let p = `M ${(sortedPoints[0].x / xMax) * 100} ${100 - (sortedPoints[0].y / yMax) * 100}`; 
                    sortedPoints.forEach(h => p+=` L ${(h.x / xMax) * 100} ${100 - (h.y / yMax) * 100}`); 
                    return p; 
                  })()} 
                  fill="none" stroke="#4ade80" strokeWidth="0.5" strokeDasharray="2,2" strokeOpacity="0.3"
                />
                {dataPoints.map(p => (
                  <circle 
                    key={p.id} 
                    cx={(p.x / xMax) * 100} 
                    cy={100 - (p.y / yMax) * 100} 
                    r="2" 
                    fill="#4ade80" 
                    className="animate-pulse shadow-[0_0_10px_#4ade80]" 
                  />
                ))}
              </svg>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[9px] text-gray-700 font-bold uppercase tracking-widest flex items-center gap-2">
                {xLabel} <div className="w-8 h-[1px] bg-gray-800" />
              </div>
              <div className="absolute left-4 top-1/2 -rotate-90 -translate-y-1/2 text-[9px] text-gray-700 font-bold uppercase tracking-widest flex items-center gap-2">
                {yLabel} <div className="w-8 h-[1px] bg-gray-800" />
              </div>
            </div>

            {/* Verdict Dossier */}
            <div className={`w-full ${verdict.bg} ${verdict.border} border p-10 rounded-[30px] space-y-4 relative overflow-hidden group shadow-lg`}>
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Network className="w-32 h-32 text-[#4ade80]" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <Fingerprint className={`w-4 h-4 ${verdict.color}`} />
                  <span className={`text-[10px] font-black uppercase tracking-widest ${verdict.color}`}>Security Report</span>
                </div>
                <h3 className={`text-3xl font-black mb-4 ${verdict.color}`}>{verdict.status}</h3>
                <p className="text-gray-300 leading-relaxed italic text-lg">"{verdict.desc}"</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-black/40 rounded-2xl border border-white/5 w-full">
              <AlertCircle className="w-5 h-5 text-gray-700 shrink-0 mt-1" />
              <p className="text-[10px] text-gray-600 leading-relaxed">
                <strong>TENの教訓:</strong> 「相関関係」は「因果関係」とは異なります。しかし、2つの事象が同期しているという事実は、一方がもう一方の予測スイッチ（レバー）になっていることを意味します。システムはこのレバーを使ってあなたを誘導します。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorrelationTool;