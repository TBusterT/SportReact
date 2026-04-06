// src/components/cards/ExerciseCard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Exercise } from '../../../types';

interface ExerciseCardProps {
    exercise: Exercise;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise }) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/active-exercise/${exercise.id}`);
    };

    const handleTechniqueClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation(); // щоб не спрацював клік по картці
        navigate(`/active-exercise/${exercise.id}`);
    };

    return (
        <div className="exercise-card" onClick={handleCardClick}>
            <div className="exercise-image">
                <img src={exercise.image} alt={exercise.title} />

                <div className="exercise-badges">
                    <span className="badge muscle">{exercise.muscle}</span>
                    <span className="badge difficulty">{exercise.difficulty}</span>
                </div>

                {/* Кнопка "Сердечко" (поки без функціоналу) */}
                <button className="btn-fav">♡</button>
            </div>

            <div className="exercise-content">
                <h4>{exercise.title}</h4>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '10px' }}>
                    🛠 <strong>Інвентар:</strong> {exercise.equipment}
                </div>
                <p>{exercise.description}</p>

                <button className="btn-technique" onClick={handleTechniqueClick}>
                    Техніка виконання
                </button>
            </div>
        </div>
    );
};

export default ExerciseCard;