import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { colors, spacing, borderRadius } from '../constants/theme';

interface ProgressBarProps {
  progress?: number; // 0-100
  percentage?: number; // alias for progress
  color?: string;
  height?: number;
  showLabel?: boolean;
  label?: string;
}

export default function ProgressBar({
  progress,
  percentage,
  color = colors.primary,
  height = 8,
  showLabel = false,
  label,
}: ProgressBarProps) {
  const actualProgress = progress ?? percentage ?? 0;
  const clampedProgress = Math.min(100, Math.max(0, actualProgress));

  return (
    <View style={styles.container}>
      {showLabel && (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label || 'Progression'}</Text>
          <Text style={[styles.percentage, { color }]}>{clampedProgress}%</Text>
        </View>
      )}

      <View style={[styles.barBackground, { height }]}>
        <View
          style={[
            styles.barFill,
            {
              backgroundColor: color,
              width: `${clampedProgress}%`,
              height,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  percentage: {
    fontSize: 12,
    fontWeight: '600',
  },
  barBackground: {
    backgroundColor: colors.gray[200],
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  barFill: {
    borderRadius: borderRadius.full,
  },
});
