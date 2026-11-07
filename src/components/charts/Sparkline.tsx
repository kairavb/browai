import { useMemo } from 'react';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { line, area, curveMonotoneX } from 'd3-shape';
import { colors } from '@/theme';

interface Props {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  filled?: boolean;
  strokeWidth?: number;
}

/** Compact area/line sparkline. Colour defaults to trend direction. */
export function Sparkline({
  data,
  width = 96,
  height = 36,
  color,
  filled = true,
  strokeWidth = 2,
}: Props) {
  const stroke = color ?? (data[data.length - 1] >= data[0] ? colors.positive : colors.negative);
  const gradId = useMemo(() => `sg${Math.round(data[0] * 1000)}_${data.length}`, [data]);

  const { linePath, areaPath } = useMemo(() => {
    const n = data.length;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const span = max - min || 1;
    const x = (i: number) => (i / (n - 1)) * width;
    const y = (v: number) => height - 4 - ((v - min) / span) * (height - 8);

    const l = line<number>().x((_, i) => x(i)).y((v) => y(v)).curve(curveMonotoneX);
    const a = area<number>()
      .x((_, i) => x(i))
      .y0(height)
      .y1((v) => y(v))
      .curve(curveMonotoneX);
    return { linePath: l(data) ?? '', areaPath: a(data) ?? '' };
  }, [data, width, height]);

  return (
    <Svg width={width} height={height}>
      {filled && (
        <Defs>
          <LinearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={stroke} stopOpacity={0.28} />
            <Stop offset="1" stopColor={stroke} stopOpacity={0} />
          </LinearGradient>
        </Defs>
      )}
      {filled && <Path d={areaPath} fill={`url(#${gradId})`} />}
      <Path d={linePath} stroke={stroke} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" />
    </Svg>
  );
}
