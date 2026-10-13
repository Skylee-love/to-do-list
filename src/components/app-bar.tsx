import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type AppBarProps = {
  title?: string;
};

/**
 * Blue top app bar with a hamburger mark and title, matching the design's "Menu" header.
 * The hamburger is decorative (navigation lives in the native tab bar).
 */
export function AppBar({ title = 'Menu' }: AppBarProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.primary, paddingTop: insets.top }]}>
      <View
        style={styles.hamburger}
        accessible={false}
        importantForAccessibility="no-hide-descendants">
        <View style={styles.bar} />
        <View style={styles.bar} />
        <View style={styles.bar} />
      </View>
      <ThemedText style={styles.title}>{title}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    minHeight: 56,
    gap: Spacing.three,
  },
  hamburger: {
    width: 24,
    gap: 4,
    justifyContent: 'center',
  },
  bar: {
    height: 2.5,
    width: 22,
    borderRadius: 2,
    backgroundColor: '#ffffff',
  },
  title: {
    color: '#ffffff',
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
  },
});
