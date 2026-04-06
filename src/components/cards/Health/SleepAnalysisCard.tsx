// src/components/cards/SleepAnalysisCard.tsx
import React from 'react';
import type { SleepAnalysis } from '../../../types';

const SleepChart: React.FC<{ data: number[] }> = ({ data }) => {
    const maxVal = Math.max(...data);
    return (
        <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '8px',
            height: '180px',
            width: '100%',
            padding: '10px',
            backgroundColor: 'var(--bg-dark)',
            borderRadius: '12px'
        }}>
            {data.map((val, idx) => (
                <div
                    key={idx}
                    style={{
                        flex: 1,
                        backgroundColor: 'var(--accent-blue)',
                        height: `${(val / maxVal) * 100}%`,
                        borderRadius: '4px 4px 0 0',
                        opacity: val < 40 ? 0.5 : 1
                    }}
                />
            ))}
        </div>
    );
};

const SleepAnalysisCard: React.FC<SleepAnalysis> = ({
                                                        deepSleep,
                                                        quality,
                                                        chartData
                                                    }) => {
    return (
        <div className="health-card sleep-analysis">
            <div className="card-header">
                <h2>Аналітика сну</h2>
                <button className="btn-small">Детальніше</button>
            </div>
            <SleepChart data={chartData} />
            <div className="sleep-stats">
                <div className="stat-item">
                    <span className="label">Глибокий сон:</span>
                    <span className="value">{deepSleep}</span>
                </div>
                <div className="stat-item">
                    <span className="label">Якість сну:</span>
                    <span className="value" style={{ color: 'var(--accent-green)' }}>
                        {quality}%
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SleepAnalysisCard;