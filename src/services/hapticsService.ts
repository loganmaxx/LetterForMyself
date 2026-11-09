import * as Haptics from 'expo-haptics';

export const HapticsService = {
  light() {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
  },
  medium() {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
  },
  success() {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}
  },
  selection() {
    try {
      Haptics.selectionAsync();
    } catch {}
  },
};
