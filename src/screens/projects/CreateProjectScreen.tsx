import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useProjectsStore } from '../../store';
import { colors, spacing, borderRadius, shadows } from '../../constants/theme';
import { PROJECT_COLORS } from '../../constants/config';
import { RootStackParamList } from '../../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function CreateProjectScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { createProject, isLoading } = useProjectsStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(PROJECT_COLORS[0]);

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un nom pour le projet');
      return;
    }

    try {
      await createProject({
        name: name.trim(),
        description: description.trim() || null,
        color: selectedColor,
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
        {/* Name */}
        <View style={styles.field}>
          <Text style={styles.label}>Nom du projet *</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            mode="outlined"
            placeholder="Ex: Refonte du site web"
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
            placeholder="Description du projet (optionnel)"
            multiline
            numberOfLines={4}
            style={[styles.input, styles.textArea]}
            outlineColor={colors.border}
            activeOutlineColor={colors.primary}
          />
        </View>

        {/* Color Selection */}
        <View style={styles.field}>
          <Text style={styles.label}>Couleur</Text>
          <View style={styles.colorGrid}>
            {PROJECT_COLORS.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  selectedColor === color && styles.colorOptionSelected,
                ]}
                onPress={() => setSelectedColor(color)}
                activeOpacity={0.7}
              >
                {selectedColor === color && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Preview */}
        <View style={styles.field}>
          <Text style={styles.label}>Aperçu</Text>
          <View style={styles.preview}>
            <View style={[styles.previewBar, { backgroundColor: selectedColor }]} />
            <View style={styles.previewContent}>
              <View style={styles.previewHeader}>
                <View style={[styles.previewIcon, { backgroundColor: selectedColor + '20' }]}>
                  <View style={[styles.previewDot, { backgroundColor: selectedColor }]} />
                </View>
              </View>
              <Text style={styles.previewName}>
                {name || 'Nom du projet'}
              </Text>
              <Text style={styles.previewDesc} numberOfLines={2}>
                {description || 'Description du projet'}
              </Text>
            </View>
          </View>
        </View>

        {/* Submit Button */}
        <Button
          mode="contained"
          onPress={handleCreate}
          loading={isLoading}
          disabled={isLoading || !name.trim()}
          style={styles.submitButton}
          contentStyle={styles.submitButtonContent}
        >
          Créer le projet
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
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  colorOption: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorOptionSelected: {
    borderWidth: 3,
    borderColor: colors.white,
    ...shadows.md,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.black,
  },
  preview: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.sm,
  },
  previewBar: {
    height: 4,
    width: '100%',
  },
  previewContent: {
    padding: spacing.md,
  },
  previewHeader: {
    marginBottom: spacing.sm,
  },
  previewIcon: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  previewName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: spacing.xs,
  },
  previewDesc: {
    fontSize: 13,
    color: colors.textSecondary,
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
