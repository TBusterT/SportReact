// src/pages/Progress.tsx
import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';

// Підключаємо стилі
import '../../styles/progress/progress.css';

// Firebase та Auth
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { uploadProgressData } from '../../services/seedDatabase';

// Компоненти
import SimpleBarChart from '../../components/cards/Progress/SimpleBarChart.tsx';
import TrainingHistoryCard from '../../components/cards/Progress/TrainingHistoryCard.tsx';

// Типи
import type { ProgressDataStructure } from '../../types';

const Progress: React.FC = () => {
    const { currentUser } = useAuth();

    // СТАНИ ДЛЯ ДАНИХ З БАЗИ
    const [data, setData] = useState<ProgressDataStructure | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // ЗАВАНТАЖЕННЯ ДАНИХ (useEffect)
    useEffect(() => {
        const fetchProgress = async () => {
            if (!currentUser) return;

            try {
                // Дістаємо документ прогресу поточного користувача з колекції user_progress
                const docRef = doc(db, "user_progress", currentUser.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    // Перетворюємо дані з Firestore у наш інтерфейс
                    setData(docSnap.data() as unknown as ProgressDataStructure);
                } else {
                    console.log("Дані прогресу не знайдені в Firebase.");
                }
            } catch (error) {
                console.error("Помилка завантаження прогресу:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProgress();
    }, [currentUser]);

    return (
        <div className="progress-page">
            <header>
                <h1>Мій прогрес</h1>
                <div className="user-profile">
                    <span>
                        Привіт, {currentUser?.email || 'Чемпіон'}! 📈
                    </span>
                    <div className="avatar"></div>
                </div>
            </header>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--accent-blue)' }}>
                    <h2>Рахуємо вашу статистику... ⏳</h2>
                </div>
            ) : !data ? (
                <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: 'var(--bg-panel)', borderRadius: '15px', marginBottom: '2rem' }}>
                    <h2 style={{ marginBottom: '10px' }}>У вас ще немає історії тренувань 📊</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
                        Натисніть кнопку нижче, щоб завантажити стартову статистику.
                    </p>
                    <button
                        onClick={async () => {
                            if (currentUser) {
                                await uploadProgressData(currentUser.uid);
                                window.location.reload();
                            }
                        }}
                        style={{
                            backgroundColor: 'var(--accent-blue)', color: 'white',
                            padding: '12px 24px', borderRadius: '10px', border: 'none',
                            fontWeight: 'bold', cursor: 'pointer', transition: '0.3s'
                        }}
                    >
                        📥 СТВОРИТИ СТАТИСТИКУ
                    </button>
                </div>
            ) : (
                <>
                    {/* --- СЕКЦІЯ 1: ОГЛЯД (Дані з поля overall) --- */}
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

                    {/* --- СЕКЦІЯ 2: ГРАФІКИ (Дані з поля charts) --- */}
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

                    {/* --- СЕКЦІЯ 3: ІСТОРІЯ ТРЕНУВАНЬ (Поле history) --- */}
                    <div className="section-title">
                        <h2>Історія тренувань</h2>
                    </div>

                    <div className="history-filters">
                        <button className="btn-filter active">Всі</button>
                        <button className="btn-filter">За тиждень</button>
                        <button className="btn-filter">За місяць</button>
                    </div>

                    <div className="training-list">
                        {data.history.length === 0 ? (
                            <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Історія поки порожня</p>
                        ) : (
                            /* .slice().reverse() робимо, щоб показувати найновіші тренування зверху,
                               не змінюючи оригінальний масив у стані */
                            data.history.slice().reverse().map(item => (
                                <TrainingHistoryCard key={item.id} item={item} />
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default Progress;