import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Text, FAB, Searchbar, Menu, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useProjectsStore, useTasksStore } from '../../store';
import { colors, spacing, borderRadius, shadows } from '../../constants/theme';
import { RootStackParamList, Project } from '../../types';
import { calculateProgress } from '../../utils/taskUtils';
import ProjectCard from '../../components/ProjectCard';
import CreateProjectModal from '../../components/CreateProjectModal';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ProjectsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { projects, fetchProjects, deleteProject, createProject, isLoading } = useProjectsStore();
  const { tasks } = useTasksStore();
  
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [menuVisible, setMenuVisible] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProjects();
    setRefreshing(false);
  };

  const handleDeleteProject = (project: Project) => {
    Alert.alert(
      'Supprimer le projet',
      `Êtes-vous sûr de vouloir supprimer "${project.name}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteProject(project.id);
            } catch (error: any) {
              Alert.alert('Erreur', error.message);
            }
          },
        },
      ]
    );
  };

  const getProjectProgress = (projectId: string) => {
    const projectTasks = tasks.filter(t => t.project_id === projectId && !t.is_deleted);
    return calculateProgress(projectTasks);
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (project.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Projets</Text>
        <Text style={styles.subtitle}>{projects.length} projet(s)</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Rechercher un projet..."
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
        {filteredProjects.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="folder-open" size={64} color={colors.gray[300]} />
            <Text style={styles.emptyTitle}>
              {searchQuery ? 'Aucun projet trouvé' : 'Aucun projet'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery 
                ? 'Essayez avec d\'autres mots-clés' 
                : 'Créez votre premier projet pour commencer'}
            </Text>
          </View>
        ) : (
          filteredProjects.map((project) => {
            const progress = getProjectProgress(project.id);
            return (
              <ProjectCard
                key={project.id}
                project={project}
                taskCount={progress.total}
                completedCount={progress.completed}
                onPress={() => navigation.navigate('ProjectDetail', { projectId: project.id })}
                onLongPress={() => setMenuVisible(project.id)}
                menuVisible={menuVisible === project.id}
                onDismissMenu={() => setMenuVisible(null)}
                onEdit={() => {
                  setMenuVisible(null);
                  // TODO: Open edit modal
                }}
                onDelete={() => {
                  setMenuVisible(null);
                  handleDeleteProject(project);
                }}
              />
            );
          })
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setShowCreateModal(true)}
        color={colors.white}
      />

      {/* Create Project Modal */}
      <CreateProjectModal
        visible={showCreateModal}
        onDismiss={() => setShowCreateModal(false)}
        onSubmit={async (data) => {
          await createProject(data);
        }}
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
