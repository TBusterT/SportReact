// src/components/cards/RecipeCard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Recipe } from '../../../types';

interface RecipeCardProps {
    recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
    const navigate = useNavigate();

    const handleClick = () => navigate(`/active-recipe/${recipe.id}`);

    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        navigate(`/active-recipe/${recipe.id}`);
    };

    return (
        <div className="recipe-card" onClick={handleClick}>
            <div className="recipe-image">
                <img src={recipe.image} alt={recipe.title} />
                <span className="recipe-time">🕒 {recipe.time}</span>
            </div>

            <div className="recipe-content">
                <h4>{recipe.title}</h4>
                <div className="recipe-macros">
                    <span className="macro kcal">🔥 {recipe.calories} ккал</span>
                    <span className="macro protein">Б: {recipe.protein}г</span>
                    <span className="macro fat">Ж: {recipe.fat}г</span>
                    <span className="macro carbs">В: {recipe.carbs}г</span>
                </div>
                <p className="recipe-description">{recipe.description}</p>

                <button className="btn-read-more" onClick={handleButtonClick}>
                    Читати рецепт
                </button>
            </div>
        </div>
    );
};

export default RecipeCard;