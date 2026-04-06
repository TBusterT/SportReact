// src/pages/Recipe/ActivePlan.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Дані
import mealPlansData from '../../data/recipe/meal-plans.json';

// Компонент детальної сторінки
import ActivePlanDetail from '../../components/cards/Recipe/ActivePlanDetail';

// Тип
import type { MealPlan } from '../../types';

import '../../styles/recipe/ActivePlan.css';

const ActivePlan: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const plan = (mealPlansData as MealPlan[]).find(
        (p) => p.id.toString() === id
    );

    if (!plan) {
        return (
            <div style={{
                padding: '3rem',
                textAlign: 'center',
                color: 'var(--text-muted)'
            }}>
                <h2>План харчування не знайдено</h2>
                <button
                    className="btn-small"
                    onClick={() => navigate('/recipes')}
                >
                    Повернутися до планів
                </button>
            </div>
        );
    }

    const handleActivatePlan = () => {
        alert(`✅ План "${plan.title}" успішно активовано!`);
        // Тут пізніше можна додати логіку збереження в глобальний стан
    };

    return (
        <ActivePlanDetail
            plan={plan}
            onActivatePlan={handleActivatePlan}
        />
    );
};

export default ActivePlan;