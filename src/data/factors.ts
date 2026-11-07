import type { FactorStock } from '@/types';

export const factorWeights = [
  { label: 'Momentum', weight: 25, icon: 'rocket' },
  { label: 'Quality', weight: 20, icon: 'gem' },
  { label: 'Value', weight: 15, icon: 'coins' },
  { label: 'Volatility', weight: 15, icon: 'zap' },
  { label: 'Liquidity', weight: 15, icon: 'waves' },
  { label: 'Sentiment', weight: 10, icon: 'brain' },
] as const;

export const factorStocks: FactorStock[] = [
  { rank: 1, symbol: 'RELIANCE', name: 'Reliance Industries', sector: 'Energy', composite: 92.4, momentum: 88, quality: 94, value: 71, volatility: 82, liquidity: 96, sentiment: 90 },
  { rank: 2, symbol: 'ICICIBANK', name: 'ICICI Bank', sector: 'Banking', composite: 90.1, momentum: 84, quality: 92, value: 78, volatility: 86, liquidity: 94, sentiment: 81 },
  { rank: 3, symbol: 'MCX', name: 'Multi Commodity Exchange', sector: 'Financials', composite: 88.7, momentum: 93, quality: 85, value: 58, volatility: 74, liquidity: 70, sentiment: 83 },
  { rank: 4, symbol: 'INFY', name: 'Infosys', sector: 'IT', composite: 86.3, momentum: 79, quality: 90, value: 66, volatility: 84, liquidity: 88, sentiment: 74 },
  { rank: 5, symbol: 'SBIN', name: 'State Bank of India', sector: 'Banking', composite: 84.9, momentum: 76, quality: 81, value: 92, volatility: 72, liquidity: 90, sentiment: 72 },
  { rank: 6, symbol: 'BRITANNIA', name: 'Britannia Industries', sector: 'FMCG', composite: 83.1, momentum: 82, quality: 88, value: 48, volatility: 88, liquidity: 64, sentiment: 77 },
  { rank: 7, symbol: 'MARICO', name: 'Marico', sector: 'FMCG', composite: 81.7, momentum: 90, quality: 83, value: 44, volatility: 80, liquidity: 68, sentiment: 86 },
  { rank: 8, symbol: 'ADANIENT', name: 'Adani Enterprises', sector: 'Infrastructure', composite: 78.4, momentum: 72, quality: 66, value: 40, volatility: 58, liquidity: 76, sentiment: 69 },
  { rank: 9, symbol: 'HDFCBANK', name: 'HDFC Bank', sector: 'Banking', composite: 77.2, momentum: 61, quality: 89, value: 80, volatility: 78, liquidity: 92, sentiment: 58 },
  { rank: 10, symbol: 'TCS', name: 'Tata Consultancy Services', sector: 'IT', composite: 74.6, momentum: 52, quality: 91, value: 63, volatility: 82, liquidity: 85, sentiment: 52 },
  { rank: 11, symbol: 'NATIONALUM', name: 'National Aluminium', sector: 'Metals', composite: 68.9, momentum: 48, quality: 62, value: 88, volatility: 54, liquidity: 72, sentiment: 53 },
  { rank: 12, symbol: 'TATAMOTORS', name: 'Tata Motors', sector: 'Auto', composite: 64.1, momentum: 38, quality: 70, value: 84, volatility: 46, liquidity: 80, sentiment: 44 },
];
