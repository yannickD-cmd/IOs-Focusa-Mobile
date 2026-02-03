import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Text, TextInput, Button, SegmentedButtons, Chip } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useTasksStore, useProjectsStore } from '../../store';
import { colors, spacing, borderRadius } from '../../constants/theme';
import { RootStackParamList, TaskType, TaskStatus } from '../../types';
import { TASK_TYPES, TASK_STATUSES, TASK_TYPE_COLORS } from '../../constants/config';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'CreateTask'>;

export default function CreateTaskScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { projectId: initialProjectId } = route.params || {};

  const { createTask, isLoading } = useTasksStore();
  const { projects } = useProjectsStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(initialProjectId || null);
  const [taskType, setTaskType] = useState<TaskType>('normal');
  const [status, setStatus] = useState<TaskStatus>('pending');

  const handleCreate = async () => {
    if (!title.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un titre pour la tâche');
      return;
    }

    if (!selectedProjectId) {
      Alert.alert('Erreur', 'Veuillez sélectionner un projet');
      return;
    }

    try {
      await createTask(selectedProjectId, {
        title: title.trim(),
        description: description.trim() || null,
        due_date: dueDate ? dueDate.toISOString().split('T')[0] : null,
        type: taskType,
        status,
      });
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Une erreur est survenue');
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Title */}
        <View style={styles.field}>
          <Text style={styles.label}>Titre *</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            mode="outlined"
            placeholder="Nom de la tâche"
            style={styles.input}
            outlineColor={colors.border}
            activeOutlineColor={colors.primary}
          />
        </View>

        {/* Description */}
        <View style={styles.field}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            placeholder="Description de la tâche (optionnel)"
            multiline
            numberOfLines={4}
            style={[styles.input, styles.textArea]}
            outlineColor={colors.border}
            activeOutlineColor={colors.primary}
          />
        </View>

        {/* Project Selection */}
        <View style={styles.field}>
          <Text style={styles.label}>Projet *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.chipRow}>
              {projects.map((project) => (
                <Chip
                  key={project.id}
                  selected={selectedProjectId === project.id}
                  onPress={() => setSelectedProjectId(project.id)}
                  style={[
                    styles.chip,
                    selectedProjectId === project.id && { backgroundColor: project.color + '30' },
                  ]}
                  textStyle={selectedProjectId === project.id ? { color: project.color } : undefined}
                >
                  {project.name}
                </Chip>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Due Date */}
        <View style={styles.field}>
          <Text style={styles.label}>Date d'échéance</Text>
          <Button
            mode="outlined"
            onPress={() => setShowDatePicker(true)}
            icon="calendar"
            style={styles.dateButton}
            contentStyle={styles.dateButtonContent}
          >
            {dueDate ? dueDate.toLocaleDateString('fr-FR') : 'Sélectionner une date'}
          </Button>
          {dueDate && (
            <Button
              mode="text"
              onPress={() => setDueDate(null)}
              textColor={colors.error}
              compact
            >
              Supprimer la date
            </Button>
          )}
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={dueDate || new Date()}
            mode="date"
            display="default"
            onChange={onDateChange}
            minimumDate={new Date()}
          />
        )}

        {/* Priority */}
        <View style={styles.field}>
          <Text style={styles.label}>Priorité</Text>
          <SegmentedButtons
            value={taskType}
            onValueChange={(value) => setTaskType(value as TaskType)}
            buttons={[
              { 
                value: 'normal', 
                label: 'Normal',
                style: taskType === 'normal' ? { backgroundColor: TASK_TYPE_COLORS.normal + '20' } : undefined,
              },
              { 
                value: 'important', 
                label: 'Important',
                style: taskType === 'important' ? { backgroundColor: TASK_TYPE_COLORS.important + '20' } : undefined,
              },
              { 
                value: 'urgent', 
                label: 'Urgent',
                style: taskType === 'urgent' ? { backgroundColor: TASK_TYPE_COLORS.urgent + '20' } : undefined,
              },
            ]}
          />
        </View>

        {/* Status */}
        <View style={styles.field}>
          <Text style={styles.label}>Statut</Text>
          <SegmentedButtons
            value={status}
            onValueChange={(value) => setStatus(value as TaskStatus)}
            buttons={[
              { value: 'pending', label: 'À faire' },
              { value: 'in_progress', label: 'En cours' },
            ]}
          />
        </View>

        {/* Submit Button */}
        <Button
          mode="contained"
          onPress={handleCreate}
          loading={isLoading}
          disabled={isLoading || !title.trim() || !selectedProjectId}
          style={styles.submitButton}
          contentStyle={styles.submitButtonContent}
        >
          Créer la tâche
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  field: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.black,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.white,
  },
  textArea: {
    minHeight: 100,
  },
  chipRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  chip: {
    marginRight: spacing.xs,
  },
  dateButton: {
    borderColor: colors.border,
  },
  dateButtonContent: {
    justifyContent: 'flex-start',
    paddingVertical: spacing.sm,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    marginTop: spacing.lg,
  },
  submitButtonContent: {
    paddingVertical: spacing.sm,
  },
});
