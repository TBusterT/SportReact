// src/pages/Exercises.tsx
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

// Стилі
import '../../styles/exercise/exercises.css';

// Дані
import dashData from '../../data/dashboard/dashboard.json';
import exercisesData from '../../data/exercise/exercises.json';

// Компонент картки
import ExerciseCard from '../../components/cards/Exercise/ExerciseCard.tsx';

// Типи
import type { Exercise } from '../../types';

const Exercises: React.FC = () => {
    const [searchParams] = useSearchParams();

    const exercises = exercisesData as Exercise[];

    // Локальний стан для пошуку та фільтру м’язів
    const [searchQuery, setSearchQuery] = useState('');
    const [muscleFilter, setMuscleFilter] = useState('Усі');

    // Фільтри з URL (з сайдбару)
    const equipmentFilter = searchParams.get('equipment') || 'Усі';
    const difficultyFilter = searchParams.get('exDifficulty') || 'Усі';

    // Унікальні групи м’язів для кнопок
    const uniqueMuscles = ['Усі', ...Array.from(new Set(exercises.map(ex => ex.muscle)))];

    // Фільтрація вправ
    const filteredExercises = exercises.filter(ex => {
        const matchSearch = ex.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchMuscle = muscleFilter === 'Усі' || ex.muscle === muscleFilter;
        const matchEquipment = equipmentFilter === 'Усі' || ex.equipment.includes(equipmentFilter);
        const matchDifficulty = difficultyFilter === 'Усі' || ex.difficulty === difficultyFilter;

        return matchSearch && matchMuscle && matchEquipment && matchDifficulty;
    });

    return (
        <>
            <header>
                <h1>Гід по вправам</h1>
                <div className="user-profile">
                    <span>Привіт, {dashData.user.name}! 🔥 {dashData.user.streak} днів серії</span>
                    <div className="avatar"></div>
                </div>
            </header>

            {/* Панель керування (пошук + фільтр м’язів) */}
            <div className="exercises-header">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="🔍 Пошук вправи (наприклад: Віджимання)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="filters">
                    {uniqueMuscles.map(muscle => (
                        <button
                            key={muscle}
                            className={`btn-filter ${muscleFilter === muscle ? 'active' : ''}`}
                            onClick={() => setMuscleFilter(muscle)}
                        >
                            {muscle}
                        </button>
                    ))}
                </div>
            </div>

            {/* Сітка вправ */}
            <div className="exercises-grid">
                {filteredExercises.length === 0 ? (
                    <p
                        style={{
                            gridColumn: '1/-1',
                            textAlign: 'center',
                            color: 'var(--text-muted)',
                            padding: '2rem',
                        }}
                    >
                        Вправ за цими критеріями не знайдено 🕵️‍♂️
                    </p>
                ) : (
                    filteredExercises.map(ex => (
                        <ExerciseCard key={ex.id} exercise={ex} />
                    ))
                )}
            </div>
        </>
    );
};

export default Exercises;