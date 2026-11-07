import { useMemo, useState } from 'react';
import { View, StyleSheet, Pressable, Modal, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Clock, Plus, X, Bell, CheckCircle2, Sparkles } from 'lucide-react-native';
import { ToolScreen } from '@/components/ToolScreen';
import { Text, Card, Badge, Button, SegmentedTabs } from '@/components/ui';
import { colors, radii, spacing } from '@/theme';
import { scheduledTasks } from '@/data/portfolio';
import type { ScheduledTask } from '@/types';

const tabs = ['Active', 'Triggered', 'All'];

export default function ScheduledTasks() {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState('Active');
  const [tasks, setTasks] = useState<ScheduledTask[]>(scheduledTasks);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [condition, setCondition] = useState('');

  const filtered = useMemo(
    () => (tab === 'All' ? tasks : tasks.filter((t) => t.status === tab)),
    [tasks, tab],
  );
  const activeCount = tasks.filter((t) => t.status === 'Active').length;
  const triggeredCount = tasks.filter((t) => t.status === 'Triggered').length;

  const create = () => {
    if (!title.trim() || !condition.trim()) return;
    setTasks((prev) => [
      { id: `new${prev.length}`, title: title.trim(), condition: condition.trim(), target: '—', status: 'Active', createdAgo: 'now' },
      ...prev,
    ]);
    setTitle('');
    setCondition('');
    setCreating(false);
  };

  return (
    <ToolScreen
      title="Scheduled Tasks"
      subtitle={`${activeCount} active · ${triggeredCount} triggered`}
      icon={<Clock size={18} color={colors.brand} />}
      pro
      right={
        <Pressable style={styles.newBtn} onPress={() => setCreating(true)}>
          <Plus size={14} color={colors.white} />
          <Text variant="micro" color={colors.white} style={styles.bold}>
            New
          </Text>
        </Pressable>
      }
    >
      <Card style={styles.info}>
        <Sparkles size={14} color={colors.brand} />
        <Text variant="micro" color={colors.textSecondary} style={styles.flex}>
          BROW monitors the market 24/7 and triggers your tasks automatically. Max 4 active tasks. Tasks expire
          after 30 days.
        </Text>
      </Card>

      <SegmentedTabs options={tabs} value={tab} onChange={setTab} scroll={false} />

      {filtered.length === 0 ? (
        <Card>
          <Text variant="caption" color={colors.textSecondary} center>
            No {tab.toLowerCase()} tasks.
          </Text>
        </Card>
      ) : (
        <View style={styles.list}>
          {filtered.map((t) => (
            <Card key={t.id} style={styles.taskCard}>
              <View style={styles.taskIcon}>
                {t.status === 'Triggered' ? (
                  <CheckCircle2 size={16} color={colors.positive} />
                ) : (
                  <Bell size={16} color={colors.brand} />
                )}
              </View>
              <View style={styles.flex}>
                <View style={styles.taskHead}>
                  <Text variant="captionStrong">{t.title}</Text>
                  <Badge
                    label={t.status}
                    tone={t.status === 'Triggered' ? 'positive' : 'brand'}
                    small
                  />
                </View>
                <Text variant="micro" color={colors.textMuted} style={{ marginTop: 2 }}>
                  {t.condition}
                </Text>
                <Text variant="micro" color={colors.textFaint} style={{ marginTop: 4 }}>
                  {t.target} · {t.createdAgo}
                </Text>
              </View>
            </Card>
          ))}
        </View>
      )}

      {/* Create modal */}
      <Modal visible={creating} transparent animationType="slide" onRequestClose={() => setCreating(false)}>
        <View style={styles.backdrop}>
          <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.lg }]}>
            <View style={styles.sheetHead}>
              <Text variant="h2">New Task</Text>
              <Pressable onPress={() => setCreating(false)} style={styles.closeBtn}>
                <X size={18} color={colors.textSecondary} />
              </Pressable>
            </View>
            <Text variant="micro" color={colors.textMuted} style={styles.fieldLabel}>
              TASK NAME
            </Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. NIFTY breakout monitor"
              placeholderTextColor={colors.textMuted}
              style={styles.field}
            />
            <Text variant="micro" color={colors.textMuted} style={styles.fieldLabel}>
              CONDITION
            </Text>
            <TextInput
              value={condition}
              onChangeText={setCondition}
              placeholder="e.g. Price closes above 24,000"
              placeholderTextColor={colors.textMuted}
              style={styles.field}
            />
            <Button label="Create Task" onPress={create} fullWidth style={{ marginTop: spacing.lg }} disabled={!title.trim() || !condition.trim()} />
          </View>
        </View>
      </Modal>
    </ToolScreen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  bold: { fontWeight: '700' },
  newBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: spacing.md, paddingVertical: 7, borderRadius: radii.pill, backgroundColor: colors.brandDim },
  info: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.bgElevated },
  list: { gap: spacing.md },
  taskCard: { flexDirection: 'row', gap: spacing.md },
  taskIcon: { width: 36, height: 36, borderRadius: radii.sm, backgroundColor: colors.brandSoft, alignItems: 'center', justifyContent: 'center' },
  taskHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backdrop: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.bgElevated, borderTopLeftRadius: radii.xl, borderTopRightRadius: radii.xl, borderWidth: 1, borderColor: colors.border, padding: spacing.lg },
  sheetHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
  closeBtn: { width: 34, height: 34, borderRadius: radii.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  fieldLabel: { letterSpacing: 0.6, fontWeight: '700', marginBottom: 6, marginTop: spacing.md },
  field: { backgroundColor: colors.surface, borderRadius: radii.md, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md, paddingVertical: spacing.md, color: colors.text, fontSize: 14 },
});
