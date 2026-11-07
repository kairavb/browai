export type Segment = 'India Equity' | 'India F&O' | 'Crypto' | 'Global';
export type Market = 'India' | 'USA' | 'Crypto' | 'Commodities';
export type AiVerdict = 'BULLISH' | 'BEARISH' | 'NEUTRAL';
export type Sentiment = 'Bullish' | 'Bearish' | 'Neutral';
export type RiskTolerance = 'Conservative' | 'Moderate' | 'Aggressive';

export interface Instrument {
  symbol: string;
  name: string;
  market: Market;
  segment: Segment;
  sector?: string;
  currency: 'INR' | 'USD';
  price: number;
  change: number;
  changePercent: number;
  dayLow: number;
  dayHigh: number;
  yearLow: number;
  yearHigh: number;
  volume: number;
  marketCap?: number;
  rsi: number;
  aiVerdict: AiVerdict;
  aiScore: number; // 0-100 conviction
  spark: number[]; // intraday sparkline points
  pe?: number;
  // Technicals for the detail screen
  support: number;
  resistance: number;
  ema20: number;
  ema50: number;
  macd: 'Bullish' | 'Bearish' | 'Neutral';
  thesis: string;
  signals: TechSignal[];
  seed: number;
}

export interface TechSignal {
  label: string;
  value: string;
  tone: 'positive' | 'negative' | 'neutral';
}

export interface Candle {
  t: number; // index / time
  o: number;
  h: number;
  l: number;
  c: number;
}

export type NewsCategory = 'India' | 'Global' | 'Economy' | 'Crypto';
export interface NewsItem {
  id: string;
  headline: string;
  summary: string;
  source: string;
  impact: number; // 0-100
  sentiment: Sentiment;
  category: NewsCategory;
  assetClass: string;
  tickers: string[];
  monitor: string;
  minutesAgo: number;
}

export type NotifType = 'Breaking' | 'Filings' | 'Alerts' | 'Market' | 'Tasks';
export interface Notification {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  tickers: string[];
  minutesAgo: number;
  read: boolean;
}

export type EventRegion = 'India' | 'USA' | 'Europe' | 'Asia';
export type EventImpact = 'High' | 'Medium' | 'Low';
export type EventCategory = 'Central Bank' | 'Inflation' | 'Jobs' | 'GDP' | 'Earnings';
export interface EconEvent {
  id: string;
  time: string;
  date: string; // e.g. "THU, NOV 5"
  flag: string;
  title: string;
  region: EventRegion;
  impact: EventImpact;
  category: EventCategory;
  currency: string;
  actual: string;
  forecast: string;
  previous: string;
  browImpact: string[];
  playbook: string;
}

export interface FactorStock {
  rank: number;
  symbol: string;
  name: string;
  sector: string;
  composite: number;
  momentum: number;
  quality: number;
  value: number;
  volatility: number;
  liquidity: number;
  sentiment: number;
}

export type SetupStatus = 'Live Picks' | 'Active' | 'Booked';
export type SetupDirection = 'LONG' | 'SHORT';
export interface TradeSetup {
  id: string;
  symbol: string;
  name: string;
  segment: Segment;
  status: SetupStatus;
  direction: SetupDirection;
  entry: number;
  stopLoss: number;
  target1: number;
  target2: number;
  confidence: number;
  rr: number; // risk-reward
  thesis: string;
  pnlPercent?: number; // for active/booked
  outcome?: 'WIN' | 'LOSS' | 'OPEN';
}

export type RadarSignal =
  | 'Breakout'
  | 'Breakdown'
  | 'Accumulation'
  | 'Distribution'
  | 'Volume Spike';
export interface RadarRow {
  id: string;
  symbol: string;
  name: string;
  segment: Segment;
  signal: RadarSignal;
  score: number;
  changePercent: number;
  volumeX: number; // relative volume multiple
  note: string;
}

export interface Holding {
  symbol: string;
  name: string;
  qty: number;
  avg: number;
  ltp: number;
  currency: 'INR' | 'USD';
}

export interface ScheduledTask {
  id: string;
  title: string;
  condition: string;
  target: string;
  status: 'Active' | 'Triggered';
  createdAgo: string;
}

export interface QuantEngine {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  icon: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  pending?: boolean;
}
