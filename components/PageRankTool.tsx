
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  ChevronLeft, UserPlus, Link2, Trash2, 
  Award, Zap, Network, Users, 
  ArrowRight, Crown, ShieldCheck, Fingerprint,
  Info, MousePointer2, Move, Share2
} from 'lucide-react';

interface Node { id: string; name: string; x: number; y: number; }
interface Edge { from: string; to: string; }
interface PageRankResult { nodeId: string; score: number; rank: number; }

const SCENARIOS = [
  {
    name: '秘密結社の連絡網',
    nodes: [
      { id: '1', name: '表のリーダー', x: 50, y: 20 },
      { id: '2', name: '情報の門番', x: 50, y: 50 },
      { id: '3', name: '古参の参謀', x: 25, y: 75 },
      { id: '4', name: '現場の工作員', x: 75, y: 75 },
    ],
    edges: [
      { from: '1', to: '2' },
      { from: '3', to: '2' },
      { from: '4', to: '3' },
      { from: '2', to: '1' },
    ],
    insight: '表のリーダーは、実質的に「門番」の承認なしには何も決定できません。'
  },
  {
    name: 'インフルエンサーの相関',
    nodes: [
      { id: '1', name: 'メガ・タレント', x: 30, y: 35 },
      { id: '2', name: '目利き批評家', x: 70, y: 35 },
      { id: '3', name: '熱狂的ファン層', x: 50, y: 75 },
    ],
    edges: [
      { from: '1', to: '2' }, 
      { from: '3', to: '1' },
      { from: '3', to: '2' },
    ],
    insight: '批評家がメガ・タレントの価値を定義しており、コミュニティの真の北極星となっています。'
  }
];

