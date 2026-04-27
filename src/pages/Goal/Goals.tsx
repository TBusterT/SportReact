// src/pages/Goal/Goals.tsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore'; // Додали addDoc

// Підключаємо стилі
import '../../styles/goal/goals.css';

// Firebase та Auth
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { uploadGoals } from '../../services/seedDatabase';

// Компонент картки
import GoalCard from '../../components/cards/Goal/GoalCard.tsx';

// Типи
import type { Goal } from '../../types';

const Goals: React.FC = () => {
    const { currentUser } = useAuth();
    const [searchParams] = useSearchParams();

    // СТАНИ ДЛЯ ДАНИХ З БАЗИ
    const [goals, setGoals] = useState<Goal[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // СТАНИ ДЛЯ НОВОЇ ЦІЛІ
    const [newType, setNewType] = useState('weight');
    const [newDesc, setNewDesc] = useState('');
    const [newTarget, setNewTarget] = useState('');
    const [newDeadline, setNewDeadline] = useState('');
    const [newImage, setNewImage] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const filterStatus = searchParams.get('status') || 'all';

    // ЗАВАНТАЖЕННЯ ДАНИХ
    useEffect(() => {
        const fetchGoals = async () => {
            if (!currentUser) return;

            try {
                const q = query(
                    collection(db, "goals"),
                    where("userId", "==", currentUser.uid)
                );

                const querySnapshot = await getDocs(q);
                const fetchedData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as unknown as Goal[];

                setGoals(fetchedData);
            } catch (error) {
                console.error("Помилка завантаження цілей:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGoals();
    }, [currentUser]);

    // === ФУНКЦІЯ СТВОРЕННЯ НОВОЇ ЦІЛІ ===
    const handleCreateGoal = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) return;
        setIsCreating(true);

        // Автоматично підставляємо правильний заголовок та одиниці виміру залежно від категорії
        let title = '';
        let unit = '';
        switch (newType) {
            case 'weight': title = 'Схуднути / Вага'; unit = 'кг'; break;
            case 'muscle': title = "Набрати м'язи"; unit = 'кг'; break;
            case 'steps': title = 'Кроки на день'; unit = 'кроків'; break;
            case 'calories': title = 'Калорії на день'; unit = 'ккал'; break;
            case 'workouts': title = 'Кількість тренувань'; unit = 'занять'; break;
            default: title = 'Нова ціль'; unit = '';
        }

        // Формуємо об'єкт нової цілі
        const newGoalData = {
            userId: currentUser.uid,
            type: newType,
            title: title,
            description: newDesc,
            current: 0, // Починаємо з нуля
            target: Number(newTarget),
            unit: unit,
            deadline: newDeadline,
            status: "active",
            // Якщо картинку не ввели, ставимо красиву дефолтну заглушку
            image: newImage || "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=400&q=60"
        };

        try {
            // Відправляємо в колекцію "goals" (Firebase сам створить унікальний ID документа)
            const docRef = await addDoc(collection(db, "goals"), newGoalData);

            // Миттєво додаємо нову ціль на екран, щоб не чекати перезавантаження сторінки
            const createdGoal = { id: docRef.id, ...newGoalData } as unknown as Goal;
            setGoals(prev => [...prev, createdGoal]);

            // Очищаємо форму
            setNewDesc('');
            setNewTarget('');
            setNewDeadline('');
            setNewImage('');

            alert("✅ Ціль успішно створена!");
        } catch (error) {
            console.error("Помилка при створенні цілі:", error);
            alert("Не вдалося створити ціль.");
        } finally {
            setIsCreating(false);
        }
    };

    // Логіка фільтрації
    const filteredGoals = goals.filter(goal => {
        if (filterStatus === 'all') return true;
        return goal.status === filterStatus;
    });

    return (
        <div className="goals-page">
            <header>
                <h1>Цілі та мотивація</h1>
                <div className="user-profile">
                    <span>
                        Привіт, {currentUser?.email || 'Спортсмен'}! 🎯
                    </span>
                    <div className="avatar"></div>
                </div>
            </header>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--accent-blue)' }}>
                    <h2>Шукаємо ваші цілі... ⏳</h2>
                </div>
            ) : (
                <>
                    {/* --- СЕКЦІЯ 1: СІТКА ЦІЛЕЙ --- */}
                    <div className="goals-overview">
                        <div className="section-title">
                            <h2>Ваші цілі</h2>
                        </div>

                        {goals.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: 'var(--bg-panel)', borderRadius: '15px', marginBottom: '2rem' }}>
                                <h2 style={{ marginBottom: '10px' }}>У вас ще немає цілей 📉</h2>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
                                    Натисніть кнопку нижче, щоб завантажити стартові цілі, або створіть власну.
                                </p>
                                <button
                                    onClick={async () => {
                                        if (currentUser) {
                                            await uploadGoals(currentUser.uid);
                                            window.location.reload();
                                        }
                                    }}
                                    style={{
                                        backgroundColor: 'var(--accent-green)', color: 'var(--bg-dark)',
                                        padding: '12px 24px', borderRadius: '10px', border: 'none',
                                        fontWeight: 'bold', cursor: 'pointer', transition: '0.3s'
                                    }}
                                >
                                    📥 ДОДАТИ ПЕРШІ ЦІЛІ
                                </button>
                            </div>
                        )}

                        {goals.length > 0 && (
                            <div className="goals-grid">
                                {filteredGoals.length === 0 ? (
                                    <p style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                                        За вашим фільтром немає цілей.
                                    </p>
                                ) : (
                                    filteredGoals.map(goal => (
                                        <GoalCard key={goal.id} goal={goal} />
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    {/* --- СЕКЦІЯ 2: ФОРМА СТВОРЕННЯ НОВОЇ ЦІЛІ --- */}
                    <div className="set-new-goal">
                        <div className="section-title">
                            <h2>Встановити нову ціль</h2>
                        </div>
                        <form className="goal-form" onSubmit={handleCreateGoal}>
                            <div className="form-group">
                                <label>Категорія:</label>
                                <select
                                    required
                                    value={newType}
                                    onChange={(e) => setNewType(e.target.value)}
                                    disabled={isCreating}
                                >
                                    <option value="weight">Схуднути / Вага</option>
                                    <option value="muscle">Набрати м'язи</option>
                                    <option value="steps">Кроки на день</option>
                                    <option value="calories">Калорії на день</option>
                                    <option value="workouts">Кількість тренувань</option>
                                </select>
                            </div>
                            <div className="form-group full-width">
                                <label>Короткий опис:</label>
                                <input
                                    type="text"
                                    placeholder="Наприклад: Підготуватися до літа"
                                    required
                                    value={newDesc}
                                    onChange={(e) => setNewDesc(e.target.value)}
                                    disabled={isCreating}
                                />
                            </div>
                            <div className="form-group">
                                <label>Цільове значення (цифра):</label>
                                <input
                                    type="number"
                                    placeholder="Наприклад: 5 або 10000"
                                    required
                                    value={newTarget}
                                    onChange={(e) => setNewTarget(e.target.value)}
                                    disabled={isCreating}
                                />
                            </div>
                            <div className="form-group">
                                <label>Дедлайн (до якого числа):</label>
                                <input
                                    type="date"
                                    required
                                    value={newDeadline}
                                    onChange={(e) => setNewDeadline(e.target.value)}
                                    disabled={isCreating}
                                />
                            </div>
                            <div className="form-group full-width">
                                <label>Фото цілі (URL посилання на картинку):</label>
                                <input
                                    type="url"
                                    placeholder="https://images.unsplash.com/..."
                                    value={newImage}
                                    onChange={(e) => setNewImage(e.target.value)}
                                    disabled={isCreating}
                                />
                                <small style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>
                                    Залиште пустим, щоб використати стандартне фото.
                                </small>
                            </div>

                            <button type="submit" className="btn-set-goal" disabled={isCreating}>
                                {isCreating ? 'Створення...' : 'Створити ціль'}
                            </button>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
};

export default Goals;