// src/components/cards/GoalCard.tsx
import React from 'react';
import type { Goal } from '../../../types';

interface GoalCardProps {
    goal: Goal;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal }) => {
    const isCompleted = goal.status === 'completed';
    const progress = Math.min(Math.round((goal.current / goal.target) * 100), 100);

    // Форматування дати (DD.MM.YYYY)
    const formatDate = (dateString: string) => {
        const [year, month, day] = dateString.split('-');
        return `${day}.${month}.${year}`;
    };

    return (
        <div className={`goal-card ${isCompleted ? 'completed' : ''}`}>
            <div className="goal-image">
                <img src={goal.image} alt={goal.title} />
                <div className={`goal-badge ${isCompleted ? 'completed' : 'active'}`}>
                    {isCompleted ? '✓ Досягнуто' : 'В процесі'}
                </div>
            </div>

            <div className="goal-details">
                <h4>{goal.title}</h4>
                <p className="goal-description">{goal.description}</p>

                <div className="goal-deadline">
                    Дедлайн: {formatDate(goal.deadline)}
                </div>

                <div className="goal-progress">
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{
                                width: `${progress}%`,
                                backgroundColor: isCompleted
                                    ? 'var(--accent-green)'
                                    : 'var(--accent-blue)',
                            }}
                        ></div>
                    </div>
                    <div className="goal-progress-info">
                        <span>Прогрес: {progress}%</span>
                        <span>
                            ({goal.current} / {goal.target} {goal.unit})
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GoalCard;