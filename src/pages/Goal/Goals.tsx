// src/pages/Goals.tsx
import React from 'react';
import { useSearchParams } from 'react-router-dom';

// Підключаємо стилі
import '../../styles/goal/goals.css';

// Дані
import dashData from '../../data/dashboard/dashboard.json';
import goalsData from '../../data/goal/goals.json';

// Компонент картки
import GoalCard from '../../components/cards/Goal/GoalCard.tsx';

// Типи
import type { Goal } from '../../types';

const Goals: React.FC = () => {
    const [searchParams] = useSearchParams();

    const goals = goalsData as Goal[];

    // Фільтр з URL (встановлюється в Sidebar.tsx)
    const filterStatus = searchParams.get('status') || 'all';

    // Логіка фільтрації
    const filteredGoals = goals.filter(goal => {
        if (filterStatus === 'all') return true;
        return goal.status === filterStatus;
    });

    return (
        <>
            <header>
                <h1>Цілі та мотивація</h1>
                <div className="user-profile">
                    <span>
                        Привіт, {dashData.user.name}! 🔥 {dashData.user.streak} днів серії
                    </span>
                    <div className="avatar"></div>
                </div>
            </header>

            {/* --- СЕКЦІЯ 1: СІТКА ЦІЛЕЙ --- */}
            <div className="goals-overview">
                <div className="section-title">
                    <h2>Ваші цілі</h2>
                </div>
                <div className="goals-grid">
                    {filteredGoals.length === 0 ? (
                        <p
                            style={{
                                gridColumn: '1/-1',
                                textAlign: 'center',
                                color: 'var(--text-muted)',
                                padding: '2rem',
                            }}
                        >
                            За вашим фільтром немає цілей.
                        </p>
                    ) : (
                        filteredGoals.map(goal => (
                            <GoalCard key={goal.id} goal={goal} />
                        ))
                    )}
                </div>
            </div>

            {/* --- СЕКЦІЯ 2: ФОРМА СТВОРЕННЯ НОВОЇ ЦІЛІ --- */}
            <div className="set-new-goal">
                <div className="section-title">
                    <h2>Встановити нову ціль</h2>
                </div>
                <form className="goal-form" onSubmit={(e) => e.preventDefault()}>
                    <div className="form-group">
                        <label>Категорія:</label>
                        <select required>
                            <option value="weight">Схуднути / Вага</option>
                            <option value="muscle">Набрати м'язи</option>
                            <option value="steps">Кроки на день</option>
                            <option value="calories">Калорії на день</option>
                            <option value="workouts">Кількість тренувань</option>
                        </select>
                    </div>
                    <div className="form-group full-width">
                        <label>Короткий опис:</label>
                        <input type="text" placeholder="Наприклад: Підготуватися до літа" required />
                    </div>
                    <div className="form-group">
                        <label>Цільове значення (цифра):</label>
                        <input type="number" placeholder="Наприклад: 5 або 10000" required />
                    </div>
                    <div className="form-group">
                        <label>Дедлайн (до якого числа):</label>
                        <input type="date" required />
                    </div>
                    <button type="submit" className="btn-set-goal">
                        Створити ціль
                    </button>
                </form>
            </div>
        </>
    );
};

export default Goals;