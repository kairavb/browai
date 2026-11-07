import { ScrollView, StyleSheet, RefreshControl, View } from 'react-native';
import { AppHeader } from '@/components/AppHeader';
import { colors, spacing } from '@/theme';

interface Props {
  children: React.ReactNode;
  refreshing?: boolean;
  onRefresh?: () => void;
  scroll?: boolean;
}

/** Standard tab screen: sticky header + scrollable body with tab-bar padding. */
export function TabScreen({ children, refreshing, onRefresh, scroll = true }: Props) {
  return (
    <View style={styles.root}>
      <AppHeader />
      {scroll ? (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={!!refreshing}
                onRefresh={onRefresh}
                tintColor={colors.brand}
                colors={[colors.brand]}
              />
            ) : undefined
          }
        >
          {children}
        </ScrollView>
      ) : (
        <View style={styles.flex}>{children}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl * 2.5, gap: spacing.xl },
  flex: { flex: 1 },
});
