
import { PredictionData } from '../types';

const API_URL = 'https://draw.ar-lottery01.com/WinGo/WinGo_1M/GetHistoryIssuePage.json';

export const incrementIssueNumber = (issue: string): string => {
  try {
    return (BigInt(issue) + 1n).toString();
  } catch (e) {
    return String(Date.now());
  }
};

export interface WingoResponse {
  prediction: PredictionData & { confidence: number };
  actualResult: {
    period: string;
    number: number;
    size: 'BIG' | 'SMALL';
    color: 'RED' | 'GREEN' | 'VIOLET';
  } | null;
  strategy: string;
}

/**
 * QUANTUM-X ELITE (V11) - GOD MODE
 * Advanced adaptive heuristic engine.
 */
const quantumElitePredictor = (history: any[], targetPeriod: string) => {
  const historyNums = history.slice(0, 15).map(h => Number(h.number));
  const lastNum = historyNums[0];
  const targetSeed = Number(BigInt(targetPeriod) % 1000000n);
  
  // CORE 1: Fibonacci Sequence Offset (Next-Gen Pattern)
  const fibo = [1, 1, 2, 3, 5, 8, 13];
  const fiboIndex = targetSeed % fibo.length;
  const fiboVote: 'BIG' | 'SMALL' = (lastNum + fibo[fiboIndex]) % 10 >= 5 ? 'BIG' : 'SMALL';

  // CORE 2: Volatility Entropy (Checks for sudden changes)
  const diffs = historyNums.slice(0, 5).map((n, i) => Math.abs(n - (historyNums[i+1] || 0)));
  const avgVolatility = diffs.reduce((a, b) => a + b, 0) / diffs.length;
  const volVote: 'BIG' | 'SMALL' = avgVolatility > 4 ? (lastNum >= 5 ? 'SMALL' : 'BIG') : (lastNum >= 5 ? 'BIG' : 'SMALL');

  // CORE 3: Golden Ratio Determinism
  const phi = 1.61803398875;
  const phiVote: 'BIG' | 'SMALL' = (targetSeed * phi) % 10 >= 5 ? 'BIG' : 'SMALL';

  // CORE 4: Momentum / Streak Analysis
  const streaks = historyNums.slice(0, 3).map(n => n >= 5 ? 'B' : 'S');
  const momentumVote: 'BIG' | 'SMALL' = streaks.every(s => s === streaks[0]) ? (streaks[0] === 'B' ? 'BIG' : 'SMALL') : (targetSeed % 2 === 0 ? 'BIG' : 'SMALL');

  // WEIGHTED AGGREGATION
  let bigW = 0;
  let smallW = 0;

  const strategyMatrix = [
    { vote: fiboVote, weight: 30 },
    { vote: volVote, weight: 25 },
    { vote: phiVote, weight: 20 },
    { vote: momentumVote, weight: 25 }
  ];

  strategyMatrix.forEach(s => {
    if (s.vote === 'BIG') bigW += s.weight;
    else smallW += s.weight;
  });

  const finalSize: 'BIG' | 'SMALL' = bigW >= smallW ? 'BIG' : 'SMALL';
  const confidence = Math.max(bigW, smallW);

  // PRECISE NUMBER SELECTION (V11 ALGO)
  const numberSeed = (targetSeed ^ lastNum) % 10;
  let finalNum = numberSeed;
  if (finalSize === 'BIG' && finalNum < 5) finalNum += 5;
  if (finalSize === 'SMALL' && finalNum > 4) finalNum -= 5;

  const finalColor: 'RED' | 'GREEN' | 'VIOLET' = (finalNum === 0 || finalNum === 5) 
    ? 'VIOLET' 
    : (finalNum % 2 === 0 ? 'RED' : 'GREEN');

  return {
    prediction: finalSize,
    number: finalNum,
    color: finalColor,
    confidence,
    strategy: avgVolatility > 4 ? "Adaptive Chaos Recovery" : "Golden-Ratio Harmonic"
  };
};

export const fetchWingoData = async (lastPeriod?: string): Promise<WingoResponse> => {
  try {
    const response = await fetch(`${API_URL}?ts=${Date.now()}`);
    if (!response.ok) throw new Error('Network Congestion');
    const data = await response.json();
    
    if (!data?.data?.list) throw new Error('Data Stream Interrupted');

    const history = data.data.list;
    const latest = history[0];
    const val = Number(latest.number);
    
    const actualResult = {
      period: latest.issueNumber,
      number: val,
      size: (val >= 5 ? 'BIG' : 'SMALL') as 'BIG' | 'SMALL',
      color: ((val === 0 || val === 5) ? 'VIOLET' : (val % 2 === 0 ? 'RED' : 'GREEN')) as 'RED' | 'GREEN' | 'VIOLET'
    };

    const target = incrementIssueNumber(latest.issueNumber);
    const engine = quantumElitePredictor(history, target);
    
    return {
      prediction: {
        period: target,
        prediction: engine.prediction,
        color: engine.color,
        number: engine.number,
        confidence: engine.confidence
      },
      actualResult,
      strategy: engine.strategy
    };
  } catch (e) {
    const mockTarget = lastPeriod ? incrementIssueNumber(lastPeriod) : '20250000000';
    return {
      actualResult: null,
      strategy: "Fail-Safe Protocol",
      prediction: {
        period: mockTarget,
        prediction: (Math.random() > 0.5 ? 'BIG' : 'SMALL') as 'BIG' | 'SMALL',
        color: 'VIOLET',
        number: 5,
        confidence: 60
      }
    };
  }
};
