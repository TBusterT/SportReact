// src/components/cards/MealItemCard.tsx
import React from 'react';
import type { MealItem } from '../../../types';

interface MealItemCardProps {
    meal: MealItem;
}

const MealItemCard: React.FC<MealItemCardProps> = ({ meal }) => {
    return (
        <div className="meal-item">
            <div className="meal-image">
                <img src={meal.image} alt={meal.title} />
            </div>
            <div className="meal-details">
                <h4>{meal.title}</h4>
                <div className="meal-info">
                    <span style={{ color: '#ff4757' }}>🔥 {meal.calories} ккал</span>
                    <span>{meal.macros}</span>
                </div>
                <p className="meal-description">{meal.description}</p>
            </div>
            <button className="btn-add">+ Додати</button>
        </div>
    );
};

export default MealItemCard;