import React from 'react';
import { useSearchParams } from 'react-router-dom';

const TrainingFilters: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const updateFilter = (key: string, value: string) => {
        setSearchParams(prev => {
            prev.set(key, value);
            return prev;
        });
    };

    const category = searchParams.get('category') || 'Усі';
    const difficulty = searchParams.get('difficulty') || 'all';
    const duration = searchParams.get('duration') || 'all';
    const caloriesLimit = searchParams.get('calories') || 'all';

    return (
        <div className="sidebar-filters">
            <div className="filter-group">
                <h3>Категорія</h3>
                <div className="filters-list">
                    {['Усі', 'Спина та Кори', 'Кардіо', 'Без обладнання', 'Силові', 'Йога'].map(cat => (
                        <button
                            key={cat}
                            className={`filter-btn ${category === cat ? 'active' : ''}`}
                            onClick={() => updateFilter('category', cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="filter-group">
                <h3>Складність</h3>
                <select
                    className="filter-select"
                    value={difficulty}
                    onChange={e => updateFilter('difficulty', e.target.value)}
                >
                    <option value="all">Будь-яка</option>
                    <option value="Новачок">Новачок</option>
                    <option value="Середній">Середній</option>
                    <option value="Профі">Профі</option>
                </select>
            </div>

            <div className="filter-group">
                <h3>Час (хвилини)</h3>
                <select
                    className="filter-select"
                    value={duration}
                    onChange={e => updateFilter('duration', e.target.value)}
                >
                    <option value="all">Будь-який</option>
                    <option value="short">До 20 хв</option>
                    <option value="medium">20 - 40 хв</option>
                    <option value="long">Більше 40 хв</option>
                </select>
            </div>

            <div className="filter-group">
                <h3>Калорії</h3>
                <select
                    className="filter-select"
                    value={caloriesLimit}
                    onChange={e => updateFilter('calories', e.target.value)}
                >
                    <option value="all">Будь-які</option>
                    <option value="low">До 200 ккал</option>
                    <option value="medium">200 - 400 ккал</option>
                    <option value="high">Більше 400 ккал</option>
                </select>
            </div>
        </div>
    );
};

export default TrainingFilters;