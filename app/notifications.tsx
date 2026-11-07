import { useMemo, useState } from 'react';
import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, CheckCheck, Bell, Newspaper, FileText, TriangleAlert, Activity, Clock } from 'lucide-react-native';
import { Text, Card, Badge, SegmentedTabs } from '@/components/ui';
import { colors, radii, spacing } from '@/theme';
import { timeAgo } from '@/utils/format';
import { useNotifications } from '@/store/notifications';
import type { NotifType } from '@/types';

const filters = ['All', 'Breaking', 'Filings', 'Alerts', 'Market', 'Tasks'];

const typeIcon: Record<NotifType, typeof Bell> = {
  Breaking: Newspaper,
  Filings: FileText,
  Alerts: TriangleAlert,
  Market: Activity,
  Tasks: Clock,
};

export default function Notifications() {
  const insets = useSafeAreaInsets();
  const { items, markAllRead, markRead } = useNotifications();
  const [filter, setFilter] = useState('All');

  const unread = items.filter((n) => !n.read).length;
  const filtered = useMemo(
    () => (filter === 'All' ? items : items.filter((n) => n.type === filter)),
    [items, filter],
  );

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <View style={styles.headTitle}>
          <View style={styles.bellWrap}>
            <Bell size={18} color={colors.brand} />
            {unread > 0 && <View style={styles.bellDot} />}
          </View>
          <View>
            <Text variant="h2">Notifications</Text>
            <Text variant="micro" color={colors.textSecondary}>
              {unread} unread
            </Text>
          </View>
        </View>
        <Pressable style={styles.iconBtn} onPress={() => router.back()}>
          <X size={18} color={colors.textSecondary} />
        </Pressable>
      </View>

      <View style={styles.sub}>
        <SegmentedTabs options={filters} value={filter} onChange={setFilter} />
        <Pressable style={styles.markBtn} onPress={markAllRead}>
          <CheckCheck size={14} color={colors.brand} />
          <Text variant="micro" color={colors.brand}>
            Mark all read
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        {filtered.map((n) => {
          const Icon = typeIcon[n.type];
          return (
            <Pressable key={n.id} onPress={() => markRead(n.id)}>
              <Card style={[styles.card, !n.read && styles.unreadCard]}>
                <View style={styles.cardIcon}>
                  <Icon size={16} color={colors.brand} />
                </View>
                <View style={styles.flex}>
                  <View style={styles.cardHead}>
                    <Text variant="captionStrong" color={colors.brand}>
                      {n.type} {n.type === 'Breaking' ? 'News' : ''}
                    </Text>
                    {!n.read && <Badge label="New" tone="brand" small />}
                  </View>
                  <Text variant="caption" style={styles.cardTitle}>
                    {n.title}
                  </Text>
                  <Text variant="micro" color={colors.textMuted} numberOfLines={2} style={styles.cardBody}>
                    {n.body}
                  </Text>
                  <View style={styles.cardFoot}>
                    {n.tickers.slice(0, 2).map((t) => (
                      <Badge key={t} label={t} tone="neutral" small />
                    ))}
                    <View style={styles.flex} />
                    <Text variant="micro" color={colors.textFaint}>
                      {timeAgo(n.minutesAgo)}
                    </Text>
                  </View>
                </View>
              </Card>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.bgElevated,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headTitle: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  bellWrap: { width: 40, height: 40, borderRadius: radii.md, backgroundColor: colors.brandSoft, alignItems: 'center', justifyContent: 'center' },
  bellDot: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.negative },
  iconBtn: { width: 36, height: 36, borderRadius: radii.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  sub: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, gap: spacing.md },
  markBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, alignSelf: 'flex-start' },
  scroll: { padding: spacing.lg, paddingTop: 0, gap: spacing.md },
  card: { flexDirection: 'row', gap: spacing.md },
  unreadCard: { borderColor: 'rgba(34,211,238,0.25)', backgroundColor: colors.surfaceAlt },
  cardIcon: { width: 36, height: 36, borderRadius: radii.sm, backgroundColor: colors.warningSoft, alignItems: 'center', justifyContent: 'center' },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  cardTitle: { marginTop: 4, lineHeight: 19 },
  cardBody: { marginTop: 4, lineHeight: 16 },
  cardFoot: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.sm },
});
