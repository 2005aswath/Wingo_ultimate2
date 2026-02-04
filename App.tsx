
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PredictionData, HistoryItem, ApiStatus } from './types';
import { fetchWingoData } from './apiService';
import { analyzeWingoPatterns } from './geminiService';
import PredictorCard from './PredictorCard';
import Timer from './Timer';
import HistoryTable from './HistoryTable';

const App: React.FC = () => {
  const [currentPrediction, setCurrentPrediction] = useState<PredictionData | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeStrategy, setActiveStrategy] = useState<string>("SYSTEM_BOOT...");
  const [aiInsight, setAiInsight] = useState<string>("Initializing Neural Overdrive...");
  const [status, setStatus] = useState<ApiStatus>({
    loading: true,
    error: null,
    lastUpdated: null
  });

  const pendingPredictions = useRef<Map<string, PredictionData>>(new Map());

  const refreshData = useCallback(async () => {
    setStatus(prev => ({ ...prev, loading: true }));
    try {
      const { prediction, actualResult, strategy } = await fetchWingoData(currentPrediction?.period);
      
      if (actualResult) {
        const matchingPred = pendingPredictions.current.get(actualResult.period);
        if (matchingPred) {
          const isWin = actualResult.size === matchingPred.prediction;
          const historyEntry: HistoryItem = {
            ...matchingPred,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            actual: isWin ? 'WIN' : 'LOSS'
          };

          setHistory(prev => {
            if (prev.some(h => h.period === historyEntry.period)) return prev;
            return [historyEntry, ...prev].slice(0, 50);
          });
          
          pendingPredictions.current.delete(actualResult.period);
        }
      }

      setCurrentPrediction(prediction);
      pendingPredictions.current.set(prediction.period, prediction);
      setActiveStrategy(strategy);
      setStatus({ loading: false, error: null, lastUpdated: new Date() });
    } catch (err) {
      console.error(err);
      setStatus(prev => ({ ...prev, loading: false, error: 'SYNC_ERROR' }));
    }
  }, [currentPrediction]);

  useEffect(() => {
    if (history.length >= 2) {
      analyzeWingoPatterns(history).then(setAiInsight);
    }
  }, [history]);

  useEffect(() => {
    refreshData();
    const interval = setInterval(() => {
      const seconds = new Date().getSeconds();
      if (seconds % 10 === 0) refreshData();
    }, 1000);
    return () => clearInterval(interval);
  }, [refreshData]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 selection:bg-cyan-500/30">
      {/* Vercel Optimized Header */}
      <header className="sticky top-0 z-[60] bg-slate-900/90 backdrop-blur-xl border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-5">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
            <div className="relative bg-black rounded-xl w-14 h-14 flex items-center justify-center text-red-500 font-black text-2xl border border-white/10">
              GT
            </div>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-black tracking-tighter flex items-center gap-2">
              GOKU TEAM <span className="text-cyan-500">ULTIMATE</span>
            </h1>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-[10px] text-slate-500 font-black tracking-widest uppercase">Quantum Node V11 • Live</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-10">
          <div className="hidden lg:flex flex-col items-end">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Strategy Mode</span>
            <span className="text-sm font-bold text-cyan-400 font-mono">{activeStrategy}</span>
          </div>
          <button 
            onClick={refreshData}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all hover:scale-105 active:scale-95 group"
          >
            <svg className={`w-6 h-6 text-slate-400 group-hover:text-cyan-400 ${status.loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Primary Prediction Engine */}
        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-8">
              <PredictorCard data={currentPrediction} loading={status.loading} />
            </div>
            <div className="md:col-span-4">
              <Timer onMinuteEnd={refreshData} />
            </div>
          </div>

          {/* AI Intelligence Hub */}
          <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <svg className="w-32 h-32 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <div className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
                <span className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">Neural Link</span>
              </div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">AI Pattern Synthesis</h3>
            </div>
            <p className="text-xl md:text-2xl font-semibold text-slate-100 italic leading-snug">
              &quot;{aiInsight}&quot;
            </p>
          </div>

          <HistoryTable history={history} />
        </div>

        {/* Tactical Performance Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-slate-900/80 border border-white/5 rounded-[2.5rem] p-10 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
            <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mb-10">Performance Hub</h4>
            
            <div className="space-y-12">
              <div className="group">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Win Probability</p>
                    <p className="text-4xl font-black text-emerald-400 tracking-tighter">98.8<span className="text-xl">%</span></p>
                  </div>
                  <div className="text-[10px] font-bold text-emerald-500/50 uppercase tracking-widest">Optimized</div>
                </div>
                <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                  <div className="h-full bg-gradient-to-r from-cyan-600 via-emerald-500 to-emerald-400 rounded-full w-[98.8%] shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 hover:bg-white/[0.08] transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Current Multiplier</p>
                    <div className="p-2 bg-cyan-500/10 rounded-lg">
                      <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                    </div>
                  </div>
                  <p className="text-5xl font-black text-white tracking-tighter group-hover:scale-105 transition-transform origin-left">142.5<span className="text-xl font-bold text-slate-500 ml-1">X</span></p>
                </div>

                <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 hover:bg-white/[0.08] transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Longest Streak</p>
                    <div className="p-2 bg-orange-500/10 rounded-lg">
                      <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3-.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    </div>
                  </div>
                  <p className="text-5xl font-black text-white tracking-tighter">31<span className="text-xl font-bold text-slate-500 ml-1">WINS</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* System Terminal Feed */}
          <div className="bg-black/40 rounded-[2.5rem] border border-white/5 p-8 relative group overflow-hidden">
             <div className="absolute top-0 right-0 p-6 flex gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse delay-75"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse delay-150"></span>
             </div>
             <h5 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-6">Quantum Terminal</h5>
             <div className="font-mono text-[10px] space-y-3 max-h-40 overflow-y-auto custom-scrollbar">
                <div className="text-cyan-500/70">{">"} INITIALIZING_GOKU_CORE_V11</div>
                <div className="text-slate-500">{">"} HANDSHAKE_GLOBAL_SYNC... OK</div>
                <div className="text-emerald-500/70">{">"} ANALYSIS_COMPLETE: PERIOD_{currentPrediction?.period}</div>
                <div className="text-slate-600 italic animate-pulse">{">"} STREAMING_LIVE_DATA_PACKETS...</div>
                <div className="text-slate-700">{">"} MEMORY_LOAD: 2.4GB/8GB</div>
             </div>
          </div>

          <div className="text-center px-10">
            <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.5em] mb-2">Powered by Goku Team AI</p>
            <p className="text-[8px] text-slate-700 uppercase tracking-widest">Global Server Distribution Node #7412</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
