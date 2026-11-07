import { makeSpark } from '@/utils/series';

/** Hero ticker cards on Home. */
export const heroTickers = [
  { symbol: 'NIFTY 50', label: 'NIFTY 50', price: 23810.85, changePercent: 1.58, currency: 'INR' as const, seed: 101 },
  { symbol: 'BTC', label: 'BTC / USDT', price: 77648.88, changePercent: 0.94, currency: 'USD' as const, seed: 102 },
  { symbol: 'GOLD', label: 'GOLD (XAU/USD)', price: 3926.36, changePercent: -0.61, currency: 'USD' as const, seed: 103 },
  { symbol: 'DOWJONES', label: 'DOW JONES', price: 51745.04, changePercent: -0.46, currency: 'USD' as const, seed: 104 },
];

/** Compact tickers for the sticky header strip. */
export const headerTickers = [
  { label: 'NIFTY 50', changePercent: 1.58 },
  { label: 'BANKNIFTY', changePercent: 0.86 },
  { label: 'BTC', changePercent: 0.94 },
  { label: 'GOLD', changePercent: -0.61 },
];

/** Normalized multi-index intraday series for the Home chart. */
export const intradayIndices = [
  { label: 'NIFTY 50', changePercent: 2.1, color: '#F59E0B', series: makeSpark(201, 40, 0.86) },
  { label: 'S&P 500', changePercent: -0.06, color: '#22D3EE', series: makeSpark(202, 40, 0.48) },
  { label: 'Nasdaq 100', changePercent: 0.0, color: '#8B5CF6', series: makeSpark(203, 40, 0.5) },
  { label: 'DAX 40', changePercent: 0.3, color: '#EC4899', series: makeSpark(204, 40, 0.56) },
];

export const topGainers = [
  { symbol: 'MARICO', price: 878.4, changePercent: 10.0 },
  { symbol: 'MCX', price: 3490.1, changePercent: 7.42 },
  { symbol: 'BRITANNIA', price: 4930.0, changePercent: 6.36 },
];

export const topDecliners = [
  { symbol: 'NLCINDIA', price: 230.31, changePercent: -3.43 },
  { symbol: 'BIOCON', price: 343.0, changePercent: -3.3 },
  { symbol: 'NATIONALUM', price: 317.55, changePercent: -3.19 },
];

export const worldMarkets = [
  { label: 'India', sub: 'Equity + F&O', changePercent: 1.2, icon: '🇮🇳' },
  { label: 'USA', sub: 'Stocks + ETFs', changePercent: 0.0, icon: '🇺🇸' },
  { label: 'Crypto', sub: 'Perps + Spot', changePercent: 1.2, icon: '🪙' },
  { label: 'Global', sub: 'Futures + Macro', changePercent: -0.7, icon: '🌐' },
  { label: 'Commodities', sub: 'Gold, Oil, More', changePercent: -0.6, icon: '🏅' },
];
