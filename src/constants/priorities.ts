export const PRIORITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
} as const;

export const PRIORITY_LABELS = {
  [PRIORITY_LEVELS.LOW]: 'Low',
  [PRIORITY_LEVELS.MEDIUM]: 'Medium',
  [PRIORITY_LEVELS.HIGH]: 'High',
  [PRIORITY_LEVELS.URGENT]: 'Urgent'
} as const;

export const PRIORITY_CLASSES = {
  [PRIORITY_LEVELS.LOW]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  [PRIORITY_LEVELS.MEDIUM]: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200',
  [PRIORITY_LEVELS.HIGH]: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200',
  [PRIORITY_LEVELS.URGENT]: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
} as const;

export const PRIORITY_COLORS = {
  [PRIORITY_LEVELS.LOW]: 'bg-gray-50 dark:bg-gray-800',
  [PRIORITY_LEVELS.MEDIUM]: 'bg-amber-50 dark:bg-amber-900/30',
  [PRIORITY_LEVELS.HIGH]: 'bg-orange-50 dark:bg-orange-900/30',
  [PRIORITY_LEVELS.URGENT]: 'bg-red-50 dark:bg-red-900/30'
} as const;

export const PRIORITY_BANNER_CLASSES = {
  [PRIORITY_LEVELS.LOW]: 'bg-gray-500',
  [PRIORITY_LEVELS.MEDIUM]: 'bg-amber-500',
  [PRIORITY_LEVELS.HIGH]: 'bg-orange-500',
  [PRIORITY_LEVELS.URGENT]: 'bg-red-500'
} as const;

export const PRIORITY_OPTIONS = [
  { value: PRIORITY_LEVELS.LOW, label: 'low' },
  { value: PRIORITY_LEVELS.MEDIUM, label: 'medium' },
  { value: PRIORITY_LEVELS.HIGH, label: 'high' },
  { value: PRIORITY_LEVELS.URGENT, label: 'urgent' }
] as const; 