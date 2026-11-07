import Svg, { Rect, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/ui';
import { colors } from '@/theme';

/** The BROW stacked-bar mark. */
export function BrowMark({ size = 24 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 512 512">
      <Defs>
        <LinearGradient id="bm" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#38BDF8" />
          <Stop offset="1" stopColor="#2563EB" />
        </LinearGradient>
      </Defs>
      <Rect x="150" y="150" width="60" height="212" rx="30" fill="url(#bm)" />
      <Rect x="150" y="150" width="190" height="56" rx="28" fill="url(#bm)" />
      <Rect x="150" y="228" width="150" height="56" rx="28" fill="url(#bm)" />
      <Rect x="150" y="306" width="212" height="56" rx="28" fill="url(#bm)" />
      <Circle cx="352" cy="178" r="30" fill="url(#bm)" />
      <Circle cx="312" cy="256" r="30" fill="url(#bm)" />
      <Circle cx="374" cy="334" r="30" fill="url(#bm)" />
    </Svg>
  );
}

/** "BROW AI" wordmark with optional mark. */
export function BrowLogo({ size = 18, showMark = true }: { size?: number; showMark?: boolean }) {
  return (
    <View style={styles.row}>
      {showMark && <BrowMark size={size + 8} />}
      <Text style={{ fontSize: size, fontWeight: '800', letterSpacing: 0.5 }}>
        BROW <Text style={{ fontSize: size, fontWeight: '800' }} color={colors.brand}>
          AI
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});
