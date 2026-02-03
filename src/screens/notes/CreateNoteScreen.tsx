import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Text, TextInput, Button, Chip } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNotesStore, useProjectsStore } from '../../store';
import { colors, spacing, borderRadius } from '../../constants/theme';
import { RootStackParamList } from '../../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'CreateNote'>;

export default function CreateNoteScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { projectId: initialProjectId } = route.params || {};

  const { createNote, isLoading } = useNotesStore();
  const { projects } = useProjectsStore();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(initialProjectId || null);

  const handleCreate = async () => {
    if (!title.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un titre pour la note');
      return;
    }

    try {
      await createNote({
        title: title.trim(),
        content: content.trim() || null,
        project_id: selectedProjectId,
      });
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Une erreur est survenue');
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
            placeholder="Titre de la note"
            style={styles.input}
            outlineColor={colors.border}
            activeOutlineColor={colors.primary}
          />
        </View>

        {/* Project Selection */}
        <View style={styles.field}>
          <Text style={styles.label}>Projet (optionnel)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.chipRow}>
              <Chip
                selected={selectedProjectId === null}
                onPress={() => setSelectedProjectId(null)}
                style={[
                  styles.chip,
                  selectedProjectId === null && { backgroundColor: colors.gray[200] },
                ]}
              >
                Aucun projet
              </Chip>
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

        {/* Content */}
        <View style={styles.field}>
          <Text style={styles.label}>Contenu</Text>
          <TextInput
            value={content}
            onChangeText={setContent}
            mode="outlined"
            placeholder="Écrivez votre note ici..."
            multiline
            numberOfLines={12}
            style={[styles.input, styles.textArea]}
            outlineColor={colors.border}
            activeOutlineColor={colors.primary}
          />
        </View>

        {/* Submit Button */}
        <Button
          mode="contained"
          onPress={handleCreate}
          loading={isLoading}
          disabled={isLoading || !title.trim()}
          style={styles.submitButton}
          contentStyle={styles.submitButtonContent}
        >
          Créer la note
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
    minHeight: 250,
    textAlignVertical: 'top',
  },
  chipRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  chip: {
    marginRight: spacing.xs,
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
