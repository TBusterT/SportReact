// src/types/achievements.ts

export interface Achievement {
    id: number | string;
    title: string;
    description: string;
    points: number;
    icon: string;
    isUnlocked: boolean;
    unlockedDate?: string;
    current: number;
    target: number;
    unit: string;
}