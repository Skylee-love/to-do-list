import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={styles.slot} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="home" href="/" asChild>
            <TabButton icon="☰">List</TabButton>
          </TabTrigger>
          <TabTrigger name="settings" href="/settings" asChild>
            <TabButton icon="⚙︎">Settings</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

type TabButtonProps = TabTriggerSlotProps & {
  icon?: string;
};

export function TabButton({ children, icon, isFocused, ...props }: TabButtonProps) {
  const theme = useTheme();

  return (
    <Pressable
      {...props}
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
      style={({ pressed }) => [
        styles.tabButton,
        isFocused && { backgroundColor: theme.backgroundElement },
        pressed && styles.pressed,
      ]}>
      {icon ? (
        <ThemedText
          themeColor={isFocused ? 'primary' : 'textSecondary'}
          style={styles.tabIcon}>
          {icon}
        </ThemedText>
      ) : null}
      <ThemedText
        type="small"
        themeColor={isFocused ? 'primary' : 'textSecondary'}
        style={styles.tabLabel}>
        {children}
      </ThemedText>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  const theme = useTheme();

  return (
    <ThemedView
      {...props}
      style={[styles.tabList, { borderTopColor: theme.border }, props.style]}>
      {props.children}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  slot: {
    height: '100%',
  },
  tabList: {
    // Phone-style bottom tab bar (replaces the starter's top overlay bar).
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    paddingTop: Spacing.two,
    paddingHorizontal: Spacing.two,
    // Total height is 72 — keep BottomTabInset in sync in constants/theme.ts.
    paddingBottom: Spacing.three,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  tabButton: {
    flex: 1,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.two,
  },
  pressed: {
    opacity: 0.7,
  },
  tabIcon: {
    fontSize: 18,
    lineHeight: 22,
  },
  tabLabel: {
    fontSize: 12,
    lineHeight: 16,
  },
});
