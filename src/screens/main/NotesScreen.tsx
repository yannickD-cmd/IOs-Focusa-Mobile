import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Text, FAB, Searchbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useNotesStore } from '../../store';
import { colors, spacing, borderRadius, shadows } from '../../constants/theme';
import { RootStackParamList, Note } from '../../types';
import { formatDate } from '../../utils/dateUtils';
import NoteCard from '../../components/NoteCard';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function NotesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { notes, fetchNotes, deleteNote, isLoading } = useNotesStore();
  
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotes();
    setRefreshing(false);
  };

  const handleDeleteNote = (note: Note) => {
    Alert.alert(
      'Supprimer la note',
      `Êtes-vous sûr de vouloir supprimer "${note.title}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteNote(note.id);
            } catch (error: any) {
              Alert.alert('Erreur', error.message);
            }
          },
        },
      ]
    );
  };

  const filteredNotes = notes.filter(note =>
    !note.is_deleted && (
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (note.content || '').toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Notes</Text>
        <Text style={styles.subtitle}>{filteredNotes.length} note(s)</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Rechercher une note..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={styles.searchInput}
          iconColor={colors.textSecondary}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
      >
        {filteredNotes.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-text" size={64} color={colors.gray[300]} />
            <Text style={styles.emptyTitle}>
              {searchQuery ? 'Aucune note trouvée' : 'Aucune note'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery 
                ? 'Essayez avec d\'autres mots-clés' 
                : 'Créez votre première note pour commencer'}
            </Text>
          </View>
        ) : (
          <View style={styles.notesGrid}>
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onPress={() => navigation.navigate('NoteDetail', { noteId: note.id })}
                onLongPress={() => handleDeleteNote(note)}
              />
            ))}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('CreateNote', {})}
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
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
  },
  searchBar: {
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.lg,
    elevation: 0,
  },
  searchInput: {
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  notesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.black,
    marginTop: spacing.lg,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    backgroundColor: colors.primary,
  },
});
