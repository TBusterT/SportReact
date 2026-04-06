// src/components/cards/TrainingHistoryCard.tsx
import React from 'react';
import type { HistoryItem } from '../../../types';

interface TrainingHistoryCardProps {
    item: HistoryItem;
}

const TrainingHistoryCard: React.FC<TrainingHistoryCardProps> = ({ item }) => {
    return (
        <div className="training-item">
            <div className="training-image">
                <img src={item.image} alt={item.title} />
            </div>

            <div className="training-details">
                <h4>{item.title}</h4>
                <div className="training-info">
                    <span>📅 {item.date}</span>
                    <span>⏱ {item.duration}</span>
                    <span>🔥 {item.calories} ккал</span>
                </div>
            </div>

            <button className="btn-small">Повторити</button>
        </div>
    );
};

export default TrainingHistoryCard;