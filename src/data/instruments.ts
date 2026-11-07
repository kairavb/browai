import type { AiVerdict, Instrument, Market, Segment, TechSignal } from '@/types';
import { makeSpark } from '@/utils/series';

interface Def {
  symbol: string;
  name: string;
  market: Market;
  segment: Segment;
  currency: 'INR' | 'USD';
  price: number;
  changePercent: number;
  rsi: number;
  aiVerdict: AiVerdict;
  aiScore: number;
  sector?: string;
  volume: number;
  marketCap?: number;
  pe?: number;
  seed: number;
}

const round = (n: number, d = 2) => Number(n.toFixed(d));

function signalsFor(d: Def): TechSignal[] {
  const bull = d.aiVerdict === 'BULLISH';
  const bear = d.aiVerdict === 'BEARISH';
  return [
    {
      label: 'Trend (1D)',
      value: bull ? 'Up' : bear ? 'Down' : 'Sideways',
      tone: bull ? 'positive' : bear ? 'negative' : 'neutral',
    },
    {
      label: 'RSI (14)',
      value:
        d.rsi >= 70 ? `${d.rsi} · Overbought` : d.rsi <= 30 ? `${d.rsi} · Oversold` : `${d.rsi} · Neutral`,
      tone: d.rsi >= 70 ? 'negative' : d.rsi <= 30 ? 'positive' : 'neutral',
    },
    {
      label: 'MACD',
      value: bull ? 'Bullish cross' : bear ? 'Bearish cross' : 'Flat',
      tone: bull ? 'positive' : bear ? 'negative' : 'neutral',
    },
    {
      label: 'Volume',
      value: d.volume > 0 ? 'Above avg' : 'Below avg',
      tone: bull ? 'positive' : 'neutral',
    },
    {
      label: 'EMA 20/50',
      value: bull ? 'Price > both' : bear ? 'Price < both' : 'Price ≈ EMAs',
      tone: bull ? 'positive' : bear ? 'negative' : 'neutral',
    },
  ];
}

function thesisFor(d: Def): string {
  if (d.aiVerdict === 'BULLISH') {
    return `BROW reads ${d.symbol} as constructive. Price holds above its 20 & 50 EMA with momentum confirmation on the 1H and 1D timeframes. RSI at ${d.rsi} leaves room before exhaustion. Watch the ${round(d.price * 1.035)} resistance — a decisive close above opens continuation toward swing highs. Invalidation on a break below ${round(d.price * 0.97)}.`;
  }
  if (d.aiVerdict === 'BEARISH') {
    return `BROW flags ${d.symbol} as distribution-prone. Lower highs on the 1D with price capped under the 20 EMA. RSI ${d.rsi} and a bearish MACD posture argue for caution. ${d.rsi >= 70 ? 'Overbought exhaustion raises mean-reversion risk. ' : ''}Key support sits at ${round(d.price * 0.97)}; losing it accelerates toward ${round(d.price * 0.93)}. Reclaiming ${round(d.price * 1.03)} would neutralise the setup.`;
  }
  return `BROW sees ${d.symbol} range-bound. Price oscillates around its EMAs with no decisive momentum. RSI ${d.rsi} is balanced. Trade the range between ${round(d.price * 0.97)} support and ${round(d.price * 1.035)} resistance until a breakout confirms direction.`;
}

