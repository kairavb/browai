import { instruments, instrumentMap } from './instruments';
import { formatPercent, formatPrice } from '@/utils/format';

/** Lightweight mock "AI" that composes a grounded-sounding reply from local data. */
export function generateAiReply(prompt: string): string {
  const q = prompt.toLowerCase();

  // Match any instrument mentioned by symbol or name.
  const matched = instruments.filter(
    (i) => q.includes(i.symbol.toLowerCase()) || q.includes(i.name.toLowerCase().split(' ')[0]),
  );

  if (matched.length >= 2) {
    const [a, b] = matched;
    const winner = a.aiScore >= b.aiScore ? a : b;
    return `Comparing ${a.symbol} and ${b.symbol}:\n\n• ${a.symbol} — ${a.aiVerdict} (conviction ${a.aiScore}). ${formatPrice(a.price, a.currency)}, ${formatPercent(a.changePercent)} today, RSI ${a.rsi}.\n• ${b.symbol} — ${b.aiVerdict} (conviction ${b.aiScore}). ${formatPrice(b.price, b.currency)}, ${formatPercent(b.changePercent)} today, RSI ${b.rsi}.\n\nBROW's read: ${winner.symbol} has the stronger multi-factor profile right now. ${winner.thesis}`;
  }

  if (matched.length === 1) {
    const i = matched[0];
    return `${i.symbol} — ${i.name}\n\nVerdict: ${i.aiVerdict} · conviction ${i.aiScore}/100\nPrice ${formatPrice(i.price, i.currency)} (${formatPercent(i.changePercent)}) · RSI ${i.rsi}\nSupport ${i.support} · Resistance ${i.resistance}\n\n${i.thesis}\n\nBROW can make mistakes — verify important market data before trading.`;
  }

  if (q.includes('overbought') || q.includes('rsi')) {
    const hot = instruments.filter((i) => i.rsi >= 70).slice(0, 4);
    return `Overbought watch (RSI ≥ 70):\n\n${hot
      .map((i) => `• ${i.symbol} — RSI ${i.rsi}, ${formatPercent(i.changePercent)}`)
      .join('\n')}\n\nThese names carry mean-reversion risk into resistance. BROW suggests tightening risk rather than chasing.`;
  }

  if (q.includes('crypto')) {
    const c = instruments.filter((i) => i.market === 'Crypto');
    return `Crypto snapshot:\n\n${c
      .map((i) => `• ${i.symbol} ${formatPrice(i.price, i.currency)} (${formatPercent(i.changePercent)}) — ${i.aiVerdict}`)
      .join('\n')}\n\nBreadth is mixed. ${instrumentMap['BTC'].thesis}`;
  }

  if (q.includes('gold') || q.includes('nfp') || q.includes('macro')) {
    return `Into the US Non-Farm Payrolls print, GOLD is the asset to watch. A strong jobs beat lifts yields and pressures gold; a miss fuels rate-cut bets and a relief bounce. ${instrumentMap['GOLD'].thesis}`;
  }

  const movers = [...instruments].sort((a, b) => b.changePercent - a.changePercent).slice(0, 3);
  return `Here's what BROW is seeing across your markets:\n\nTop movers: ${movers
    .map((m) => `${m.symbol} ${formatPercent(m.changePercent)}`)
    .join(' · ')}\n\nBreadth is narrow with leadership concentrated in large-caps. Ask me about any instrument (e.g. "Is RELIANCE a buy?") for a full multi-timeframe read. BROW is grounded in live market data — verify before trading.`;
}
