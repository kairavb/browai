/** Formatting helpers for prices, percentages and relative time. */

export function formatPrice(value: number, currency: 'INR' | 'USD' = 'INR'): string {
  const symbol = currency === 'INR' ? '₹' : '$';
  const formatted = value.toLocaleString(currency === 'INR' ? 'en-IN' : 'en-US', {
    minimumFractionDigits: value < 100 ? 2 : 2,
    maximumFractionDigits: 2,
  });
  return `${symbol}${formatted}`;
}

export function formatNumber(value: number): string {
  return value.toLocaleString('en-IN', { maximumFractionDigits: 2 });
}

export function formatPercent(value: number): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export function formatSignedPrice(value: number, currency: 'INR' | 'USD' = 'INR'): string {
  const sign = value > 0 ? '+' : '';
  const symbol = currency === 'INR' ? '₹' : '$';
  return `${sign}${symbol}${Math.abs(value).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatCompact(value: number): string {
  if (value >= 1e7) return `${(value / 1e7).toFixed(2)}Cr`;
  if (value >= 1e5) return `${(value / 1e5).toFixed(2)}L`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
  return `${value}`;
}

export function timeAgo(minutes: number): string {
  if (minutes < 1) return 'now';
  if (minutes < 60) return `${Math.round(minutes)}m ago`;
  const hours = minutes / 60;
  if (hours < 24) return `${Math.round(hours)}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

/** Clamp a value between 0 and 1 given a low/high range (for L–H bars). */
export function rangePosition(value: number, low: number, high: number): number {
  if (high <= low) return 0.5;
  return Math.max(0, Math.min(1, (value - low) / (high - low)));
}
