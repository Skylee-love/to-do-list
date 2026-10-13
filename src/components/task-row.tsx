import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type TaskRowProps = {
  text: string;
  done: boolean;
  onToggle: () => void;
  onRemove: () => void;
};

/**
 * A single to-do row: custom checkbox + task label.
 * Tap toggles completion; press and hold removes the task.
 */
export function TaskRow({ text, done, onToggle, onRemove }: TaskRowProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: done }}
      accessibilityLabel={text}
      accessibilityHint="Activates to mark this task done. Press and hold to delete."
      onPress={onToggle}
      onLongPress={onRemove}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View
        style={[
          styles.checkbox,
          {
            borderColor: done ? theme.primary : theme.border,
            backgroundColor: done ? theme.primary : 'transparent',
          },
        ]}>
        {done && <ThemedText style={styles.checkmark}>✓</ThemedText>}
      </View>
      <ThemedText
        style={[
          styles.label,
          done && styles.labelDone,
          done && { color: theme.textSecondary },
        ]}
        numberOfLines={3}>
        {text}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.one,
    borderRadius: Spacing.two,
    minHeight: 44,
  },
  pressed: {
    opacity: 0.6,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '700',
  },
  label: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
  },
  labelDone: {
    textDecorationLine: 'line-through',
  },
});
