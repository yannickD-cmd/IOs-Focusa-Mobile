import { format, parseISO, isToday, isBefore, isThisWeek, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';

export function formatDate(dateString: string | null, formatStr: string = 'dd MMM yyyy'): string {
  if (!dateString) return '';
  try {
    return format(parseISO(dateString), formatStr, { locale: fr });
  } catch {
    return dateString;
  }
}

export function formatDateShort(dateString: string | null): string {
  return formatDate(dateString, 'dd/MM');
}

export function formatDateFull(dateString: string | null): string {
  return formatDate(dateString, 'EEEE dd MMMM yyyy');
}

export function formatDateTime(dateString: string | null): string {
  return formatDate(dateString, 'dd MMM yyyy HH:mm');
}

export function formatRelativeDate(dateString: string | null): string {
  if (!dateString) return '';
  
  try {
    const date = parseISO(dateString);
    const today = startOfDay(new Date());
    const targetDate = startOfDay(date);
    
    if (isToday(targetDate)) {
      return "Aujourd'hui";
    }
    
    const diffDays = Math.floor((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return 'Demain';
    }
    if (diffDays === -1) {
      return 'Hier';
    }
    if (diffDays > 1 && diffDays <= 7) {
      return `Dans ${diffDays} jours`;
    }
    if (diffDays < -1 && diffDays >= -7) {
      return `Il y a ${Math.abs(diffDays)} jours`;
    }
    
    return formatDate(dateString);
  } catch {
    return dateString;
  }
}

export function isDateToday(dateString: string | null): boolean {
  if (!dateString) return false;
  try {
    return isToday(parseISO(dateString));
  } catch {
    return false;
  }
}

export function isDateOverdue(dateString: string | null): boolean {
  if (!dateString) return false;
  try {
    return isBefore(parseISO(dateString), startOfDay(new Date()));
  } catch {
    return false;
  }
}

export function isDateThisWeek(dateString: string | null): boolean {
  if (!dateString) return false;
  try {
    return isThisWeek(parseISO(dateString), { weekStartsOn: 1 });
  } catch {
    return false;
  }
}

export function getTodayString(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function getDateString(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}
