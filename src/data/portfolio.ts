import type { Holding, ScheduledTask } from '@/types';

export const holdings: Holding[] = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', qty: 40, avg: 1180.5, ltp: 1307.9, currency: 'INR' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank', qty: 65, avg: 1120.0, ltp: 1284.7, currency: 'INR' },
  { symbol: 'INFY', name: 'Infosys', qty: 30, avg: 1940.0, ltp: 1876.2, currency: 'INR' },
  { symbol: 'TATAMOTORS', name: 'Tata Motors', qty: 120, avg: 720.0, ltp: 782.15, currency: 'INR' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', qty: 15, avg: 164.3, ltp: 198.7, currency: 'USD' },
  { symbol: 'SBIN', name: 'State Bank of India', qty: 90, avg: 790.0, ltp: 842.9, currency: 'INR' },
];

export const scheduledTasks: ScheduledTask[] = [
  { id: 't1', title: 'RELIANCE breakout monitor', condition: 'Price closes above ₹1,320', target: 'RELIANCE', status: 'Active', createdAgo: '2h ago' },
  { id: 't2', title: 'NIFTY RSI exhaustion', condition: 'RSI (1D) crosses below 68', target: 'NIFTY 50', status: 'Active', createdAgo: '5h ago' },
  { id: 't3', title: 'BTC liquidity sweep', condition: 'Price taps $75,000 shelf', target: 'BTC', status: 'Active', createdAgo: '1d ago' },
  { id: 't4', title: 'GOLD key-level alert', condition: 'Daily close below 3,879', target: 'GOLD', status: 'Triggered', createdAgo: '2d ago' },
];
