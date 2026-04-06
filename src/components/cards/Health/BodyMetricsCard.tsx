// src/components/cards/BodyMetricsCard.tsx
import React from 'react';
import type { BodyMetric } from '../../../types';

interface BodyMetricsCardProps {
    metrics: BodyMetric[];
}

const BodyMetricsCard: React.FC<BodyMetricsCardProps> = ({ metrics }) => {
    return (
        <div className="health-card body-metrics">
            <div className="card-header">
                <h2>Параметри тіла</h2>
                <button className="btn-small">Оновити</button>
            </div>
            <div className="metrics-list">
                {metrics.map((metric, idx) => (
                    <div key={idx} className="metric-item">
                        <span className="metric-name">{metric.name}</span>
                        <div className="metric-value">
                            {metric.value}
                            {metric.isBadge ? (
                                <span className={`status-badge ${metric.badgeClass || ''}`}>
                                    {metric.badgeText}
                                </span>
                            ) : (
                                metric.trend && metric.trendText && (
                                    <span className={`trend ${metric.trend}`}>
                                        {metric.trendText}
                                    </span>
                                )
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BodyMetricsCard;