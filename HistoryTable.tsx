
import React from 'react';
import { HistoryItem } from '../types';

interface HistoryTableProps {
  history: HistoryItem[];
}

const HistoryTable: React.FC<HistoryTableProps> = ({ history }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
      <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
          <h3 className="text-[11px] font-black uppercase text-slate-600 tracking-widest">Global Node History</h3>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-[10px] font-black text-slate-400 uppercase">Verified:</span>
           <span className="text-xs font-bold text-slate-900">{history.length}</span>
        </div>
      </div>
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
            <tr>
              <th className="px-8 py-5">Issue ID</th>
              <th className="px-8 py-5">Signal Type</th>
              <th className="px-8 py-5">Analysis Target</th>
              <th className="px-8 py-5 text-right">Node State</th>
            </tr>
          </thead>
          <tbody>
            {history.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-slate-100 border-t-cyan-500 rounded-full animate-spin"></div>
                    <p className="text-slate-400 text-sm font-medium italic">Synchronizing with global Wingo servers...</p>
                  </div>
                </td>
              </tr>
            ) : (
              history.map((item, idx) => (
                <tr key={`${item.period}-${idx}`} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <span className="font-extrabold text-slate-900 text-base tracking-tighter group-hover:text-cyan-600 transition-colors">{item.period}</span>
                    <p className="text-[10px] text-slate-400 mt-1 font-mono font-bold">{item.timestamp}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest border-2 ${
                      item.prediction === 'BIG' 
                        ? 'bg-amber-50 text-amber-700 border-amber-100' 
                        : 'bg-blue-50 text-blue-700 border-blue-100'
                    }`}>
                      {item.prediction}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-5 h-5 rounded-lg border-2 border-white shadow-lg ${
                        item.color === 'RED' ? 'bg-red-500' : (item.color === 'VIOLET' ? 'bg-purple-600' : 'bg-emerald-500')
                      }`}></div>
                      <span className="font-extrabold text-slate-600 text-sm tracking-tight">Focus #{item.number}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-2xl font-black text-[11px] uppercase tracking-tighter transition-all ${
                      item.actual === 'WIN' 
                        ? 'bg-emerald-500 text-white shadow-[0_5px_15px_rgba(16,185,129,0.3)] scale-105' 
                        : 'bg-slate-100 text-slate-400 border border-slate-200 opacity-60'
                    }`}>
                      {item.actual === 'WIN' && (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      {item.actual}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryTable;
