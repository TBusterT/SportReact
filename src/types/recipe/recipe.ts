// src/types/recipe/recipe.ts

// Основний рецепт зі списку
export interface Recipe {
    id: number;
    title: string;
    image: string;
    time: string;
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
    description: string;
    category: string;
}

// Детальна інформація про рецепт (ingredients + steps)
export interface RecipeDetail {
    servings: number;
    ingredients: string[];
    steps: string[];
}

// Мапа деталей за ID
export interface RecipeDetailsMap {
    [key: string]: RecipeDetail;
}

// План харчування (MealPlan)
export interface MealPlan {
    id: number;
    title: string;
    badge: string;
    image: string;
    description: string;
    calories: string;
    protein: string;
    fat: string;
    carbs: string;
    schedule: {
        day: string;
        meals: {
            type: string;
            name: string;
            kcal: number;
        }[];
    }[];
}