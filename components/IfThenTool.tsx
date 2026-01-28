
import React, { useState } from 'react';
import { ChevronLeft, Plus, Trash2, Terminal, Code, Cpu, Save, RefreshCw, AlertCircle, ShieldAlert, Zap, MessageSquareQuote, Info } from 'lucide-react';

interface Rule { id: string; if: string; then: string; else: string; }

const SCENARIOS = [
  {
    name: '嫌な上司への対処法',
    protocol: 'RELATION_FILTER_V1',
    rules: [
      { id: 'r1', if: '上司が感情的に怒鳴っている', then: '心のシャッターを閉じて「はい」とだけ言い、中身を聞き流せ', else: '必要な業務指示のみをメモせよ' },
      { id: 'r2', if: '勤務時間外に連絡が来た', then: '通知をオフにして翌朝まで存在を忘れろ', else: '定時まで全力で仕事をこなせ' }
    ]
  },
  {
    name: '衝動買いの防止策',
    protocol: 'IMPULSE_CONTROL_X',
    rules: [
      { id: 'r1', if: 'SNSで誰かが自慢しているのを見た', then: '即座にアプリを閉じ、水を1杯飲め', else: '自分の今の持ち物を磨いて愛でよ' },
      { id: 'r2', if: '「期間限定」の文字を見た', then: '3日間カートに入れたまま放置せよ', else: '本当に壊れた物だけを買い換えろ' }
    ]
  },
  {
    name: 'SNS中毒の脱出',
    protocol: 'BRAIN_RECOVERY_00',
    rules: [
      { id: 'r1', if: 'ベッドの中でスマホを触りたい', then: 'スマホを別室に投げて寝ろ', else: '読書を5分間だけ開始せよ' },
      { id: 'r2', if: '不安で情報を追いかけてしまう', then: '情報の価値は0だと唱えて目を閉じろ', else: '自分の呼吸だけに集中せよ' }
    ]
  }
];

