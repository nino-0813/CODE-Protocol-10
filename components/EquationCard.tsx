
import React from 'react';
import { Equation } from '../types';
import { ChevronRight } from 'lucide-react';

interface EquationCardProps {
  equation: Equation;
  onClick: () => void;
}

const EquationCard: React.FC<EquationCardProps> = ({ equation, onClick }) => {
  return (
    <div 
      onClick={equation.isAvailable ? onClick : undefined}
      className={`
        relative overflow-hidden group border border-white/5 rounded-2xl p-7 transition-all duration-500
        ${equation.isAvailable ? 'cursor-pointer card-hover bg-[#0a0a0a]/50 backdrop-blur-sm' : 'cursor-not-allowed bg-[#070707] opacity-40'}
      `}
    >
      {/* Scanning effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#4ade80]/0 via-[#4ade80]/5 to-[#4ade80]/0 -translate-y-full group-hover:translate-y-full transition-transform duration-[1.5s] pointer-events-none" />

      {/* Background Number */}
      <div className="absolute top-[-20px] right-[-10px] text-9xl font-bold text-white/[0.02] pointer-events-none group-hover:text-green-400/[0.05] transition-colors font-mono">
        {equation.number}
      </div>

      <div className="flex justify-between items-start mb-6">
        <div className={`
          p-3 rounded-xl border transition-all duration-300
          ${equation.isAvailable 
            ? 'text-[#4ade80] border-[#4ade80]/20 bg-[#4ade80]/5 group-hover:bg-[#4ade80]/10' 
            : 'text-gray-700 border-white/5'}
        `}>
          {React.cloneElement(equation.icon as React.ReactElement, { size: 28 })}
        </div>
        {equation.isAvailable ? (
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-[#4ade80]/50 font-mono tracking-widest uppercase">Available</span>
            <div className="h-[2px] w-8 bg-[#4ade80] mt-1 shadow-[0_0_5px_#4ade80]" />
          </div>
        ) : (
          <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-gray-700">Locked</span>
        )}
      </div>

      <div className="relative z-10">
        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[#4ade80] transition-colors tracking-tight">
          {equation.title}
        </h3>
        <p className="text-[11px] text-[#4ade80]/60 font-bold uppercase tracking-widest mb-4">
          {equation.subtitle}
        </p>
        
        <div className="bg-black border border-white/5 p-4 rounded-xl mb-5 group-hover:border-[#4ade80]/30 transition-colors">
          <code className="text-xs font-mono text-gray-400 group-hover:text-gray-200 transition-colors block overflow-x-auto whitespace-nowrap py-1">
            {equation.formula}
          </code>
        </div>

        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 group-hover:text-gray-400 transition-colors">
          {equation.description}
        </p>

        <div className="mt-6 flex items-center text-[10px] font-bold text-[#4ade80] opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
          EXECUTE PROTOCOL <ChevronRight className="w-3 h-3 ml-1" />
        </div>
      </div>
    </div>
  );
};

export default EquationCard;
