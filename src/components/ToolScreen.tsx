import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { Text, ProBadge } from '@/components/ui';
import { colors, radii, spacing } from '@/theme';

interface Props {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  pro?: boolean;
  right?: React.ReactNode;
  children: React.ReactNode;
  scroll?: boolean;
}

/** Secondary (pushed) screen scaffold: back header + scrollable body. */
export function ToolScreen({ title, subtitle, icon, pro, right, children, scroll = true }: Props) {
  const insets = useSafeAreaInsets();
  const Body = (
    <>
      <View style={styles.titleRow}>
        {icon && <View style={styles.titleIcon}>{icon}</View>}
        <View style={styles.flex}>
          <View style={styles.titleTop}>
            <Text variant="h2">{title}</Text>
            {pro && <ProBadge />}
          </View>
          {subtitle ? (
            <Text variant="micro" color={colors.textSecondary} style={{ marginTop: 2 }}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>
      {children}
    </>
  );

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={22} color={colors.text} />
        </Pressable>
        <Text variant="h3" style={styles.headerTitle} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.headerRight}>{right}</View>
      </View>
      {scroll ? (
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing.xxxl }]}
          showsVerticalScrollIndicator={false}
        >
          {Body}
        </ScrollView>
      ) : (
        <View style={[styles.scroll, styles.flex]}>{Body}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.bgElevated,
    gap: spacing.sm,
  },
  backBtn: { width: 36, height: 36, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  scroll: { padding: spacing.lg, gap: spacing.lg },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  titleIcon: { width: 40, height: 40, borderRadius: radii.md, backgroundColor: colors.brandSoft, alignItems: 'center', justifyContent: 'center' },
  titleTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
})
