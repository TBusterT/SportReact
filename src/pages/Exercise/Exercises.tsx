// src/pages/Exercise/Exercises.tsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';

// Стилі
import '../../styles/exercise/exercises.css';

// Firebase та Auth
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { uploadExercises } from '../../services/seedDatabase';

// Компонент картки
import ExerciseCard from '../../components/cards/Exercise/ExerciseCard.tsx';

// Типи
import type { Exercise } from '../../types';

const Exercises: React.FC = () => {
    const { currentUser } = useAuth();
    const [searchParams] = useSearchParams();

    // СТАНИ ДЛЯ ДАНИХ З БАЗИ
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Локальний стан для пошуку та фільтру м’язів
    const [searchQuery, setSearchQuery] = useState('');
    const [muscleFilter, setMuscleFilter] = useState('Усі');

    // ЗАВАНТАЖЕННЯ ДАНИХ (useEffect)
    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "exercises"));
                const fetchedData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as unknown as Exercise[];

                setExercises(fetchedData);
            } catch (error) {
                console.error("Помилка завантаження вправ:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchExercises();
    }, []);

    // Фільтри з URL (з сайдбару)
    const equipmentFilter = searchParams.get('equipment') || 'Усі';
    const difficultyFilter = searchParams.get('exDifficulty') || 'Усі';

    // Унікальні групи м’язів для кнопок
    const uniqueMuscles = ['Усі', ...Array.from(new Set(exercises.map(ex => ex.muscle)))];

    // Фільтрація вправ
    const filteredExercises = exercises.filter(ex => {
        const matchSearch = ex.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchMuscle = muscleFilter === 'Усі' || ex.muscle === muscleFilter;
        const matchEquipment = equipmentFilter === 'Усі' || ex.equipment.includes(equipmentFilter);
        const matchDifficulty = difficultyFilter === 'Усі' || ex.difficulty === difficultyFilter;

        return matchSearch && matchMuscle && matchEquipment && matchDifficulty;
    });

    return (
        <div className="exercises-page">
            <header>
                <h1>Гід по вправам</h1>
                <div className="user-profile">
                    <span>Привіт, {currentUser?.email || 'Спортсмен'}! 💪</span>
                    <div className="avatar"></div>
                </div>
            </header>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--accent-blue)' }}>
                    <h2>Завантажуємо енциклопедію вправ... ⏳</h2>
                </div>
            ) : (
                <>
                    {/* --- КНОПКА ЗАВАНТАЖЕННЯ (Показується тільки якщо база порожня) --- */}
                    {exercises.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: 'var(--bg-panel)', borderRadius: '15px', marginBottom: '2rem' }}>
                            <h2 style={{ marginBottom: '10px' }}>Довідник вправ порожній 🏋️‍♂️</h2>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
                                Натисніть кнопку нижче, щоб завантажити базові вправи у Firebase.
                            </p>
                            <button
                                onClick={async () => {
                                    await uploadExercises();
                                    window.location.reload();
                                }}
                                style={{
                                    backgroundColor: 'var(--accent-blue)', color: 'white',
                                    padding: '12px 24px', borderRadius: '10px', border: 'none',
                                    fontWeight: 'bold', cursor: 'pointer', transition: '0.3s'
                                }}
                            >
                                📥 ЗАВАНТАЖИТИ ВПРАВИ
                            </button>
                        </div>
                    )}
                    {/* ----------------------------------------------------------------- */}

                    {exercises.length > 0 && (
                        <>
                            {/* Панель керування (пошук + фільтр м’язів) */}
                            <div className="exercises-header">
                                <div className="search-bar">
                                    <input
                                        type="text"
                                        placeholder="🔍 Пошук вправи (наприклад: Віджимання)..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <div className="filters">
                                    {uniqueMuscles.map(muscle => (
                                        <button
                                            key={muscle}
                                            className={`btn-filter ${muscleFilter === muscle ? 'active' : ''}`}
                                            onClick={() => setMuscleFilter(muscle)}
                                        >
                                            {muscle}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Сітка вправ */}
                            <div className="exercises-grid">
                                {filteredExercises.length === 0 ? (
                                    <p
                                        style={{
                                            gridColumn: '1/-1',
                                            textAlign: 'center',
                                            color: 'var(--text-muted)',
                                            padding: '2rem',
                                        }}
                                    >
                                        Вправ за цими критеріями не знайдено 🕵️‍♂️
                                    </p>
                                ) : (
                                    filteredExercises.map(ex => (
                                        <ExerciseCard key={ex.id} exercise={ex} />
                                    ))
                                )}
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default Exercises;