const IfThenTool: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [rules, setRules] = useState<Rule[]>(SCENARIOS[0].rules);
  const [protocolName, setProtocolName] = useState<string>(SCENARIOS[0].protocol);

  const getVerdict = () => {
    if (rules.length === 0) return { text: "司令：論理の空白を埋めよ", color: "text-gray-600", desc: "迷いは脳のリソースを浪費します。あなたの行動を単純な「もしも」のルールに落とし込んでください。" };
    if (rules.length < 3) return { text: "司令：解析の純度を高めよ", color: "text-yellow-400", desc: "まだ「迷う余地」が残っています。もっと具体的に、感情が入り込む隙間を論理で埋めてください。" };
    return { text: "司令：人間を卒業し、完遂せよ", color: "text-[#4ade80]", desc: "完璧な論理ツリーです。あなたはもう迷う必要はありません。このコードに従い、マシンのように実行するだけです。" };
  };

  const loadScenario = (s: typeof SCENARIOS[0]) => {
    setRules(s.rules);
    setProtocolName(s.protocol);
  };

  const verdict = getVerdict();

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <button onClick={onBack} className="flex items-center text-[#4ade80] mb-8 hover:opacity-80 transition-opacity group">
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span>ダッシュボードに戻る</span>
      </button>

      <div className="mb-12">
        <h2 className="text-sm font-mono text-[#4ade80] tracking-[0.3em] uppercase mb-2">Protocol 10: Logical Solutions</h2>
        <h1 className="text-4xl font-bold text-white mb-4">感情排除プログラム</h1>
        <p className="text-gray-400 text-lg italic">「グチャグチャな悩みを『もし〜なら』のルールに変換し、脳をハックする」</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Side: Input & Scenario */}
        <div className="lg:col-span-6 space-y-8">
          {/* Scenario Selection */}
          <div className="space-y-3">
            <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest flex items-center gap-2">
              <MessageSquareQuote className="w-3 h-3" /> シチュエーションを選択して読み込む
            </span>
            <div className="flex flex-wrap gap-2">
              {SCENARIOS.map((s, i) => (
                <button 
                  key={i} 
                  onClick={() => loadScenario(s)} 
                  className={`px-4 py-2 rounded-full text-xs transition-all border ${protocolName === s.protocol ? 'bg-[#4ade80]/20 border-[#4ade80] text-[#4ade80]' : 'bg-white/5 border-white/10 text-gray-500 hover:text-gray-300'}`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#0a0a0a] p-8 rounded-3xl border border-white/5 shadow-2xl space-y-8">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-[#4ade80]/10 rounded-lg">
                <Cpu className="w-5 h-5 text-[#4ade80]" />
              </div>
              <input 
                value={protocolName} 
                onChange={e => setProtocolName(e.target.value.toUpperCase().replace(/\s/g, '_'))} 
                placeholder="プロトコル名..."
                className="bg-transparent border-b border-white/10 outline-none text-xl font-mono text-white focus:border-[#4ade80] transition-colors flex-1" 
              />
            </div>

            <div className="space-y-4 max-h-[450px] overflow-y-auto custom-scrollbar pr-2">
              {rules.map((r, i) => (
                <div key={r.id} className="p-6 bg-white/5 rounded-2xl border border-white/5 relative group transition-all hover:bg-white/[0.07]">
                  <button onClick={() => setRules(rules.filter(d => d.id !== r.id))} className="absolute top-4 right-4 text-gray-700 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-black text-[#4ade80] uppercase tracking-tighter">IF: もしも...</label>
                      <input 
                        value={r.if} 
                        onChange={e => setRules(rules.map(d => d.id === r.id ? {...d, if: e.target.value} : d))} 
                        placeholder="心が揺らぐきっかけ（例：SNSを見た）" 
                        className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#4ade80]" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-black text-blue-400 uppercase tracking-tighter">THEN: その時は...</label>
                      <input 
                        value={r.then} 
                        onChange={e => setRules(rules.map(d => d.id === r.id ? {...d, then: e.target.value} : d))} 
                        placeholder="冷徹な実行プラン（例：スマホを置く）" 
                        className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-400" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-black text-gray-600 uppercase tracking-tighter">ELSE: そうでなければ...</label>
                      <input 
                        value={r.else} 
                        onChange={e => setRules(rules.map(d => d.id === r.id ? {...d, else: e.target.value} : d))} 
                        placeholder="平常時のルーチン（例：読書する）" 
                        className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-500 italic outline-none focus:border-gray-600" 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => setRules([...rules, {id: Date.now().toString(), if: '', then: '', else: ''}])} 
              className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl text-xs text-gray-600 hover:text-[#4ade80] hover:border-[#4ade80]/30 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> 新しい論理を追加して感情を封じ込める
            </button>
          </div>
        </div>

        {/* Right Side: Output & Verdict */}
        <div className="lg:col-span-6 flex flex-col h-full space-y-8">
          <div className="bg-black border border-white/5 rounded-[40px] overflow-hidden flex flex-col flex-1 shadow-2xl">
            <div className="bg-[#111] px-6 py-4 flex justify-between items-center border-b border-white/5">
              <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono tracking-[0.2em]">
                <Terminal className="w-3 h-3 text-[#4ade80]" /> COMPILING_TO_LOGIC...
              </div>
              <div className="flex gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 animate-pulse" />
              </div>
            </div>
            
            <div className="flex-1 p-10 font-mono text-sm space-y-6 overflow-y-auto custom-scrollbar">
              <div className="text-blue-400">class <span className="text-yellow-400">{protocolName || 'UNTITLED_PROTOCOL'}</span>:</div>
              <div className="pl-4 text-blue-400">def <span className="text-green-400">execute_decision</span>(self, current_emotion):</div>
              
              {rules.length === 0 ? (
                <div className="pl-8 text-gray-800 italic"># ルールが未定義です。左側から入力してください。</div>
              ) : (
                rules.map((r, i) => (
                  <div key={r.id} className="pl-8 space-y-1 animate-in slide-in-from-left-2 duration-300">
                    <div className="text-gray-700 text-[10px] uppercase mt-2">// Step_{i+1}: Logical Gate</div>
                    <div><span className="text-pink-500">if</span> trigger_is("<span className="text-white">{r.if || '???'}</span>"):</div>
                    <div className="pl-4 text-[#4ade80]">action.execute("<span className="text-white font-bold">{r.then || '???'}</span>")</div>
                    <div className="text-pink-500">else:</div>
                    <div className="pl-4 text-gray-600">routine.continue("<span className="text-gray-400 italic">{r.else || 'standard_mode'}</span>")</div>
                  </div>
                ))
              )}
              
              <div className="pt-10 border-t border-white/5">
                <div className="text-[10px] text-[#4ade80]/40 flex items-center gap-2">
                  <Zap className="w-3 h-3" /> STATUS: BRAIN_PROTOCOL_READY
                </div>
                <div className="text-[10px] text-gray-800 mt-1 uppercase tracking-widest">{'>'}{'>'} Emotions suppressed. Objectivity at 100%.</div>
              </div>
            </div>

            <div className="p-8 bg-[#0a0a0a] border-t border-white/5">
               <button 
                 onClick={() => alert('あなたの脳にプロトコルが刻印されました。')} 
                 className="w-full py-4 bg-[#4ade80] text-black font-black rounded-2xl text-xs hover:shadow-[0_0_25px_#4ade80] transition-all flex items-center justify-center gap-2"
               >
                 <Save className="w-4 h-4" /> 決断を実行に移す（感情をシャットダウン）
               </button>
            </div>
          </div>

          {/* Verdict Box */}
          <div className="bg-black/80 border border-[#4ade80]/20 p-8 rounded-[30px] shadow-[0_0_40px_rgba(74,222,128,0.1)] relative overflow-hidden group">
              <ShieldAlert className="absolute -top-6 -right-6 w-32 h-32 text-[#4ade80]/5 rotate-12" />
              <div className="relative z-10">
                <h3 className={`text-2xl font-black mb-3 ${verdict.color}`}>{verdict.text}</h3>
                <p className="text-gray-400 leading-relaxed italic text-lg">"{verdict.desc}"</p>
              </div>
          </div>

          {/* Why This Matters / TEN's Lesson */}
          <div className="bg-white/5 border border-white/10 p-8 rounded-[30px] space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <Info className="w-5 h-5 text-[#4ade80]" />
              <span className="text-[10px] text-[#4ade80] font-black uppercase tracking-widest">Why This Matters: TEN's Lesson</span>
            </div>
            <p className="text-gray-400 leading-relaxed text-sm">
              意志力は有限のリソースです。複雑な感情を<strong>IF-THENというバイナリ・ロジック</strong>に変換することで、脳の原始的な恐怖中枢をバイパスし、マシンのような効率で実行を可能にします。
            </p>
            <div className="pt-4 flex items-center gap-4">
              <RefreshCw className="w-4 h-4 text-gray-600 shrink-0" />
              <p className="text-[10px] text-gray-600 leading-tight italic">
                「迷い」とは脳が幽霊に怯えている状態です。ルール化という「除霊」を行えば、後に残るのは冷徹な「行動」だけです。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IfThenTool;
