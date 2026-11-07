import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles, ArrowUpRight } from 'lucide-react-native';
import { Text, Card } from '@/components/ui';
import { colors, radii, spacing } from '@/theme';

interface Props {
  title: string;
  subtitle: string;
  actions: string[];
  badge?: string;
}

/** The "BROW AI … Co-Pilot" banner with live-engine chips, used across tool screens. */
export function CoPilotBanner({ title, subtitle, actions, badge = 'LIVE ENGINES' }: Props) {
  return (
    <Card style={styles.card} padded={false}>
      <View style={styles.top}>
        <LinearGradient
          colors={[colors.gradientFrom, colors.gradientTo]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.icon}
        >
          <Sparkles size={18} color={colors.white} />
        </LinearGradient>
        <View style={styles.flex}>
          <View style={styles.titleRow}>
            <Text variant="captionStrong">{title}</Text>
            <View style={styles.liveBadge}>
              <Text variant="micro" color={colors.brand} style={styles.liveText}>
                {badge}
              </Text>
            </View>
          </View>
          <Text variant="micro" color={colors.textSecondary} style={{ marginTop: 2 }} numberOfLines={2}>
            {subtitle}
          </Text>
        </View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {actions.map((a) => (
          <Pressable key={a} style={styles.chip} onPress={() => router.push('/ask')}>
            <Text variant="micro" color={colors.textSecondary}>
              {a}
            </Text>
            <ArrowUpRight size={12} color={colors.brand} />
          </Pressable>
        ))}
      </ScrollView>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { padding: spacing.md, gap: spacing.md, backgroundColor: colors.bgElevated },
  top: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  icon: { width: 38, height: 38, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center' },
  flex: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  liveBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: colors.brandSoft,
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.3)',
  },
  liveText: { letterSpacing: 0.6, fontWeight: '800' },
  chips: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.xs },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
