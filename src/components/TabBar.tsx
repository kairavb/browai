import { View, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Home, Eye, Sparkles, Newspaper, LayoutGrid } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Text } from '@/components/ui';
import { colors, spacing, radii } from '@/theme';

/** Minimal structural type for the expo-router Tabs tabBar prop. */
interface TabBarProps {
  state: { index: number; routes: { key: string; name: string }[] };
  navigateToTab: (routeKey: string) => void;
}

const meta: Record<string, { label: string; Icon: typeof Home }> = {
  home: { label: 'Home', Icon: Home },
  watchlist: { label: 'Watchlist', Icon: Eye },
  ask: { label: 'Ask BROW', Icon: Sparkles },
  news: { label: 'News', Icon: Newspaper },
  markets: { label: 'Markets', Icon: LayoutGrid },
};

export function TabBar({ state, navigateToTab }: TabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
      {state.routes.map((route, index) => {
        const m = meta[route.name];
        if (!m) return null;
        const focused = state.index === index;
        const isCenter = route.name === 'ask';

        const onPress = () => {
          Haptics.selectionAsync().catch(() => {});
          if (!focused) navigateToTab(route.key);
        };

        if (isCenter) {
          return (
            <Pressable key={route.key} onPress={onPress} style={styles.centerItem}>
              <LinearGradient
                colors={[colors.gradientFrom, colors.gradientTo]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.centerBtn}
              >
                <m.Icon size={22} color={colors.white} />
              </LinearGradient>
              <Text variant="micro" color={focused ? colors.brand : colors.textMuted} style={styles.centerLabel}>
                {m.label}
              </Text>
            </Pressable>
          );
        }

        return (
          <Pressable key={route.key} onPress={onPress} style={styles.item}>
            <m.Icon size={21} color={focused ? colors.brand : colors.textMuted} strokeWidth={focused ? 2.4 : 2} />
            <Text variant="micro" color={focused ? colors.brand : colors.textMuted}>
              {m.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    backgroundColor: colors.bgElevated,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    alignItems: 'flex-start',
  },
  item: { flex: 1, alignItems: 'center', gap: 3, paddingTop: 4 },
  centerItem: { flex: 1, alignItems: 'center', gap: 3, marginTop: -18 },
  centerBtn: {
    width: 52,
    height: 52,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.bg,
    shadowColor: colors.brand,
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  centerLabel: { marginTop: 1 },
});
