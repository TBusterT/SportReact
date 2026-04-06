// src/pages/Recipes.tsx
import React from 'react';
import { useSearchParams } from 'react-router-dom';

// Стилі
import '../../styles/recipe/recipes.css';

// Дані
import dashData from '../../data/dashboard/dashboard.json';
import recipesData from '../../data/recipe/recipes.json';
import mealPlansData from '../../data/recipe/meal-plans.json';

// Компоненти карток
import MealPlanCard from '../../components/cards/Recipe/MealPlanCard.tsx';
import RecipeCard from '../../components/cards/Recipe/RecipeCard.tsx';

// Типи
import type { MealPlan, Recipe } from '../../types';

const Recipes: React.FC = () => {
    const [searchParams] = useSearchParams();

    const recipes = recipesData as Recipe[];
    const mealPlans = mealPlansData as MealPlan[];

    // Кольори для градієнтів планів
    const overlayColors = [
        'rgba(0, 255, 136, 0.25)',
        'rgba(0, 210, 255, 0.25)',
        'rgba(255, 153, 0, 0.25)',
    ];

    // Фільтри з URL
    const category = searchParams.get('recipeCategory') || 'Усі';
    const calFilter = searchParams.get('calFilter') || 'all';
    const proFilter = searchParams.get('proFilter') || 'all';
    const fatFilter = searchParams.get('fatFilter') || 'all';
    const carbFilter = searchParams.get('carbFilter') || 'all';

    // Фільтрація рецептів
    const filteredRecipes = recipes.filter(r => {
        const matchCategory = category === 'Усі' || r.category === category;

        let matchCal = true;
        if (calFilter === 'low') matchCal = r.calories <= 300;
        else if (calFilter === 'medium') matchCal = r.calories > 300 && r.calories <= 500;
        else if (calFilter === 'high') matchCal = r.calories > 500;

        let matchPro = true;
        if (proFilter === 'low') matchPro = r.protein <= 15;
        else if (proFilter === 'medium') matchPro = r.protein > 15 && r.protein <= 30;
        else if (proFilter === 'high') matchPro = r.protein > 30;

        let matchFat = true;
        if (fatFilter === 'low') matchFat = r.fat <= 10;
        else if (fatFilter === 'medium') matchFat = r.fat > 10 && r.fat <= 20;
        else if (fatFilter === 'high') matchFat = r.fat > 20;

        let matchCarb = true;
        if (carbFilter === 'low') matchCarb = r.carbs <= 20;
        else if (carbFilter === 'medium') matchCarb = r.carbs > 20 && r.carbs <= 50;
        else if (carbFilter === 'high') matchCarb = r.carbs > 50;

        return matchCategory && matchCal && matchPro && matchFat && matchCarb;
    });

    return (
        <>
            <header>
                <h1>Рецепти та плани</h1>
                <div className="user-profile">
                    <span>Привіт, {dashData.user.name}! 🔥 {dashData.user.streak} днів серії</span>
                    <div className="avatar"></div>
                </div>
            </header>

            {/* ПЛАНИ ХАРЧУВАННЯ */}
            <div className="meal-plans-section">
                <div className="section-title">
                    <h2>Рекомендовані плани харчування</h2>
                </div>
                <div className="plans-grid">
                    {mealPlans.map((plan, index) => {
                        const overlayColor = overlayColors[index % overlayColors.length];
                        return (
                            <MealPlanCard
                                key={plan.id}
                                plan={plan}
                                overlayColor={overlayColor}
                            />
                        );
                    })}
                </div>
            </div>

            {/* РЕЦЕПТИ */}
            <div className="recipes-section">
                <div className="section-title">
                    <h2>Здорові рецепти</h2>
                </div>
                <div className="recipes-grid">
                    {filteredRecipes.length === 0 ? (
                        <p
                            style={{
                                gridColumn: '1/-1',
                                textAlign: 'center',
                                color: 'var(--text-muted)',
                                padding: '2rem',
                            }}
                        >
                            За вашими фільтрами нічого не знайдено 🕵️‍♂️
                        </p>
                    ) : (
                        filteredRecipes.map(recipe => (
                            <RecipeCard key={recipe.id} recipe={recipe} />
                        ))
                    )}
                </div>
            </div>
        </>
    );
};

export default Recipes;