import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Text, FAB, SegmentedButtons, IconButton, Menu } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useProjectsStore, useTasksStore } from '../../store';
import { colors, spacing, borderRadius, shadows } from '../../constants/theme';
import { RootStackParamList, Task } from '../../types';
import { calculateProgress } from '../../utils/taskUtils';
import { formatDate } from '../../utils/dateUtils';
import TaskCard from '../../components/TaskCard';
import ProgressBar from '../../components/ProgressBar';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'ProjectDetail'>;

export default function ProjectDetailScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { projectId } = route.params;

  const { projects, fetchProjects } = useProjectsStore();
  const { tasks, fetchTasks, toggleTaskComplete, deleteTask } = useTasksStore();

  const [refreshing, setRefreshing] = useState(false);
  const [taskFilter, setTaskFilter] = useState<'active' | 'completed'>('active');
  const [menuVisible, setMenuVisible] = useState<string | null>(null);

  const project = projects.find(p => p.id === projectId);
  const projectTasks = tasks.filter(t => t.project_id === projectId && !t.is_deleted);

  useEffect(() => {
    if (!project) {
      fetchProjects();
    }
    fetchTasks();
  }, [projectId]);

  useEffect(() => {
    if (project) {
      navigation.setOptions({
        headerTitle: project.name,
      });
    }
  }, [project]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchProjects(), fetchTasks()]);
    setRefreshing(false);
  };

  const handleDeleteTask = (task: Task) => {
    Alert.alert(
      'Supprimer la tâche',
      `Êtes-vous sûr de vouloir supprimer "${task.title}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTask(task.id);
            } catch (error: any) {
              Alert.alert('Erreur', error.message);
            }
          },
        },
      ]
    );
  };

  if (!project) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  const progress = calculateProgress(projectTasks);
  const filteredTasks = projectTasks.filter(task => {
    if (taskFilter === 'active') {
      return task.status !== 'completed';
    }
    return task.status === 'completed';
  });

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
      >
        {/* Project Header */}
        <View style={styles.projectHeader}>
          <View style={[styles.colorIndicator, { backgroundColor: project.color }]} />
          <View style={styles.projectInfo}>
            <Text style={styles.projectName}>{project.name}</Text>
            {project.description && (
              <Text style={styles.projectDescription}>{project.description}</Text>
            )}
            {project.end_date && (
              <View style={styles.dateRow}>
                <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
                <Text style={styles.dateText}>Échéance: {formatDate(project.end_date)}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Progress Section */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.sectionTitle}>Progression</Text>
            <Text style={styles.progressPercent}>{progress.percentage}%</Text>
          </View>
          <ProgressBar percentage={progress.percentage} />
          <View style={styles.progressStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{progress.total}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.primary }]}>{progress.completed}</Text>
              <Text style={styles.statLabel}>Terminées</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.warning }]}>{progress.total - progress.completed}</Text>
              <Text style={styles.statLabel}>En cours</Text>
            </View>
          </View>
        </View>

        {/* Tasks Section */}
        <View style={styles.tasksSection}>
          <View style={styles.tasksSectionHeader}>
            <Text style={styles.sectionTitle}>Tâches</Text>
            <SegmentedButtons
              value={taskFilter}
              onValueChange={(value) => setTaskFilter(value as 'active' | 'completed')}
              buttons={[
                { value: 'active', label: 'En cours' },
                { value: 'completed', label: 'Terminées' },
              ]}
              style={styles.segmentedButtons}
            />
          </View>

          {filteredTasks.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons 
                name={taskFilter === 'active' ? 'checkmark-done-circle' : 'list'} 
                size={48} 
                color={colors.gray[300]} 
              />
              <Text style={styles.emptyTitle}>
                {taskFilter === 'active' 
                  ? 'Aucune tâche en cours' 
                  : 'Aucune tâche terminée'}
              </Text>
            </View>
          ) : (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                projectName={project.name}
                projectColor={project.color}
                showCheckbox
                onPress={() => navigation.navigate('TaskDetail', { taskId: task.id })}
                onToggleComplete={() => toggleTaskComplete(task.id)}
                onLongPress={() => setMenuVisible(task.id)}
              />
            ))
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('CreateTask', { projectId })}
        color={colors.white}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  projectHeader: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  colorIndicator: {
    width: 4,
    borderRadius: 2,
    marginRight: spacing.md,
  },
  projectInfo: {
    flex: 1,
  },
  projectName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: spacing.xs,
  },
  projectDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  dateText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  progressSection: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.black,
  },
  progressPercent: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.black,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  tasksSection: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.md,
  },
  tasksSectionHeader: {
    marginBottom: spacing.md,
  },
  segmentedButtons: {
    marginTop: spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyTitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    backgroundColor: colors.primary,
  },
});
