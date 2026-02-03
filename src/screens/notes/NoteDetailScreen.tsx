import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Text, IconButton, Menu, FAB } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useNotesStore, useProjectsStore } from '../../store';
import { colors, spacing, borderRadius, shadows } from '../../constants/theme';
import { RootStackParamList } from '../../types';
import { formatDate, formatRelativeDate } from '../../utils/dateUtils';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'NoteDetail'>;

export default function NoteDetailScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { noteId } = route.params;

  const { notes, deleteNote, isLoading } = useNotesStore();
  const { projects } = useProjectsStore();

  const [menuVisible, setMenuVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const note = notes.find(n => n.id === noteId);
  const project = note?.project_id ? projects.find(p => p.id === note.project_id) : null;

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <IconButton
              icon="dots-vertical"
              onPress={() => setMenuVisible(true)}
            />
          }
        >
          <Menu.Item
            onPress={() => {
              setMenuVisible(false);
              navigation.navigate('EditNote', { noteId });
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
      ),
    });
  }, [menuVisible, noteId]);

  const handleDelete = () => {
    Alert.alert(
      'Supprimer la note',
      'Êtes-vous sûr de vouloir supprimer cette note ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteNote(noteId);
              navigation.goBack();
            } catch (error: any) {
              Alert.alert('Erreur', error.message);
            }
          },
        },
      ]
    );
  };

  if (!note) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Note non trouvée</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="document-text" size={24} color={colors.warning} />
          </View>
          <Text style={styles.date}>
            Modifiée {formatRelativeDate(note.updated_at)}
          </Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>{note.title}</Text>

        {/* Project */}
        {project && (
          <View style={styles.projectRow}>
            <View style={[styles.projectDot, { backgroundColor: project.color }]} />
            <Text style={styles.projectName}>{project.name}</Text>
          </View>
        )}

        {/* Content */}
        {note.content ? (
          <View style={styles.contentCard}>
            <Text style={styles.contentText}>{note.content}</Text>
          </View>
        ) : (
          <View style={styles.emptyContent}>
            <Ionicons name="document-outline" size={48} color={colors.gray[300]} />
            <Text style={styles.emptyText}>Aucun contenu</Text>
          </View>
        )}

        {/* Metadata */}
        <View style={styles.metadata}>
          <Text style={styles.metadataText}>
            Créée le {formatDate(note.created_at)}
          </Text>
          {note.updated_at !== note.created_at && (
            <Text style={styles.metadataText}>
              Modifiée le {formatDate(note.updated_at)}
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Edit FAB */}
      <FAB
        icon="pencil"
        style={styles.fab}
        onPress={() => navigation.navigate('EditNote', { noteId })}
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.warning + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: colors.textMuted,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: spacing.sm,
  },
  projectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  projectDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  projectName: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  contentCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  contentText: {
    fontSize: 15,
    color: colors.black,
    lineHeight: 24,
  },
  emptyContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    marginTop: spacing.md,
    fontSize: 16,
    color: colors.textMuted,
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
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    backgroundColor: colors.primary,
  },
});
