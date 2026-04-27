// src/pages/Diet/Diet.tsx
import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';

// Підключаємо стилі
import '../../styles/diet/diet.css';

// Firebase та Auth
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { uploadDietData } from '../../services/seedDatabase';

// Компоненти
import DietOverviewWidget from '../../components/cards/Diet/DietOverviewWidget.tsx';
import MealItemCard from '../../components/cards/Diet/MealItemCard.tsx';
import TrackedItemCard from '../../components/cards/Diet/TrackedItemCard.tsx';

// Твої точні типи!
import type { DietDataStructure, TrackedItem } from '../../types';

const Diet: React.FC = () => {
    const { currentUser } = useAuth();

    // СТАНИ ДЛЯ ДАНИХ
    const [dietData, setDietData] = useState<DietDataStructure | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // СТАНИ ДЛЯ ФОРМИ ВІДСТЕЖЕННЯ
    const [trackName, setTrackName] = useState('');
    const [trackCalories, setTrackCalories] = useState('');
    const [trackProtein, setTrackProtein] = useState('');
    const [trackFat, setTrackFat] = useState('');
    const [trackCarbs, setTrackCarbs] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    // ЗАВАНТАЖЕННЯ ДАНИХ
    useEffect(() => {
        const fetchDietData = async () => {
            if (!currentUser) return;
            try {
                const docRef = doc(db, "user_diet", currentUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    // Тепер TypeScript чітко розуміє, що це DietDataStructure
                    setDietData(docSnap.data() as DietDataStructure);
                }
            } catch (error) {
                console.error("Помилка завантаження раціону:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDietData();
    }, [currentUser]);

    // === ГОЛОВНА ФУНКЦІЯ ДОДАВАННЯ СТРАВИ ===
    const handleAddFood = async (name: string, calories: number, protein: number = 0, fat: number = 0, carbs: number = 0) => {
        if (!currentUser || !dietData) return;
        setIsUpdating(true);

        try {
            const docRef = doc(db, "user_diet", currentUser.uid);

            // Створюємо об'єкт строго за твоїм типом TrackedItem
            const newItem: TrackedItem = {
                name,
                calories,
                protein,
                fat,
                carbs
            };

            // 1. Надійно оновлюємо віджети БЖВ
            const newOverview = dietData.overview.map(item => {
                const cleanTitle = item.title.trim().toLowerCase();

                if (cleanTitle === 'калорії') return { ...item, current: Number(item.current) + calories };
                if (cleanTitle === 'білки') return { ...item, current: Number(item.current) + protein };
                if (cleanTitle === 'жири') return { ...item, current: Number(item.current) + fat };
                if (cleanTitle === 'вуглеводи') return { ...item, current: Number(item.current) + carbs };

                return item;
            });

            // 2. Відправляємо дані у Firebase
            await updateDoc(docRef, {
                tracked: arrayUnion(newItem),
                overview: newOverview
            });

            // 3. Миттєво оновлюємо екран
            setDietData(prev => prev ? {
                ...prev,
                tracked: [...prev.tracked, newItem],
                overview: newOverview
            } : null);

            // 4. Очищаємо інпути
            setTrackName('');
            setTrackCalories('');
            setTrackProtein('');
            setTrackFat('');
            setTrackCarbs('');
        } catch (error) {
            console.error("Помилка додавання їжі:", error);
            alert("Не вдалося додати страву.");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="diet-page">
            <header>
                <h1>Раціон</h1>
                <div className="user-profile">
                    <span>
                        Привіт, {currentUser?.email || 'Спортсмен'}! 🍏
                    </span>
                    <div className="avatar"></div>
                </div>
            </header>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--accent-blue)' }}>
                    <h2>Аналізуємо меню... ⏳</h2>
                </div>
            ) : !dietData ? (
                <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: 'var(--bg-panel)', borderRadius: '15px', marginBottom: '2rem' }}>
                    <h2 style={{ marginBottom: '10px' }}>Ваш раціон порожній 🍽️</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
                        Натисніть кнопку нижче, щоб завантажити персональний план харчування.
                    </p>
                    <button
                        onClick={async () => {
                            if (currentUser) {
                                await uploadDietData(currentUser.uid);
                                window.location.reload();
                            }
                        }}
                        style={{
                            backgroundColor: '#ffcc00', color: 'var(--bg-dark)',
                            padding: '12px 24px', borderRadius: '10px', border: 'none',
                            fontWeight: 'bold', cursor: 'pointer', transition: '0.3s'
                        }}
                    >
                        📥 СТВОРИТИ ПЛАН ХАРЧУВАННЯ
                    </button>
                </div>
            ) : (
                <>
                    {/* --- СЕКЦІЯ 1: ОГЛЯД (Віджети БЖВ) --- */}
                    <div className="diet-overview">
                        <div className="section-title">
                            <h2>Огляд харчування сьогодні</h2>
                        </div>
                        <div className="diet-widgets">
                            {dietData.overview.map((item, index) => (
                                <DietOverviewWidget key={index} item={item} />
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>

                        {/* --- СЕКЦІЯ 2: ПЛАН ХАРЧУВАННЯ --- */}
                        <div className="daily-plan" style={{ flex: 2 }}>
                            <div className="section-title">
                                <h2>План на сьогодні</h2>
                            </div>
                            <div>
                                {dietData.dailyPlan.map((plan, index) => (
                                    <div key={index} className="meal-section">
                                        <h3>{plan.mealType}</h3>
                                        <div>
                                            {plan.items.map((meal, idx) => (
                                                <div key={idx} style={{ marginBottom: '1rem' }}>
                                                    <MealItemCard meal={meal} />
                                                    {/* Кнопка швидкого додавання */}
                                                    <button
                                                        onClick={() => {
                                                            // РОЗУМНИЙ ПІДРАХУНОК: оскільки meal.macros це рядок,
                                                            // ми просто вираховуємо БЖВ від загальної калорійності страви (meal.calories)
                                                            const calcProtein = Math.round((meal.calories * 0.3) / 4);
                                                            const calcFat = Math.round((meal.calories * 0.3) / 9);
                                                            const calcCarbs = Math.round((meal.calories * 0.4) / 4);

                                                            handleAddFood(
                                                                meal.title,
                                                                meal.calories,
                                                                calcProtein,
                                                                calcFat,
                                                                calcCarbs
                                                            );
                                                        }}
                                                        disabled={isUpdating}
                                                        style={{
                                                            marginTop: '8px', padding: '6px 12px', borderRadius: '6px',
                                                            backgroundColor: 'rgba(0, 255, 136, 0.1)', color: 'var(--accent-green)',
                                                            border: '1px solid var(--accent-green)', cursor: 'pointer',
                                                            fontWeight: 'bold', fontSize: '0.85rem'
                                                        }}
                                                    >
                                                        + Я з'їв це ({meal.calories} ккал)
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* --- СЕКЦІЯ 3: ТРЕКЕР КАЛОРІЙ --- */}
                        <div className="calorie-tracker" style={{ flex: 1 }}>
                            <div className="section-title">
                                <h2>Відстеження калорій</h2>
                            </div>

                            {/* Форма ручного додавання */}
                            <div className="tracker-form" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <input
                                    type="text"
                                    placeholder="Назва страви або продукту"
                                    value={trackName}
                                    onChange={(e) => setTrackName(e.target.value)}
                                    disabled={isUpdating}
                                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-dark)', color: 'white' }}
                                />

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                    <input
                                        type="number"
                                        placeholder="Калорії (ккал)"
                                        value={trackCalories}
                                        onChange={(e) => setTrackCalories(e.target.value)}
                                        disabled={isUpdating}
                                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-dark)', color: 'white' }}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Білки (г)"
                                        value={trackProtein}
                                        onChange={(e) => setTrackProtein(e.target.value)}
                                        disabled={isUpdating}
                                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-dark)', color: 'white' }}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                                    <input
                                        type="number"
                                        placeholder="Жири (г)"
                                        value={trackFat}
                                        onChange={(e) => setTrackFat(e.target.value)}
                                        disabled={isUpdating}
                                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-dark)', color: 'white' }}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Вуглеводи (г)"
                                        value={trackCarbs}
                                        onChange={(e) => setTrackCarbs(e.target.value)}
                                        disabled={isUpdating}
                                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-dark)', color: 'white' }}
                                    />
                                </div>

                                <button
                                    className="btn-track"
                                    onClick={() => {
                                        if (trackName.trim() && trackCalories) {
                                            handleAddFood(
                                                trackName,
                                                Number(trackCalories),
                                                Number(trackProtein) || 0,
                                                Number(trackFat) || 0,
                                                Number(trackCarbs) || 0
                                            );
                                        }
                                    }}
                                    disabled={isUpdating || !trackName.trim() || !trackCalories}
                                    style={{ padding: '12px', borderRadius: '8px', background: 'var(--accent-green)', color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
                                >
                                    {isUpdating ? 'Додаємо...' : 'Додати до трекера'}
                                </button>
                            </div>

                            <div className="tracked-items" style={{ marginTop: '20px' }}>
                                {dietData.tracked.length === 0 ? (
                                    <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
                                        Ви ще нічого не додали.
                                    </p>
                                ) : (
                                    /* Перевертаємо масив, щоб нові страви були зверху */
                                    [...dietData.tracked].reverse().map((item, idx) => (
                                        <TrackedItemCard key={idx} item={item} />
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Diet;