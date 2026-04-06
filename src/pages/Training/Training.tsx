// src/pages/Training.tsx
import React from 'react';
import { useSearchParams } from 'react-router-dom';

// Дані
import trainingsData from '../../data/training/trainings.json';
import dashData from '../../data/dashboard/dashboard.json';

// Компоненти
import TrainingCard from '../../components/cards/Training/TrainingCard.tsx';

// Стилі
import '../../styles/training/training.css';

// Типи
import type { TrainingPlan } from '../../types';

const Training: React.FC = () => {
    const [searchParams] = useSearchParams();

    const trainings = trainingsData as TrainingPlan[];

    // Фільтри з URL (з сайдбару)
    const category = searchParams.get('category') || 'Усі';
    const difficulty = searchParams.get('difficulty') || 'all';
    const duration = searchParams.get('duration') || 'all';
    const caloriesLimit = searchParams.get('calories') || 'all';

    // Фільтрація тренувань
    const filteredTrainings = trainings.filter((t) => {
        const matchCategory = category === 'Усі' || t.category === category;
        const matchDifficulty = difficulty === 'all' || t.badge === difficulty;

        const tDuration = parseInt(t.duration, 10);
        const tCalories = parseInt(t.calories, 10);

        let matchDuration = true;
        if (duration === 'short') matchDuration = tDuration <= 20;
        else if (duration === 'medium') matchDuration = tDuration > 20 && tDuration <= 40;
        else if (duration === 'long') matchDuration = tDuration > 40;

        let matchCalories = true;
        if (caloriesLimit === 'low') matchCalories = tCalories <= 200;
        else if (caloriesLimit === 'medium') matchCalories = tCalories > 200 && tCalories <= 400;
        else if (caloriesLimit === 'high') matchCalories = tCalories > 400;

        return matchCategory && matchDifficulty && matchDuration && matchCalories;
    });

    return (
        <div className="training-page">
            <header>
                <h1>Тренування</h1>
                <div className="user-profile">
                    <span>
                        Привіт, {dashData.user.name}! 🔥 {dashData.user.streak} днів серії
                    </span>
                    <div className="avatar"></div>
                </div>
            </header>

            <main className="page-main-content" style={{ padding: 0 }}>
                <div className="section-title">
                    <h2>Доступні програми</h2>
                </div>

                <div className="training-grid">
                    {filteredTrainings.length === 0 ? (
                        <p
                            style={{
                                gridColumn: '1/-1',
                                textAlign: 'center',
                                color: 'var(--text-muted)',
                                padding: '3rem',
                            }}
                        >
                            За вашими фільтрами нічого не знайдено 🕵️‍♂️
                        </p>
                    ) : (
                        filteredTrainings.map((training) => (
                            <TrainingCard key={training.id} training={training} />
                        ))
                    )}
                </div>
            </main>
        </div>
    );
};

export default Training;