const PageRankTool: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [nodes, setNodes] = useState<Node[]>(SCENARIOS[0].nodes);
  const [edges, setEdges] = useState<Edge[]>(SCENARIOS[0].edges);
  const [newNodeName, setNewNodeName] = useState('');
  const [newEdgeFrom, setNewEdgeFrom] = useState('');
  const [newEdgeTo, setNewEdgeTo] = useState('');
  const [hoverNodeId, setHoverNodeId] = useState<string | null>(null);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  
  const svgRef = useRef<SVGSVGElement>(null);

  // PageRankの計算
  const results = useMemo(() => {
    if (nodes.length === 0) return [];
    const n = nodes.length;
    let scores: Record<string, number> = {};
    nodes.forEach(node => scores[node.id] = 1 / n);

    const d = 0.85; 
    for (let i = 0; i < 25; i++) {
      let nextScores: Record<string, number> = {};
      nodes.forEach(node => nextScores[node.id] = (1 - d) / n);
      
      let danglingRank = 0;
      nodes.forEach(node => {
        const outLinks = edges.filter(e => e.from === node.id);
        if (outLinks.length === 0) {
          danglingRank += scores[node.id];
        } else {
          outLinks.forEach(edge => {
            nextScores[edge.to] += d * (scores[node.id] / outLinks.length);
          });
        }
      });
      
      nodes.forEach(node => {
        nextScores[node.id] += d * (danglingRank / n);
      });
      scores = nextScores;
    }

    return nodes
      .map(node => ({ nodeId: node.id, score: scores[node.id], rank: 0 }))
      .sort((a, b) => b.score - a.score)
      .map((item, index) => ({ ...item, rank: index + 1 }));
  }, [nodes, edges]);

  const topNodeId = results[0]?.nodeId;
  const topNode = nodes.find(n => n.id === topNodeId);

  // ドラッグ操作の実装
  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingNodeId && svgRef.current) {
      const CTM = svgRef.current.getScreenCTM();
      if (CTM) {
        const x = (e.clientX - CTM.e) / CTM.a;
        const y = (e.clientY - CTM.f) / CTM.d;
        setNodes(nodes.map(n => n.id === draggingNodeId ? { ...n, x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) } : n));
      }
    }
  };

  const addNode = () => {
    if (newNodeName.trim()) {
      const newNode: Node = { 
        id: Date.now().toString(), 
        name: newNodeName.trim(),
        x: 30 + Math.random() * 40,
        y: 30 + Math.random() * 40
      };
      setNodes([...nodes, newNode]);
      setNewNodeName('');
    }
  };

  const addEdge = () => {
    if (newEdgeFrom && newEdgeTo && newEdgeFrom !== newEdgeTo) {
      if (!edges.find(e => e.from === newEdgeFrom && e.to === newEdgeTo)) {
        setEdges([...edges, { from: newEdgeFrom, to: newEdgeTo }]);
      }
    }
  };

  const loadScenario = (s: typeof SCENARIOS[0]) => {
    setNodes(s.nodes);
    setEdges(s.edges);
  };

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 select-none">
      <button type="button" onClick={onBack} className="flex items-center gap-2 text-[#4ade80] mb-8 min-h-[44px] touch-manipulation hover:opacity-80 transition-opacity group -ml-1">
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span>ダッシュボードに戻る</span>
      </button>

      <div className="mb-12">
        <h2 className="text-sm font-mono text-[#4ade80] tracking-[0.3em] uppercase mb-2">Protocol 05: Influence Node</h2>
        <h1 className="text-4xl font-bold text-white mb-4">キーマン発見機 <span className="text-gray-600 font-light font-mono text-xl">v2.0</span></h1>
        <p className="text-gray-400 text-lg italic">「繋がりという『質の連鎖』から、組織の真の重心を特定する」</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Tactical Control */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#0a0a0a] p-8 rounded-[2rem] border border-white/5 space-y-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#4ade80]/20 to-transparent" />
            
            <div className="space-y-6">
              <div className="space-y-4">
                <label className="text-[10px] uppercase text-gray-500 font-black tracking-[0.2em] flex items-center gap-2">
                  <Users className="w-3 h-3 text-[#4ade80]" /> 人物エージェントを登録
                </label>
                <div className="flex gap-2">
                  <input 
                    value={newNodeName} 
                    onChange={e => setNewNodeName(e.target.value)} 
                    placeholder="エージェント名..." 
                    className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-[#4ade80] outline-none placeholder:text-gray-800" 
                    onKeyPress={e => e.key === 'Enter' && addNode()}
                  />
                  <button onClick={addNode} className="p-3 bg-[#4ade80] text-black rounded-xl hover:shadow-[0_0_20px_rgba(74,222,128,0.4)] transition-all"><UserPlus className="w-5 h-5"/></button>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-white/5">
                <label className="text-[10px] uppercase text-gray-500 font-black tracking-[0.2em] flex items-center gap-2">
                  <Link2 className="w-3 h-3 text-[#4ade80]" /> 影響力ラインを接続
                </label>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 gap-2">
                    <select value={newEdgeFrom} onChange={e => setNewEdgeFrom(e.target.value)} className="bg-black border border-white/10 rounded-xl px-4 py-3 text-xs text-gray-400 outline-none appearance-none hover:border-gray-700 transition-colors">
                      <option value="">(FROM)</option>
                      {nodes.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
                    </select>
                    <div className="flex justify-center"><ArrowRight className="w-4 h-4 text-gray-800" /></div>
                    <select value={newEdgeTo} onChange={e => setNewEdgeTo(e.target.value)} className="bg-black border border-white/10 rounded-xl px-4 py-3 text-xs text-gray-400 outline-none appearance-none hover:border-gray-700 transition-colors">
                      <option value="">(TO: 信頼・支持)</option>
                      {nodes.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
                    </select>
                  </div>
                  <button onClick={addEdge} className="w-full py-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase text-gray-600 hover:text-[#4ade80] hover:border-[#4ade80]/40 transition-all flex items-center justify-center gap-2">
                    <Share2 className="w-3 h-3" /> プロトコルリンク構築
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 space-y-4">
              <span className="text-[10px] text-gray-700 font-black uppercase tracking-widest flex items-center gap-2">
                <Network className="w-3 h-3" /> 解析パターン読込
              </span>
              <div className="grid grid-cols-1 gap-2">
                {SCENARIOS.map((s, i) => (
                  <button key={i} onClick={() => loadScenario(s)} className="p-4 text-left bg-black/40 rounded-2xl border border-white/5 hover:border-[#4ade80]/30 transition-all group/btn">
                    <div className="text-[11px] font-black text-gray-400 group-hover/btn:text-[#4ade80] transition-colors">{s.name}</div>
                    <div className="text-[9px] text-gray-700 italic mt-1 leading-tight">{s.insight}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-black/40 border border-white/5 rounded-[2rem] flex items-center gap-4 text-gray-600">
            <Move className="w-4 h-4" />
            <span className="text-[10px] font-mono">キャンバス上のノードをドラッグして再配置可能</span>
          </div>
        </div>

        {/* Center: Tactical Mapping Canvas */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-black border border-white/5 rounded-[3rem] p-4 shadow-[0_0_80px_rgba(0,0,0,0.5)] relative overflow-hidden h-[600px] group/canvas">
            <div className="absolute inset-0 matrix-grid opacity-20 pointer-events-none" />
            
            <div className="absolute top-8 left-8 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#4ade80] animate-ping" />
                <span className="text-[10px] text-[#4ade80] font-mono font-bold tracking-[0.3em]">LIVE_INFLUENCE_MONITOR</span>
              </div>
              <div className="h-[1px] w-12 bg-white/10" />
              <div className="text-[10px] text-gray-700 font-mono">NODES: {nodes.length} | LINKS: {edges.length}</div>
            </div>

            {/* 凡例：グラフの読み方 */}
            <div className="absolute bottom-8 left-8 right-8 flex flex-wrap items-center gap-6 text-[10px] text-gray-500 font-mono bg-black/70 border border-white/10 rounded-xl px-4 py-3 backdrop-blur-sm">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#4ade80]/60 border border-[#4ade80]" /> 円の大きさ = 影響力スコア
              </span>
              <span className="flex items-center gap-2">
                <svg width="28" height="14" viewBox="0 0 28 14" className="flex-shrink-0">
                  <defs>
                    <marker id="arrowhead-legend" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                      <polygon points="0 0, 8 3, 0 6" fill="#4ade80" />
                    </marker>
                  </defs>
                  <line x1="0" y1="7" x2="20" y2="7" stroke="#4ade80" strokeWidth="1.5" opacity="0.8" markerEnd="url(#arrowhead-legend)" />
                </svg>
                矢印 = 「誰が誰を信頼しているか」の向き
              </span>
              <span className="flex items-center gap-2">
                <Crown className="w-3.5 h-3.5 text-[#4ade80]" /> 王冠 = 最も影響力の高いノード
              </span>
            </div>

            <svg 
              ref={svgRef} 
              className="w-full h-full cursor-crosshair" 
              viewBox="0 0 100 100"
              onMouseMove={handleMouseMove}
              onMouseUp={() => setDraggingNodeId(null)}
              onMouseLeave={() => setDraggingNodeId(null)}
            >
              <defs>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="1.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <radialGradient id="nodeGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#4ade80" />
                  <stop offset="100%" stopColor="#22c55e" />
                </radialGradient>
                {/* 矢印マーカー：影響の向きを表示 */}
                <marker id="arrowhead" markerWidth="4" markerHeight="4" refX="3" refY="2" orient="auto">
                  <polygon points="0 0, 4 2, 0 4" fill="#4ade80" opacity="0.8" />
                </marker>
              </defs>

              {/* Influencial Edges (Data Flow) - 矢印で「誰が誰を信頼しているか」を表示 */}
              {edges.map((edge, i) => {
                const from = nodes.find(n => n.id === edge.from);
                const to = nodes.find(n => n.id === edge.to);
                if (!from || !to) return null;
                const fromRes = results.find(r => r.nodeId === from.id);
                const toRes = results.find(r => r.nodeId === to.id);
                const toRadius = 2.5 + ((toRes?.score || 0) * 35);
                const dx = to.x - from.x, dy = to.y - from.y;
                const len = Math.hypot(dx, dy) || 1;
                const nx = dx / len, ny = dy / len;
                const x2 = to.x - nx * (toRadius + 1.5);
                const y2 = to.y - ny * (toRadius + 1.5);
                const isActive = hoverNodeId === edge.from || hoverNodeId === edge.to;
                return (
                  <g key={i}>
                    <title>{from.name} → {to.name}（{from.name}が{to.name}を信頼）</title>
                    <line 
                      x1={from.x} y1={from.y} 
                      x2={x2} y2={y2} 
                      stroke="#4ade80" 
                      strokeWidth={isActive ? "0.6" : "0.4"} 
                      strokeOpacity={isActive ? "0.7" : "0.35"} 
                      markerEnd="url(#arrowhead)"
                      className="transition-all duration-300"
                    />
                    <circle r="0.35" fill="#4ade80" opacity="0.9">
                      <animateMotion 
                        path={`M ${from.x} ${from.y} L ${x2} ${y2}`} 
                        dur={`${2.5 + (i % 3) * 0.5}s`} 
                        repeatCount="indefinite" 
                      />
                    </circle>
                  </g>
                );
              })}
              
              {/* Nodes (Power Cores) */}
              {nodes.map(node => {
                const res = results.find(r => r.nodeId === node.id);
                const score = res?.score || 0;
                const isTop = node.id === topNodeId;
                const isHovered = hoverNodeId === node.id;
                const radius = 2.5 + (score * 35); 
                
                return (
                  <g 
                    key={node.id} 
                    className="cursor-grab active:cursor-grabbing transition-all duration-300"
                    onMouseDown={(e) => { e.stopPropagation(); setDraggingNodeId(node.id); }}
                    onMouseEnter={() => setHoverNodeId(node.id)}
                    onMouseLeave={() => setHoverNodeId(null)}
                  >
                    {/* Outer Rings for Top Node */}
                    {isTop && (
                      <g className="animate-spin" style={{ transformOrigin: `${node.x}% ${node.y}%`, animationDuration: '10s' }}>
                        <circle cx={node.x} cy={node.y} r={radius + 3} fill="none" stroke="#4ade80" strokeWidth="0.1" strokeDasharray="1,2" opacity="0.4" />
                      </g>
                    )}
                    
                    {/* Glow and Shadow */}
                    <circle cx={node.x} cy={node.y} r={radius + 1} fill="#4ade80" fillOpacity={isTop ? 0.15 : 0.05} filter="url(#glow)" />
                    
                    {/* Main Core */}
                    <circle 
                      cx={node.x} cy={node.y} r={radius} 
                      fill={isTop ? "url(#nodeGradient)" : isHovered ? "#4ade80" : "#111"} 
                      stroke={isTop || isHovered ? "#4ade80" : "rgba(255,255,255,0.05)"}
                      strokeWidth="0.4"
                      className="transition-all duration-500"
                    />

                    {/* Node Info Label - 名前と影響力％を大きく表示 */}
                    <g transform={`translate(${node.x}, ${node.y + radius + 5.5})`}>
                      {isTop && (
                        <foreignObject x="-2.5" y="-14" width="5" height="5" className="-translate-y-full">
                           <Crown className="w-full h-full text-white drop-shadow-[0_0_5px_#4ade80] animate-bounce" />
                        </foreignObject>
                      )}
                      <text textAnchor="middle" fill={isTop ? "#fff" : isHovered ? "#4ade80" : "#888"} fontSize="3.2" fontWeight="900" className="font-mono">
                        {node.name}
                      </text>
                      <text textAnchor="middle" y="3.2" fill="#4ade80" fillOpacity={isTop || isHovered ? 0.9 : 0.6} fontSize="2.2" fontWeight="700" className="font-mono">
                        影響力 {(score * 100).toFixed(1)}%
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Intelligence Report Box */}
            <div className="md:col-span-7 bg-[#0a0a0a] border border-[#4ade80]/20 p-8 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Fingerprint className="w-32 h-32 text-[#4ade80]" />
              </div>
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#4ade80]/10 rounded-lg"><ShieldCheck className="w-5 h-5 text-[#4ade80]" /></div>
                  <span className="text-[10px] text-[#4ade80] font-black uppercase tracking-[0.4em]">Intelligence Analysis Report</span>
                </div>
                <h3 className="text-2xl font-black text-white">
                  最重要ノード: <span className="text-[#4ade80] glow-text">{topNode?.name || '---'}</span>
                </h3>
                <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5">
                  <p className="text-gray-400 text-sm italic leading-relaxed">
                    「{topNode?.name}は、一見すると表舞台に立つ回数は少ないかもしれません。しかし、ネットワーク解析の結果、彼は組織内で『情報のハブ』となる複数の重要人物から絶大な信頼を集めていることが判明しました。
                    この『質の高い信頼』こそが PageRank における高スコアの源泉であり、彼こそがこの集団を裏で操る真の北極星です。」
                  </p>
                </div>
              </div>
            </div>

            {/* Micro Ranking */}
            <div className="md:col-span-5 bg-black/40 border border-white/5 rounded-[2.5rem] p-8 flex flex-col gap-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest flex items-center gap-2">
                  <Award className="w-4 h-4" /> Power Rankings
                </span>
                <span className="text-[9px] font-mono text-gray-800 tracking-tighter">TOTAL_NODES: {nodes.length}</span>
              </div>
              <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-2">
                {results.slice(0, 5).map((res, i) => (
                  <div 
                    key={res.nodeId} 
                    className={`flex items-center gap-4 p-3 rounded-xl transition-all ${res.nodeId === topNodeId ? 'bg-[#4ade80]/10 border border-[#4ade80]/20' : 'bg-white/[0.02] border border-white/5'}`}
                    onMouseEnter={() => setHoverNodeId(res.nodeId)}
                    onMouseLeave={() => setHoverNodeId(null)}
                  >
                    <div className={`text-xs font-mono font-black ${res.nodeId === topNodeId ? 'text-[#4ade80]' : 'text-gray-700'}`}>0{i+1}</div>
                    <div className="flex-1">
                      <div className="text-[11px] font-bold text-gray-300">{nodes.find(n => n.id === res.nodeId)?.name}</div>
                      <div className="w-full bg-white/5 h-[2px] mt-1 rounded-full overflow-hidden">
                        <div className={`h-full ${res.nodeId === topNodeId ? 'bg-[#4ade80]' : 'bg-gray-700'}`} style={{ width: `${(res.score / (results[0]?.score || 1)) * 100}%` }} />
                      </div>
                    </div>
                    <div className="text-[10px] font-mono text-[#4ade80] opacity-60">{(res.score * 100).toFixed(1)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageRankTool;
