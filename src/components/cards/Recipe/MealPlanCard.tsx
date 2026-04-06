// src/components/cards/MealPlanCard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { MealPlan } from '../../../types';

interface MealPlanCardProps {
    plan: MealPlan;
    overlayColor: string;
}

const MealPlanCard: React.FC<MealPlanCardProps> = ({ plan, overlayColor }) => {
    const navigate = useNavigate();

    const handleClick = () => navigate(`/active-plan/${plan.id}`);

    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        navigate(`/active-plan/${plan.id}`);
    };

    return (
        <div className="plan-card" onClick={handleClick}>
            <div className="plan-bg">
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: overlayColor,
                        zIndex: 1,
                    }}
                ></div>
                <img src={plan.image} alt={plan.title} />
            </div>

            <div className="plan-content">
                <span className="plan-badge">{plan.badge}</span>
                <h3>{plan.title}</h3>
                <p>{plan.description}</p>
                <button className="btn-start-plan" onClick={handleButtonClick}>
                    Переглянути план
                </button>
            </div>
        </div>
    );
};

export default MealPlanCard;