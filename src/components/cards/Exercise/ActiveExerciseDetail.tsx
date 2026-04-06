// src/components/cards/Exercise/ActiveExerciseDetail.tsx
import React from 'react';
import type { Exercise } from '../../../types';

interface ActiveExerciseDetailProps {
    exercise: Exercise;
}

const ActiveExerciseDetail: React.FC<ActiveExerciseDetailProps> = ({ exercise }) => {
    return (
        <div className="detail-mode">
            <header className="detail-header">
                <button
                    className="btn-back"
                    onClick={() => window.history.back()}
                >
                    ← Повернутися до гіда
                </button>
            </header>

            <main className="detail-container">
                {/* ГЕРО-СЕКЦІЯ */}
                <section className="detail-hero">
                    <div className="media-container">
                        <img src={exercise.image} alt={exercise.title} />
                    </div>

                    <div className="hero-info">
                        <div className="badges">
                            <span className="badge muscle">{exercise.muscle}</span>
                            <span className="badge difficulty">{exercise.difficulty}</span>
                        </div>
                        <h1>{exercise.title}</h1>
                        <p className="ex-desc">{exercise.description}</p>

                        <div className="ex-meta">
                            <div className="meta-item">
                                <span className="meta-label">Обладнання:</span>
                                <span className="meta-value">{exercise.equipment}</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* НИЖНЯ СІТКА */}
                <section className="detail-content-grid">
                    {/* Покрокова інструкція */}
                    <div className="instructions-panel">
                        <h2>Як виконувати (Покроково)</h2>
                        <div className="steps-container">
                            {exercise.steps.map((step, index) => (
                                <div key={index} className="step-item">
                                    <div className="step-number">{index + 1}</div>
                                    <div className="step-text">{step}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Часті помилки */}
                    <div className="mistakes-panel">
                        <h2>Часті помилки ❌</h2>
                        <ul className="mistakes-list">
                            {exercise.mistakes.map((mistake, index) => (
                                <li key={index}>{mistake}</li>
                            ))}
                        </ul>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ActiveExerciseDetail;