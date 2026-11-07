import { useRef, useState, useEffect, type ComponentRef } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Sparkles,
  ArrowUp,
  Plus,
  Activity,
  Layers,
  BarChart3,
  GitCompare,
  Globe,
  Landmark,
  RotateCcw,
} from 'lucide-react-native';
import { AppHeader } from '@/components/AppHeader';
import { Text, Card } from '@/components/ui';
import { BrowMark } from '@/components/BrowLogo';
import { colors, radii, spacing } from '@/theme';
import { quantEngines, suggestedPrompts } from '@/data/engines';
import { usePrefs } from '@/store/prefs';
import { useChat } from '@/store/chat';

const iconMap: Record<string, typeof Activity> = {
  activity: Activity,
  layers: Layers,
  'bar-chart-3': BarChart3,
  'git-compare': GitCompare,
  globe: Globe,
  landmark: Landmark,
};

export default function Ask() {
  const insets = useSafeAreaInsets();
  const name = usePrefs((s) => s.name);
  const { messages, thinking, send, reset } = useChat();
  const [text, setText] = useState('');
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);

  useEffect(() => {
    if (messages.length) setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 120);
  }, [messages]);

  const submit = (preset?: string) => {
    const value = preset ?? text;
    if (!value.trim()) return;
    send(value);
    setText('');
  };

  const hasChat = messages.length > 0;

  return (
    <View style={styles.root}>
      <AppHeader />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={insets.top + 44}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={[styles.scroll, !hasChat && styles.scrollCentered]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {!hasChat ? (
            <>
              <View style={styles.hero}>
                <View style={styles.liveTag}>
                  <Sparkles size={12} color={colors.brand} />
                  <Text variant="micro" color={colors.brand} style={styles.bold}>
                    BROW AI · Live Market Intelligence
                  </Text>
                </View>
                <Text variant="display" center style={styles.heroTitle}>
                  <Text variant="display" color={colors.brand}>
                    Hi {name},
                  </Text>{' '}
                  what's on your mind?
                </Text>
                <Text variant="caption" color={colors.textMuted} center style={styles.heroSub}>
                  BROW can make mistakes — verify important market data before trading.
                </Text>
              </View>

              <View style={styles.enginesHead}>
                <Sparkles size={13} color={colors.brand} />
                <Text variant="label" color={colors.textSecondary}>
                  AUTONOMOUS QUANTITATIVE ENGINES
                </Text>
              </View>
              <View style={styles.engineGrid}>
                {quantEngines.map((e) => {
                  const Icon = iconMap[e.icon] ?? Activity;
                  return (
                    <Pressable
                      key={e.id}
                      style={styles.engineCard}
                      onPress={() => submit(`Run ${e.title} synthesis`)}
                    >
                      <View style={styles.engineTop}>
                        <View style={styles.engineIcon}>
                          <Icon size={16} color={colors.brand} />
                        </View>
                        <Text variant="micro" color={colors.textMuted} style={styles.engineTag}>
                          {e.tag}
                        </Text>
                      </View>
                      <Text variant="captionStrong" style={{ marginTop: spacing.sm }} numberOfLines={2}>
                        {e.title}
                      </Text>
                      <Text variant="micro" color={colors.textMuted} style={{ marginTop: 4 }} numberOfLines={2}>
                        {e.subtitle}
                      </Text>
                      <Text variant="micro" color={colors.brand} style={styles.runLink}>
                        Run live synthesis →
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <View style={styles.suggestions}>
                {suggestedPrompts.map((p) => (
                  <Pressable key={p} style={styles.suggestChip} onPress={() => submit(p)}>
                    <Text variant="micro" color={colors.textSecondary}>
                      {p}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </>
          ) : (
            <View style={styles.chatList}>
              {messages.map((m) =>
                m.role === 'user' ? (
                  <View key={m.id} style={styles.userBubble}>
                    <Text variant="caption" color={colors.white}>
                      {m.text}
                    </Text>
                  </View>
                ) : (
                  <View key={m.id} style={styles.assistantRow}>
                    <LinearGradient
                      colors={[colors.gradientFrom, colors.gradientTo]}
                      style={styles.assistantAvatar}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <BrowMark size={16} />
                    </LinearGradient>
                    <Card style={styles.assistantBubble}>
                      {m.pending ? (
                        <View style={styles.thinkingRow}>
                          <Text variant="caption" color={colors.textMuted}>
                            BROW is analysing
                          </Text>
                          <View style={styles.dots}>
                            <View style={styles.dot} />
                            <View style={styles.dot} />
                            <View style={styles.dot} />
                          </View>
                        </View>
                      ) : (
                        <Text variant="caption" color={colors.text} style={styles.assistantText}>
                          {m.text}
                        </Text>
                      )}
                    </Card>
                  </View>
                ),
              )}
            </View>
          )}
        </ScrollView>

        {/* Composer */}
        <View style={[styles.composer, { paddingBottom: insets.bottom + spacing.sm }]}>
          {hasChat && (
            <Pressable style={styles.resetBtn} onPress={reset}>
              <RotateCcw size={13} color={colors.textMuted} />
              <Text variant="micro" color={colors.textMuted}>
                New chat
              </Text>
            </Pressable>
          )}
          <View style={styles.inputBar}>
            <View style={styles.plusBtn}>
              <Plus size={18} color={colors.textSecondary} />
            </View>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Ask BROW anything…"
              placeholderTextColor={colors.textMuted}
              style={styles.composerInput}
              multiline
              onSubmitEditing={() => submit()}
            />
            <Pressable
              style={[styles.sendBtn, (!text.trim() || thinking) && styles.sendDisabled]}
              onPress={() => submit()}
              disabled={!text.trim() || thinking}
            >
              <LinearGradient
                colors={[colors.gradientFrom, colors.gradientTo]}
                style={styles.sendInner}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <ArrowUp size={18} color={colors.white} />
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  bold: { fontWeight: '700' },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xl, gap: spacing.lg },
  scrollCentered: { flexGrow: 1, justifyContent: 'center' },
  hero: { alignItems: 'center', gap: spacing.md },
  liveTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radii.pill,
    backgroundColor: colors.brandSoft,
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.25)',
  },
  heroTitle: { lineHeight: 36 },
  heroSub: { maxWidth: 320 },
  enginesHead: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.sm },
  engineGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  engineCard: {
    width: '47.5%',
    flexGrow: 1,
    padding: spacing.md,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  engineTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  engineIcon: { width: 34, height: 34, borderRadius: radii.md, backgroundColor: colors.brandSoft, alignItems: 'center', justifyContent: 'center' },
  engineTag: { letterSpacing: 0.3, fontSize: 8.5 },
  runLink: { marginTop: spacing.sm, fontWeight: '700' },
  suggestions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, justifyContent: 'center' },
  suggestChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radii.pill, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  chatList: { gap: spacing.lg },
  userBubble: { alignSelf: 'flex-end', maxWidth: '85%', backgroundColor: colors.brandDim, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radii.lg, borderBottomRightRadius: 4 },
  assistantRow: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start' },
  assistantAvatar: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  assistantBubble: { flex: 1, borderBottomLeftRadius: 4 },
  assistantText: { lineHeight: 20 },
  thinkingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  dots: { flexDirection: 'row', gap: 3 },
  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.brand },
  composer: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.bgElevated, gap: spacing.sm },
  resetBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'center' },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm, backgroundColor: colors.surface, borderRadius: radii.xl, borderWidth: 1, borderColor: colors.border, padding: spacing.sm },
  plusBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.bgElevated, alignItems: 'center', justifyContent: 'center' },
  composerInput: { flex: 1, color: colors.text, fontSize: 15, maxHeight: 110, paddingVertical: spacing.sm },
  sendBtn: { borderRadius: 17 },
  sendDisabled: { opacity: 0.4 },
  sendInner: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
});
