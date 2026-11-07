import { View, StyleSheet, ViewStyle } from 'react-native';
import { Text } from './Text';
import { colors, spacing } from '@/theme';

/** Uppercase tracked section label, optionally with a trailing action. */
export function SectionLabel({
  label,
  icon,
  right,
  style,
}: {
  label: string;
  icon?: React.ReactNode;
  right?: React.ReactNode;
  style?: ViewStyle;
}) {
  return (
    <View style={[styles.sectionRow, style]}>
      <View style={styles.labelRow}>
        {icon}
        <Text variant="label" color={colors.textSecondary}>
          {label}
        </Text>
      </View>
      {right}
    </View>
  );
}

/** Larger screen/section title with subtitle. */
export function TitleBlock({
  title,
  subtitle,
  icon,
  right,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <View style={styles.titleRow}>
      {icon}
      <View style={styles.flex}>
        <View style={styles.titleTop}>
          <Text variant="h1">{title}</Text>
          {right}
        </View>
        {subtitle ? (
          <Text variant="caption" color={colors.textSecondary} style={{ marginTop: 2 }}>
            {subtitle}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

export function Divider({ style }: { style?: ViewStyle }) {
  return <View style={[styles.divider, style]} />;
}

export function Row({
  children,
  gap = spacing.sm,
  style,
}: {
  children: React.ReactNode;
  gap?: number;
  style?: ViewStyle;
}) {
  return <View style={[styles.row, { gap }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  titleTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  flex: { flex: 1 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center' },
});
