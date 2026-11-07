import { View, ViewProps, StyleSheet, Pressable, PressableProps } from 'react-native';
import { colors, radii, spacing } from '@/theme';

interface CardProps extends ViewProps {
  padded?: boolean;
  elevated?: boolean;
}

export function Card({ padded = true, elevated, style, children, ...rest }: CardProps) {
  return (
    <View
      {...rest}
      style={[
        styles.card,
        elevated && styles.elevated,
        padded && styles.padded,
        style,
      ]}
    >
      {children}
    </View>
  );
}

interface PressCardProps extends PressableProps {
  padded?: boolean;
}

export function PressableCard({ padded = true, style, children, ...rest }: PressCardProps) {
  return (
    <Pressable
      {...rest}
      style={({ pressed }) => [
        styles.card,
        padded && styles.padded,
        pressed && styles.pressed,
        typeof style === 'function' ? style({ pressed } as any) : style,
      ]}
    >
      {children as any}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  elevated: {
    backgroundColor: colors.surfaceAlt,
  },
  padded: {
    padding: spacing.lg,
  },
  pressed: {
    opacity: 0.75,
    backgroundColor: colors.surfaceHover,
  },
});
