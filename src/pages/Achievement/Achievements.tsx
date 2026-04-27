// src/pages/Achievement/Achievements.tsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';

// Стилі
import '../../styles/achievement/achievements.css';

// Firebase та Auth
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { uploadAchievements } from '../../services/seedDatabase'; // <-- Імпорт функції

// Компонент картки
import AchievementCard from '../../components/cards/Achievement/AchievementCard.tsx';

// Типи
import type { Achievement } from '../../types';

const Achievements: React.FC = () => {
    const { currentUser } = useAuth();
    const [searchParams] = useSearchParams();

    // СТАНИ ДЛЯ ДАНИХ
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const filterStatus = searchParams.get('status') || 'all';

    // ЗАВАНТАЖЕННЯ ДАНИХ (useEffect)
    useEffect(() => {
        const fetchAchievements = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "achievements"));
                const fetchedData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as unknown as Achievement[];

                setAchievements(fetchedData);
            } catch (error) {
                console.error("Помилка завантаження досягнень:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAchievements();
    }, []);

    // === РОЗРАХУНОК СТАТИСТИКИ (на основі завантажених даних) ===
    const totalCount = achievements.length;
    const unlockedCount = achievements.filter(ach => ach.isUnlocked).length;
    const totalPoints = achievements
        .filter(ach => ach.isUnlocked)
        .reduce((sum, ach) => sum + ach.points, 0);

    const currentLevel = Math.floor(totalPoints / 300) + 1;

    // === ЛОГІКА ФІЛЬТРАЦІЇ ===
    const filteredAchievements = achievements.filter(ach => {
        if (filterStatus === 'all') return true;
        if (filterStatus === 'unlocked') return ach.isUnlocked;
        if (filterStatus === 'locked') return !ach.isUnlocked;
        return true;
    });

    return (
        <div className="achievements-page">
            <header>
                <h1>Мої досягнення</h1>
                <div className="user-profile">
                    <span>
                        Привіт, {currentUser?.email || 'Чемпіон'}! 🏆
                    </span>
                    <div className="avatar"></div>
                </div>
            </header>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--accent-blue)' }}>
                    <h2>Підраховуємо бали... ⏳</h2>
                </div>
            ) : (
                <>
                    {/* --- КНОПКА ЗАВАНТАЖЕННЯ (Показується тільки якщо база порожня) --- */}
                    {achievements.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: 'var(--bg-panel)', borderRadius: '15px', marginBottom: '2rem' }}>
                            <h2 style={{ marginBottom: '10px' }}>У вас ще немає досягнень 🏅</h2>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
                                Натисніть кнопку нижче, щоб завантажити базові досягнення у Firebase.
                            </p>
                            <button
                                onClick={async () => {
                                    await uploadAchievements();
                                    window.location.reload();
                                }}
                                style={{
                                    backgroundColor: '#f1c40f', color: 'var(--bg-dark)',
                                    padding: '12px 24px', borderRadius: '10px', border: 'none',
                                    fontWeight: 'bold', cursor: 'pointer', transition: '0.3s'
                                }}
                            >
                                📥 СТВОРИТИ ДОСЯГНЕННЯ
                            </button>
                        </div>
                    )}
                    {/* ----------------------------------------------------------------- */}

                    {achievements.length > 0 && (
                        <>
                            {/* СЕКЦІЯ 1: СТАТИСТИКА ПРОФІЛЮ */}
                            <div className="achievements-stats">
                                <h2>Ваш профіль</h2>
                                <div className="stats-grid">
                                    <div className="stat-card">
                                        <h3>Розблоковано</h3>
                                        <div className="stat-value" id="stat-unlocked">{unlockedCount}</div>
                                        <div className="stat-detail">З {totalCount} можливих</div>
                                    </div>
                                    <div className="stat-card">
                                        <h3>Бали</h3>
                                        <div className="stat-value" id="stat-points">{totalPoints}</div>
                                        <div className="stat-detail">Загальні бали</div>
                                    </div>
                                    <div className="stat-card">
                                        <h3>Рівень</h3>
                                        <div className="stat-value" id="stat-level">{currentLevel}</div>
                                        <div className="stat-detail">Поточний рівень</div>
                                    </div>
                                </div>
                            </div>

                            {/* СЕКЦІЯ 2: КАРТКИ ДОСЯГНЕНЬ */}
                            <div className="achievements-overview">
                                <h2>Досягнення</h2>
                                <div className="achievements-grid">
                                    {filteredAchievements.length === 0 ? (
                                        <p
                                            style={{
                                                gridColumn: '1/-1',
                                                textAlign: 'center',
                                                color: 'var(--text-muted)',
                                                padding: '2rem',
                                            }}
                                        >
                                            За вашим фільтром нічого не знайдено.
                                        </p>
                                    ) : (
                                        filteredAchievements.map(ach => (
                                            <AchievementCard key={ach.id} achievement={ach} />
                                        ))
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default Achievements;