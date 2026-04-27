// src/components/Sidebar.tsx
import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

// Імпортуємо наш контекст авторизації
import { useAuth } from '../contexts/AuthContext';

// Імпортуємо окремі фільтри
import TrainingFilters from './filters/TrainingFilters';
import AchievementsGoalsFilters from './filters/AchievementsGoalsFilters';
import RecipesFilters from './filters/RecipesFilters';
import ExercisesFilters from './filters/ExercisesFilters';
import HealthPanel from './filters/HealthPanel';

const Sidebar: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth(); // Дістаємо функцію виходу

    // Функція обробки виходу з акаунту
    const handleLogout = async () => {
        try {
            await logout(); // Виходимо з Firebase
            navigate('/auth'); // Перенаправляємо на сторінку логіну
        } catch (error) {
            console.error("Помилка при виході:", error);
            alert("Не вдалося вийти з акаунту");
        }
    };

    return (
        <aside className="sidebar" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div className="logo">FitMonitor</div>

            <ul className="nav-menu">
                <li><NavLink to="/">📊 Дашборд</NavLink></li>
                <li><NavLink to="/training">🏋️ Тренування</NavLink></li>
                <li><NavLink to="/progress">🏆 Мій прогрес</NavLink></li>
                <li><NavLink to="/diet">🥗 Раціон</NavLink></li>
                <li><NavLink to="/achievements">🏅 Ачівки</NavLink></li>
                <li><NavLink to="/goals">🎯 Цілі</NavLink></li>
                <li><NavLink to="/calendar">📅 Календар тренувань</NavLink></li>
                <li><NavLink to="/recipes">🍲 Рецепти та плани</NavLink></li>
                <li><NavLink to="/exercises">📚 Гід по вправам</NavLink></li>
                <li><NavLink to="/health">💧 Здоров'я</NavLink></li>
            </ul>

            {/* Блок з фільтрами */}
            <div className="sidebar-filters">
                {location.pathname === '/training' && <TrainingFilters />}
                {(location.pathname === '/achievements' || location.pathname === '/goals') && <AchievementsGoalsFilters />}
                {location.pathname === '/recipes' && <RecipesFilters />}
                {location.pathname === '/exercises' && <ExercisesFilters />}
                {location.pathname === '/health' && <HealthPanel />}
            </div>

            {/* --- КНОПКА ВИХОДУ З АКАУНТУ --- */}
            {/* Використовуємо marginTop: 'auto', щоб притиснути кнопку до самого низу */}
            <div className="sidebar-footer" style={{ marginTop: 'auto', paddingTop: '20px', paddingBottom: '20px' }}>
                <button
                    onClick={handleLogout}
                    style={{
                        width: '100%',
                        padding: '12px 15px',
                        backgroundColor: 'transparent',
                        color: '#ff4757', // Червоний акцентний колір
                        border: '1px solid #ff4757',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#ff4757';
                        e.currentTarget.style.color = 'white';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#ff4757';
                    }}
                >
                    🚪 Вийти з акаунту
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;