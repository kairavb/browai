import { useState } from 'react';
import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Check,
  ArrowRight,
  TrendingUp,
  Target,
  Sparkles,
  Globe,
  Shield,
  Scale,
  Rocket,
  Eye,
  Newspaper,
  BrainCircuit,
} from 'lucide-react-native';
import { Text, Button } from '@/components/ui';
import { BrowMark } from '@/components/BrowLogo';
import { colors, radii, spacing } from '@/theme';
import { usePrefs } from '@/store/prefs';
import type { RiskTolerance, Segment } from '@/types';

const STEPS = 4;

const marketOptions: { value: Segment; label: string; sub: string; Icon: typeof TrendingUp }[] = [
  { value: 'India Equity', label: 'Indian Equity', sub: 'NSE/BSE stocks', Icon: TrendingUp },
  { value: 'India F&O', label: 'Indian F&O', sub: 'Futures & Options', Icon: Target },
  { value: 'Crypto', label: 'Crypto', sub: 'Spot + perps, live prices', Icon: Sparkles },
  { value: 'Global', label: 'Global', sub: 'US, Europe, Commodities', Icon: Globe },
];

const riskOptions: { value: RiskTolerance; sub: string; Icon: typeof Shield }[] = [
  { value: 'Conservative', sub: 'Capital preservation first', Icon: Shield },
  { value: 'Moderate', sub: 'Balanced risk & reward', Icon: Scale },
  { value: 'Aggressive', sub: 'Growth-oriented, higher risk', Icon: Rocket },
];

const tourItems = [
  { label: 'Ask BROW', sub: 'AI-powered market intelligence', Icon: BrainCircuit },
  { label: 'Watchlist', sub: 'Track instruments with live data', Icon: Eye },
  { label: 'Factor Ranking', sub: 'Multi-factor rankings & track record', Icon: Target },
  { label: 'News', sub: 'Breaking news with impact scores', Icon: Newspaper },
];

export default function Onboarding() {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const { markets, risk, toggleMarket, setRisk, completeOnboarding } = usePrefs();

  const next = () => (step < STEPS - 1 ? setStep(step + 1) : finish());
  const back = () => setStep(Math.max(0, step - 1));
  const finish = () => {
    completeOnboarding();
    router.replace('/(tabs)/home');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.xxl, paddingBottom: insets.bottom + spacing.xl }]}>
      {/* Progress */}
      <View style={styles.progress}>
        {Array.from({ length: STEPS }).map((_, i) => (
          <View key={i} style={[styles.progressSeg, i <= step && styles.progressActive]} />
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {step === 0 && <Welcome />}
        {step === 1 && <MarketsStep selected={markets} onToggle={toggleMarket} />}
        {step === 2 && <RiskStep selected={risk} onSelect={setRisk} />}
        {step === 3 && <TourStep />}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerRow}>
          {step > 0 && <Button label="Back" variant="outline" onPress={back} style={styles.backBtn} />}
          <Button
            label={step === 0 ? 'Get Started' : step === STEPS - 1 ? 'Enter BROW AI' : 'Continue'}
            onPress={next}
            icon={<ArrowRight size={18} color={colors.white} />}
            disabled={step === 1 && markets.length === 0}
            style={styles.nextBtn}
          />
        </View>
        {step === 0 && (
          <Pressable onPress={finish} style={styles.skip}>
            <Text variant="caption" color={colors.textMuted}>
              Skip setup
            </Text>
          </Pressable>
        )}
        <Text variant="micro" color={colors.textFaint} center style={styles.disclaimer}>
          BROW AI is a financial intelligence tool, not investment advice.
        </Text>
      </View>
    </View>
  );
}

