import { Pressable, StyleSheet, ViewStyle, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from './Text';
import { colors, radii, spacing } from '@/theme';
import * as Haptics from 'expo-haptics';

type Variant = 'gradient' | 'solid' | 'ghost' | 'outline';

interface Props {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  icon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  small?: boolean;
  style?: ViewStyle;
}

export function Button({
  label,
  onPress,
  variant = 'gradient',
  icon,
  loading,
  disabled,
  fullWidth,
  small,
  style,
}: Props) {
  const handle = () => {
    if (disabled || loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onPress?.();
  };

  const inner = (
    <>
      {loading ? (
        <ActivityIndicator color={variant === 'gradient' ? colors.white : colors.brand} size="small" />
      ) : (
        <>
          {icon}
          <Text
            variant="bodyStrong"
            color={
              variant === 'gradient' || variant === 'solid'
                ? colors.white
                : variant === 'outline'
                  ? colors.text
                  : colors.brand
            }
          >
            {label}
          </Text>
        </>
      )}
    </>
  );

  const pad = small
    ? { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg }
    : { paddingVertical: spacing.md + 2, paddingHorizontal: spacing.xl };

  if (variant === 'gradient') {
    return (
      <Pressable
        onPress={handle}
        disabled={disabled || loading}
        style={[fullWidth && styles.full, disabled && styles.disabled, style]}
      >
        <LinearGradient
          colors={[colors.gradientFrom, colors.gradientTo]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.base, pad, styles.gradient]}
        >
          {inner}
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={handle}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        pad,
        variant === 'solid' && styles.solid,
        variant === 'outline' && styles.outline,
        variant === 'ghost' && styles.ghost,
        fullWidth && styles.full,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      {inner}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radii.pill,
  },
  gradient: {},
  solid: { backgroundColor: colors.brandDim },
  outline: { borderWidth: 1, borderColor: colors.borderStrong, backgroundColor: colors.surface },
  ghost: { backgroundColor: colors.brandSoft },
  full: { width: '100%' },
  pressed: { opacity: 0.8 },
  disabled: { opacity: 0.45 },
});
