// src/pages/Training/ActiveTraining.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Дані
import trainingsData from '../../data/training/trainings.json';
import workoutDetailsData from '../../data/training/workout-details.json';

// Компонент детальної сторінки
import ActiveTrainingDetail from '../../components/cards/Training/ActiveTrainingDetail';

import '../../styles/training/ActiveTraining.css';
// Типи
import type { TrainingPlan, WorkoutDetail, WorkoutDetailsMap } from '../../types';

const ActiveTraining: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Знаходимо тренування
    const training = (trainingsData as TrainingPlan[]).find(
        (t) => t.id.toString() === id
    );

    // Деталі тренування (відео, опис, поради)
    const workoutDetails = workoutDetailsData as WorkoutDetailsMap;
    const details: WorkoutDetail = workoutDetails[id || '1'] || {
        video: 'https://www.w3schools.com/html/mov_bbb.mp4',
        fullDescription: 'Тренування не знайдено. Використовується демо-відео.',
        tips: ['Слідкуйте за технікою', 'Дихайте рівномірно'],
    };

    // Таймер
    const [seconds, setSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(true);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = window.setInterval(() => {
                setSeconds((prev) => prev + 1);
            }, 1000);
        } else {
            if (intervalRef.current) {
                window.clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

        return () => {
            if (intervalRef.current) {
                window.clearInterval(intervalRef.current);
            }
        };
    }, [isRunning]);

    const formatTime = (secs: number): string => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const togglePause = () => setIsRunning(!isRunning);

    const finishWorkout = () => {
        if (window.confirm('Завершити тренування?')) {
            alert('🎉 Тренування успішно завершено! Дані збережено в прогресі.');
            navigate('/training');
        }
    };

    if (!training) {
        return (
            <div style={{
                padding: '3rem',
                textAlign: 'center',
                color: 'var(--text-muted)'
            }}>
                <h2>Тренування не знайдено</h2>
                <button
                    className="btn-small"
                    onClick={() => navigate('/training')}
                >
                    Повернутися до тренувань
                </button>
            </div>
        );
    }

    return (
        <ActiveTrainingDetail
            training={training}
            details={details}
            seconds={seconds}
            isRunning={isRunning}
            onTogglePause={togglePause}
            onFinishWorkout={finishWorkout}
            formatTime={formatTime}
        />
    );
};

export default ActiveTraining;