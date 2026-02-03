import { API_BASE_URL } from '../constants/config';
import { 
  User, 
  Project, 
  Task, 
  Note, 
  FileAttachment, 
  CustomTag,
  LoginResponse,
  SignupResponse,
  ProjectActivity
} from '../types';

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    token?: string
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // ============================================================================
  // AUTHENTICATION
  // ============================================================================

  async login(email: string, password: string): Promise<LoginResponse> {
    return this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async signup(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ): Promise<SignupResponse> {
    return this.request<SignupResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ firstName, lastName, email, password }),
    });
  }

  async googleLogin(googleToken: string): Promise<LoginResponse> {
    return this.request<LoginResponse>('/auth/google-login', {
      method: 'POST',
      body: JSON.stringify({ token: googleToken }),
    });
  }

  async forgotPassword(email: string): Promise<{ message: string; success: boolean }> {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, password: string): Promise<{ message: string; success: boolean }> {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  }

  async getCurrentUser(token: string): Promise<User> {
    return this.request<User>('/auth/me', {}, token);
  }

  async updateProfile(token: string, data: { full_name?: string; email?: string }): Promise<User> {
    return this.request<User>('/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }, token);
  }

  async deleteAccount(token: string): Promise<{ message: string }> {
    return this.request('/auth/delete-account', {
      method: 'DELETE',
    }, token);
  }

  // ============================================================================
  // PROJECTS
  // ============================================================================

  async getProjects(token: string): Promise<Project[]> {
    return this.request<Project[]>('/projects', {}, token);
  }

  async getProject(token: string, projectId: string): Promise<Project> {
    return this.request<Project>(`/projects/${projectId}`, {}, token);
  }

  async createProject(
    token: string,
    data: { name: string; description?: string; color?: string; end_date?: string }
  ): Promise<Project> {
    return this.request<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    }, token);
  }

  async updateProject(
    token: string,
    projectId: string,
    data: Partial<Project>
  ): Promise<Project> {
    return this.request<Project>(`/projects/${projectId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }, token);
  }

  async deleteProject(token: string, projectId: string): Promise<{ message: string }> {
    return this.request(`/projects/${projectId}`, {
      method: 'DELETE',
    }, token);
  }

  // ============================================================================
  // TASKS
  // ============================================================================

  async getTasks(token: string): Promise<Task[]> {
    return this.request<Task[]>('/tasks', {}, token);
  }

  async getProjectTasks(token: string, projectId: string): Promise<Task[]> {
    return this.request<Task[]>(`/projects/${projectId}/tasks`, {}, token);
  }

  async createTask(
    token: string,
    projectId: string,
    data: {
      title: string;
      description?: string;
      due_date?: string;
      status?: string;
      type?: string;
      tag_id?: string;
    }
  ): Promise<Task> {
    return this.request<Task>(`/projects/${projectId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(data),
    }, token);
  }

  async updateTask(
    token: string,
    taskId: string,
    data: Partial<Task>
  ): Promise<Task> {
    return this.request<Task>(`/tasks/${taskId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }, token);
  }

  async deleteTask(token: string, taskId: string): Promise<{ message: string }> {
    return this.request(`/tasks/${taskId}`, {
      method: 'DELETE',
    }, token);
  }

  // ============================================================================
  // NOTES
  // ============================================================================

  async getNotes(token: string): Promise<Note[]> {
    return this.request<Note[]>('/notes', {}, token);
  }

  async getTaskNotes(token: string, taskId: string): Promise<Note[]> {
    return this.request<Note[]>(`/tasks/${taskId}/notes`, {}, token);
  }

  async createNote(
    token: string,
    data: {
      title: string;
      content?: string;
      project_id?: string;
      task_id?: string;
    }
  ): Promise<Note> {
    return this.request<Note>('/notes', {
      method: 'POST',
      body: JSON.stringify(data),
    }, token);
  }

  async updateNote(
    token: string,
    noteId: string,
    data: Partial<Note>
  ): Promise<Note> {
    return this.request<Note>(`/notes/${noteId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }, token);
  }

  async deleteNote(token: string, noteId: string): Promise<{ message: string }> {
    return this.request(`/notes/${noteId}`, {
      method: 'DELETE',
    }, token);
  }

  // ============================================================================
  // FILES
  // ============================================================================

  async getProjectFiles(token: string, projectId: string): Promise<FileAttachment[]> {
    return this.request<FileAttachment[]>(`/projects/${projectId}/files`, {}, token);
  }

  async getTaskFiles(token: string, taskId: string): Promise<FileAttachment[]> {
    return this.request<FileAttachment[]>(`/tasks/${taskId}/files`, {}, token);
  }

  async uploadProjectFile(
    token: string,
    projectId: string,
    file: { uri: string; name: string; type: string }
  ): Promise<FileAttachment> {
    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      name: file.name,
      type: file.type,
    } as any);

    const response = await fetch(`${this.baseUrl}/projects/${projectId}/files`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to upload file');
    }

    return response.json();
  }

  async deleteProjectFile(
    token: string,
    projectId: string,
    fileId: string
  ): Promise<{ message: string }> {
    return this.request(`/projects/${projectId}/files/${fileId}`, {
      method: 'DELETE',
    }, token);
  }

  // ============================================================================
  // CUSTOM TAGS
  // ============================================================================

  async getCustomTags(token: string): Promise<CustomTag[]> {
    return this.request<CustomTag[]>('/custom-tags', {}, token);
  }

  async createCustomTag(
    token: string,
    data: { name: string; color: string }
  ): Promise<CustomTag> {
    return this.request<CustomTag>('/custom-tags', {
      method: 'POST',
      body: JSON.stringify(data),
    }, token);
  }

  async updateCustomTag(
    token: string,
    tagId: string,
    data: Partial<CustomTag>
  ): Promise<CustomTag> {
    return this.request<CustomTag>(`/custom-tags/${tagId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }, token);
  }

  async deleteCustomTag(token: string, tagId: string): Promise<{ message: string }> {
    return this.request(`/custom-tags/${tagId}`, {
      method: 'DELETE',
    }, token);
  }

  // ============================================================================
  // TAG SETTINGS
  // ============================================================================

  async getTagSettings(token: string): Promise<{ use_custom_tags: boolean }> {
    return this.request('/tag-settings', {}, token);
  }

  async updateTagSettings(
    token: string,
    data: { use_custom_tags: boolean }
  ): Promise<{ use_custom_tags: boolean }> {
    return this.request('/tag-settings', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }, token);
  }

  // ============================================================================
  // PROJECT ACTIVITIES
  // ============================================================================

  async getProjectActivities(token: string, projectId: string): Promise<ProjectActivity[]> {
    return this.request<ProjectActivity[]>(`/projects/${projectId}/activities`, {}, token);
  }

  async createProjectActivity(
    token: string,
    projectId: string,
    data: { activity_type: string; activity_description: string }
  ): Promise<ProjectActivity> {
    return this.request<ProjectActivity>(`/projects/${projectId}/activities`, {
      method: 'POST',
      body: JSON.stringify(data),
    }, token);
  }

  // ============================================================================
  // SUBSCRIPTION
  // ============================================================================

  async getTrialStatus(token: string): Promise<{
    has_used_trial: boolean;
    trial_ends_at?: string;
    is_trial_active: boolean;
  }> {
    return this.request('/trial-status', {}, token);
  }

  async getSubscriptionStatus(token: string): Promise<{
    subscription_plan: string;
    subscription_status?: string;
    current_period_end?: string;
  }> {
    return this.request('/subscription-status', {}, token);
  }
}

export const api = new ApiService();
export default api;
