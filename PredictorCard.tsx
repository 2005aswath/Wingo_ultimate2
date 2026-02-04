import React, { useState } from 'react';
import { PredictionData } from '../types';

interface PredictorCardProps {
  data: PredictionData | null;
  loading: boolean;
}

const PredictorCard: React.FC<PredictorCardProps> = ({ data, loading }) => {
  const [copied, setCopied] = useState(false);

  if (!data) {
    return (
      <div className="bg-slate-900 border border-slate-800 p-12 rounded-[2.5rem] flex flex-col items-center justify-center space-y-6 animate-pulse shadow-2xl">
        <div className="h-4 w-40 bg-slate-800 rounded-full"></div>
        <div className="h-10 w-64 bg-slate-800 rounded-2xl"></div>
        <div className="flex gap-6">
          <div className="h-20 w-20 bg-slate-800 rounded-3xl"></div>
          <div className="h-20 w-20 bg-slate-800 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  const isBig = data.prediction === 'BIG';
  const confidence = data.confidence || 75;
  
  const getColorStyles = (c: string) => {
    switch (c) {
      case 'RED': return 'from-red-500 to-red-600 shadow-red-500/50';
      case 'VIOLET': return 'from-purple-500 to-purple-600 shadow-purple-500/50';
      default: return 'from-emerald-500 to-emerald-600 shadow-emerald-500/50';
    }
  };

  const handleCopy = () => {
    const text = `Wingo 1M Elite Signal\nPeriod: ${data.period}\nPrediction: ${data.prediction}\nNumber: ${data.number}\nConfidence: ${confidence}%`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      {/* Outer Glow */}
      <div className={`absolute -inset-2 rounded-[2.8rem] blur-2xl opacity-20 transition duration-1000 group-hover:opacity-40 ${
        isBig ? 'bg-amber-500' : 'bg-blue-500'
      }`}></div>
      
      <div className="relative bg-slate-900 border border-slate-800 p-8 md:p-10 rounded-[2.5rem] shadow-2xl overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full -mr-32 -mt-32 blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full -ml-32 -mb-32 blur-[100px]"></div>

        <div className="relative z-10 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-800/50 pb-8 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="flex space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/50"></span>
                </div>
                <span className="text-[10px] font-black uppercase text-cyan-500 tracking-[0.3em]">X-Quantum Target</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter font-mono">
                {data.period}
              </h2>
            </div>
            <button 
              onClick={handleCopy}
              className={`group/btn relative flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all duration-500 overflow-hidden ${
                copied ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-cyan-500'
              }`}
            >
               <span className="relative z-10 text-[11px] font-black uppercase tracking-widest">{copied ? 'Signal Copied' : 'Extract Signal'}</span>
               {!copied && <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative bg-slate-800/40 p-8 rounded-[2rem] border border-slate-700/50 flex flex-col items-center group/item hover:bg-slate-800/60 transition-all">
              <span className="text-[9px] font-black text-slate-500 uppercase mb-4 tracking-[0.2em]">Neural Verdict</span>
              <div className={`text-6xl font-black italic tracking-tighter drop-shadow-2xl transition-transform group-hover/item:scale-110 ${
                isBig ? 'text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.3)]' : 'text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.3)]'
              }`}>
                {data.prediction}
              </div>
            </div>

            <div className="bg-slate-800/40 p-8 rounded-[2rem] border border-slate-700/50 flex flex-col items-center hover:bg-slate-800/60 transition-all">
              <span className="text-[9px] font-black text-slate-500 uppercase mb-4 tracking-[0.2em]">Parity Color</span>
              <div className={`w-20 h-20 rounded-[2rem] bg-gradient-to-br shadow-2xl border-4 border-slate-900 transition-transform hover:rotate-12 ${
                getColorStyles(data.color)
              }`}></div>
            </div>

            <div className="bg-slate-800/40 p-8 rounded-[2rem] border border-slate-700/50 flex flex-col items-center hover:bg-slate-800/60 transition-all">
              <span className="text-[9px] font-black text-slate-500 uppercase mb-4 tracking-[0.2em]">Quantum Digit</span>
              <div className="text-6xl font-black text-white font-mono tracking-tighter">
                {data.number}
              </div>
            </div>
          </div>

          {/* Confidence Meter */}
          <div className="pt-4 space-y-4">
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ensemble Confidence</span>
                <div className="text-2xl font-black text-cyan-400">{confidence}%</div>
              </div>
              <div className="text-[10px] font-bold text-emerald-500 uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                High Probability State
              </div>
            </div>
            <div className="h-4 bg-slate-800 rounded-full p-1 overflow-hidden border border-slate-700">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(6,182,212,0.5)] ${
                  confidence > 80 ? 'bg-gradient-to-r from-cyan-400 to-emerald-400' : 'bg-gradient-to-r from-blue-500 to-cyan-400'
                }`}
                style={{ width: `${confidence}%` }}
              ></div>
            </div>
          </div>

          <div className="flex justify-between items-center opacity-20 group-hover:opacity-40 transition-opacity">
            <p className="text-[9px] font-black text-slate-400 tracking-[0.4em] uppercase">V10-GOD-MODE-ACTIVE</p>
            <p className="text-[9px] font-black text-slate-400 tracking-[0.4em] uppercase">AES-256 SYNC</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictorCard;
