import { View, StyleSheet, Pressable, Switch } from 'react-native';
import { router } from 'expo-router';
import { Settings as SettingsIcon, User, Scale, Bell, RefreshCw, Info } from 'lucide-react-native';
import { ToolScreen } from '@/components/ToolScreen';
import { Text, Card, Badge, SegmentedTabs } from '@/components/ui';
import { colors, radii, spacing } from '@/theme';
import { usePrefs } from '@/store/prefs';
import type { RiskTolerance, Segment } from '@/types';

const allMarkets: Segment[] = ['India Equity', 'India F&O', 'Crypto', 'Global'];

export default function Settings() {
  const { name, markets, risk, notificationsEnabled, toggleMarket, setRisk, setNotifications, resetOnboarding } = usePrefs();

  return (
    <ToolScreen
      title="Settings"
      subtitle="Markets, risk profile & preferences"
      icon={<SettingsIcon size={18} color={colors.brand} />}
    >
      {/* Profile */}
      <Card style={styles.profile}>
        <View style={styles.avatar}>
          <Text variant="h3" color={colors.white}>
            {name.slice(0, 1).toUpperCase()}
          </Text>
        </View>
        <View style={styles.flex}>
          <Text variant="h3">{name} Bhatia</Text>
          <Text variant="micro" color={colors.textMuted}>
            BROW AI · Free plan
          </Text>
        </View>
        <Badge label="FREE" tone="neutral" small />
      </Card>

      {/* Markets */}
      <Card style={styles.section}>
        <View style={styles.sectionHead}>
          <User size={14} color={colors.brand} />
          <Text variant="captionStrong">Markets you trade</Text>
        </View>
        <View style={styles.marketGrid}>
          {allMarkets.map((m) => {
            const active = markets.includes(m);
            return (
              <Pressable key={m} onPress={() => toggleMarket(m)} style={[styles.marketChip, active && styles.marketActive]}>
                <Text variant="caption" color={active ? colors.brand : colors.textSecondary}>
                  {m}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Card>

      {/* Risk */}
      <Card style={styles.section}>
        <View style={styles.sectionHead}>
          <Scale size={14} color={colors.brand} />
          <Text variant="captionStrong">Risk tolerance</Text>
        </View>
        <SegmentedTabs
          options={(['Conservative', 'Moderate', 'Aggressive'] as RiskTolerance[]).map((r) => ({ label: r, value: r }))}
          value={risk}
          onChange={(v) => setRisk(v as RiskTolerance)}
        />
      </Card>

      {/* Notifications */}
      <Card style={styles.toggleRow}>
        <Bell size={16} color={colors.brand} />
        <View style={styles.flex}>
          <Text variant="captionStrong">Push notifications</Text>
          <Text variant="micro" color={colors.textMuted}>
            Breaking news, breakouts & task alerts
          </Text>
        </View>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotifications}
          trackColor={{ true: colors.brandDim, false: colors.border }}
          thumbColor={notificationsEnabled ? colors.brand : colors.textMuted}
        />
      </Card>

      {/* Actions */}
      <Pressable onPress={() => { resetOnboarding(); router.replace('/onboarding'); }}>
        <Card style={styles.actionRow}>
          <RefreshCw size={16} color={colors.textSecondary} />
          <Text variant="caption" style={styles.flex}>
            Replay onboarding
          </Text>
        </Card>
      </Pressable>

      <Card style={styles.about}>
        <Info size={14} color={colors.textMuted} />
        <Text variant="micro" color={colors.textMuted} style={styles.flex}>
          BROW AI Mobile v1.0.0 · A financial intelligence tool, not investment advice. Data shown is simulated
          for demonstration.
        </Text>
      </Card>
    </ToolScreen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  profile: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.brandDim, alignItems: 'center', justifyContent: 'center' },
  section: { gap: spacing.md },
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  marketGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  marketChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radii.pill, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  marketActive: { backgroundColor: colors.brandSoft, borderColor: colors.brand },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  about: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.bgElevated },
});
