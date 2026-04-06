// src/types/goals.ts

export interface Goal {
    id: number;
    type: string;
    title: string;
    description: string;
    current: number;
    target: number;
    unit: string;
    deadline: string;
    status: string; // 'active' | 'completed'
    image: string;
}