import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Menu } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Project } from '../types';
import { colors, spacing, borderRadius, shadows } from '../constants/theme';

interface ProjectCardProps {
  project: Project;
  taskCount: number;
  completedCount: number;
  onPress: () => void;
  onLongPress?: () => void;
  menuVisible?: boolean;
  onDismissMenu?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function ProjectCard({
  project,
  taskCount,
  completedCount,
  onPress,
  onLongPress,
  menuVisible = false,
  onDismissMenu,
  onEdit,
  onDelete,
}: ProjectCardProps) {
  const progress = taskCount > 0 ? Math.round((completedCount / taskCount) * 100) : 0;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      {/* Color Bar */}
      <View style={[styles.colorBar, { backgroundColor: project.color }]} />

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <View style={[styles.iconBg, { backgroundColor: project.color + '20' }]}>
              <View style={[styles.iconDot, { backgroundColor: project.color }]} />
            </View>
          </View>

          <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
        </View>

        {/* Project Name */}
        <Text style={styles.name} numberOfLines={2}>
          {project.name}
        </Text>

        {/* Description */}
        {project.description && (
          <Text style={styles.description} numberOfLines={2}>
            {project.description}
          </Text>
        )}

        {/* Progress */}
        <View style={styles.progressContainer}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressLabel}>
              {completedCount}/{taskCount} tâches
            </Text>
            <Text style={[styles.progressPercent, { color: project.color }]}>
              {progress}%
            </Text>
          </View>

          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                {
                  backgroundColor: project.color,
                  width: `${progress}%`,
                },
              ]}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
    ...shadows.sm,
  },
  colorBar: {
    height: 4,
    width: '100%',
  },
  content: {
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  iconContainer: {
    marginRight: spacing.sm,
  },
  iconBg: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  progressContainer: {
    marginTop: spacing.sm,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  progressLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  progressPercent: {
    fontSize: 12,
    fontWeight: '600',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: colors.gray[200],
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
});
