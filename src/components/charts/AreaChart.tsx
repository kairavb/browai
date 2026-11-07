import { useMemo } from 'react';
import Svg, { Path, Defs, LinearGradient, Stop, Line, Circle } from 'react-native-svg';
import { line, area, curveMonotoneX } from 'd3-shape';
import { colors } from '@/theme';

interface RefLine {
  value: number;
  color: string;
  dashed?: boolean;
}

interface Props {
  data: number[];
  width: number;
  height?: number;
  color?: string;
  refLines?: RefLine[];
}

/** Larger area chart with gridlines and optional reference lines (support/resistance). */
export function AreaChart({ data, width, height = 200, color, refLines = [] }: Props) {
  const stroke = color ?? (data[data.length - 1] >= data[0] ? colors.positive : colors.negative);

  const { linePath, areaPath, lastX, lastY, scaleY, min, max } = useMemo(() => {
    const n = data.length;
    const allValues = [...data, ...refLines.map((r) => r.value)];
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    const span = max - min || 1;
    const padTop = 12;
    const padBottom = 12;
    const x = (i: number) => (i / (n - 1)) * width;
    const y = (v: number) => height - padBottom - ((v - min) / span) * (height - padTop - padBottom);

    const l = line<number>().x((_, i) => x(i)).y((v) => y(v)).curve(curveMonotoneX);
    const a = area<number>()
      .x((_, i) => x(i))
      .y0(height)
      .y1((v) => y(v))
      .curve(curveMonotoneX);
    return {
      linePath: l(data) ?? '',
      areaPath: a(data) ?? '',
      lastX: x(n - 1),
      lastY: y(data[n - 1]),
      scaleY: y,
      min,
      max,
    };
  }, [data, width, height, refLines]);

  const grid = [0.25, 0.5, 0.75];

  return (
    <Svg width={width} height={height}>
      <Defs>
        <LinearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={stroke} stopOpacity={0.26} />
          <Stop offset="1" stopColor={stroke} stopOpacity={0} />
        </LinearGradient>
      </Defs>

      {grid.map((g) => (
        <Line
          key={g}
          x1={0}
          x2={width}
          y1={height * g}
          y2={height * g}
          stroke={colors.border}
          strokeWidth={1}
        />
      ))}

      {refLines.map((r, i) => (
        <Line
          key={i}
          x1={0}
          x2={width}
          y1={scaleY(r.value)}
          y2={scaleY(r.value)}
          stroke={r.color}
          strokeWidth={1}
          strokeDasharray={r.dashed ? '4 4' : undefined}
          opacity={0.7}
        />
      ))}

      <Path d={areaPath} fill="url(#areaFill)" />
      <Path d={linePath} stroke={stroke} strokeWidth={2.5} fill="none" strokeLinecap="round" />
      <Circle cx={lastX} cy={lastY} r={4} fill={stroke} />
      <Circle cx={lastX} cy={lastY} r={8} fill={stroke} opacity={0.2} />
    </Svg>
  );
}
