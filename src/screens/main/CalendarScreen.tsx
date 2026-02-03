import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Calendar, DateData } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useTasksStore, useProjectsStore } from '../../store';
import { colors, spacing, borderRadius, shadows } from '../../constants/theme';
import { RootStackParamList, Task } from '../../types';
import TaskCard from '../../components/TaskCard';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function CalendarScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { tasks, fetchTasks } = useTasksStore();
  const { projects } = useProjectsStore();
  
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), 'yyyy-MM-dd')
  );

  useEffect(() => {
    fetchTasks();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  };

  // Build marked dates for calendar
  const markedDates = useMemo(() => {
    const dates: { [date: string]: any } = {};
    
    tasks.forEach(task => {
      if (task.due_date && !task.is_deleted) {
        const dateKey = task.due_date;
        if (!dates[dateKey]) {
          dates[dateKey] = {
            marked: true,
            dots: [],
          };
        }
        
        // Add dot for task type
        const dotColor = task.type === 'urgent' 
          ? colors.error 
          : task.type === 'important' 
            ? colors.warning 
            : colors.primary;
        
        if (dates[dateKey].dots.length < 3) {
          dates[dateKey].dots.push({ color: dotColor });
        }
      }
    });

    // Mark selected date
    if (dates[selectedDate]) {
      dates[selectedDate] = {
        ...dates[selectedDate],
        selected: true,
        selectedColor: colors.primary,
      };
    } else {
      dates[selectedDate] = {
        selected: true,
        selectedColor: colors.primary,
      };
    }

    return dates;
  }, [tasks, selectedDate]);

  // Get tasks for selected date
  const selectedDateTasks = useMemo(() => {
    return tasks.filter(task => 
      task.due_date === selectedDate && !task.is_deleted
    ).sort((a, b) => {
      // Sort by status (pending first, then completed)
      if (a.status === 'completed' && b.status !== 'completed') return 1;
      if (a.status !== 'completed' && b.status === 'completed') return -1;
      return 0;
    });
  }, [tasks, selectedDate]);

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

  const formatSelectedDate = () => {
    try {
      return format(parseISO(selectedDate), 'EEEE d MMMM yyyy', { locale: fr });
    } catch {
      return selectedDate;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Calendrier</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
      >
        {/* Calendar */}
        <View style={styles.calendarContainer}>
          <Calendar
            current={selectedDate}
            onDayPress={(day: DateData) => setSelectedDate(day.dateString)}
            markedDates={markedDates}
            markingType="multi-dot"
            theme={{
              backgroundColor: colors.white,
              calendarBackground: colors.white,
              textSectionTitleColor: colors.textSecondary,
              selectedDayBackgroundColor: colors.primary,
              selectedDayTextColor: colors.white,
              todayTextColor: colors.primary,
              dayTextColor: colors.black,
              textDisabledColor: colors.gray[300],
              arrowColor: colors.primary,
              monthTextColor: colors.black,
              textDayFontWeight: '400',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '600',
              textDayFontSize: 14,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 12,
            }}
            firstDay={1} // Start week on Monday
          />
        </View>

        {/* Selected Date Tasks */}
        <View style={styles.tasksSection}>
          <Text style={styles.dateTitle}>{formatSelectedDate()}</Text>
          <Text style={styles.taskCount}>
            {selectedDateTasks.length} tâche(s)
          </Text>

          {selectedDateTasks.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={48} color={colors.gray[300]} />
              <Text style={styles.emptyTitle}>Aucune tâche ce jour</Text>
              <Text style={styles.emptySubtitle}>
                Vous n'avez pas de tâches prévues pour cette date
              </Text>
            </View>
          ) : (
            selectedDateTasks.map((task) => (
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

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.black,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  calendarContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  tasksSection: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.md,
  },
  dateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.black,
    textTransform: 'capitalize',
  },
  taskCount: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
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
});
