// src/types/exercises.ts

export interface Exercise {
    id: number;
    title: string;
    image: string;
    muscle: string;
    difficulty: string;
    description: string;
    equipment: string;
    steps: string[];
    mistakes: string[];
}