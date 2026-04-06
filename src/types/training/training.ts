// src/types/training/training.ts

export interface TrainingPlan {
    id: number | string;
    title: string;
    image?: string;
    badge?: string;
    duration: string;
    calories: string;
    description: string;
    category: string;
}

export interface WorkoutDetail {
    video: string;
    fullDescription: string;
    tips: string[];
}

export interface WorkoutDetailsMap {
    [key: string]: WorkoutDetail;
}