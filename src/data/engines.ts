import type { QuantEngine } from '@/types';

/** Autonomous quantitative engine cards shown on the Ask BROW screen. */
export const quantEngines: QuantEngine[] = [
  { id: 'mtf', tag: 'MULTI-TF ENGINE', title: 'Multi-Timeframe Confluence', subtitle: '15m · 1h · 1D EMA, RSI, MACD, Bollinger & fractal swing levels', icon: 'activity' },
  { id: 'oi', tag: 'OPTIONS CHAIN', title: 'Options Surface & OI Walls', subtitle: 'Live PCR, Max Pain, ATM straddle expected move, IV Rank & Greeks', icon: 'layers' },
  { id: 'bt', tag: 'BACKTEST ENGINE', title: 'Quantitative Strategy Backtest', subtitle: 'Simulate historical win-rate, drawdown & expectancy on live candles', icon: 'bar-chart-3' },
  { id: 'corr', tag: 'CORRELATION MATRIX', title: 'Cross-Asset Correlation', subtitle: 'Rolling Pearson correlation across Equities, Gold, Crypto & FX', icon: 'git-compare' },
  { id: 'scan', tag: 'LIVE SCREENER', title: 'Institutional Market Scan', subtitle: 'Screen NSE Equity, F&O, Crypto & Global Futures by momentum & volume', icon: 'globe' },
  { id: 'macro', tag: 'MACRO & FLOWS', title: 'FII / DII & Macro Intelligence', subtitle: 'Participant OI, India VIX regime, bond yields & AMFI mutual funds', icon: 'landmark' },
];

export const suggestedPrompts = [
  'Is NIFTY overbought right now?',
  'Compare RELIANCE vs ICICIBANK',
  'What is moving crypto today?',
  'Should I watch GOLD into NFP?',
];
