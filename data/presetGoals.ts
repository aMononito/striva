import { Goal } from '../types/goal';

export const presetGoals: Goal[] = [
  // Professional
  {
    id: 'emails-sent',
    name: 'Emails Sent',
    category: 'Professional',
    metricType: 'count',
    icon: '📧'
  },
  {
    id: 'productive-minutes',
    name: 'Minutes Pretending to Be Productive',
    category: 'Professional',
    metricType: 'time',
    icon: '💼'
  },
  {
    id: 'tabs-opened',
    name: 'Tabs Opened Without Using Them',
    category: 'Professional',
    metricType: 'count',
    icon: '📱'
  },
  {
    id: 'actually-worked',
    name: 'Did I actually work today?',
    category: 'Professional',
    metricType: 'binary',
    icon: '💪'
  },
  
  // Wellness
  {
    id: 'time-horizontal',
    name: 'Time Horizontal',
    category: 'Wellness',
    metricType: 'time',
    icon: '🛌'
  },
  {
    id: 'meditated',
    name: 'Meditated',
    category: 'Wellness',
    metricType: 'binary',
    icon: '🧘‍♀️'
  },
  {
    id: 'screen-free-minutes',
    name: 'Screen-Free Minutes',
    category: 'Wellness',
    metricType: 'time',
    icon: '📵'
  },
  {
    id: 'touched-grass',
    name: 'Did I touch grass?',
    category: 'Wellness',
    metricType: 'binary',
    icon: '🌱'
  },
  
  // Personal
  {
    id: 'toilet-time',
    name: 'Time Spent On The Toilet',
    category: 'Personal',
    metricType: 'time',
    icon: '🚽'
  },
  {
    id: 'strangers-talked-to',
    name: 'Strangers Talked To',
    category: 'Personal',
    metricType: 'count',
    icon: '🗣️'
  },
  {
    id: 'laundry-folded',
    name: 'Laundry Folded',
    category: 'Personal',
    metricType: 'binary',
    icon: '👕'
  },
  {
    id: 'tiktoks-sent',
    name: 'TikToks Sent',
    category: 'Personal',
    metricType: 'count',
    icon: '📱'
  },
];