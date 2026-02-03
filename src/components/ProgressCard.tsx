import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows } from '../constants/theme';

interface ProgressCardProps {
  title?: string;
  value?: number;
  total?: number;
  completed?: number;
  remaining?: number;
  percentage?: number;
  icon?: keyof typeof Ionicons.glyphMap;
  color?: string;
  subtitle?: string;
}

export default function ProgressCard({
  title,
  value,
  total,
  completed,
  remaining,
  percentage: passedPercentage,
  icon = 'checkmark-circle',
  color = colors.primary,
  subtitle,
}: ProgressCardProps) {
  // Support both (value/total) and (completed/total with remaining) patterns
  const actualValue = value ?? completed ?? 0;
  const actualTotal = total ?? (completed ?? 0) + (remaining ?? 0);
  const percentage = passedPercentage ?? (actualTotal > 0 ? Math.round((actualValue / actualTotal) * 100) : 0);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
          <Ionicons name={icon} size={20} color={color} />
        </View>
        <Text style={[styles.percentage, { color }]}>{percentage}%</Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Progress Bar */}
      <View style={styles.progressBarBg}>
        <View
          style={[
            styles.progressBarFill,
            {
              backgroundColor: color,
              width: `${percentage}%`,
            },
          ]}
        />
      </View>

      {/* Subtitle / Count */}
      <Text style={styles.subtitle}>
        {subtitle || `${value} sur ${total}`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    flex: 1,
    minWidth: 140,
    ...shadows.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentage: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.black,
    marginBottom: spacing.sm,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: colors.gray[200],
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
});
