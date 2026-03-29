import { create } from 'zustand';
import { User, Project, Task, Note, CustomTag, TaskFilters } from '../types';
import api from '../services/api';
import storage from '../services/storage';

// ============================================================================
// AUTH STORE
// ============================================================================

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  login: (email: string, password: string) => Promise<void>;
  signup: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadStoredAuth: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  login: async (email: string, password: string): Promise<void> => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.login(email, password);
      
      await storage.saveAuthToken(response.token);
      await storage.saveUserData(response.user);
      
      set({
        user: response.user as User,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Une erreur est survenue';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  signup: async (firstName: string, lastName: string, email: string, password: string): Promise<void> => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.signup(firstName, lastName, email, password);
      
      if (response.token) {
        await storage.saveAuthToken(response.token);
        await storage.saveUserData(response.user);
        
        set({
          user: response.user as User,
          token: response.token,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Une erreur est survenue';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    await storage.removeAuthToken();
    await storage.removeUserData();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  loadStoredAuth: async (): Promise<void> => {
    try {
      set({ isLoading: true });
      const token = await storage.getAuthToken();
      const user = await storage.getUserData();
      
      if (token && user) {
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('loadStoredAuth error:', error);
      set({ isLoading: false });
    }
  },

  clearError: (): void => set({ error: null }),
  setUser: (user: User): void => set({ user }),
}));

// ============================================================================
// PROJECTS STORE
// ============================================================================

interface ProjectsState {
  projects: Project[];
  selectedProject: Project | null;
  isLoading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  createProject: (data: { name: string; description?: string | null; color?: string; end_date?: string }) => Promise<Project>;
  updateProject: (projectId: string, data: Partial<Project>) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  selectProject: (project: Project | null) => void;
  clearError: () => void;
}

export const useProjectsStore = create<ProjectsState>()((set, get) => ({
  projects: [],
  selectedProject: null,
  isLoading: false,
  error: null,

  fetchProjects: async (): Promise<void> => {
    const token = await storage.getAuthToken();
    if (!token) return;

    try {
      set({ isLoading: true, error: null });
      const projects = await api.getProjects(token);
      set({ projects, isLoading: false });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Une erreur est survenue';
      set({ error: message, isLoading: false });
    }
  },

  createProject: async (data): Promise<Project> => {
    const token = await storage.getAuthToken();
    if (!token) throw new Error('Not authenticated');

    try {
      set({ isLoading: true, error: null });
      const project = await api.createProject(token, data);
      set((state) => ({
        projects: [project, ...state.projects],
        isLoading: false,
      }));
      return project;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Une erreur est survenue';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  updateProject: async (projectId: string, data: Partial<Project>): Promise<void> => {
    const token = await storage.getAuthToken();
    if (!token) throw new Error('Not authenticated');

    try {
      const project = await api.updateProject(token, projectId, data);
      set((state) => ({
        projects: state.projects.map((p) => p.id === projectId ? project : p),
        selectedProject: state.selectedProject?.id === projectId ? project : state.selectedProject,
      }));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Une erreur est survenue';
      set({ error: message });
      throw error;
    }
  },

  deleteProject: async (projectId: string): Promise<void> => {
    const token = await storage.getAuthToken();
    if (!token) throw new Error('Not authenticated');

    try {
      await api.deleteProject(token, projectId);
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== projectId),
        selectedProject: state.selectedProject?.id === projectId ? null : state.selectedProject,
      }));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Une erreur est survenue';
      set({ error: message });
      throw error;
    }
  },

  selectProject: (project: Project | null): void => set({ selectedProject: project }),
  clearError: (): void => set({ error: null }),
}));

// ============================================================================
// TASKS STORE
// ============================================================================

interface CreateTaskData {
  title: string;
  description?: string | null;
  due_date?: string | null;
  status?: string;
  type?: string;
  tag_id?: string;
}

