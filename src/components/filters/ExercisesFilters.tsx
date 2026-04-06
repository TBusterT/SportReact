import React from 'react';
import { useSearchParams } from 'react-router-dom';

const ExercisesFilters: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const updateFilter = (key: string, value: string) => {
        setSearchParams(prev => {
            prev.set(key, value);
            return prev;
        });
    };

    const exerciseEquipment = searchParams.get('equipment') || 'Усі';
    const exerciseDifficulty = searchParams.get('exDifficulty') || 'Усі';

    return (
        <div className="sidebar-filters exercises-sidebar">
            {/* Інвентар */}
            <div className="filter-group">
                <h3>Інвентар</h3>
                <select
                    className="filter-select"
                    value={exerciseEquipment}
                    onChange={e => updateFilter('equipment', e.target.value)}
                >
                    <option value="Усі">Будь-яке обладнання</option>
                    <option value="Власна вага">Власна вага</option>
                    <option value="Гантелі">Гантелі</option>
                    <option value="Штанга">Штанга</option>
                    <option value="Турнік">Турнік</option>
                    <option value="Килимок">Килимок</option>
                </select>
            </div>

            {/* Складність */}
            <div className="filter-group">
                <h3>Складність</h3>
                <div className="difficulty-filters">
                    <button
                        className={exerciseDifficulty === 'Усі' ? 'active' : ''}
                        onClick={() => updateFilter('exDifficulty', 'Усі')}
                    >
                        Усі рівні
                    </button>
                    <button
                        className={exerciseDifficulty === 'Новачок' ? 'active' : ''}
                        onClick={() => updateFilter('exDifficulty', 'Новачок')}
                    >
                        Новачок
                    </button>
                    <button
                        className={exerciseDifficulty === 'Середній' ? 'active' : ''}
                        onClick={() => updateFilter('exDifficulty', 'Середній')}
                    >
                        Середній
                    </button>
                    <button
                        className={exerciseDifficulty === 'Профі' ? 'active' : ''}
                        onClick={() => updateFilter('exDifficulty', 'Профі')}
                    >
                        Профі
                    </button>
                    <button
                        className={exerciseDifficulty === 'Універсал' ? 'active' : ''}
                        onClick={() => updateFilter('exDifficulty', 'Універсал')}
                    >
                        Універсал
                    </button>
                </div>
            </div>

            {/* Обрані вправи */}
            <div className="filter-group favorites-group">
                <h3>Обрані вправи ✨</h3>
                <div className="favorites-list">
                    <div className="fav-item-empty">
                        Тут з'являться ваші улюблені вправи
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExercisesFilters;