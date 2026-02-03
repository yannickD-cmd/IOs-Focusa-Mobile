// User types
export interface User {
  id: string;
  email: string;
  name: string;
  surname: string;
  full_name?: string;
  subscription_plan: 'free' | 'pro' | 'premium';
  subscription_status?: 'active' | 'inactive' | 'trial' | null;
  created_at: string;
  updated_at?: string;
  user_metadata?: {
    full_name?: string;
  };
}

// Note with project relation
export interface NoteWithProject extends Note {
  project?: Project | null;
}

// Project types
export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  color: string;
  end_date: string | null;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

// Task types
export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export type TaskType = 'urgent' | 'important' | 'normal' | null;

export interface Task {
  id: string;
  user_id: string;
  project_id: string | null;
  title: string;
  description: string | null;
  due_date: string | null;
  status: TaskStatus;
  type: TaskType;
  tag_id: string | null;
  is_late: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  actual_completion_date: string | null;
}

// Note types
export interface Note {
  id: string;
  user_id: string;
  project_id: string | null;
  task_id: string | null;
  title: string;
  content: string | null;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  project?: {
    id: string;
    name: string;
    color: string;
  } | null;
}

// File types
export interface FileAttachment {
  id: string;
  filename: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  created_at: string;
}

// Custom Tag types
export interface CustomTag {
  id: string;
  user_id: string;
  name: string;
  color: string;
  display_order: number;
  created_at: string;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  message: string;
}

export interface SignupResponse {
  token: string | null;
  user: User;
  message: string;
}

// Navigation types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  Dashboard: undefined;
  Projects: undefined;
  ProjectDetail: { projectId: string };
  CreateProject: undefined;
  TaskDetail: { taskId: string };
  CreateTask: { projectId?: string };
  EditTask: { taskId: string };
  Calendar: undefined;
  Notes: undefined;
  NoteDetail: { noteId: string };
  CreateNote: { projectId?: string; taskId?: string };
  EditNote: { noteId: string };
  Settings: undefined;
  Account: undefined;
  Plan: undefined;
  Support: undefined;
  Tags: undefined;
};

export type BottomTabParamList = {
  DashboardTab: undefined;
  ProjectsTab: undefined;
  CalendarTab: undefined;
  NotesTab: undefined;
  SettingsTab: undefined;
};

// Filter types
export interface TaskFilters {
  project: string | null;
  urgency: boolean;
  deadline: string | null;
  showCompleted: boolean;
}

// Activity types
export interface ProjectActivity {
  id: string;
  project_id: string;
  user_id: string;
  activity_type: string;
  activity_description: string;
  created_at: string;
}
