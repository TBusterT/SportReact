// src/components/cards/HealthWidget.tsx
import React from 'react';
import type { HealthWidgetData } from '../../../types';

const HealthWidget: React.FC<HealthWidgetData> = ({
                                                      icon,
                                                      color,
                                                      title,
                                                      value,
                                                      status,
                                                      statusClass,
                                                      children
                                                  }) => {
    return (
        <div className="health-widget">
            <div className="widget-icon" style={{ color }}>
                {icon}
            </div>
            <div className="widget-info">
                <h3>{title}</h3>
                <div className="data" style={{ color }}>
                    {value}
                </div>
                {status && statusClass && (
                    <div className={`health-status ${statusClass}`}>
                        ✓ {status}
                    </div>
                )}
                {children}
            </div>
        </div>
    );
};

export default HealthWidget;