import { useEffect, useRef, useState } from 'react';
import { Animated, Platform, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, SnackbarColor, Spacing } from '@/constants/theme';

type SnackbarProps = {
  message: string;
  visible: boolean;
  /** Incremented on every add so each new task restarts the notification. */
  showCount?: number;
  onHide: () => void;
  /** How long the message stays on screen. */
  duration?: number;
};

/**
 * Transient "Task Added!" notification, styled like the design:
 * a full-width translucent dark bar flush with the bottom of the screen.
 * On web it overlays the tab bar; on native it sits flush on top of the
 * native tab bar (native bars cannot be overlaid).
 * Fades and slides in, then auto-hides after `duration` ms.
 */
export function Snackbar({
  message,
  visible,
  showCount = 0,
  onHide,
  duration = 2500,
}: SnackbarProps) {
  // useState (not useRef) so render never reads a ref's `.current`.
  const [opacity] = useState(() => new Animated.Value(0));
  const [translateY] = useState(() => new Animated.Value(12));
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }

    if (visible) {
      // Cancel any in-flight hide animation so a new add keeps the bar up.
      opacity.stopAnimation();
      translateY.stopAnimation();

      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 180, useNativeDriver: true }),
      ]).start();

      timer.current = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(({ finished }) => {
          if (finished) onHide();
        });
      }, duration);
    } else {
      opacity.setValue(0);
      translateY.setValue(12);
    }

    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
    };
  }, [visible, showCount, duration, onHide, opacity, translateY]);

  if (!visible) return null;

  return (
    <Animated.View
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      style={[styles.snackbar, { opacity, transform: [{ translateY }] }]}>
      <ThemedText style={styles.message}>{message}</ThemedText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  snackbar: {
    position: 'absolute',
    // Full-width, flush with the bottom edge (like the design's screenshot).
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: Spacing.four,
    backgroundColor: SnackbarColor,
    ...Platform.select({
      web: {
        // Overlay the web tab bar; minHeight matches its height exactly.
        bottom: 0,
        minHeight: BottomTabInset,
        justifyContent: 'center',
      },
      default: {
        // Native tab bars render above RN content, so sit flush on top of them.
        bottom: BottomTabInset,
        paddingVertical: Spacing.three,
      },
    }),
  },
  message: {
    color: '#ffffff',
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
  },
});
