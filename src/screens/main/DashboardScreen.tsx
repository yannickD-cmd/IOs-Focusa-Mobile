import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Text, FAB, SegmentedButtons } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore, useTasksStore, useProjectsStore } from '../../store';
import { colors, spacing, borderRadius, shadows } from '../../constants/theme';
import { RootStackParamList, Task } from '../../types';
import { getPriorityTasks, calculateDailyProgress, calculateWeeklyProgress } from '../../utils/taskUtils';
import TaskCard from '../../components/TaskCard';
import ProgressCard from '../../components/ProgressCard';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function DashboardScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuthStore();
  const { tasks, fetchTasks, isLoading: tasksLoading } = useTasksStore();
  const { projects, fetchProjects } = useProjectsStore();
  
  const [refreshing, setRefreshing] = useState(false);
  const [progressMode, setProgressMode] = useState<'day' | 'week'>('day');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([fetchTasks(), fetchProjects()]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const priorityTasks = getPriorityTasks(tasks);
  const progress = progressMode === 'day' 
    ? calculateDailyProgress(tasks) 
    : calculateWeeklyProgress(tasks);

  const getProjectName = (projectId: string | null): string => {
    if (!projectId) return 'Sans projet';
    const project = projects.find(p => p.id === projectId);
    return project?.name || 'Projet inconnu';
  };

  const getProjectColor = (projectId: string | null): string => {
    if (!projectId) return colors.gray[400];
    const project = projects.find(p => p.id === projectId);
    return project?.color || colors.gray[400];
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bonjour,</Text>
          <Text style={styles.userName}>
            {user?.name || user?.user_metadata?.full_name?.split(' ')[0] || 'Utilisateur'} 👋
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => navigation.navigate('Account')}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
      >
        {/* Progress Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <View style={[styles.iconBox, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="trending-up" size={18} color={colors.primary} />
              </View>
              <Text style={styles.sectionTitle}>Progression</Text>
            </View>
            <SegmentedButtons
              value={progressMode}
              onValueChange={(value) => setProgressMode(value as 'day' | 'week')}
              buttons={[
                { value: 'day', label: 'Jour' },
                { value: 'week', label: 'Semaine' },
              ]}
              style={styles.segmentedButtons}
            />
          </View>
          <ProgressCard 
            remaining={progress.remaining}
            completed={progress.completed}
            total={progress.total}
            percentage={progress.percentage}
          />
        </View>

        {/* Priority Tasks Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <View style={[styles.iconBox, { backgroundColor: colors.error + '20' }]}>
                <Ionicons name="alarm" size={18} color={colors.error} />
              </View>
              <Text style={styles.sectionTitle}>Tâches prioritaires</Text>
            </View>
          </View>

          {priorityTasks.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="checkmark-circle" size={48} color={colors.primary} />
              <Text style={styles.emptyTitle}>Aucune tâche prioritaire</Text>
              <Text style={styles.emptySubtitle}>
                Toutes vos tâches urgentes sont terminées !
              </Text>
            </View>
          ) : (
            priorityTasks.slice(0, 5).map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                projectName={getProjectName(task.project_id)}
                projectColor={getProjectColor(task.project_id)}
                onPress={() => navigation.navigate('TaskDetail', { taskId: task.id })}
              />
            ))
          )}
        </View>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <TouchableOpacity 
            style={styles.statCard}
            onPress={() => navigation.navigate('Main', { screen: 'ProjectsTab' } as any)}
          >
            <Ionicons name="folder" size={24} color={colors.secondary} />
            <Text style={styles.statNumber}>{projects.length}</Text>
            <Text style={styles.statLabel}>Projets</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.statCard}
            onPress={() => navigation.navigate('Main', { screen: 'CalendarTab' } as any)}
          >
            <Ionicons name="list" size={24} color={colors.primary} />
            <Text style={styles.statNumber}>{tasks.filter(t => !t.is_deleted && t.status !== 'completed').length}</Text>
            <Text style={styles.statLabel}>Tâches en cours</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('CreateTask', {})}
        color={colors.white}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  greeting: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.black,
  },
  profileButton: {
    padding: spacing.xs,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.black,
  },
  segmentedButtons: {
    maxWidth: 200,
  },
  emptyState: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    ...shadows.md,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.black,
    marginTop: spacing.md,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadows.md,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.black,
    marginTop: spacing.sm,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    backgroundColor: colors.primary,
  },
});
