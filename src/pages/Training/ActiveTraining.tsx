// src/pages/Training/ActiveTraining.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, arrayUnion, increment } from 'firebase/firestore';

// Firebase та Auth
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { uploadWorkoutDetails } from '../../services/seedDatabase';

// Компонент детальної сторінки
import ActiveTrainingDetail from '../../components/cards/Training/ActiveTrainingDetail';
import '../../styles/training/ActiveTraining.css';

// Типи
import type { TrainingPlan, WorkoutDetail } from '../../types';

const ActiveTraining: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { currentUser } = useAuth(); // Дістаємо користувача


    const [training, setTraining] = useState<TrainingPlan | null>(null);
    const [details, setDetails] = useState<WorkoutDetail | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isSaving, setIsSaving] = useState<boolean>(false); // Стан для процесу збереження

    // Таймер
    const [seconds, setSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(true);
    const intervalRef = useRef<number | null>(null);


    useEffect(() => {
        const fetchTrainingAndDetails = async () => {
            if (!id) return;

            try {
                // 1. Шукаємо загальну інфу про тренування
                const trainingRef = doc(db, "trainings", id);
                const trainingSnap = await getDoc(trainingRef);

                if (trainingSnap.exists()) {
                    setTraining({ id: trainingSnap.id, ...trainingSnap.data() } as TrainingPlan);
                }

                // 2. Шукаємо деталі (відео, поради)
                const detailsRef = doc(db, "workout_details", id);
                const detailsSnap = await getDoc(detailsRef);

                if (detailsSnap.exists()) {
                    setDetails(detailsSnap.data() as WorkoutDetail);
                } else {
                    setDetails({
                        video: 'https://www.w3schools.com/html/mov_bbb.mp4',
                        fullDescription: 'Спеціальний опис для цього тренування ще не додано. Зосередьтеся на правильній техніці виконання!',
                        tips: ['Слідкуйте за технікою', 'Дихайте рівномірно'],
                    });
                }
            } catch (error) {
                console.error("Помилка завантаження активного тренування:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrainingAndDetails();
    }, [id]);

    // Логіка таймера
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

    // === ФУНКЦІЯ ЗАВЕРШЕННЯ ТРЕНУВАННЯ ТА ЗБЕРЕЖЕННЯ ПРОГРЕСУ ===
    const finishWorkout = async () => {
        if (!window.confirm('Завершити тренування?')) return;

        if (!currentUser || !training) {
            alert('Помилка: не знайдено користувача або дані тренування.');
            navigate('/training');
            return;
        }

        setIsSaving(true);
        setIsRunning(false); // Зупиняємо таймер

        try {
            // 1. Витягуємо цифру калорій (наприклад, з "450 ккал" робимо 450)
            const caloriesBurned = parseInt(training.calories.toString().replace(/\D/g, ''), 10) || 0;

            // 2. Рахуємо реальний витрачений час
            const minutesSpent = Math.ceil(seconds / 60);

            // 3. Формуємо дати
            const today = new Date();
            const dateStr = today.toLocaleDateString('uk-UA'); // "27.04.2026"
            const timestampStr = today.toISOString().split('T')[0]; // "2026-04-27"

            // 4. Створюємо новий запис для історії
            const newHistoryItem = {
                id: Date.now(), // Унікальний ID на основі часу
                title: training.title,
                duration: `${minutesSpent} хв`, // Записуємо реальний час
                calories: caloriesBurned,
                date: dateStr,
                timestamp: timestampStr,
                image: training.image
            };

            // 5. Зберігаємо у Firebase (колекція user_progress)
            const progressRef = doc(db, "user_progress", currentUser.uid);

            // Використовуємо setDoc з { merge: true }, щоб не стерти інші дані,
            // якщо документ вже існує, і створити його, якщо його ще не було.
            await setDoc(progressRef, {
                overall: {
                    workouts: increment(1), // Автоматично додає +1 до загальної кількості
                    calories: increment(caloriesBurned) // Додає спалені калорії
                },
                history: arrayUnion(newHistoryItem) // Додає тренування у список історії
            }, { merge: true });

            alert(`🎉 Тренування завершено! Спалено калорій: ${caloriesBurned}. Дані збережено.`);
            navigate('/progress'); // Перекидаємо одразу на сторінку прогресу, щоб юзер побачив результат!

        } catch (error) {
            console.error("Помилка збереження результатів:", error);
            alert("Не вдалося зберегти прогрес у базу даних.");
            navigate('/training');
        } finally {
            setIsSaving(false);
        }
    };

    // РЕНДЕР
    if (loading) {
        return (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--accent-blue)' }}>
                <h2>Підготовка залу... ⏳</h2>
            </div>
        );
    }

    if (!training) {
        return (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <h2>Тренування не знайдено</h2>
                <button className="btn-small" onClick={() => navigate('/training')}>
                    Повернутися до тренувань
                </button>
            </div>
        );
    }

    return (
        <>
            {(id === "1" || id === "5") && details?.fullDescription.includes('ще не додано') && (
                <div style={{ textAlign: 'center', margin: '20px' }}>
                    <button
                        onClick={async () => {
                            await uploadWorkoutDetails();
                            window.location.reload();
                        }}
                        style={{ padding: '10px 20px', background: 'var(--accent-blue)', color: 'white', borderRadius: '8px', cursor: 'pointer', border: 'none' }}
                    >
                        📤 Завантажити деталі (відео та описи) у Firebase
                    </button>
                </div>
            )}

            {isSaving ? (
                <div style={{ padding: '5rem', textAlign: 'center', color: 'var(--accent-green)' }}>
                    <h2>💾 Зберігаємо ваші досягнення...</h2>
                </div>
            ) : (
                <ActiveTrainingDetail
                    training={training}
                    details={details!}
                    seconds={seconds}
                    isRunning={isRunning}
                    onTogglePause={togglePause}
                    onFinishWorkout={finishWorkout}
                    formatTime={formatTime}
                />
            )}
        </>
    );
};

export default ActiveTraining;