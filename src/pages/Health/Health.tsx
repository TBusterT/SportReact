// src/pages/Health.tsx
import React from 'react';
import '../../styles/health/health.css';

import dashData from '../../data/dashboard/dashboard.json';
import healthData from '../../data/health/health.json';

import HealthWidget from '../../components/cards/Health/HealthWidget.tsx';
import SleepAnalysisCard from '../../components/cards/Health/SleepAnalysisCard.tsx';
import BodyMetricsCard from '../../components/cards/Health/BodyMetricsCard.tsx';
import RecommendationCard from '../../components/cards/Health/RecommendationCard.tsx';

import type { HealthDataStructure } from '../../types';

const Health: React.FC = () => {
    const data = healthData as HealthDataStructure;

    return (
        <>
            <header>
                <h1>Показники здоров'я</h1>
                <div className="user-profile">
                    <span>
                        Привіт, {dashData.user.name}! 🔥 {dashData.user.streak} днів серії
                    </span>
                    <div className="avatar"></div>
                </div>
            </header>

            {/* СЕКЦІЯ 1: Головні віджети */}
            <div className="health-widgets">
                <HealthWidget
                    icon={data.widgets.sleep.icon}
                    color={data.widgets.sleep.color}
                    title="Сон"
                    value={data.widgets.sleep.time}
                    status={data.widgets.sleep.status}
                    statusClass={data.widgets.sleep.statusClass}
                />

                <HealthWidget
                    icon={data.widgets.heartRate.icon}
                    color={data.widgets.heartRate.color}
                    title="Пульс (у спокої)"
                    value={
                        <span
                            dangerouslySetInnerHTML={{
                                __html: data.widgets.heartRate.value,
                            }}
                        />
                    }
                    status={data.widgets.heartRate.status}
                    statusClass={data.widgets.heartRate.statusClass}
                />

                <HealthWidget
                    icon={data.widgets.stress.icon}
                    color={data.widgets.stress.color}
                    title="Рівень стресу"
                    value={data.widgets.stress.level}
                >
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{
                                width: `${data.widgets.stress.percentage}%`,
                                backgroundColor: data.widgets.stress.color,
                            }}
                        />
                    </div>
                </HealthWidget>
            </div>

            {/* СЕКЦІЯ 2: Аналітика та параметри тіла */}
            <div className="health-grid">
                <SleepAnalysisCard
                    deepSleep={data.sleepAnalysis.deepSleep}
                    quality={data.sleepAnalysis.quality}
                    chartData={data.sleepAnalysis.chartData}
                />
                <BodyMetricsCard metrics={data.bodyMetrics} />
            </div>

            {/* СЕКЦІЯ 3: Рекомендації */}
            <div className="health-recommendations">
                <h2>Щоденні рекомендації</h2>
                <div className="recommendations-list">
                    {data.recommendations.map((rec, idx) => (
                        <RecommendationCard
                            key={idx}
                            recommendation={rec}
                        />
                    ))}
                </div>
            </div>
        </>
    );
};

export default Health;