interface TasksState {
  tasks: Task[];
  selectedTask: Task | null;
  filters: TaskFilters;
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  createTask: (projectId: string, data: CreateTaskData) => Promise<Task>;
  updateTask: (taskId: string, data: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  toggleTaskComplete: (taskId: string) => Promise<void>;
  selectTask: (task: Task | null) => void;
  setFilters: (filters: Partial<TaskFilters>) => void;
  clearFilters: () => void;
  clearError: () => void;
}

const defaultFilters: TaskFilters = {
  project: null,
  urgency: false,
  deadline: null,
  showCompleted: false,
};

export const useTasksStore = create<TasksState>()((set, get) => ({
  tasks: [],
  selectedTask: null,
  filters: defaultFilters,
  isLoading: false,
  error: null,

  fetchTasks: async (): Promise<void> => {
    const token = await storage.getAuthToken();
    if (!token) return;

    try {
      set({ isLoading: true, error: null });
      const tasks = await api.getTasks(token);
      set({ tasks, isLoading: false });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Une erreur est survenue';
      set({ error: message, isLoading: false });
    }
  },

  createTask: async (projectId: string, data: { 
    title: string; 
    description?: string | null; 
    due_date?: string | null; 
    status?: string; 
    type?: string; 
    tag_id?: string; 
  }): Promise<Task> => {
    const token = await storage.getAuthToken();
    if (!token) throw new Error('Not authenticated');

    try {
      set({ isLoading: true, error: null });
      const task = await api.createTask(token, projectId, {
        title: data.title,
        description: data.description || undefined,
        due_date: data.due_date || undefined,
        status: data.status,
        type: data.type,
        tag_id: data.tag_id,
      });
      set((state) => ({
        tasks: [task, ...state.tasks],
        isLoading: false,
      }));
      return task;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Une erreur est survenue';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  updateTask: async (taskId: string, data: Partial<Task>): Promise<void> => {
    const token = await storage.getAuthToken();
    if (!token) throw new Error('Not authenticated');

    try {
      const task = await api.updateTask(token, taskId, data);
      set((state) => ({
        tasks: state.tasks.map((t) => t.id === taskId ? task : t),
        selectedTask: state.selectedTask?.id === taskId ? task : state.selectedTask,
      }));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Une erreur est survenue';
      set({ error: message });
      throw error;
    }
  },

  deleteTask: async (taskId: string): Promise<void> => {
    const token = await storage.getAuthToken();
    if (!token) throw new Error('Not authenticated');

    try {
      await api.deleteTask(token, taskId);
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== taskId),
        selectedTask: state.selectedTask?.id === taskId ? null : state.selectedTask,
      }));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Une erreur est survenue';
      set({ error: message });
      throw error;
    }
  },

  toggleTaskComplete: async (taskId: string): Promise<void> => {
    const { tasks, updateTask } = get();
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    const updateData: Partial<Task> = { status: newStatus };
    
    if (newStatus === 'completed') {
      updateData.actual_completion_date = new Date().toISOString().split('T')[0];
    }

    await updateTask(taskId, updateData);
  },

  selectTask: (task: Task | null): void => set({ selectedTask: task }),
  setFilters: (filters: Partial<TaskFilters>): void => set((state) => ({
    filters: { ...state.filters, ...filters },
  })),
  clearFilters: (): void => set({ filters: defaultFilters }),
  clearError: (): void => set({ error: null }),
}));

// ============================================================================
// NOTES STORE
// ============================================================================

interface NotesState {
  notes: Note[];
  selectedNote: Note | null;
  isLoading: boolean;
  error: string | null;
  fetchNotes: () => Promise<void>;
  createNote: (data: { title: string; content?: string | null; project_id?: string | null; task_id?: string | null }) => Promise<Note>;
  updateNote: (noteId: string, data: Partial<Note>) => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;
  selectNote: (note: Note | null) => void;
  clearError: () => void;
}

