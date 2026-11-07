import type { Candle } from '@/types';

/** Deterministic pseudo-random generator so mock charts are stable across renders. */
export function seededRandom(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** Build a sparkline series trending toward `endBias` with volatility. */
export function makeSpark(seed: number, points = 32, endBias = 0.5): number[] {
  const rand = seededRandom(seed);
  const out: number[] = [];
  let v = 50;
  for (let i = 0; i < points; i++) {
    const drift = (endBias - 0.5) * 1.6;
    v += (rand() - 0.5) * 7 + drift;
    v = Math.max(8, Math.min(92, v));
    out.push(v);
  }
  return out;
}

/** Build OHLC candles from a base price, trend and seed. */
export function makeCandles(
  seed: number,
  basePrice: number,
  count = 40,
  trend = 0,
): Candle[] {
  const rand = seededRandom(seed);
  const out: Candle[] = [];
  let close = basePrice * (1 - trend * 0.12);
  for (let i = 0; i < count; i++) {
    const open = close;
    const vol = basePrice * 0.012;
    const drift = trend * basePrice * 0.004;
    const move = (rand() - 0.5) * vol * 2 + drift;
    close = Math.max(basePrice * 0.6, open + move);
    const high = Math.max(open, close) + rand() * vol;
    const low = Math.min(open, close) - rand() * vol;
    out.push({ t: i, o: open, h: high, l: low, c: close });
  }
  return out;
}

/** Normalize a series to 0..1 for drawing. */
export function normalize(values: number[]): number[] {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  return values.map((v) => (v - min) / span);
}
