import { useMemo, useState, useCallback } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Newspaper, Lock, CalendarDays, Bell, Zap } from 'lucide-react-native';
import { TabScreen } from '@/components/TabScreen';
import { NewsCard } from '@/components/NewsCard';
import { Text, Card, SegmentedTabs } from '@/components/ui';
import { colors, radii, spacing } from '@/theme';
import { news } from '@/data/news';
import { useNotifications } from '@/store/notifications';
import type { NewsCategory } from '@/types';

const categories = ['All', 'India', 'Global', 'Economy', 'Crypto'];

export default function News() {
  const [cat, setCat] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const unread = useNotifications((s) => s.items.filter((n) => !n.read).length);

  const filtered = useMemo(
    () => (cat === 'All' ? news : news.filter((n) => n.category === (cat as NewsCategory))),
    [cat],
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  return (
    <TabScreen refreshing={refreshing} onRefresh={onRefresh}>
      <View style={styles.titleRow}>
        <View style={styles.titleIcon}>
          <Newspaper size={18} color={colors.brand} />
        </View>
        <View style={styles.flex}>
          <Text variant="h1">News Intelligence</Text>
          <Text variant="micro" color={colors.textSecondary}>
            AI-analyzed market news · impact-ranked
          </Text>
        </View>
      </View>

      {/* Quick links */}
      <View style={styles.links}>
        <Pressable style={styles.linkBtn} onPress={() => router.push('/economic-calendar')}>
          <CalendarDays size={15} color={colors.brand} />
          <Text variant="micro" color={colors.textSecondary}>
            Economic Calendar
          </Text>
        </Pressable>
        <Pressable style={styles.linkBtn} onPress={() => router.push('/notifications')}>
          <Bell size={15} color={colors.brand} />
          <Text variant="micro" color={colors.textSecondary}>
            Alerts {unread > 0 ? `· ${unread}` : ''}
          </Text>
        </Pressable>
      </View>

      {/* AI digest (premium nudge, still accessible) */}
      <Card style={styles.digest}>
        <View style={styles.digestHead}>
          <Zap size={14} color={colors.brand} fill={colors.brand} />
          <Text variant="label" color={colors.brand}>
            AI MARKET DIGEST
          </Text>
          <View style={styles.flex} />
          <Lock size={12} color={colors.textMuted} />
        </View>
        <Text variant="caption" color={colors.textSecondary} style={styles.digestBody}>
          BROW reads every headline and distills the market's tone, dominant themes, movers and what to watch
          next — a terminal-grade briefing in one card.
        </Text>
        <Pressable style={styles.digestBtn} onPress={() => router.push('/ask')}>
          <Text variant="captionStrong" color={colors.brand}>
            Generate digest with BROW →
          </Text>
        </Pressable>
      </Card>

      <SegmentedTabs options={categories} value={cat} onChange={setCat} />

      <Text variant="label" color={colors.textMuted}>
        LAST HOUR
      </Text>
      <View style={styles.list}>
        {filtered.map((n) => (
          <NewsCard key={n.id} item={n} />
        ))}
      </View>
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  titleIcon: { width: 40, height: 40, borderRadius: radii.md, backgroundColor: colors.brandSoft, alignItems: 'center', justifyContent: 'center' },
  links: { flexDirection: 'row', gap: spacing.sm },
  linkBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: spacing.md, borderRadius: radii.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  digest: { gap: spacing.sm, backgroundColor: colors.bgElevated },
  digestHead: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  digestBody: { lineHeight: 19 },
  digestBtn: { marginTop: spacing.xs },
  list: { gap: spacing.md },
});
