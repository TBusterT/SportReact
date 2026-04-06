// src/components/Sidebar.tsx
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

// Імпортуємо окремі фільтри
import TrainingFilters from './filters/TrainingFilters';
import AchievementsGoalsFilters from './filters/AchievementsGoalsFilters';
import RecipesFilters from './filters/RecipesFilters';
import ExercisesFilters from './filters/ExercisesFilters';
import HealthPanel from './filters/HealthPanel';

const Sidebar: React.FC = () => {
    const location = useLocation();

    return (
        <aside className="sidebar">
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


            {location.pathname === '/training' && <TrainingFilters />}
            {(location.pathname === '/achievements' || location.pathname === '/goals') && <AchievementsGoalsFilters />}
            {location.pathname === '/recipes' && <RecipesFilters />}
            {location.pathname === '/exercises' && <ExercisesFilters />}
            {location.pathname === '/health' && <HealthPanel />}
        </aside>
    );
};

export default Sidebar;