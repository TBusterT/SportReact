// src/pages/Exercise/ActiveExercise.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';

// Firebase
import { db } from '../../firebase';
import { uploadExercises } from '../../services/seedDatabase';

// Компонент детальної картки
import ActiveExerciseDetail from '../../components/cards/Exercise/ActiveExerciseDetail';
import '../../styles/exercise/ActiveExercise.css';

// Тип
import type { Exercise } from '../../types';

const ActiveExercise: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [exercise, setExercise] = useState<Exercise | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchExercise = async () => {
            if (!id) return;

            try {
                const docRef = doc(db, "exercises", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    // Використовуємо unknown хак для приведення типів (ID string -> number)
                    setExercise({ id: Number(docSnap.id), ...docSnap.data() } as unknown as Exercise);
                } else {
                    console.log("Вправу не знайдено в базі даних");
                }
            } catch (error) {
                console.error("Помилка завантаження вправи:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchExercise();
    }, [id]);

    if (loading) {
        return (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--accent-blue)' }}>
                <h2>Завантажуємо техніку виконання... 📚</h2>
            </div>
        );
    }

    if (!exercise) {
        return (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <h2>Вправу не знайдено 🕵️‍♂️</h2>
                <button
                    className="btn-small"
                    onClick={() => navigate('/exercises')}
                    style={{ marginBottom: '20px' }}
                >
                    Повернутися до гіда
                </button>

                {/* Кнопка завантаження, якщо база порожня */}
                <div style={{ marginTop: '2rem' }}>
                    <button
                        onClick={async () => {
                            await uploadExercises();
                            window.location.reload();
                        }}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: 'var(--accent-blue)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer'
                        }}
                    >
                        📥 Завантажити вправи у Firebase
                    </button>
                </div>
            </div>
        );
    }

    return <ActiveExerciseDetail exercise={exercise} />;
};

export default ActiveExercise;