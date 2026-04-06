import React from 'react';
import { useSearchParams } from 'react-router-dom';

const RecipesFilters: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const updateFilter = (key: string, value: string) => {
        setSearchParams(prev => {
            prev.set(key, value);
            return prev;
        });
    };

    // === ВСІ ЗМІННІ, ЯКІ ВИКОРИСТОВУЮТЬСЯ ===
    const recipeCategory = searchParams.get('recipeCategory') || 'Усі';
    const calFilter = searchParams.get('calFilter') || 'all';
    const proFilter = searchParams.get('proFilter') || 'all';
    const fatFilter = searchParams.get('fatFilter') || 'all';
    const carbFilter = searchParams.get('carbFilter') || 'all';

    return (
        <div className="sidebar-filters">
            {/* Категорія прийому їжі */}
            <div className="filter-group categories-group">
                <h3>Прийом їжі</h3>
                <div className="filters-list">
                    {['Усі', 'Сніданки', 'Обіди', 'Вечері', 'Перекуси', 'Десерти'].map(cat => (
                        <button
                            key={cat}
                            className={`filter-btn ${recipeCategory === cat ? 'active' : ''}`}
                            onClick={() => updateFilter('recipeCategory', cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Фільтр Калорії */}
            <div className="filter-group">
                <select
                    className="filter-select"
                    value={calFilter}
                    onChange={e => updateFilter('calFilter', e.target.value)}
                >
                    <option value="all">Калорії: Усі</option>
                    <option value="low">До 300 ккал</option>
                    <option value="medium">300 - 500 ккал</option>
                    <option value="high">Більше 500 ккал</option>
                </select>
            </div>

            {/* Фільтр Білки */}
            <div className="filter-group">
                <select
                    className="filter-select"
                    value={proFilter}
                    onChange={e => updateFilter('proFilter', e.target.value)}
                >
                    <option value="all">Білки: Усі</option>
                    <option value="low">До 15 г</option>
                    <option value="medium">15 - 30 г</option>
                    <option value="high">Більше 30 г</option>
                </select>
            </div>

            {/* Фільтр Жири */}
            <div className="filter-group">
                <select
                    className="filter-select"
                    value={fatFilter}
                    onChange={e => updateFilter('fatFilter', e.target.value)}
                >
                    <option value="all">Жири: Усі</option>
                    <option value="low">До 10 г</option>
                    <option value="medium">10 - 20 г</option>
                    <option value="high">Більше 20 г</option>
                </select>
            </div>

            {/* Фільтр Вуглеводи */}
            <div className="filter-group">
                <select
                    className="filter-select"
                    value={carbFilter}
                    onChange={e => updateFilter('carbFilter', e.target.value)}
                >
                    <option value="all">Вуглеводи: Усі</option>
                    <option value="low">До 20 г</option>
                    <option value="medium">20 - 50 г</option>
                    <option value="high">Більше 50 г</option>
                </select>
            </div>
        </div>
    );
};

export default RecipesFilters;