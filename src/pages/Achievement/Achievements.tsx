// src/pages/Achievements.tsx
import React from 'react';
import { useSearchParams } from 'react-router-dom';

// Підключаємо стилі
import '../../styles/achievement/achievements.css';

// Дані
import dashData from '../../data/dashboard/dashboard.json';
import achievementsData from '../../data/achievement/achievements.json';

// Компонент картки
import AchievementCard from '../../components/cards/Achievement/AchievementCard.tsx';

// Типи
import type { Achievement } from '../../types';

const Achievements: React.FC = () => {
    const [searchParams] = useSearchParams();

    const achievements = achievementsData as Achievement[];

    // Фільтр з URL (встановлюється в Sidebar.tsx)
    const filterStatus = searchParams.get('status') || 'all';

    // === РОЗРАХУНОК СТАТИСТИКИ ===
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
        <>
            <header>
                <h1>Мої досягнення</h1>
                <div className="user-profile">
                    <span>
                        Привіт, {dashData.user.name}! 🔥 {dashData.user.streak} днів серії
                    </span>
                    <div className="avatar"></div>
                </div>
            </header>

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
    );
};

export default Achievements;