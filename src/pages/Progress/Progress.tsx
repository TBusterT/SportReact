// src/pages/Progress.tsx
import React from 'react';

// Підключаємо стилі
import '../../styles/progress/progress.css';

// Дані
import dashData from '../../data/dashboard/dashboard.json';
import progressData from '../../data/progress/progress.json';

// Компоненти
import SimpleBarChart from '../../components/cards/Progress/SimpleBarChart.tsx';
import TrainingHistoryCard from '../../components/cards/Progress/TrainingHistoryCard.tsx';

// Типи
import type { ProgressDataStructure } from '../../types';

const Progress: React.FC = () => {
    const data = progressData as ProgressDataStructure;
    const history = data.history;

    return (
        <>
            <header>
                <h1>Мій прогрес</h1>
                <div className="user-profile">
                    <span>
                        Привіт, {dashData.user.name}! 🔥 {dashData.user.streak} днів серії
                    </span>
                    <div className="avatar"></div>
                </div>
            </header>

            {/* --- СЕКЦІЯ 1: ОГЛЯД (Віджети статистики) --- */}
            <div className="progress-overview">
                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Всього тренувань</h3>
                        <div className="stat-value" style={{ color: 'var(--accent-green)' }}>
                            {data.overall.workouts}
                        </div>
                        <div className="stat-detail">За весь час</div>
                    </div>
                    <div className="stat-card">
                        <h3>Спалено калорій</h3>
                        <div className="stat-value" style={{ color: '#ff4757' }}>
                            {data.overall.calories.toLocaleString()} <span>ккал</span>
                        </div>
                        <div className="stat-detail">Загалом</div>
                    </div>
                    <div className="stat-card">
                        <h3>Кроки</h3>
                        <div className="stat-value" style={{ color: 'var(--accent-blue)' }}>
                            {data.overall.steps.toLocaleString()}
                        </div>
                        <div className="stat-detail">Загальна кількість</div>
                    </div>
                    <div className="stat-card">
                        <h3>Серія днів</h3>
                        <div className="stat-value" style={{ color: '#ffcc00' }}>
                            {data.overall.streak} <span>днів</span>
                        </div>
                        <div className="stat-detail">Поточна</div>
                    </div>
                </div>
            </div>

            {/* --- СЕКЦІЯ 2: ГРАФІКИ --- */}
            <div className="section-title">
                <h2>Аналітика</h2>
            </div>
            <div className="charts-grid">
                <SimpleBarChart
                    data={data.charts.stepsWeekly}
                    color="var(--accent-blue)"
                    label="Кроки (Останні 7 днів)"
                />
                <SimpleBarChart
                    data={data.charts.caloriesMonthly}
                    color="#ff4757"
                    label="Калорії (Останні дні)"
                />
            </div>

            {/* --- СЕКЦІЯ 3: ІСТОРІЯ ТРЕНУВАНЬ --- */}
            <div className="section-title">
                <h2>Історія тренувань</h2>
            </div>

            <div className="history-filters">
                <button className="btn-filter active">Всі</button>
                <button className="btn-filter">За тиждень</button>
                <button className="btn-filter">За місяць</button>
            </div>

            <div className="training-list">
                {history.map(item => (
                    <TrainingHistoryCard key={item.id} item={item} />
                ))}
            </div>
        </>
    );
};

export default Progress;