// src/components/cards/DashboardWidget.tsx
import React from 'react';
import type { DashboardWidgetProps } from '../../../types';

const DashboardWidget: React.FC<DashboardWidgetProps> = ({
                                                             title,
                                                             current,
                                                             total,
                                                             progress,
                                                             color,
                                                         }) => {
    return (
        <div className="widget">
            <h3>{title}</h3>
            <div className="data">
                {current} <span>{total}</span>
            </div>
            <div className="progress-bar">
                <div
                    className="progress-fill"
                    style={{
                        width: `${progress}%`,
                        backgroundColor: color,
                    }}
                ></div>
            </div>
        </div>
    );
};

export default DashboardWidget;