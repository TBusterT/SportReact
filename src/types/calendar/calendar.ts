// src/types/calendar.ts

export interface CalendarEvent {
    id: number | string;
    date: string;           // "YYYY-MM-DD"
    title: string;
    duration?: string;      // наприклад "45 хв"
    status: 'completed' | 'planned';
}