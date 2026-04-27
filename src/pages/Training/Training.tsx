// src/pages/Training/Training.tsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';

// Firebase
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';

// Компоненти
import TrainingCard from '../../components/cards/Training/TrainingCard.tsx';

// Стилі
import '../../styles/training/training.css';

// Типи
import type { TrainingPlan } from '../../types';

const Training: React.FC = () => {
    const { currentUser } = useAuth(); // Беремо поточного користувача
    const [searchParams] = useSearchParams();


    const [trainings, setTrainings] = useState<TrainingPlan[]>([]);
    const [loading, setLoading] = useState<boolean>(true);


    useEffect(() => {
        const fetchTrainings = async () => {
            try {
                // Звертаємось до колекції "trainings" у Firestore
                const querySnapshot = await getDocs(collection(db, "trainings"));

                // Перетворюємо відповідь у масив об'єктів
                const fetchedData = querySnapshot.docs.map(doc => ({
                    id: doc.id, // Тепер ID це рядок з бази даних
                    ...doc.data()
                })) as TrainingPlan[];

                setTrainings(fetchedData);
            } catch (error) {
                console.error("Помилка завантаження тренувань:", error);
            } finally {
                setLoading(false); // Вимикаємо лоадер у будь-якому випадку
            }
        };

        fetchTrainings();
    }, []);

    // Фільтри з URL
    const category = searchParams.get('category') || 'Усі';
    const difficulty = searchParams.get('difficulty') || 'all';
    const duration = searchParams.get('duration') || 'all';
    const caloriesLimit = searchParams.get('calories') || 'all';

    // Фільтрація тренувань
    const filteredTrainings = trainings.filter((t) => {
        const matchCategory = category === 'Усі' || t.category === category;
        const matchDifficulty = difficulty === 'all' || t.badge === difficulty;

        // Витягуємо числа з рядків ("50 хв" -> 50, "450 ккал" -> 450)
        const tDuration = parseInt(t.duration.toString(), 10) || 0;
        const tCalories = parseInt(t.calories.toString(), 10) || 0;

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
                        Привіт, {currentUser?.email || 'Спортсмен'}! 🔥
                    </span>
                    <div className="avatar"></div>
                </div>
            </header>

            <main className="page-main-content" style={{ padding: 0 }}>
                <div className="section-title">
                    <h2>Доступні програми</h2>
                </div>

                {loading ? (
                    // Показуємо завантаження, поки чекаємо сервер
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--accent-blue)' }}>
                        <h3>Завантаження тренувань... ⏳</h3>
                    </div>
                ) : (
                    <div className="training-grid">
                        {filteredTrainings.length === 0 ? (
                            <p style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
                                За вашими фільтрами нічого не знайдено 🕵️‍♂️
                            </p>
                        ) : (
                            filteredTrainings.map((training) => (
                                <TrainingCard key={training.id} training={training} />
                            ))
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Training;