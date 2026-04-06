// src/components/cards/Training/ActiveTrainingDetail.tsx
import React from 'react';
import type { TrainingPlan, WorkoutDetail } from '../../../types';

interface ActiveTrainingDetailProps {
    training: TrainingPlan;
    details: WorkoutDetail;
    seconds: number;
    isRunning: boolean;
    onTogglePause: () => void;
    onFinishWorkout: () => void;
    formatTime: (secs: number) => string;
}

const ActiveTrainingDetail: React.FC<ActiveTrainingDetailProps> = ({
                                                                       training,
                                                                       details,
                                                                       seconds,
                                                                       isRunning,
                                                                       onTogglePause,
                                                                       onFinishWorkout,
                                                                       formatTime,
                                                                   }) => {
    return (
        <div className="workout-mode">
            <header className="workout-header">
                <button
                    className="btn-back"
                    onClick={() => window.history.back()}
                >
                    ← Перервати
                </button>
                <h1>{training.title}</h1>
                <div className="workout-meta">🔥 {training.calories}</div>
            </header>

            <main className="workout-grid">
                {/* Ліва панель — таймер */}
                <aside className="panel-left">
                    <div className="timer-box">
                        <div id="timer-display">{formatTime(seconds)}</div>
                    </div>

                    <div className="workout-controls">
                        <button
                            className={`btn-control ${isRunning ? 'play' : 'pause'}`}
                            onClick={onTogglePause}
                        >
                            {isRunning ? 'Пауза' : 'Продовжити'}
                        </button>
                        <button
                            className="btn-control finish"
                            onClick={onFinishWorkout}
                        >
                            Завершити
                        </button>
                    </div>
                </aside>

                {/* Відео */}
                <section className="panel-center">
                    <div className="video-container">
                        <video
                            src={details.video}
                            autoPlay
                            loop
                            muted
                            playsInline
                            controls={false}
                        />
                    </div>
                </section>

                {/* Права панель */}
                <aside className="panel-right">
                    <h3>Про тренування</h3>
                    <p>{details.fullDescription}</p>

                    <h3 style={{ marginTop: '1.5rem' }}>Поради до техніки</h3>
                    <ul className="tips-list">
                        {details.tips.map((tip, index) => (
                            <li key={index}>{tip}</li>
                        ))}
                    </ul>
                </aside>
            </main>
        </div>
    );
};

export default ActiveTrainingDetail;