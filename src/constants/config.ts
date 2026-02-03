// API Configuration
export const API_BASE_URL = 'https://www.api.focusa.app/api';

// App Configuration
export const APP_NAME = 'Focusa';
export const APP_VERSION = '1.0.0';

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  ONBOARDING_COMPLETE: 'onboarding_complete',
  THEME_PREFERENCE: 'theme_preference',
  NOTIFICATION_SETTINGS: 'notification_settings',
};

// Task Types
export const TASK_TYPES = {
  URGENT: 'urgent',
  IMPORTANT: 'important',
  NORMAL: 'normal',
} as const;

export const TASK_TYPE_LABELS = {
  urgent: 'Urgent',
  important: 'Important',
  normal: 'Normal',
};

export const TASK_TYPE_COLORS = {
  urgent: '#EF4444',
  important: '#F59E0B',
  normal: '#4AB37F',
};

// Task Statuses
export const TASK_STATUSES = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
} as const;

export const TASK_STATUS_LABELS = {
  pending: 'À faire',
  in_progress: 'En cours',
  completed: 'Terminée',
};

export const TASK_STATUS_COLORS = {
  pending: '#9CA3AF',
  in_progress: '#3B82F6',
  completed: '#10B981',
};

// Project Colors
export const PROJECT_COLORS = [
  '#4AB37F', // Green
  '#3498DB', // Blue
  '#EF4444', // Red
  '#F59E0B', // Orange
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#F97316', // Deep Orange
  '#6366F1', // Indigo
];

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'dd MMM yyyy',
  DISPLAY_SHORT: 'dd/MM',
  DISPLAY_FULL: 'EEEE dd MMMM yyyy',
  API: 'yyyy-MM-dd',
  TIME: 'HH:mm',
  DATETIME: 'dd MMM yyyy HH:mm',
};

// Pomodoro Timer
export const POMODORO_DEFAULTS = {
  WORK_DURATION: 25 * 60, // 25 minutes in seconds
  SHORT_BREAK: 5 * 60, // 5 minutes
  LONG_BREAK: 15 * 60, // 15 minutes
  SESSIONS_BEFORE_LONG_BREAK: 4,
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
};

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
  ],
};

// Subscription Plans
export const SUBSCRIPTION_PLANS = {
  FREE: 'free',
  PRO: 'pro',
  PREMIUM: 'premium',
} as const;

export const PLAN_LIMITS = {
  free: {
    maxProjects: 3,
    maxTasksPerProject: 20,
    maxFileSizeMB: 5,
    aiAssistant: false,
    emailIntegration: false,
  },
  pro: {
    maxProjects: 10,
    maxTasksPerProject: 100,
    maxFileSizeMB: 25,
    aiAssistant: true,
    emailIntegration: true,
  },
  premium: {
    maxProjects: Infinity,
    maxTasksPerProject: Infinity,
    maxFileSizeMB: 100,
    aiAssistant: true,
    emailIntegration: true,
  },
};
