import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PaperTheme } from '../../types';

interface PaperBackgroundProps {
  theme: PaperTheme;
  isNight?: boolean;
}

export const PaperBackground: React.FC<PaperBackgroundProps> = ({ theme, isNight }) => {
  if (theme !== 'lined' && theme !== 'terracotta' && theme !== 'dotgrid') {
    return null;
  }

  const isLined = theme === 'lined' || theme === 'terracotta';
  const lineColor =
    theme === 'terracotta'
      ? isNight ? 'rgba(242, 182, 160, 0.12)' : 'rgba(227, 136, 104, 0.3)'
      : isNight ? 'rgba(255, 255, 255, 0.08)' : 'rgba(155, 191, 176, 0.35)';

  if (isLined) {
    // Generate notebook ruled lines every 32px across the paper
    const lineCount = 60;
    return (
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {Array.from({ length: lineCount }).map((_, i) => (
          <View
            key={`line-${i}`}
            style={{
              position: 'absolute',
              top: (i + 1) * 32,
              left: 14,
              right: 14,
              height: 1,
              backgroundColor: lineColor,
            }}
          />
        ))}
      </View>
    );
  }

  if (theme === 'dotgrid') {
    const dotColor = isNight ? 'rgba(255, 255, 255, 0.12)' : 'rgba(110, 98, 89, 0.25)';
    const rows = 50;
    const cols = 12;
    return (
      <View style={[StyleSheet.absoluteFill, styles.dotGridContainer]} pointerEvents="none">
        {Array.from({ length: rows }).map((_, r) => (
          <View key={`row-${r}`} style={styles.dotRow}>
            {Array.from({ length: cols }).map((_, c) => (
              <View
                key={`dot-${r}-${c}`}
                style={[styles.dot, { backgroundColor: dotColor }]}
              />
            ))}
          </View>
        ))}
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  dotGridContainer: {
    paddingTop: 54,
    paddingHorizontal: 16,
    justifyContent: 'flex-start',
    gap: 22,
  },
  dotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dot: {
    width: 2.2,
    height: 2.2,
    borderRadius: 1.1,
  },
});
