import { useCallback, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

import { AddTaskForm } from '@/components/add-task-form';
import { AppBar } from '@/components/app-bar';
import { Snackbar } from '@/components/snackbar';
import { TaskRow } from '@/components/task-row';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useTodos } from '@/context/todos-context';

export default function ListScreen() {
  const { todos, addTodo, toggleTodo, removeTodo } = useTodos();
  const [snackVisible, setSnackVisible] = useState(false);
  const [snackCount, setSnackCount] = useState(0);

  const handleAdd = useCallback(
    (text: string) => {
      addTodo(text);
      // Bump the count so the notification re-triggers on every add.
      setSnackCount((count) => count + 1);
      setSnackVisible(true);
    },
    [addTodo],
  );

  const hideSnack = useCallback(() => setSnackVisible(false), []);

  return (
    <ThemedView style={styles.screen}>
      <AppBar />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag">
          <ThemedText type="subtitle" style={styles.heading}>
            Add an item
          </ThemedText>

          <AddTaskForm onSubmit={handleAdd} />

          <View style={styles.list}>
            {todos.length === 0 ? (
              <ThemedText themeColor="textSecondary" style={styles.empty}>
                No tasks yet — type one above and tap SAVE.
              </ThemedText>
            ) : (
              todos.map((todo) => (
                <TaskRow
                  key={todo.id}
                  text={todo.text}
                  done={todo.done}
                  onToggle={() => toggleTodo(todo.id)}
                  onRemove={() => removeTodo(todo.id)}
                />
              ))
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Snackbar
        message="Task Added!"
        visible={snackVisible}
        showCount={snackCount}
        onHide={hideSnack}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  flex: {
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
  list: {
    alignSelf: 'stretch',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  empty: {
    paddingVertical: Spacing.three,
  },
});
