// src/types/diet.ts

export interface OverviewItem {
    title: string;
    current: number;
    max: number;
    unit: string;
    color: string;
}

export interface MealItem {
    title: string;
    image: string;
    calories: number;
    macros: string;
    description: string;
}

export interface TrackedItem {
    name: string;
    calories: number;
    protein?: number;   // додаємо
    fat?: number;
    carbs?: number;
}

export interface DailyPlan {
    mealType: string;
    items: MealItem[];
}

export interface DietDataStructure {
    overview: OverviewItem[];
    dailyPlan: DailyPlan[];
    tracked: TrackedItem[];
}