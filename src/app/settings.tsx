import Constants from 'expo-constants';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { AppBar } from '@/components/app-bar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useTodos } from '@/context/todos-context';
import { useTheme } from '@/hooks/use-theme';

export default function SettingsScreen() {
  const theme = useTheme();
  const { todos, clearCompleted } = useTodos();

  const completedCount = todos.filter((todo) => todo.done).length;
  const canClear = completedCount > 0;

  return (
    <ThemedView style={styles.screen}>
      <AppBar title="Settings" />

      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type="subtitle" style={styles.heading}>
          Settings
        </ThemedText>

        <ThemedView type="backgroundElement" style={styles.card}>
          <View style={styles.row}>
            <ThemedText type="smallBold">Tasks</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {todos.length} total · {completedCount} completed
            </ThemedText>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={styles.row}>
            <ThemedText type="smallBold">Storage</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Saved on this device
            </ThemedText>
          </View>
        </ThemedView>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Clear completed tasks"
          accessibilityState={{ disabled: !canClear }}
          disabled={!canClear}
          onPress={clearCompleted}
          style={({ pressed }) => [
            styles.clearButton,
            {
              borderColor: theme.primary,
              opacity: !canClear ? 0.4 : pressed ? 0.7 : 1,
            },
          ]}>
          <ThemedText themeColor="primary" style={styles.clearText}>
            Clear completed tasks
          </ThemedText>
        </Pressable>

        <ThemedText type="small" themeColor="textSecondary" style={styles.version}>
          to-do-list v{Constants.expoConfig?.version ?? '1.0.0'}
        </ThemedText>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.six,
    gap: Spacing.four,
  },
  heading: {
    fontSize: 26,
    lineHeight: 34,
  },
  card: {
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    gap: Spacing.two,
    alignSelf: 'stretch',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.two,
    gap: Spacing.three,
  },
  divider: {
    height: 1,
    width: '100%',
  },
  clearButton: {
    borderWidth: 1.5,
    borderRadius: 6,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  clearText: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
  },
  version: {
    textAlign: 'center',
  },
});
