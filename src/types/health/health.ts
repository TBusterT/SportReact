// src/types/health.ts

import React from 'react';

export interface HealthWidgetData {
    icon: string;
    color: string;
    title: string;
    value: string | React.ReactNode;
    status?: string;
    statusClass?: string;
    children?: React.ReactNode;        // ← Додано!
}

export interface HealthWidgets {
    sleep: {
        time: string;
        status: string;
        statusClass: string;
        icon: string;
        color: string;
    };
    heartRate: {
        value: string;
        status: string;
        statusClass: string;
        icon: string;
        color: string;
    };
    stress: {
        level: string;
        percentage: number;
        color: string;
        icon: string;
    };
}

export interface SleepAnalysis {
    deepSleep: string;
    quality: number;
    chartData: number[];
}

export interface BodyMetric {
    name: string;
    value: string;
    trend?: string;
    trendText?: string;
    isBadge?: boolean;
    badgeText?: string;
    badgeClass?: string;
}

export interface Recommendation {
    icon: string;
    title: string;
    text: string;
}

export interface HealthDataStructure {
    widgets: HealthWidgets;
    sleepAnalysis: SleepAnalysis;
    bodyMetrics: BodyMetric[];
    recommendations: Recommendation[];
}