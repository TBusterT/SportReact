// src/pages/Diet.tsx
import React from 'react';

// Підключаємо стилі
import '../../styles/diet/diet.css';

// Дані
import dashData from '../../data/dashboard/dashboard.json';
import dietJson from '../../data/diet/diet.json';

// Компоненти
import DietOverviewWidget from '../../components/cards/Diet/DietOverviewWidget.tsx';
import MealItemCard from '../../components/cards/Diet/MealItemCard.tsx';
import TrackedItemCard from '../../components/cards/Diet/TrackedItemCard.tsx';

// Типи
import type { DietDataStructure } from '../../types';

const Diet: React.FC = () => {
    const dietData = dietJson as DietDataStructure;

    return (
        <>
            <header>
                <h1>Раціон</h1>
                <div className="user-profile">
                    <span>
                        Привіт, {dashData.user.name}! 🔥 {dashData.user.streak} днів серії
                    </span>
                    <div className="avatar"></div>
                </div>
            </header>

            {/* --- СЕКЦІЯ 1: ОГЛЯД (Віджети БЖВ) --- */}
            <div className="diet-overview">
                <div className="section-title">
                    <h2>Огляд харчування сьогодні</h2>
                </div>
                <div className="diet-widgets">
                    {dietData.overview.map((item, index) => (
                        <DietOverviewWidget key={index} item={item} />
                    ))}
                </div>
            </div>

            {/* Розділяємо екран на 2 колонки */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '2rem',
                }}
            >
                {/* --- СЕКЦІЯ 2: ПЛАН ХАРЧУВАННЯ --- */}
                <div className="daily-plan" style={{ flex: 2 }}>
                    <div className="section-title">
                        <h2>План на сьогодні</h2>
                    </div>
                    <div>
                        {dietData.dailyPlan.map((plan, index) => (
                            <div key={index} className="meal-section">
                                <h3>{plan.mealType}</h3>
                                <div>
                                    {plan.items.map((meal, idx) => (
                                        <MealItemCard key={idx} meal={meal} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- СЕКЦІЯ 3: ТРЕКЕР КАЛОРІЙ --- */}
                <div className="calorie-tracker" style={{ flex: 1 }}>
                    <div className="section-title">
                        <h2>Відстеження калорій</h2>
                    </div>

                    <div className="tracker-form">
                        <input type="text" placeholder="Назва страви або продукту" />
                        <input type="number" placeholder="Калорії (ккал)" />
                        <button className="btn-track">Додати до трекера</button>
                    </div>

                    <div className="tracked-items">
                        {dietData.tracked.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
                                Ви ще нічого не додали.
                            </p>
                        ) : (
                            dietData.tracked.map((item, idx) => (
                                <TrackedItemCard key={idx} item={item} />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Diet;