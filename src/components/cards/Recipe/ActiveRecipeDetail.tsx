// src/components/cards/Recipe/ActiveRecipeDetail.tsx
import React from 'react';
import type { Recipe, RecipeDetail } from '../../../types';

interface ActiveRecipeDetailProps {
    recipe: Recipe;
    detail: RecipeDetail;
}

const ActiveRecipeDetail: React.FC<ActiveRecipeDetailProps> = ({ recipe, detail }) => {
    return (
        <div className="recipe-mode">
            <header className="recipe-header">
                <button
                    className="btn-back"
                    onClick={() => window.history.back()}
                >
                    ← До всіх рецептів
                </button>
            </header>

            <main className="recipe-container">
                {/* Hero секція */}
                <div className="recipe-hero">
                    <img src={recipe.image} alt={recipe.title} />
                    <div className="recipe-hero-content">
                        <span className="category-badge">{recipe.category}</span>
                        <h1>{recipe.title}</h1>

                        <div className="recipe-meta-badges">
                            <span>🕒 {recipe.time}</span>
                            <span>🍽 {detail.servings} порцій</span>
                        </div>

                        <div className="recipe-macros">
                            <span className="macro kcal">🔥 {recipe.calories} ккал</span>
                            <span className="macro protein">Б: {recipe.protein}г</span>
                            <span className="macro fat">Ж: {recipe.fat}г</span>
                            <span className="macro carbs">В: {recipe.carbs}г</span>
                        </div>
                    </div>
                </div>

                {/* Нижня сітка */}
                <div className="recipe-details-grid">
                    {/* Інгредієнти */}
                    <aside className="ingredients-panel">
                        <h3>Інгредієнти</h3>
                        <ul className="checklist">
                            {detail.ingredients.map((item, index) => (
                                <li key={index}>
                                    <input type="checkbox" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </aside>

                    {/* Кроки приготування */}
                    <section className="instructions-panel">
                        <h3>Як готувати</h3>
                        <div className="steps-container">
                            {detail.steps.map((step, index) => (
                                <div key={index} className="step-item">
                                    <div className="step-number">{index + 1}</div>
                                    <div className="step-text">{step}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default ActiveRecipeDetail;