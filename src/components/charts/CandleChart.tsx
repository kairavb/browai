import { useMemo } from 'react';
import Svg, { Rect, Line } from 'react-native-svg';
import { colors } from '@/theme';
import type { Candle } from '@/types';

interface Props {
  candles: Candle[];
  width: number;
  height?: number;
}

/** Candlestick chart for the stock detail screen. */
export function CandleChart({ candles, width, height = 220 }: Props) {
  const { bars, gridY } = useMemo(() => {
    const highs = candles.map((c) => c.h);
    const lows = candles.map((c) => c.l);
    const max = Math.max(...highs);
    const min = Math.min(...lows);
    const span = max - min || 1;
    const padY = 12;
    const n = candles.length;
    const slot = width / n;
    const bodyW = Math.max(2, slot * 0.6);
    const y = (v: number) => height - padY - ((v - min) / span) * (height - padY * 2);

    const bars = candles.map((c, i) => {
      const cx = i * slot + slot / 2;
      const up = c.c >= c.o;
      const color = up ? colors.positive : colors.negative;
      const bodyTop = y(Math.max(c.o, c.c));
      const bodyBottom = y(Math.min(c.o, c.c));
      return {
        x: cx - bodyW / 2,
        bodyW,
        cx,
        color,
        wickTop: y(c.h),
        wickBottom: y(c.l),
        bodyY: bodyTop,
        bodyH: Math.max(1, bodyBottom - bodyTop),
      };
    });
    const gridY = [0.25, 0.5, 0.75].map((g) => height * g);
    return { bars, gridY };
  }, [candles, width, height]);

  return (
    <Svg width={width} height={height}>
      {gridY.map((gy, i) => (
        <Line key={i} x1={0} x2={width} y1={gy} y2={gy} stroke={colors.border} strokeWidth={1} />
      ))}
      {bars.map((b, i) => (
        <Line key={`w${i}`} x1={b.cx} x2={b.cx} y1={b.wickTop} y2={b.wickBottom} stroke={b.color} strokeWidth={1} opacity={0.9} />
      ))}
      {bars.map((b, i) => (
        <Rect key={`b${i}`} x={b.x} y={b.bodyY} width={b.bodyW} height={b.bodyH} rx={1} fill={b.color} />
      ))}
    </Svg>
  );
}
