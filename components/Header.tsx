
import React from 'react';
import { Shield, Cpu } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="py-20 flex flex-col items-center text-center relative overflow-hidden">
      {/* Background technical text decoration */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none font-mono text-[12rem] font-black tracking-tighter leading-none whitespace-nowrap">
        DECISION PROTOCOL
      </div>

      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-10 rounded-full border border-[#4ade80]/20 bg-[#4ade80]/5 text-[10px] text-[#4ade80] font-mono uppercase tracking-[0.3em] glow-border">
          <Cpu className="w-3 h-3" /> System Initialized
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black tracking-tightest mb-6 glow-text uppercase italic leading-none flex flex-col md:flex-row items-center justify-center gap-x-6">
          <span className="text-white">CODE:</span> 
          <span className="text-[#4ade80] font-light">Protocol 10</span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-gray-500 text-sm md:text-lg leading-relaxed tracking-wider font-light italic">
          「世界を支配する者たちが密かに用いる10の方程式」<br />
          <span className="text-gray-400 not-italic font-normal">合理的な意思決定を、冷徹に、そして完璧に実行するための秘密結社ダッシュボード。</span>
        </p>

        <div className="mt-12 flex items-center justify-center gap-6">
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-[#4ade80]/40" />
          <Shield className="w-5 h-5 text-[#4ade80]/40" />
          <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-[#4ade80]/40" />
        </div>
      </div>
    </header>
  );
};

export default Header;
