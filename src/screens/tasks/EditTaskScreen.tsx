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
import { useTasksStore, useProjectsStore } from '../../store';
import { colors, spacing, borderRadius } from '../../constants/theme';
import { RootStackParamList } from '../../types';
import { TASK_TYPE_COLORS } from '../../constants/config';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'EditTask'>;

export default function EditTaskScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { taskId } = route.params;

  const { tasks, updateTask, isLoading } = useTasksStore();
  const { projects } = useProjectsStore();

  const task = tasks.find(t => t.id === taskId);

  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [dueDate, setDueDate] = useState<Date | null>(
    task?.due_date ? new Date(task.due_date) : null
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [taskType, setTaskType] = useState<string>(task?.type || 'normal');
  const [status, setStatus] = useState<string>(task?.status || 'pending');

  useEffect(() => {
    if (!task) {
      Alert.alert('Erreur', 'Tâche non trouvée');
      navigation.goBack();
    }
  }, [task]);

  const handleUpdate = async () => {
    if (!title.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un titre pour la tâche');
      return;
    }

    try {
      await updateTask(taskId, {
        title: title.trim(),
        description: description.trim() || null,
        due_date: dueDate ? dueDate.toISOString().split('T')[0] : null,
        type: taskType as any,
        status: status as any,
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

  if (!task) return null;

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
          />
        )}

        {/* Priority */}
        <View style={styles.field}>
          <Text style={styles.label}>Priorité</Text>
          <SegmentedButtons
            value={taskType}
            onValueChange={setTaskType}
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
            onValueChange={setStatus}
            buttons={[
              { value: 'pending', label: 'À faire' },
              { value: 'in_progress', label: 'En cours' },
              { value: 'completed', label: 'Terminée' },
            ]}
          />
        </View>

        {/* Submit Button */}
        <Button
          mode="contained"
          onPress={handleUpdate}
          loading={isLoading}
          disabled={isLoading || !title.trim()}
          style={styles.submitButton}
          contentStyle={styles.submitButtonContent}
        >
          Enregistrer les modifications
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
