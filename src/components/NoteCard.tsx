import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Note } from '../types';
import { colors, spacing, borderRadius, shadows } from '../constants/theme';
import { formatDate, formatRelativeDate } from '../utils/dateUtils';

interface NoteCardProps {
  note: Note;
  onPress: () => void;
  onLongPress?: () => void;
  compact?: boolean;
}

export default function NoteCard({ note, onPress, onLongPress, compact = false }: NoteCardProps) {
  // Get a preview of the content (strip markdown/html-like syntax)
  const getPreview = (content: string | null) => {
    if (!content) return '';
    // Remove markdown headers, links, etc.
    return content
      .replace(/[#*_~`]/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .trim();
  };

  const preview = getPreview(note.content);

  return (
    <TouchableOpacity
      style={[styles.container, compact && styles.containerCompact]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons
              name="document-text"
              size={18}
              color={colors.warning}
            />
          </View>
          <Text style={styles.date}>
            {formatRelativeDate(note.updated_at)}
          </Text>
        </View>

        {/* Title */}
        <Text style={styles.title} numberOfLines={compact ? 1 : 2}>
          {note.title}
        </Text>

        {/* Preview */}
        {!compact && preview && (
          <Text style={styles.preview} numberOfLines={2}>
            {preview}
          </Text>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          {note.project && (
            <View style={styles.projectBadge}>
              <View
                style={[
                  styles.projectDot,
                  { backgroundColor: note.project.color },
                ]}
              />
              <Text style={styles.projectName} numberOfLines={1}>
                {note.project.name}
              </Text>
            </View>
          )}

          <Ionicons
            name="chevron-forward"
            size={16}
            color={colors.gray[400]}
          />
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
    ...shadows.sm,
  },
  containerCompact: {
    marginBottom: spacing.sm,
  },
  content: {
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.warning + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: colors.textMuted,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.black,
    marginBottom: spacing.xs,
  },
  preview: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  projectBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
  },
  projectDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  projectName: {
    fontSize: 12,
    color: colors.textSecondary,
    flex: 1,
  },
});
