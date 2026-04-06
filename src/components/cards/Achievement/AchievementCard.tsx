// src/components/cards/AchievementCard.tsx
import React from 'react';
import type { Achievement } from '../../../types';

interface AchievementCardProps {
    achievement: Achievement;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
    const isUnlocked = achievement.isUnlocked;
    const percent = Math.min(
        Math.round((achievement.current / achievement.target) * 100),
        100
    );

    return (
        <div
            className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`}
        >
            <div className="achievement-image">
                <img src={achievement.icon} alt={achievement.title} />
            </div>

            <div className="achievement-details">
                <div className="achievement-title-row">
                    <h4>{achievement.title}</h4>
                    <span className="achievement-points">+{achievement.points}</span>
                </div>

                <p className="achievement-description">{achievement.description}</p>

                {/* Блок прогресу або статусу розблокування */}
                {isUnlocked ? (
                    <div className="achievement-status">
                        Розблоковано: {achievement.unlockedDate}
                    </div>
                ) : (
                    <div className="achievement-progress-info">
                        <div className="achievement-progress-text">
                            <span>Прогрес:</span>
                            <span>
                                {achievement.current} / {achievement.target}
                                {achievement.unit} ({percent}%)
                            </span>
                        </div>
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{
                                    width: `${percent}%`,
                                    backgroundColor: 'var(--accent-blue)',
                                }}
                            ></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AchievementCard;