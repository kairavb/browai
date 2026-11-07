import { View, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bell, Search } from 'lucide-react-native';
import { Text } from '@/components/ui';
import { BrowLogo } from '@/components/BrowLogo';
import { colors, radii, spacing } from '@/theme';
import { headerTickers } from '@/data/home';
import { trendColor } from '@/theme';
import { formatPercent } from '@/utils/format';
import { useNotifications } from '@/store/notifications';

/** Sticky top bar: logo + intelligence badge, mini tickers, search & notifications. */
export function AppHeader() {
  const insets = useSafeAreaInsets();
  const unread = useNotifications((s) => s.items.filter((n) => !n.read).length);

  return (
    <View style={[styles.wrap, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.topRow}>
        <View style={styles.logoRow}>
          <BrowLogo size={17} />
          <View style={styles.versionBadge}>
            <Text variant="micro" color={colors.brand} style={styles.versionText}>
              2.5 Intelligence
            </Text>
          </View>
        </View>
        <View style={styles.actions}>
          <Pressable style={styles.iconBtn} onPress={() => router.push('/(tabs)/markets')}>
            <Search size={18} color={colors.textSecondary} />
          </Pressable>
          <Pressable style={styles.iconBtn} onPress={() => router.push('/notifications')}>
            <Bell size={18} color={colors.textSecondary} />
            {unread > 0 && (
              <View style={styles.dot}>
                <Text variant="micro" color={colors.black} style={styles.dotText}>
                  {unread > 9 ? '9+' : unread}
                </Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>

      <View style={styles.tickerRow}>
        {headerTickers.map((t) => (
          <View key={t.label} style={styles.ticker}>
            <Text variant="micro" color={colors.textMuted}>
              {t.label}
            </Text>
            <Text variant="micro" color={trendColor(t.changePercent)} style={styles.tickerVal}>
              {formatPercent(t.changePercent)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.bgElevated,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  versionBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: colors.brandSoft,
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.25)',
  },
  versionText: { fontWeight: '700', fontSize: 9.5 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 15,
    height: 15,
    paddingHorizontal: 3,
    borderRadius: 8,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotText: { fontSize: 8.5, fontWeight: '800' },
  tickerRow: { flexDirection: 'row', gap: spacing.lg, marginTop: spacing.sm },
  ticker: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  tickerVal: { fontWeight: '700' },
});
