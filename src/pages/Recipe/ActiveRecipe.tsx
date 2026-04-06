// src/pages/Recipe/ActiveRecipe.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Дані
import recipesData from '../../data/recipe/recipes.json';
import recipeDetailsData from '../../data/recipe/recipe-details.json';

// Компонент
import ActiveRecipeDetail from '../../components/cards/Recipe/ActiveRecipeDetail';

import '../../styles/recipe/ActiveRecipe.css';

// Типи
import type { Recipe, RecipeDetail, RecipeDetailsMap } from '../../types';

const ActiveRecipe: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const recipe = (recipesData as Recipe[]).find(
        (r) => r.id.toString() === id
    );

    const detailsMap = recipeDetailsData as RecipeDetailsMap;
    const detail: RecipeDetail | undefined = detailsMap[id || '1'];   // ← явно вказуємо тип

    if (!recipe || !detail) {
        return (
            <div style={{
                padding: '3rem',
                textAlign: 'center',
                color: 'var(--text-muted)'
            }}>
                <h2>Рецепт не знайдено</h2>
                <button
                    className="btn-small"
                    onClick={() => navigate('/recipes')}
                >
                    Повернутися до рецептів
                </button>
            </div>
        );
    }

    return <ActiveRecipeDetail recipe={recipe} detail={detail} />;
};

export default ActiveRecipe;