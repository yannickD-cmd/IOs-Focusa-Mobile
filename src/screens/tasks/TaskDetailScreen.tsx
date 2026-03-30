import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Text, Button, Chip, IconButton, Menu } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTasksStore, useProjectsStore } from '../../store';
import { colors, spacing, borderRadius, shadows } from '../../constants/theme';
import { RootStackParamList } from '../../types';
import { formatDate, formatRelativeDate, isDateOverdue } from '../../utils/dateUtils';
import { TASK_TYPE_COLORS, TASK_TYPE_LABELS, TASK_STATUS_LABELS, TASK_STATUS_COLORS } from '../../constants/config';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'TaskDetail'>;

export default function TaskDetailScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { taskId } = route.params;

  const { tasks, toggleTaskComplete, deleteTask } = useTasksStore();
  const { projects } = useProjectsStore();

  const [menuVisible, setMenuVisible] = useState(false);

  const task = tasks.find(t => t.id === taskId);
  const project = task?.project_id ? projects.find(p => p.id === task.project_id) : null;

  const openMenu = useCallback(() => setMenuVisible(true), []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="dots-vertical"
          onPress={openMenu}
          style={{ backgroundColor: colors.gray[100], borderRadius: 20, width: 40, height: 40 }}
        />
      ),
    });
  }, [openMenu]);

  const handleDelete = () => {
    Alert.alert(
      'Supprimer la tâche',
      'Êtes-vous sûr de vouloir supprimer cette tâche ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTask(taskId);
              navigation.goBack();
            } catch (error: any) {
              Alert.alert('Erreur', error.message);
            }
          },
        },
      ]
    );
  };

  if (!task) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Tâche non trouvée</Text>
      </View>
    );
  }

  const isOverdue = task.due_date && isDateOverdue(task.due_date) && task.status !== 'completed';
  const typeColor = task.type ? TASK_TYPE_COLORS[task.type] : colors.gray[400];
  const statusColor = TASK_STATUS_COLORS[task.status];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Dropdown Menu */}
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={{ x: 1000, y: 0 }}
      >
        <Menu.Item
          onPress={() => {
            setMenuVisible(false);
            navigation.navigate('EditTask', { taskId });
          }}
          title="Modifier"
          leadingIcon="pencil"
        />
        <Menu.Item
          onPress={() => {
            setMenuVisible(false);
            handleDelete();
          }}
          title="Supprimer"
          leadingIcon="delete"
          titleStyle={{ color: colors.error }}
        />
      </Menu>

      {/* Status Badge */}
      <View style={styles.statusRow}>
        <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text style={[styles.statusText, { color: statusColor }]}>
            {TASK_STATUS_LABELS[task.status]}
          </Text>
        </View>
        {task.type && (
          <Chip
            style={[styles.priorityChip, { backgroundColor: typeColor + '20' }]}
            textStyle={{ color: typeColor, fontWeight: '600' }}
          >
            {TASK_TYPE_LABELS[task.type]}
          </Chip>
        )}
      </View>

      {/* Title */}
      <Text style={styles.title}>{task.title}</Text>

      {/* Project */}
      {project && (
        <View style={styles.infoRow}>
          <View style={[styles.projectDot, { backgroundColor: project.color }]} />
          <Text style={styles.projectName}>{project.name}</Text>
        </View>
      )}

      {/* Due Date */}
      {task.due_date && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="calendar-outline" size={20} color={colors.textSecondary} />
            <Text style={styles.sectionTitle}>Date d'échéance</Text>
          </View>
          <View style={styles.dateCard}>
            <Text style={[styles.dateText, isOverdue && styles.overdueText]}>
              {formatDate(task.due_date)}
            </Text>
            <Text style={[styles.relativeDateText, isOverdue && styles.overdueText]}>
              {formatRelativeDate(task.due_date)}
            </Text>
            {isOverdue && (
              <View style={styles.overdueBadge}>
                <Ionicons name="alert-circle" size={14} color={colors.error} />
                <Text style={styles.overdueLabel}>En retard</Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Description */}
      {task.description && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="document-text-outline" size={20} color={colors.textSecondary} />
            <Text style={styles.sectionTitle}>Description</Text>
          </View>
          <View style={styles.descriptionCard}>
            <Text style={styles.description}>{task.description}</Text>
          </View>
        </View>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          mode="contained"
          onPress={() => toggleTaskComplete(taskId)}
          icon={task.status === 'completed' ? 'undo' : 'check'}
          style={[
            styles.actionButton,
            { backgroundColor: task.status === 'completed' ? colors.warning : colors.primary },
          ]}
          contentStyle={styles.actionButtonContent}
        >
          {task.status === 'completed' ? 'Marquer comme non terminée' : 'Marquer comme terminée'}
        </Button>

        <Button
          mode="outlined"
          onPress={() => navigation.navigate('EditTask', { taskId })}
          icon="pencil"
          style={styles.editButton}
          contentStyle={styles.actionButtonContent}
        >
          Modifier
        </Button>
      </View>

      {/* Metadata */}
      <View style={styles.metadata}>
        <Text style={styles.metadataText}>
          Créée le {formatDate(task.created_at)}
        </Text>
        {task.updated_at !== task.created_at && (
          <Text style={styles.metadataText}>
            Modifiée le {formatDate(task.updated_at)}
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  priorityChip: {
    height: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  projectDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  projectName: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  dateCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.sm,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.black,
  },
  relativeDateText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  overdueText: {
    color: colors.error,
  },
  overdueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  overdueLabel: {
    fontSize: 12,
    color: colors.error,
    fontWeight: '500',
  },
  descriptionCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.sm,
  },
  description: {
    fontSize: 15,
    color: colors.black,
    lineHeight: 22,
  },
  actions: {
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  actionButton: {
    borderRadius: borderRadius.md,
  },
  actionButtonContent: {
    paddingVertical: spacing.sm,
  },
  editButton: {
    borderColor: colors.primary,
    borderRadius: borderRadius.md,
  },
  metadata: {
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  metadataText: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
});
