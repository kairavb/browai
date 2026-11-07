import { View, StyleSheet } from 'react-native';
import { Text } from './Text';
import { colors } from '@/theme';

const palette = ['#F97316', '#22C55E', '#3B82F6', '#8B5CF6', '#EC4899', '#14B8A6', '#F59E0B', '#06B6D4'];

function colorFor(symbol: string): string {
  let h = 0;
  for (let i = 0; i < symbol.length; i++) h = (h * 31 + symbol.charCodeAt(i)) % 997;
  return palette[h % palette.length];
}

interface Props {
  symbol: string;
  size?: number;
}

/** Colored initials avatar for an instrument. */
export function SymbolAvatar({ symbol, size = 40 }: Props) {
  const initials = symbol.replace(/[^A-Za-z0-9]/g, '').slice(0, 2).toUpperCase();
  const bg = colorFor(symbol);
  return (
    <View
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: bg + '22', borderColor: bg + '55' },
      ]}
    >
      <Text variant="captionStrong" color={bg} style={{ fontSize: size * 0.34 }}>
        {initials}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});
