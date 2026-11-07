import { useMemo } from 'react';
import Svg, { Path, Line } from 'react-native-svg';
import { line, curveMonotoneX } from 'd3-shape';
import { colors } from '@/theme';

interface Series {
  label: string;
  color: string;
  series: number[];
}

interface Props {
  data: Series[];
  width: number;
  height?: number;
}

/** Normalized multi-series line chart (Home intraday trends). */
export function MultiLineChart({ data, width, height = 190 }: Props) {
  const paths = useMemo(() => {
    const all = data.flatMap((d) => d.series);
    const min = Math.min(...all);
    const max = Math.max(...all);
    const span = max - min || 1;
    const padY = 14;
    return data.map((d) => {
      const n = d.series.length;
      const x = (i: number) => (i / (n - 1)) * width;
      const y = (v: number) => height - padY - ((v - min) / span) * (height - padY * 2);
      const l = line<number>().x((_, i) => x(i)).y((v) => y(v)).curve(curveMonotoneX);
      return { d: l(d.series) ?? '', color: d.color };
    });
  }, [data, width, height]);

  const grid = [0.25, 0.5, 0.75];

  return (
    <Svg width={width} height={height}>
      {grid.map((g) => (
        <Line key={g} x1={0} x2={width} y1={height * g} y2={height * g} stroke={colors.border} strokeWidth={1} />
      ))}
      {paths.map((p, i) => (
        <Path key={i} d={p.d} stroke={p.color} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      ))}
    </Svg>
  );
}
