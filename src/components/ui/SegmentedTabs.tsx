import { ScrollView, View, Pressable, StyleSheet } from 'react-native';
import { Text } from './Text';
import { colors, radii, spacing } from '@/theme';
import * as Haptics from 'expo-haptics';

interface Option {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface Props {
  options: (Option | string)[];
  value: string;
  onChange: (value: string) => void;
  scroll?: boolean;
  size?: 'sm' | 'md';
}

export function SegmentedTabs({ options, value, onChange, scroll = true, size = 'md' }: Props) {
  const norm: Option[] = options.map((o) => (typeof o === 'string' ? { label: o, value: o } : o));

  const pills = norm.map((o) => {
    const active = o.value === value;
    return (
      <Pressable
        key={o.value}
        onPress={() => {
          Haptics.selectionAsync().catch(() => {});
          onChange(o.value);
        }}
        style={[
          styles.pill,
          size === 'sm' && styles.pillSm,
          active ? styles.active : styles.inactive,
        ]}
      >
        {o.icon}
        <Text
          variant={size === 'sm' ? 'micro' : 'captionStrong'}
          color={active ? colors.brand : colors.textSecondary}
        >
          {o.label}
        </Text>
      </Pressable>
    );
  });

  if (!scroll) return <View style={styles.row}>{pills}</View>;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollRow}
    >
      {pills}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
  scrollRow: { flexDirection: 'row', gap: spacing.sm, paddingRight: spacing.lg },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md + 2,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  pillSm: { paddingHorizontal: spacing.md, paddingVertical: 6 },
  active: {
    backgroundColor: colors.brandSoft,
    borderColor: colors.brand,
  },
  inactive: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
});
