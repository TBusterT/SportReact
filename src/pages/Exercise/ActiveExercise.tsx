// src/pages/Exercise/ActiveExercise.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Дані
import exercisesData from '../../data/exercise/exercises.json';

// Компонент детальної картки
import ActiveExerciseDetail from '../../components/cards/Exercise/ActiveExerciseDetail';

import '../../styles/exercise/ActiveExercise.css';
// Тип
import type { Exercise } from '../../types';

const ActiveExercise: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const exercise = (exercisesData as Exercise[]).find(
        (ex) => ex.id.toString() === id
    );

    if (!exercise) {
        return (
            <div style={{
                padding: '3rem',
                textAlign: 'center',
                color: 'var(--text-muted)'
            }}>
                <h2>Вправу не знайдено</h2>
                <button
                    className="btn-small"
                    onClick={() => navigate('/exercises')}
                >
                    Повернутися до гіда по вправам
                </button>
            </div>
        );
    }

    return <ActiveExerciseDetail exercise={exercise} />;
};

export default ActiveExercise;