import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Inbox, TriangleAlert, Lock } from 'lucide-react-native';
import { Text } from './Text';
import { Button } from './Button';
import { colors, radii, spacing } from '@/theme';

function IconCircle({ children }: { children: React.ReactNode }) {
  return <View style={styles.circle}>{children}</View>;
}

export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return (
    <View style={styles.wrap}>
      <ActivityIndicator color={colors.brand} />
      <Text variant="caption" color={colors.textSecondary} style={{ marginTop: spacing.md }}>
        {label}
      </Text>
    </View>
  );
}

export function EmptyState({
  title,
  message,
  icon,
  actionLabel,
  onAction,
}: {
  title: string;
  message?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.wrap}>
      <IconCircle>{icon ?? <Inbox size={26} color={colors.brand} />}</IconCircle>
      <Text variant="h3" center style={{ marginTop: spacing.lg }}>
        {title}
      </Text>
      {message ? (
        <Text variant="caption" color={colors.textSecondary} center style={styles.msg}>
          {message}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} small style={{ marginTop: spacing.lg }} />
      ) : null}
    </View>
  );
}

export function ErrorState({
  message = 'Something went wrong.',
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <View style={styles.wrap}>
      <IconCircle>
        <TriangleAlert size={26} color={colors.warning} />
      </IconCircle>
      <Text variant="h3" center style={{ marginTop: spacing.lg }}>
        No matches
      </Text>
      <Text variant="caption" color={colors.textSecondary} center style={styles.msg}>
        {message}
      </Text>
      {onRetry ? <Button label="Retry" onPress={onRetry} small style={{ marginTop: spacing.lg }} /> : null}
    </View>
  );
}

export function LockedState({
  title,
  message,
  onAction,
}: {
  title: string;
  message?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.wrap}>
      <IconCircle>
        <Lock size={24} color={colors.brand} />
      </IconCircle>
      <Text variant="h3" center style={{ marginTop: spacing.lg }}>
        {title}
      </Text>
      {message ? (
        <Text variant="caption" color={colors.textSecondary} center style={styles.msg}>
          {message}
        </Text>
      ) : null}
      {onAction ? (
        <Button label="View plans" onPress={onAction} small style={{ marginTop: spacing.lg }} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xl,
  },
  circle: {
    width: 56,
    height: 56,
    borderRadius: radii.pill,
    backgroundColor: colors.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  msg: { marginTop: spacing.sm, maxWidth: 300, lineHeight: 19 },
});
