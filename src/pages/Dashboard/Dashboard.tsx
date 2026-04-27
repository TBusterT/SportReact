// src/pages/Dashboard/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, getDocs, query, limit } from 'firebase/firestore';

// Стилі
import '../../styles/dashboard/dashboard.css';

// Компоненти
import DashboardWidget from '../../components/cards/Dashboard/DashboardWidget.tsx';
import TrainingCard from '../../components/cards/Training/TrainingCard.tsx';

// Firebase
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { uploadDashboardData, uploadTrainingsToFirebase } from '../../services/seedDatabase';

// Типи
import type { DashboardData, TrainingPlan } from '../../types';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    // СТАНИ ДЛЯ ДАНИХ З БАЗИ
    const [dashData, setDashData] = useState<DashboardData | null>(null);
    const [recommended, setRecommended] = useState<TrainingPlan[]>([]); // Тренування
    const [loading, setLoading] = useState<boolean>(true);

    // ЗАВАНТАЖЕННЯ ДАНИХ (useEffect)
    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!currentUser) return;

            try {
                // 1. Завантажуємо особисту статистику (віджети)
                const dashRef = doc(db, "user_dashboard", currentUser.uid);
                const dashSnap = await getDoc(dashRef);

                if (dashSnap.exists()) {
                    setDashData(dashSnap.data() as DashboardData);
                }
                // 2. Завантажуємо 3 рекомендовані тренування
                const trainingsQuery = query(collection(db, "trainings"), limit(3));
                const trainingsSnap = await getDocs(trainingsQuery);
                const fetchedTrainings = trainingsSnap.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as unknown as TrainingPlan[];

                setRecommended(fetchedTrainings);
            } catch (error) {
                console.error("Помилка завантаження дашборду:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [currentUser]);

    // Функція розрахунку прогресу
    const calcProgress = (current: number, target: number): number => {
        return Math.min((current / target) * 100, 100);
    };

    return (
        <div className="dashboard-page">
            <header>
                <h1>Огляд активності</h1>
                <div className="user-profile">
                    <span>
                        Привіт, {currentUser?.email || 'Спортсмен'}! 🔥 {dashData?.streak || 0} днів серії
                    </span>
                    <div className="avatar"></div>
                </div>
            </header>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--accent-blue)' }}>
                    <h2>Завантажуємо вашу панель... ⏳</h2>
                </div>
            ) : (
                <>
                    {/* --- КНОПКА ГЕНЕРАЦІЇ ВІДЖЕТІВ (Якщо немає даних) --- */}
                    {!dashData && (
                        <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: 'var(--bg-panel)', borderRadius: '15px', marginBottom: '2rem' }}>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '10px' }}>У вас ще немає стартової статистики віджетів.</p>
                            <button
                                onClick={async () => {
                                    if (currentUser) {
                                        await uploadDashboardData(currentUser.uid);
                                        window.location.reload();
                                    }
                                }}
                                style={{ background: 'var(--accent-green)', color: 'var(--bg-dark)', padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                                📊 Згенерувати віджети
                            </button>
                        </div>
                    )}

                    {/* Секція віджетів */}
                    {dashData && dashData.widgets && (
                        <div className="dashboard-widgets">
                            <DashboardWidget
                                title="Кроки"
                                current={dashData.widgets.steps.current.toLocaleString()}
                                total={`/ ${dashData.widgets.steps.target.toLocaleString()}`}
                                progress={calcProgress(dashData.widgets.steps.current, dashData.widgets.steps.target)}
                                color="var(--accent-green)"
                            />
                            <DashboardWidget
                                title="Калорії (Спалено)"
                                current={dashData.widgets.calories.current}
                                total={`/ ${dashData.widgets.calories.target} ккал`}
                                progress={calcProgress(dashData.widgets.calories.current, dashData.widgets.calories.target)}
                                color="#ff4757"
                            />
                            <DashboardWidget
                                title="Активний час"
                                current={dashData.widgets.activeTime.current}
                                total={`/ ${dashData.widgets.activeTime.target} хв`}
                                progress={calcProgress(dashData.widgets.activeTime.current, dashData.widgets.activeTime.target)}
                                color="var(--accent-blue)"
                            />
                            <DashboardWidget
                                title="Вода"
                                current={dashData.widgets.water.current}
                                total={`/ ${dashData.widgets.water.target} л`}
                                progress={calcProgress(dashData.widgets.water.current, dashData.widgets.water.target)}
                                color="#00a8ff"
                            />
                        </div>
                    )}

                    {/* Секція рекомендованих тренувань */}
                    <div className="section-title">
                        <h2>Рекомендовані на сьогодні</h2>
                        <button className="btn-small" onClick={() => navigate('/training')}>
                            Дивитись усі
                        </button>
                    </div>

                    {/* --- КНОПКА ГЕНЕРАЦІЇ ТРЕНУВАНЬ (Якщо база порожня) --- */}
                    {recommended.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: 'var(--bg-panel)', borderRadius: '15px' }}>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '10px' }}>База тренувань порожня.</p>
                            <button
                                onClick={async () => {
                                    await uploadTrainingsToFirebase();
                                    window.location.reload();
                                }}
                                style={{ background: 'var(--accent-blue)', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                                📤 Завантажити 50 тренувань
                            </button>
                        </div>
                    ) : (
                        <div className="training-grid">
                            {recommended.map((training) => (
                                <TrainingCard key={training.id} training={training} />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Dashboard;