function Welcome() {
  return (
    <View style={styles.centerStep}>
      <LinearGradient
        colors={[colors.gradientFrom, colors.gradientTo]}
        style={styles.welcomeIcon}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <BrowMark size={48} />
      </LinearGradient>
      <Text variant="display" center style={{ marginTop: spacing.xl }}>
        Welcome to BROW AI
      </Text>
      <Text variant="caption" color={colors.textSecondary} center style={styles.welcomeBody}>
        Your intelligent financial workspace for Indian equities, F&O, crypto, and global markets. BROW
        analyses, ranks, and tracks market opportunities — with a fully transparent outcome history.
      </Text>
      <View style={styles.checkList}>
        {[
          'AI-powered market intelligence & analysis',
          'Multi-factor factor rankings with transparent tracking',
          'Real-time notifications for breaking news & market opens',
          'No survivorship bias — losers preserved, history immutable',
        ].map((c) => (
          <View key={c} style={styles.checkRow}>
            <View style={styles.checkDot}>
              <Check size={12} color={colors.positive} strokeWidth={3} />
            </View>
            <Text variant="caption" color={colors.textSecondary} style={styles.flex}>
              {c}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function MarketsStep({ selected, onToggle }: { selected: Segment[]; onToggle: (m: Segment) => void }) {
  return (
    <View>
      <Text variant="h1" center>
        What do you trade?
      </Text>
      <Text variant="caption" color={colors.textSecondary} center style={styles.stepSub}>
        Select all that apply — BROW will prioritise these
      </Text>
      <View style={styles.optionList}>
        {marketOptions.map((o) => {
          const active = selected.includes(o.value);
          return (
            <Pressable key={o.value} onPress={() => onToggle(o.value)} style={[styles.option, active && styles.optionActive]}>
              <View style={styles.optionIcon}>
                <o.Icon size={20} color={active ? colors.brand : colors.textSecondary} />
              </View>
              <View style={styles.flex}>
                <Text variant="bodyStrong">{o.label}</Text>
                <Text variant="micro" color={colors.textMuted}>
                  {o.sub}
                </Text>
              </View>
              {active && (
                <View style={styles.tick}>
                  <Check size={14} color={colors.black} strokeWidth={3} />
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function RiskStep({ selected, onSelect }: { selected: RiskTolerance; onSelect: (r: RiskTolerance) => void }) {
  return (
    <View>
      <Text variant="h1" center>
        Risk tolerance?
      </Text>
      <Text variant="caption" color={colors.textSecondary} center style={styles.stepSub}>
        This helps BROW tailor recommendations
      </Text>
      <View style={styles.optionList}>
        {riskOptions.map((o) => {
          const active = selected === o.value;
          return (
            <Pressable key={o.value} onPress={() => onSelect(o.value)} style={[styles.option, active && styles.optionActive]}>
              <View style={styles.optionIcon}>
                <o.Icon size={20} color={active ? colors.brand : colors.textSecondary} />
              </View>
              <View style={styles.flex}>
                <Text variant="bodyStrong">{o.value}</Text>
                <Text variant="micro" color={colors.textMuted}>
                  {o.sub}
                </Text>
              </View>
              {active && (
                <View style={styles.tick}>
                  <Check size={14} color={colors.black} strokeWidth={3} />
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function TourStep() {
  return (
    <View>
      <Text variant="h1" center>
        Your workspace
      </Text>
      <Text variant="caption" color={colors.textSecondary} center style={styles.stepSub}>
        Quick tour of key features
      </Text>
      <View style={styles.tourGrid}>
        {tourItems.map((t) => (
          <View key={t.label} style={styles.tourCard}>
            <View style={styles.tourIcon}>
              <t.Icon size={20} color={colors.brand} />
            </View>
            <Text variant="captionStrong" center style={{ marginTop: spacing.sm }}>
              {t.label}
            </Text>
            <Text variant="micro" color={colors.textMuted} center style={{ marginTop: 2 }}>
              {t.sub}
            </Text>
          </View>
        ))}
      </View>
      <View style={styles.trustBox}>
        <Shield size={16} color={colors.positive} />
        <Text variant="micro" color={colors.textSecondary} style={styles.flex}>
          BROW AI never edits history. Outcome records are immutable and losers are preserved. No guaranteed
          profitability.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: spacing.xl },
  progress: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xxl },
  progressSeg: { flex: 1, height: 3, borderRadius: radii.pill, backgroundColor: colors.border },
  progressActive: { backgroundColor: colors.brand },
  scroll: { flexGrow: 1, justifyContent: 'center', paddingVertical: spacing.lg },
  centerStep: { alignItems: 'center' },
  welcomeIcon: {
    width: 88,
    height: 88,
    borderRadius: radii.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeBody: { marginTop: spacing.md, lineHeight: 20, maxWidth: 340 },
  checkList: { marginTop: spacing.xl, gap: spacing.md, alignSelf: 'stretch' },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  checkDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.positiveSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: { flex: 1 },
  stepSub: { marginTop: spacing.sm, marginBottom: spacing.xl },
  optionList: { gap: spacing.md },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionActive: { borderColor: colors.brand, backgroundColor: colors.brandSoft },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: colors.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tick: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tourGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  tourCard: {
    width: '47.5%',
    flexGrow: 1,
    padding: spacing.lg,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  tourIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: colors.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trustBox: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
    marginTop: spacing.xl,
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  footer: { gap: spacing.md },
  footerRow: { flexDirection: 'row', gap: spacing.md },
  backBtn: { flex: 0, minWidth: 100 },
  nextBtn: { flex: 1 },
  skip: { alignSelf: 'center' },
  disclaimer: { marginTop: spacing.xs },
});
