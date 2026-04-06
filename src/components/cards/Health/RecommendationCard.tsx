// src/components/cards/RecommendationCard.tsx
import React from 'react';
import type { Recommendation } from '../../../types';

interface RecommendationCardProps {
    recommendation: Recommendation;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
    return (
        <div className="recommendation-item">
            <div className="rec-icon">{recommendation.icon}</div>
            <div className="rec-text">
                <h4>{recommendation.title}</h4>
                <p>{recommendation.text}</p>
            </div>
        </div>
    );
};

export default RecommendationCard;