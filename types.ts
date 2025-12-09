export type Priority = 'High' | 'Medium' | 'Low';
export type RepeatFrequency = 'None' | 'Daily' | 'WorkDays' | 'Weekends' | 'Weekly' | 'Monthly';

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  datetime: string; // ISO string
  completed: boolean;
  priority: Priority;
  repeat: RepeatFrequency;
  isImportant: boolean;
}

export interface Journey {
  id: string;
  title: string;
  startTime: string; // ISO
  endTime?: string; // ISO
  startLocation: string;
  endLocation?: string;
  distance: number; // in km
  status: 'upcoming' | 'in-progress' | 'completed';
  isAuto: boolean;
}

export interface ActiveJourneyState {
  isActive: boolean;
  startTime: string | null;
  startLocation: string | null;
  startCoords: { lat: number; lng: number } | null;
  currentDistance: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: string; // ISO string
}

export interface Settings {
  pushNotifications: boolean;
  notificationSound: 'Default' | 'Beep' | 'Chime' | 'Silent';
  reminderTime: number; // minutes before
  theme: 'light' | 'dark' | 'system';
  voiceLanguage: string;
}

export const DEFAULT_SETTINGS: Settings = {
  pushNotifications: true,
  notificationSound: 'Default',
  reminderTime: 15,
  theme: 'system',
  voiceLanguage: 'en-US',
};
