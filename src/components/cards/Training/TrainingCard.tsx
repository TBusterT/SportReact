// src/components/cards/TrainingCard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { TrainingPlan } from '../../../types';

interface TrainingCardProps {
    training: TrainingPlan;
}

const TrainingCard: React.FC<TrainingCardProps> = ({ training }) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/active-training/${training.id}`);
    };

    const handleStartClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation(); // щоб не спрацьовував клік по всій картці
        navigate(`/active-training/${training.id}`);
    };

    return (
        <div className="training-card" onClick={handleCardClick}>
            <div className="card-image">
                <img src={training.image} alt={training.title} />
                <span className="card-badge">{training.badge}</span>
            </div>

            <div className="card-content">
                <h4>{training.title}</h4>
                <div className="card-info">
                    <span>⏱ {training.duration}</span>
                    <span>🔥 {training.calories}</span>
                </div>
                <p className="card-description">{training.description}</p>

                <button className="btn-start" onClick={handleStartClick}>
                    Почати тренування
                </button>
            </div>
        </div>
    );
};

export default TrainingCard;