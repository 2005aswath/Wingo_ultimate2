export interface PredictionData {
  period: string;
  prediction: 'BIG' | 'SMALL';
  color: 'RED' | 'GREEN' | 'VIOLET';
  number: number;
  confidence?: number;
}

export interface HistoryItem extends PredictionData {
  timestamp: string;
  actual?: 'WIN' | 'LOSS';
}

export interface ApiStatus {
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}