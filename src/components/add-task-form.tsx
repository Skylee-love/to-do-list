import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type AddTaskFormProps = {
  onSubmit: (text: string) => void;
};

/**
 * Outlined text field with a floating label plus a blue SAVE button.
 * Pressing SAVE (or the keyboard's return key) submits the trimmed text and clears the field.
 */
export function AddTaskForm({ onSubmit }: AddTaskFormProps) {
  const theme = useTheme();
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);

  const floated = focused || value.length > 0;
  const canSave = value.trim().length > 0;

  const submit = () => {
    const text = value.trim();
    if (!text) return;
    onSubmit(text);
    setValue('');
  };

  return (
    <View style={styles.row}>
      <View
        style={[
          styles.field,
          {
            borderColor: focused ? theme.primary : theme.border,
            backgroundColor: theme.background,
          },
        ]}>
        {floated && (
          <ThemedText
            themeColor="primary"
            style={[styles.label, { backgroundColor: theme.background }]}>
            Enter a task
          </ThemedText>
        )}
        <TextInput
          accessibilityLabel="Enter a task"
          value={value}
          onChangeText={setValue}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onSubmitEditing={submit}
          returnKeyType="done"
          blurOnSubmit={false}
          placeholder={floated ? 'Mow the lawn' : 'Enter a task'}
          placeholderTextColor={theme.textSecondary}
          style={[styles.input, { color: theme.text }]}
        />
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Save task"
        disabled={!canSave}
        onPress={submit}
        style={({ pressed }) => [
          styles.saveButton,
          {
            backgroundColor: theme.primary,
            opacity: !canSave ? 0.4 : pressed ? 0.8 : 1,
          },
        ]}>
        <ThemedText style={styles.saveText}>SAVE</ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    alignSelf: 'stretch',
  },
  field: {
    flex: 1,
    height: 52,
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
    borderWidth: 1.5,
    borderRadius: 6,
  },
  label: {
    position: 'absolute',
    top: -9,
    left: 10,
    paddingHorizontal: Spacing.one,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
  },
  input: {
    fontSize: 16,
    lineHeight: 22,
    paddingVertical: 0,
    textAlignVertical: 'center',
  },
  saveButton: {
    height: 52,
    paddingHorizontal: Spacing.four,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveText: {
    color: '#ffffff',
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
