import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Text, TextInput, Button, FAB, Modal, Portal, IconButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useTagsStore } from '../../store';
import { colors, spacing, borderRadius, shadows } from '../../constants/theme';
import { PROJECT_COLORS } from '../../constants/config';
import { CustomTag } from '../../types';

export default function TagsScreen() {
  const { tags, fetchTags, createTag, updateTag, deleteTag, isLoading } = useTagsStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingTag, setEditingTag] = useState<CustomTag | null>(null);
  const [tagName, setTagName] = useState('');
  const [tagColor, setTagColor] = useState(PROJECT_COLORS[0]);

  useEffect(() => {
    fetchTags();
  }, []);

  const handleOpenModal = (tag?: CustomTag) => {
    if (tag) {
      setEditingTag(tag);
      setTagName(tag.name);
      setTagColor(tag.color);
    } else {
      setEditingTag(null);
      setTagName('');
      setTagColor(PROJECT_COLORS[0]);
    }
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingTag(null);
    setTagName('');
    setTagColor(PROJECT_COLORS[0]);
  };

  const handleSave = async () => {
    if (!tagName.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un nom pour le tag');
      return;
    }

    try {
      if (editingTag) {
        await updateTag(editingTag.id, {
          name: tagName.trim(),
          color: tagColor,
        });
      } else {
        await createTag({
          name: tagName.trim(),
          color: tagColor,
        });
      }
      handleCloseModal();
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Une erreur est survenue');
    }
  };

  const handleDelete = (tag: CustomTag) => {
    Alert.alert(
      'Supprimer le tag',
      `Êtes-vous sûr de vouloir supprimer "${tag.name}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => deleteTag(tag.id),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Description */}
        <View style={styles.description}>
          <Ionicons name="pricetags" size={24} color={colors.primary} />
          <Text style={styles.descriptionText}>
            Créez des tags personnalisés pour organiser vos tâches et projets.
          </Text>
        </View>

        {/* Tags List */}
        {tags.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="pricetags-outline" size={64} color={colors.gray[300]} />
            <Text style={styles.emptyTitle}>Aucun tag</Text>
            <Text style={styles.emptySubtitle}>
              Créez votre premier tag pour commencer à organiser
            </Text>
          </View>
        ) : (
          <View style={styles.tagsList}>
            {tags.map((tag) => (
              <View key={tag.id} style={styles.tagItem}>
                <View style={styles.tagInfo}>
                  <View style={[styles.tagColor, { backgroundColor: tag.color }]} />
                  <Text style={styles.tagName}>{tag.name}</Text>
                </View>
                <View style={styles.tagActions}>
                  <IconButton
                    icon="pencil"
                    size={18}
                    onPress={() => handleOpenModal(tag)}
                  />
                  <IconButton
                    icon="delete"
                    size={18}
                    iconColor={colors.error}
                    onPress={() => handleDelete(tag)}
                  />
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Add FAB */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => handleOpenModal()}
        color={colors.white}
      />

      {/* Create/Edit Modal */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={handleCloseModal}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>
            {editingTag ? 'Modifier le tag' : 'Nouveau tag'}
          </Text>

          {/* Name Input */}
          <View style={styles.field}>
            <Text style={styles.label}>Nom</Text>
            <TextInput
              value={tagName}
              onChangeText={setTagName}
              mode="outlined"
              placeholder="Nom du tag"
              style={styles.input}
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
                    tagColor === color && styles.colorOptionSelected,
                  ]}
                  onPress={() => setTagColor(color)}
                >
                  {tagColor === color && (
                    <Ionicons name="checkmark" size={18} color={colors.white} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Preview */}
          <View style={styles.field}>
            <Text style={styles.label}>Aperçu</Text>
            <View style={styles.previewContainer}>
              <View style={[styles.previewTag, { backgroundColor: tagColor + '20', borderColor: tagColor }]}>
                <Text style={[styles.previewTagText, { color: tagColor }]}>
                  {tagName || 'Nom du tag'}
                </Text>
              </View>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.modalActions}>
            <Button
              mode="outlined"
              onPress={handleCloseModal}
              style={styles.cancelButton}
            >
              Annuler
            </Button>
            <Button
              mode="contained"
              onPress={handleSave}
              loading={isLoading}
              disabled={isLoading || !tagName.trim()}
              style={styles.saveButton}
              buttonColor={colors.primary}
            >
              {editingTag ? 'Enregistrer' : 'Créer'}
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    flexGrow: 1,
  },
  description: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.primary + '10',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  descriptionText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
    marginTop: spacing.md,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  tagsList: {
    gap: spacing.sm,
  },
  tagItem: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shadows.sm,
  },
  tagInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  tagColor: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  tagName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.black,
  },
  tagActions: {
    flexDirection: 'row',
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    backgroundColor: colors.primary,
  },
  modalContainer: {
    backgroundColor: colors.white,
    margin: spacing.lg,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
  },
  modalTitle: {
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
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorOptionSelected: {
    borderWidth: 3,
    borderColor: colors.white,
    ...shadows.md,
  },
  previewContainer: {
    alignItems: 'flex-start',
  },
  previewTag: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  previewTagText: {
    fontSize: 14,
    fontWeight: '500',
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  cancelButton: {
    flex: 1,
    borderColor: colors.border,
  },
  saveButton: {
    flex: 1,
  },
});
