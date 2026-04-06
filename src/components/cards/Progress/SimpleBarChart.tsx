// src/components/charts/SimpleBarChart.tsx
import React from 'react';

interface SimpleBarChartProps {
    data: number[];
    color: string;
    label: string;
}

const SimpleBarChart: React.FC<SimpleBarChartProps> = ({ data, color, label }) => {
    const maxVal = Math.max(...data);

    return (
        <div className="chart-container">
            <h3>{label}</h3>
            <div className="chart-bars-wrapper">
                {data.map((val, idx) => {
                    const heightPercent = maxVal === 0 ? 0 : (val / maxVal) * 100;
                    return (
                        <div key={idx} className="chart-column">
                            <span className="chart-value">{val}</span>
                            <div
                                className="chart-fill"
                                style={{
                                    height: `${heightPercent}%`,
                                    backgroundColor: color,
                                }}
                            ></div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SimpleBarChart;