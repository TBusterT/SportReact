// src/components/cards/DietOverviewWidget.tsx
import React from 'react';
import type { OverviewItem } from '../../../types';

interface DietOverviewWidgetProps {
    item: OverviewItem;
}

const DietOverviewWidget: React.FC<DietOverviewWidgetProps> = ({ item }) => {
    const progress = Math.min((item.current / item.max) * 100, 100);

    return (
        <div className="widget">
            <h3>{item.title}</h3>
            <div className="data" style={{ color: item.color }}>
                {item.current} <span>/ {item.max} {item.unit}</span>
            </div>
            <div className="progress-bar">
                <div
                    className="progress-fill"
                    style={{
                        width: `${progress}%`,
                        backgroundColor: item.color,
                    }}
                ></div>
            </div>
        </div>
    );
};

export default DietOverviewWidget;