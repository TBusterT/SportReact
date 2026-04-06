// src/types/dashboard.ts

export interface DashboardWidgets {
    steps: {
        current: number;
        target: number;
    };
    calories: {
        current: number;
        target: number;
    };
    activeTime: {
        current: number;
        target: number;
    };
    water: {
        current: number;
        target: number;
    };
}

export interface DashboardData {
    user: {
        name: string;
        streak: number;
    };
    widgets: DashboardWidgets;
}

export interface DashboardWidgetProps {
    title: string;
    current: string | number;
    total: string;
    progress: number;
    color: string;
}