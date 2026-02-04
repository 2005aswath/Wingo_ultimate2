
import React, { useState, useEffect } from 'react';

interface TimerProps {
  onMinuteEnd: () => void;
}

const Timer: React.FC<TimerProps> = ({ onMinuteEnd }) => {
  const [timeLeft, setTimeLeft] = useState(60 - new Date().getSeconds());

  useEffect(() => {
    const timer = setInterval(() => {
      const seconds = new Date().getSeconds();
      const remaining = 60 - seconds;
      
      setTimeLeft(remaining);
      
      if (remaining === 60 || remaining === 0) {
        onMinuteEnd();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [onMinuteEnd]);

  const percentage = (timeLeft / 60) * 100;

  return (
    <div className="bg-white border border-slate-200 p-6 rounded-[2rem] flex flex-col items-center justify-center min-w-[160px] shadow-sm">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r="42"
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            className="text-slate-100"
          />
          <circle
            cx="48"
            cy="48"
            r="42"
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            strokeDasharray={264}
            strokeDashoffset={264 - (264 * percentage) / 100}
            className="text-cyan-500 transition-all duration-1000 ease-linear drop-shadow-[0_0_8px_rgba(6,182,212,0.3)]"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-slate-900 tracking-tighter">{timeLeft}</span>
          <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest -mt-1">Sec</span>
        </div>
      </div>
      <p className="mt-4 text-[9px] text-slate-400 uppercase font-black tracking-widest">Node Sync</p>
    </div>
  );
};

export default Timer;
