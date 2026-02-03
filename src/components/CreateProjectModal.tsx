import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text, TextInput, Button, Modal, Portal } from 'react-native-paper';
import { colors, spacing, borderRadius, shadows } from '../constants/theme';
import { PROJECT_COLORS } from '../constants/config';

interface CreateProjectModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSubmit: (data: { name: string; description: string; color: string }) => Promise<void>;
  isLoading?: boolean;
}

export default function CreateProjectModal({
  visible,
  onDismiss,
  onSubmit,
  isLoading = false,
}: CreateProjectModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(PROJECT_COLORS[0]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un nom pour le projet');
      return;
    }

    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        color: selectedColor,
      });
      // Reset form
      setName('');
      setDescription('');
      setSelectedColor(PROJECT_COLORS[0]);
      onDismiss();
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Une erreur est survenue');
    }
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setSelectedColor(PROJECT_COLORS[0]);
    onDismiss();
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={handleClose}
        contentContainerStyle={styles.container}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <Text style={styles.title}>Nouveau projet</Text>

          {/* Name Input */}
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

          {/* Description Input */}
          <View style={styles.field}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              mode="outlined"
              placeholder="Description du projet (optionnel)"
              multiline
              numberOfLines={3}
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
                <Text style={styles.previewName}>
                  {name || 'Nom du projet'}
                </Text>
                <Text style={styles.previewDesc} numberOfLines={1}>
                  {description || 'Description du projet'}
                </Text>
              </View>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <Button
              mode="outlined"
              onPress={handleClose}
              style={styles.cancelButton}
            >
              Annuler
            </Button>
            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={isLoading}
              disabled={isLoading || !name.trim()}
              style={styles.submitButton}
              buttonColor={colors.primary}
            >
              Créer
            </Button>
          </View>
        </ScrollView>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    margin: spacing.lg,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    maxHeight: '85%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: spacing.lg,
    textAlign: 'center',
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
    minHeight: 80,
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
    backgroundColor: colors.gray[50],
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
  previewName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.black,
    marginBottom: spacing.xs,
  },
  previewDesc: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  cancelButton: {
    flex: 1,
    borderColor: colors.border,
  },
  submitButton: {
    flex: 1,
  },
});