export const useNotesStore = create<NotesState>()((set) => ({
  notes: [],
  selectedNote: null,
  isLoading: false,
  error: null,

  fetchNotes: async (): Promise<void> => {
    const token = await storage.getAuthToken();
    if (!token) return;

    try {
      set({ isLoading: true, error: null });
      const notes = await api.getNotes(token);
      set({ notes, isLoading: false });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Une erreur est survenue';
      set({ error: message, isLoading: false });
    }
  },

  createNote: async (data): Promise<Note> => {
    const token = await storage.getAuthToken();
    if (!token) throw new Error('Not authenticated');

    try {
      set({ isLoading: true, error: null });
      const note = await api.createNote(token, data);
      set((state) => ({
        notes: [note, ...state.notes],
        isLoading: false,
      }));
      return note;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Une erreur est survenue';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  updateNote: async (noteId: string, data: Partial<Note>): Promise<void> => {
    const token = await storage.getAuthToken();
    if (!token) throw new Error('Not authenticated');

    try {
      const note = await api.updateNote(token, noteId, data);
      set((state) => ({
        notes: state.notes.map((n) => n.id === noteId ? note : n),
        selectedNote: state.selectedNote?.id === noteId ? note : state.selectedNote,
      }));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Une erreur est survenue';
      set({ error: message });
      throw error;
    }
  },

  deleteNote: async (noteId: string): Promise<void> => {
    const token = await storage.getAuthToken();
    if (!token) throw new Error('Not authenticated');

    try {
      await api.deleteNote(token, noteId);
      set((state) => ({
        notes: state.notes.filter((n) => n.id !== noteId),
        selectedNote: state.selectedNote?.id === noteId ? null : state.selectedNote,
      }));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Une erreur est survenue';
      set({ error: message });
      throw error;
    }
  },

  selectNote: (note: Note | null): void => set({ selectedNote: note }),
  clearError: (): void => set({ error: null }),
}));

// ============================================================================
// TAGS STORE
// ============================================================================

interface TagsState {
  tags: CustomTag[];
  useCustomTags: boolean;
  isLoading: boolean;
  error: string | null;
  fetchTags: () => Promise<void>;
  createTag: (data: { name: string; color: string }) => Promise<CustomTag>;
  updateTag: (tagId: string, data: Partial<CustomTag>) => Promise<void>;
  deleteTag: (tagId: string) => Promise<void>;
  setUseCustomTags: (use: boolean) => Promise<void>;
  clearError: () => void;
}

export const useTagsStore = create<TagsState>()((set) => ({
  tags: [],
  useCustomTags: false,
  isLoading: false,
  error: null,

  fetchTags: async (): Promise<void> => {
    const token = await storage.getAuthToken();
    if (!token) return;

    try {
      set({ isLoading: true, error: null });
      const [tags, settings] = await Promise.all([
        api.getCustomTags(token),
        api.getTagSettings(token),
      ]);
      set({
        tags,
        useCustomTags: settings.use_custom_tags,
        isLoading: false,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Une erreur est survenue';
      set({ error: message, isLoading: false });
    }
  },

  createTag: async (data: { name: string; color: string }): Promise<CustomTag> => {
    const token = await storage.getAuthToken();
    if (!token) throw new Error('Not authenticated');

    try {
      const tag = await api.createCustomTag(token, data);
      set((state) => ({
        tags: [...state.tags, tag],
      }));
      return tag;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Une erreur est survenue';
      set({ error: message });
      throw error;
    }
  },

  updateTag: async (tagId: string, data: Partial<CustomTag>): Promise<void> => {
    const token = await storage.getAuthToken();
    if (!token) throw new Error('Not authenticated');

    try {
      const tag = await api.updateCustomTag(token, tagId, data);
      set((state) => ({
        tags: state.tags.map((t) => t.id === tagId ? tag : t),
      }));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Une erreur est survenue';
      set({ error: message });
      throw error;
    }
  },

  deleteTag: async (tagId: string): Promise<void> => {
    const token = await storage.getAuthToken();
    if (!token) throw new Error('Not authenticated');

    try {
      await api.deleteCustomTag(token, tagId);
      set((state) => ({
        tags: state.tags.filter((t) => t.id !== tagId),
      }));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Une erreur est survenue';
      set({ error: message });
      throw error;
    }
  },

  setUseCustomTags: async (use: boolean): Promise<void> => {
    const token = await storage.getAuthToken();
    if (!token) throw new Error('Not authenticated');

    try {
      await api.updateTagSettings(token, { use_custom_tags: use });
      set({ useCustomTags: use });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Une erreur est survenue';
      set({ error: message });
      throw error;
    }
  },

  clearError: (): void => set({ error: null }),
}));
