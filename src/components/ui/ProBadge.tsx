import { View, StyleSheet } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import { Text } from './Text';
import { colors, radii } from '@/theme';

/** Subtle, non-blocking "PRO" tag used on tools the web app gates. */
export function ProBadge() {
  return (
    <View style={styles.badge}>
      <Sparkles size={9} color={colors.warning} fill={colors.warning} />
      <Text variant="micro" color={colors.warning} style={styles.text}>
        PRO
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radii.sm,
    backgroundColor: colors.warningSoft,
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.3)',
  },
  text: { letterSpacing: 0.8, fontWeight: '800' },
});
