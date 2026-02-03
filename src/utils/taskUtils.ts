import { Task } from '../types';
import { isDateToday, isDateOverdue, isDateThisWeek } from './dateUtils';

export function getTasksByProject(tasks: Task[], projectId: string): Task[] {
  return tasks.filter(t => t.project_id === projectId && !t.is_deleted);
}

export function getActiveTasks(tasks: Task[]): Task[] {
  return tasks.filter(t => t.status !== 'completed' && !t.is_deleted);
}

export function getCompletedTasks(tasks: Task[]): Task[] {
  return tasks.filter(t => t.status === 'completed' && !t.is_deleted);
}

export function getPriorityTasks(tasks: Task[]): Task[] {
  const today = new Date().toISOString().split('T')[0];
  return tasks.filter(t => {
    if (t.status === 'completed' || t.is_deleted) return false;
    
    // Include urgent tasks
    if (t.type === 'urgent') return true;
    
    // Include tasks due today
    if (t.due_date && isDateToday(t.due_date)) return true;
    
    // Include overdue tasks
    if (t.due_date && isDateOverdue(t.due_date)) return true;
    
    return false;
  }).sort((a, b) => {
    // Sort by urgency first
    if (a.type === 'urgent' && b.type !== 'urgent') return -1;
    if (a.type !== 'urgent' && b.type === 'urgent') return 1;
    
    // Then by due date
    if (a.due_date && b.due_date) {
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    }
    if (a.due_date && !b.due_date) return -1;
    if (!a.due_date && b.due_date) return 1;
    
    return 0;
  });
}

export function calculateProgress(tasks: Task[]): {
  total: number;
  completed: number;
  percentage: number;
} {
  const activeTasks = tasks.filter(t => !t.is_deleted);
  const total = activeTasks.length;
  const completed = activeTasks.filter(t => t.status === 'completed').length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return { total, completed, percentage };
}

export function calculateDailyProgress(tasks: Task[]): {
  remaining: number;
  completed: number;
  total: number;
  percentage: number;
} {
  let remaining = 0;
  let completed = 0;
  let total = 0;
  
  tasks.forEach(task => {
    if (task.is_deleted) return;
    
    const dueDate = task.due_date;
    const isDueToday = isDateToday(dueDate);
    const isOverdue = isDateOverdue(dueDate);
    
    if (isDueToday || isOverdue) {
      total++;
      if (task.status === 'completed') {
        completed++;
      } else {
        remaining++;
      }
    }
  });
  
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return { remaining, completed, total, percentage };
}

export function calculateWeeklyProgress(tasks: Task[]): {
  remaining: number;
  completed: number;
  total: number;
  percentage: number;
} {
  let remaining = 0;
  let completed = 0;
  let total = 0;
  
  tasks.forEach(task => {
    if (task.is_deleted) return;
    
    const dueDate = task.due_date;
    const isDueThisWeek = isDateThisWeek(dueDate);
    const isOverdue = isDateOverdue(dueDate);
    
    if (isDueThisWeek || isOverdue) {
      total++;
      if (task.status === 'completed') {
        completed++;
      } else {
        remaining++;
      }
    }
  });
  
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return { remaining, completed, total, percentage };
}

export function filterTasks(
  tasks: Task[],
  filters: {
    project?: string | null;
    urgency?: boolean;
    deadline?: string | null;
    showCompleted?: boolean;
  }
): Task[] {
  return tasks.filter(task => {
    if (task.is_deleted) return false;
    
    // Filter by completion status
    if (!filters.showCompleted && task.status === 'completed') return false;
    
    // Filter by project
    if (filters.project && task.project_id !== filters.project) return false;
    
    // Filter by urgency
    if (filters.urgency && task.type !== 'urgent') return false;
    
    // Filter by deadline
    if (filters.deadline && task.due_date !== filters.deadline) return false;
    
    return true;
  });
}

export function sortTasks(
  tasks: Task[],
  sortBy: 'due_date' | 'priority' | 'created_at' = 'due_date'
): Task[] {
  return [...tasks].sort((a, b) => {
    switch (sortBy) {
      case 'due_date':
        if (!a.due_date && !b.due_date) return 0;
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      
      case 'priority':
        const priorityOrder = { urgent: 0, important: 1, normal: 2, null: 3 };
        return (priorityOrder[a.type || 'null'] || 3) - (priorityOrder[b.type || 'null'] || 3);
      
      case 'created_at':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      
      default:
        return 0;
    }
  });
}
