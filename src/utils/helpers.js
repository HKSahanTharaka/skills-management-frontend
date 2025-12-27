import { format, parseISO, isValid } from 'date-fns';

export const formatDate = (date, formatStr = 'yyyy-MM-dd') => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isValid(dateObj) ? format(dateObj, formatStr) : '';
  } catch (error) {
    console.error('Date formatting error:', error);
    return '';
  }
};

export const formatDisplayDate = (date) => {
  return formatDate(date, 'MMM dd, yyyy');
};

export const formatDateTime = (date) => {
  return formatDate(date, 'MMM dd, yyyy HH:mm');
};

export const getProficiencyColor = (level) => {
  const colors = {
    Beginner: 'badge-secondary',
    Intermediate: 'badge-primary',
    Advanced: 'badge-success',
    Expert: 'badge-warning',
  };
  return colors[level] || 'badge-secondary';
};

export const getExperienceLevelColor = (level) => {
  const colors = {
    Junior: 'badge-secondary',
    'Mid-Level': 'badge-primary',
    Senior: 'badge-success',
  };
  return colors[level] || 'badge-secondary';
};

export const getProjectStatusColor = (status) => {
  const colors = {
    Planning: 'badge-secondary',
    Active: 'badge-primary',
    Completed: 'badge-success',
    'On Hold': 'badge-warning',
  };
  return colors[status] || 'badge-secondary';
};

export const getMatchScoreColor = (score) => {
  if (score >= 90) return 'text-success-600';
  if (score >= 75) return 'text-primary-600';
  if (score >= 50) return 'text-warning-600';
  return 'text-danger-600';
};

export const truncate = (str, length = 50) => {
  if (!str) return '';
  return str.length > length ? `${str.substring(0, length)}...` : str;
};

export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const debounce = (func, wait = 300) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const buildQueryString = (params) => {
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value);
    }
  });
  
  return queryParams.toString();
};

export const handleError = (error) => {
  if (error.response) {
    return error.response.data?.error?.message || error.response.data?.message || 'An error occurred';
  } else if (error.request) {
    return 'No response from server. Please check your connection.';
  } else {
    return error.message || 'An unexpected error occurred';
  }
};

export const calculateUtilization = (allocations, startDate, endDate) => {
  if (!allocations || allocations.length === 0) return 0;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  
  let weightedSum = 0;
  
  allocations.forEach((allocation) => {
    const allocStart = new Date(Math.max(start, new Date(allocation.start_date)));
    const allocEnd = new Date(Math.min(end, new Date(allocation.end_date)));
    const allocDays = Math.ceil((allocEnd - allocStart) / (1000 * 60 * 60 * 24)) + 1;
    
    if (allocDays > 0) {
      weightedSum += allocDays * allocation.allocation_percentage;
    }
  });
  
  return totalDays > 0 ? Math.round(weightedSum / totalDays) : 0;
};

