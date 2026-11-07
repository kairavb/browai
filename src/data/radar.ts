import type { RadarRow } from '@/types';

export const radarRows: RadarRow[] = [
  { id: 'r1', symbol: 'MCX', name: 'Multi Commodity Exchange', segment: 'India Equity', signal: 'Breakout', score: 94, changePercent: 7.42, volumeX: 4.8, note: 'Range breakout on 4.8× volume — institutional footprints detected.' },
  { id: 'r2', symbol: 'MARICO', name: 'Marico', segment: 'India Equity', signal: 'Volume Spike', score: 88, changePercent: 10.0, volumeX: 6.2, note: 'Upper-circuit momentum with sustained buying pressure.' },
  { id: 'r3', symbol: 'ICICIBANK', name: 'ICICI Bank', segment: 'India Equity', signal: 'Accumulation', score: 82, changePercent: 1.44, volumeX: 2.1, note: 'Quiet accumulation beneath resistance — OBV rising.' },
  { id: 'r4', symbol: 'NVDA', name: 'NVIDIA Corp.', segment: 'Global', signal: 'Breakout', score: 85, changePercent: 2.31, volumeX: 3.3, note: 'Reclaim of the 20 EMA with expanding range on the hourly.' },
  { id: 'r5', symbol: 'SOL', name: 'Solana', segment: 'Crypto', signal: 'Accumulation', score: 79, changePercent: 4.62, volumeX: 2.7, note: 'Relative strength vs BTC with rising spot demand.' },
  { id: 'r6', symbol: 'TATAMOTORS', name: 'Tata Motors', segment: 'India Equity', signal: 'Breakdown', score: 74, changePercent: -1.88, volumeX: 2.4, note: 'Support loss with distribution signature on rising volume.' },
  { id: 'r7', symbol: 'BIOCON', name: 'Biocon', segment: 'India Equity', signal: 'Distribution', score: 71, changePercent: -3.3, volumeX: 2.9, note: 'Smart-money distribution — lower highs into supply.' },
  { id: 'r8', symbol: 'BTC', name: 'Bitcoin', segment: 'Crypto', signal: 'Distribution', score: 68, changePercent: 1.14, volumeX: 1.8, note: 'Oversold RSI but spot outflows persist — bounce faded.' },
];
