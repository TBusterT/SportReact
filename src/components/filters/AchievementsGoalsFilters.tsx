import React from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';

const AchievementsGoalsFilters: React.FC = () => {
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    const updateFilter = (key: string, value: string) => {
        setSearchParams(prev => { prev.set(key, value); return prev; });
    };

    const currentStatus = searchParams.get('status') || 'all';
    const isGoals = location.pathname === '/goals';

    return (
        <div className="sidebar-filters">
            <div className="filter-group">
                <h3>{isGoals ? 'Статус цілей' : 'Статус'}</h3>
                <div className="filters-list">
                    <button
                        className={`filter-btn ${currentStatus === 'all' ? 'active' : ''}`}
                        onClick={() => updateFilter('status', 'all')}
                    >
                        Усі
                    </button>
                    <button
                        className={`filter-btn ${currentStatus === (isGoals ? 'active' : 'unlocked') ? 'active' : ''}`}
                        onClick={() => updateFilter('status', isGoals ? 'active' : 'unlocked')}
                    >
                        {isGoals ? 'В процесі' : 'Розблоковані'}
                    </button>
                    <button
                        className={`filter-btn ${currentStatus === (isGoals ? 'completed' : 'locked') ? 'active' : ''}`}
                        onClick={() => updateFilter('status', isGoals ? 'completed' : 'locked')}
                    >
                        {isGoals ? 'Досягнуті' : 'В процесі'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AchievementsGoalsFilters;