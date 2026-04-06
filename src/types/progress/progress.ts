// src/types/progress.ts

export interface HistoryItem {
    id: number;
    title: string;
    duration: string;
    calories: number;
    date: string;
    image: string;
}

export interface ProgressDataStructure {
    overall: {
        workouts: number;
        calories: number;
        steps: number;
        streak: number;
    };
    charts: {
        stepsWeekly: number[];
        caloriesMonthly: number[];
    };
    history: HistoryItem[];
}