function build(d: Def): Instrument {
  const change = round((d.price * d.changePercent) / 100);
  const dayLow = round(d.price * (1 - Math.abs(d.changePercent) / 100 - 0.004));
  const dayHigh = round(d.price * (1 + Math.abs(d.changePercent) / 100 + 0.003));
  const bias = d.aiVerdict === 'BULLISH' ? 0.72 : d.aiVerdict === 'BEARISH' ? 0.28 : 0.5;
  return {
    ...d,
    change,
    dayLow,
    dayHigh,
    yearLow: round(d.price * 0.72),
    yearHigh: round(d.price * 1.34),
    spark: makeSpark(d.seed, 36, bias),
    support: round(d.price * 0.97),
    resistance: round(d.price * 1.035),
    ema20: round(d.price * (d.aiVerdict === 'BULLISH' ? 0.985 : 1.012)),
    ema50: round(d.price * (d.aiVerdict === 'BULLISH' ? 0.96 : 1.03)),
    macd: d.aiVerdict === 'BULLISH' ? 'Bullish' : d.aiVerdict === 'BEARISH' ? 'Bearish' : 'Neutral',
    thesis: thesisFor(d),
    signals: signalsFor(d),
  };
}

const defs: Def[] = [
  // --- Indices / F&O ---
  { symbol: 'NIFTY 50', name: 'NIFTY 50 Index', market: 'India', segment: 'India F&O', currency: 'INR', price: 23810.85, changePercent: 1.58, rsi: 72, aiVerdict: 'BEARISH', aiScore: 70, sector: 'Index', volume: 1, seed: 11 },
  { symbol: 'BANKNIFTY', name: 'Nifty Bank Index', market: 'India', segment: 'India F&O', currency: 'INR', price: 51240.3, changePercent: 0.86, rsi: 61, aiVerdict: 'NEUTRAL', aiScore: 55, sector: 'Index', volume: 1, seed: 12 },
  // --- India Equity ---
  { symbol: 'RELIANCE', name: 'Reliance Industries', market: 'India', segment: 'India Equity', currency: 'INR', price: 1307.9, changePercent: 0.61, rsi: 73, aiVerdict: 'BULLISH', aiScore: 90, sector: 'Energy', volume: 8_900_000, marketCap: 8_850_000_000_000, pe: 24.1, seed: 21 },
  { symbol: 'TCS', name: 'Tata Consultancy Services', market: 'India', segment: 'India Equity', currency: 'INR', price: 4120.5, changePercent: -0.42, rsi: 44, aiVerdict: 'NEUTRAL', aiScore: 52, sector: 'IT', volume: 2_100_000, marketCap: 14_900_000_000_000, pe: 28.4, seed: 22 },
  { symbol: 'INFY', name: 'Infosys', market: 'India', segment: 'India Equity', currency: 'INR', price: 1876.2, changePercent: 1.12, rsi: 58, aiVerdict: 'BULLISH', aiScore: 74, sector: 'IT', volume: 4_300_000, marketCap: 7_780_000_000_000, pe: 26.9, seed: 23 },
  { symbol: 'HDFCBANK', name: 'HDFC Bank', market: 'India', segment: 'India Equity', currency: 'INR', price: 1702.35, changePercent: 0.34, rsi: 55, aiVerdict: 'NEUTRAL', aiScore: 58, sector: 'Banking', volume: 9_600_000, marketCap: 12_950_000_000_000, pe: 19.2, seed: 24 },
  { symbol: 'ICICIBANK', name: 'ICICI Bank', market: 'India', segment: 'India Equity', currency: 'INR', price: 1284.7, changePercent: 1.44, rsi: 64, aiVerdict: 'BULLISH', aiScore: 81, sector: 'Banking', volume: 11_200_000, marketCap: 9_040_000_000_000, pe: 18.6, seed: 25 },
  { symbol: 'TATAMOTORS', name: 'Tata Motors', market: 'India', segment: 'India Equity', currency: 'INR', price: 782.15, changePercent: -1.88, rsi: 38, aiVerdict: 'BEARISH', aiScore: 68, sector: 'Auto', volume: 14_800_000, marketCap: 2_880_000_000_000, pe: 11.3, seed: 26 },
  { symbol: 'MARICO', name: 'Marico', market: 'India', segment: 'India Equity', currency: 'INR', price: 878.4, changePercent: 10.0, rsi: 79, aiVerdict: 'BULLISH', aiScore: 86, sector: 'FMCG', volume: 6_700_000, marketCap: 1_135_000_000_000, pe: 54.2, seed: 27 },
  { symbol: 'BRITANNIA', name: 'Britannia Industries', market: 'India', segment: 'India Equity', currency: 'INR', price: 4930.0, changePercent: 6.36, rsi: 71, aiVerdict: 'BULLISH', aiScore: 77, sector: 'FMCG', volume: 1_900_000, marketCap: 1_188_000_000_000, pe: 59.1, seed: 28 },
  { symbol: 'BIOCON', name: 'Biocon', market: 'India', segment: 'India Equity', currency: 'INR', price: 343.0, changePercent: -3.3, rsi: 34, aiVerdict: 'BEARISH', aiScore: 64, sector: 'Pharma', volume: 7_200_000, marketCap: 411_000_000_000, pe: 42.8, seed: 29 },
  { symbol: 'NLCINDIA', name: 'NLC India', market: 'India', segment: 'India Equity', currency: 'INR', price: 230.31, changePercent: -3.43, rsi: 41, aiVerdict: 'BEARISH', aiScore: 60, sector: 'Power', volume: 5_400_000, marketCap: 319_000_000_000, pe: 13.7, seed: 30 },
  { symbol: 'NATIONALUM', name: 'National Aluminium', market: 'India', segment: 'India Equity', currency: 'INR', price: 317.55, changePercent: -3.19, rsi: 46, aiVerdict: 'NEUTRAL', aiScore: 53, sector: 'Metals', volume: 10_100_000, marketCap: 583_000_000_000, pe: 9.4, seed: 31 },
  { symbol: 'SBIN', name: 'State Bank of India', market: 'India', segment: 'India Equity', currency: 'INR', price: 842.9, changePercent: 0.92, rsi: 59, aiVerdict: 'BULLISH', aiScore: 72, sector: 'Banking', volume: 12_600_000, marketCap: 7_520_000_000_000, pe: 10.1, seed: 32 },
  { symbol: 'ADANIENT', name: 'Adani Enterprises', market: 'India', segment: 'India Equity', currency: 'INR', price: 2456.3, changePercent: 2.74, rsi: 66, aiVerdict: 'BULLISH', aiScore: 69, sector: 'Infrastructure', volume: 3_800_000, marketCap: 2_830_000_000_000, pe: 71.5, seed: 33 },
  { symbol: 'TATASTEEL', name: 'Tata Steel', market: 'India', segment: 'India Equity', currency: 'INR', price: 152.8, changePercent: -0.78, rsi: 48, aiVerdict: 'NEUTRAL', aiScore: 50, sector: 'Metals', volume: 22_400_000, marketCap: 1_910_000_000_000, pe: 55.3, seed: 34 },
  { symbol: 'MCX', name: 'Multi Commodity Exchange', market: 'India', segment: 'India Equity', currency: 'INR', price: 3490.1, changePercent: 7.42, rsi: 75, aiVerdict: 'BULLISH', aiScore: 83, sector: 'Financials', volume: 980_000, marketCap: 178_000_000_000, pe: 48.9, seed: 35 },
  // --- USA ---
  { symbol: 'SPY', name: 'SPDR S&P 500 ETF', market: 'USA', segment: 'Global', currency: 'USD', price: 753.8, changePercent: 0.23, rsi: 56, aiVerdict: 'BEARISH', aiScore: 70, sector: 'ETF', volume: 68_000_000, seed: 41 },
  { symbol: 'AAPL', name: 'Apple Inc.', market: 'USA', segment: 'Global', currency: 'USD', price: 268.4, changePercent: -0.64, rsi: 52, aiVerdict: 'NEUTRAL', aiScore: 54, sector: 'Technology', volume: 54_000_000, marketCap: 4_050_000_000_000, pe: 34.2, seed: 42 },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', market: 'USA', segment: 'Global', currency: 'USD', price: 198.7, changePercent: 2.31, rsi: 68, aiVerdict: 'BULLISH', aiScore: 88, sector: 'Semiconductors', volume: 210_000_000, marketCap: 4_840_000_000_000, pe: 58.7, seed: 43 },
  { symbol: 'TSLA', name: 'Tesla Inc.', market: 'USA', segment: 'Global', currency: 'USD', price: 412.3, changePercent: -1.42, rsi: 43, aiVerdict: 'BEARISH', aiScore: 66, sector: 'Auto', volume: 98_000_000, marketCap: 1_320_000_000_000, pe: 112.4, seed: 44 },
  { symbol: 'AMD', name: 'Advanced Micro Devices', market: 'USA', segment: 'Global', currency: 'USD', price: 242.1, changePercent: 3.05, rsi: 65, aiVerdict: 'BULLISH', aiScore: 79, sector: 'Semiconductors', volume: 72_000_000, marketCap: 392_000_000_000, pe: 46.1, seed: 45 },
  { symbol: 'DOWJONES', name: 'Dow Jones Industrial Avg', market: 'USA', segment: 'Global', currency: 'USD', price: 51745.04, changePercent: -0.46, rsi: 49, aiVerdict: 'BEARISH', aiScore: 58, sector: 'Index', volume: 1, seed: 46 },
  // --- Crypto ---
  { symbol: 'BTC', name: 'Bitcoin', market: 'Crypto', segment: 'Crypto', currency: 'USD', price: 77670.0, changePercent: 1.14, rsi: 30, aiVerdict: 'BEARISH', aiScore: 70, sector: 'Crypto', volume: 42_000_000_000, seed: 51 },
  { symbol: 'ETH', name: 'Ethereum', market: 'Crypto', segment: 'Crypto', currency: 'USD', price: 2920.5, changePercent: 2.18, rsi: 47, aiVerdict: 'NEUTRAL', aiScore: 56, sector: 'Crypto', volume: 18_000_000_000, seed: 52 },
  { symbol: 'SOL', name: 'Solana', market: 'Crypto', segment: 'Crypto', currency: 'USD', price: 168.2, changePercent: 4.62, rsi: 63, aiVerdict: 'BULLISH', aiScore: 76, sector: 'Crypto', volume: 4_300_000_000, seed: 53 },
  // --- Commodities ---
  { symbol: 'GOLD', name: 'Gold Futures (XAU/USD)', market: 'Commodities', segment: 'Global', currency: 'USD', price: 3930.2, changePercent: -0.99, rsi: 55, aiVerdict: 'BEARISH', aiScore: 70, sector: 'Metals', volume: 210_000, seed: 61 },
  { symbol: 'SILVER', name: 'Silver Futures', market: 'Commodities', segment: 'Global', currency: 'USD', price: 46.82, changePercent: 0.74, rsi: 58, aiVerdict: 'BULLISH', aiScore: 71, sector: 'Metals', volume: 142_000, seed: 62 },
  { symbol: 'CRUDE', name: 'Crude Oil WTI', market: 'Commodities', segment: 'Global', currency: 'USD', price: 68.45, changePercent: -1.23, rsi: 42, aiVerdict: 'BEARISH', aiScore: 62, sector: 'Energy', volume: 390_000, seed: 63 },
];

export const instruments: Instrument[] = defs.map(build);

export const instrumentMap: Record<string, Instrument> = Object.fromEntries(
  instruments.map((i) => [i.symbol, i]),
);

export function getInstrument(symbol?: string | string[]): Instrument | undefined {
  if (!symbol) return undefined;
  const key = Array.isArray(symbol) ? symbol[0] : symbol;
  return instrumentMap[decodeURIComponent(key)];
}

/** Default instruments shown in a fresh watchlist (mirrors the reference screenshots). */
export const defaultWatchlist = ['NIFTY 50', 'RELIANCE', 'BTC', 'GOLD', 'SPY'];
