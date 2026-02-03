import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Checkbox, IconButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Task, Project } from '../types';
import { colors, spacing, borderRadius, shadows } from '../constants/theme';
import { formatRelativeDate, isDateOverdue } from '../utils/dateUtils';
import { TASK_TYPE_COLORS, TASK_STATUS_COLORS } from '../constants/config';

interface TaskCardProps {
  task: Task;
  project?: Project | null;
  projectName?: string;
  projectColor?: string;
  onPress: () => void;
  onToggleComplete?: () => void;
  onLongPress?: () => void;
  showProject?: boolean;
  showCheckbox?: boolean;
  compact?: boolean;
}

export default function TaskCard({
  task,
  project,
  projectName,
  projectColor,
  onPress,
  onToggleComplete,
  onLongPress,
  showProject = true,
  showCheckbox = true,
  compact = false,
}: TaskCardProps) {
  const isCompleted = task.status === 'completed';
  const isOverdue = task.due_date && isDateOverdue(task.due_date) && !isCompleted;
  const typeColor = task.type ? TASK_TYPE_COLORS[task.type] : colors.gray[400];
  const statusColor = TASK_STATUS_COLORS[task.status];

  return (
    <TouchableOpacity
      style={[styles.container, compact && styles.containerCompact]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      {/* Priority Indicator */}
      <View style={[styles.priorityBar, { backgroundColor: typeColor }]} />

      <View style={styles.content}>
        <View style={styles.header}>
          {/* Checkbox */}
          {showCheckbox && (
            <Checkbox
              status={isCompleted ? 'checked' : 'unchecked'}
              onPress={onToggleComplete}
              color={colors.primary}
            />
          )}

          {/* Title & Info */}
          <View style={styles.info}>
            <Text
              style={[
                styles.title,
                isCompleted && styles.titleCompleted,
              ]}
              numberOfLines={2}
            >
              {task.title}
            </Text>

            <View style={styles.metaRow}>
              {/* Project */}
              {showProject && (project || projectName) && (
                <View style={styles.projectBadge}>
                  <View
                    style={[styles.projectDot, { backgroundColor: project?.color || projectColor || colors.gray[400] }]}
                  />
                  <Text style={styles.projectName} numberOfLines={1}>
                    {project?.name || projectName}
                  </Text>
                </View>
              )}

              {/* Due Date */}
              {task.due_date && (
                <View style={styles.dueDateBadge}>
                  <Ionicons
                    name="calendar-outline"
                    size={12}
                    color={isOverdue ? colors.error : colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.dueDate,
                      isOverdue && styles.dueDateOverdue,
                    ]}
                  >
                    {formatRelativeDate(task.due_date)}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Arrow */}
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.gray[400]}
          />
        </View>

        {/* Description Preview */}
        {!compact && task.description && (
          <Text style={styles.description} numberOfLines={1}>
            {task.description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    flexDirection: 'row',
    overflow: 'hidden',
    ...shadows.sm,
  },
  containerCompact: {
    marginBottom: spacing.sm,
  },
  priorityBar: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginLeft: spacing.xs,
    marginRight: spacing.sm,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.black,
    marginBottom: spacing.xs,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  projectBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  projectDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  projectName: {
    fontSize: 12,
    color: colors.textSecondary,
    maxWidth: 100,
  },
  dueDateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  dueDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  dueDateOverdue: {
    color: colors.error,
    fontWeight: '500',
  },
  description: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: spacing.sm,
    marginLeft: 40,
  },
});
