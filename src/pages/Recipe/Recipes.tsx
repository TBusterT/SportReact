// src/pages/Recipes/Recipes.tsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';

// Стилі
import '../../styles/recipe/recipes.css';

// Firebase, Auth та функція завантаження бази
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { uploadRecipesAndPlans } from '../../services/seedDatabase'; // <-- ІМПОРТУВАЛИ ФУНКЦІЮ

// Компоненти карток
import MealPlanCard from '../../components/cards/Recipe/MealPlanCard.tsx';
import RecipeCard from '../../components/cards/Recipe/RecipeCard.tsx';

// Типи
import type { MealPlan, Recipe } from '../../types';

const Recipes: React.FC = () => {
    const { currentUser } = useAuth();
    const [searchParams] = useSearchParams();


    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const overlayColors = [
        'rgba(0, 255, 136, 0.25)',
        'rgba(0, 210, 255, 0.25)',
        'rgba(255, 153, 0, 0.25)',
    ];


    useEffect(() => {
        const fetchRecipesAndPlans = async () => {
            try {
                const recipesSnap = await getDocs(collection(db, "recipes"));
                const fetchedRecipes = recipesSnap.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as unknown as Recipe[];

                const plansSnap = await getDocs(collection(db, "meal_plans"));
                const fetchedPlans = plansSnap.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as unknown as MealPlan[];

                setRecipes(fetchedRecipes);
                setMealPlans(fetchedPlans);
            } catch (error) {
                console.error("Помилка завантаження рецептів:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipesAndPlans();
    }, []);

    const category = searchParams.get('recipeCategory') || 'Усі';
    const calFilter = searchParams.get('calFilter') || 'all';
    const proFilter = searchParams.get('proFilter') || 'all';
    const fatFilter = searchParams.get('fatFilter') || 'all';
    const carbFilter = searchParams.get('carbFilter') || 'all';

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
        <div className="recipes-page">
            <header>
                <h1>Рецепти та плани</h1>
                <div className="user-profile">
                    <span>Привіт, {currentUser?.email || 'Гурман'}! 🔥</span>
                    <div className="avatar"></div>
                </div>
            </header>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--accent-green)' }}>
                    <h2>Готуємо меню... 🍽️</h2>
                </div>
            ) : (
                <>

                    {recipes.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: 'var(--bg-panel)', borderRadius: '15px', marginBottom: '2rem' }}>
                            <h2 style={{ marginBottom: '10px' }}>База рецептів порожня 👨‍🍳</h2>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
                                Натисніть кнопку нижче, щоб завантажити плани харчування та рецепти у Firebase.
                            </p>
                            <button
                                onClick={async () => {
                                    await uploadRecipesAndPlans();
                                    window.location.reload(); // Автоматично оновлюємо сторінку після успіху
                                }}
                                style={{
                                    backgroundColor: 'var(--accent-blue)', color: 'white',
                                    padding: '12px 24px', borderRadius: '10px', border: 'none',
                                    fontWeight: 'bold', cursor: 'pointer', transition: '0.3s'
                                }}
                            >
                                📥 ЗАВАНТАЖИТИ РЕЦЕПТИ ТА ПЛАНИ
                            </button>
                        </div>
                    )}
                    {/* ----------------------------------------------------------------- */}

                    {mealPlans.length > 0 && (
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
                    )}

                    {recipes.length > 0 && (
                        <div className="recipes-section">
                            <div className="section-title">
                                <h2>Здорові рецепти</h2>
                            </div>
                            <div className="recipes-grid">
                                {filteredRecipes.length === 0 ? (
                                    <p style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                                        За вашими фільтрами нічого не знайдено 🕵️‍♂️
                                    </p>
                                ) : (
                                    filteredRecipes.map(recipe => (
                                        <RecipeCard key={recipe.id} recipe={recipe} />
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Recipes;