// src/pages/Dashboard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

// Стилі
import '../../styles/dashboard/dashboard.css';

// Дані
import dashData from '../../data/dashboard/dashboard.json';
import trainingsData from '../../data/training/trainings.json';

// Компоненти
import DashboardWidget from '../../components/cards/Dashboard/DashboardWidget.tsx';
import TrainingCard from '../../components/cards/Training/TrainingCard.tsx';

// Типи
import type { DashboardData } from '../../types';
import type { TrainingPlan } from '../../types';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();

    const data = dashData as DashboardData;

    // Беремо перші 3 тренування для рекомендацій
    const recommended = (trainingsData as TrainingPlan[]).slice(0, 3);

    // Функція розрахунку прогресу
    const calcProgress = (current: number, target: number): number => {
        return Math.min((current / target) * 100, 100);
    };

    return (
        <>
            <header>
                <h1>Огляд активності</h1>
                <div className="user-profile">
                    <span>
                        Привіт, {data.user.name}! 🔥 {data.user.streak} днів серії
                    </span>
                    <div className="avatar"></div>
                </div>
            </header>

            {/* Секція віджетів */}
            <div className="dashboard-widgets">
                <DashboardWidget
                    title="Кроки"
                    current={data.widgets.steps.current.toLocaleString()}
                    total={`/ ${data.widgets.steps.target.toLocaleString()}`}
                    progress={calcProgress(data.widgets.steps.current, data.widgets.steps.target)}
                    color="var(--accent-green)"
                />
                <DashboardWidget
                    title="Калорії (Спалено)"
                    current={data.widgets.calories.current}
                    total={`/ ${data.widgets.calories.target} ккал`}
                    progress={calcProgress(data.widgets.calories.current, data.widgets.calories.target)}
                    color="#ff4757"
                />
                <DashboardWidget
                    title="Активний час"
                    current={data.widgets.activeTime.current}
                    total={`/ ${data.widgets.activeTime.target} хв`}
                    progress={calcProgress(data.widgets.activeTime.current, data.widgets.activeTime.target)}
                    color="var(--accent-blue)"
                />
                <DashboardWidget
                    title="Вода"
                    current={data.widgets.water.current}
                    total={`/ ${data.widgets.water.target} л`}
                    progress={calcProgress(data.widgets.water.current, data.widgets.water.target)}
                    color="#00a8ff"
                />
            </div>

            {/* Секція рекомендованих тренувань */}
            <div className="section-title">
                <h2>Рекомендовані на сьогодні</h2>
                <button className="btn-small" onClick={() => navigate('/training')}>
                    Дивитись усі
                </button>
            </div>

            {/* Використовуємо TrainingCard */}
            <div className="training-grid">
                {recommended.map((training) => (
                    <TrainingCard key={training.id} training={training} />
                ))}
            </div>
        </>
    );
};

export default Dashboard;