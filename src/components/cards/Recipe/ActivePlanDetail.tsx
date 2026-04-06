// src/components/cards/Recipe/ActivePlanDetail.tsx
import React from 'react';
import type { MealPlan } from '../../../types';

interface ActivePlanDetailProps {
    plan: MealPlan;
    onActivatePlan: () => void;
}

const ActivePlanDetail: React.FC<ActivePlanDetailProps> = ({ plan, onActivatePlan }) => {
    return (
        <div className="plan-mode">
            <header className="plan-header">
                <button
                    className="btn-back"
                    onClick={() => window.history.back()}
                >
                    ← Повернутися назад
                </button>
            </header>

            <main className="plan-container">
                {/* Hero секція */}
                <div className="plan-hero">
                    <img src={plan.image} alt={plan.title} />
                    <div className="plan-hero-content">
                        <span className="category-badge">{plan.badge}</span>
                        <h1>{plan.title}</h1>
                        <p className="plan-desc">{plan.description}</p>

                        <div className="plan-macros-summary">
                            <div className="macro-box">
                                <div className="label">Калорії</div>
                                <div className="val kcal">{plan.calories}</div>
                            </div>
                            <div className="macro-box">
                                <div className="label">Білки</div>
                                <div className="val protein">{plan.protein}</div>
                            </div>
                            <div className="macro-box">
                                <div className="label">Жири</div>
                                <div className="val fat">{plan.fat}</div>
                            </div>
                            <div className="macro-box">
                                <div className="label">Вуглеводи</div>
                                <div className="val carbs">{plan.carbs}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Розклад */}
                <div className="plan-content-section">
                    <div className="section-title">
                        <h2>Щоденний розклад</h2>
                        <button
                            className="btn-start"
                            onClick={onActivatePlan}
                        >
                            Активувати цей план
                        </button>
                    </div>

                    <div className="schedule-container">
                        {plan.schedule.map((dayItem, dayIndex) => (
                            <div key={dayIndex} className="schedule-day">
                                <h3 className="day-title">{dayItem.day}</h3>
                                <div className="meals-list">
                                    {dayItem.meals.map((meal, mealIndex) => (
                                        <div key={mealIndex} className="plan-meal-item">
                                            <div className="meal-type">{meal.type}</div>
                                            <div className="meal-name">{meal.name}</div>
                                            <div className="meal-kcal">{meal.kcal} ккал</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ActivePlanDetail;