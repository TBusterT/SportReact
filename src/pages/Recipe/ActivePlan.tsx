// src/pages/Recipe/ActivePlan.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore'; // Додали setDoc

import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext'; // Імпортуємо користувача
import { uploadMealPlans } from '../../services/seedDatabase';

import ActivePlanDetail from '../../components/cards/Recipe/ActivePlanDetail';
import '../../styles/recipe/ActivePlan.css';

import type { MealPlan } from '../../types';

const ActivePlan: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { currentUser } = useAuth(); // Отримуємо поточного користувача

    const [plan, setPlan] = useState<MealPlan | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isActivating, setIsActivating] = useState<boolean>(false); // Стан для кнопки активації

    // Завантаження плану з Firestore
    useEffect(() => {
        const fetchPlan = async () => {
            if (!id) {
                setError("ID плану не вказано");
                setLoading(false);
                return;
            }

            try {
                const docRef = doc(db, "meal_plans", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();

                    const planData: MealPlan = {
                        id: Number(docSnap.id) || 0,
                        title: data?.title ?? '',
                        badge: data?.badge ?? '',
                        image: data?.image ?? '',
                        description: data?.description ?? '',
                        calories: data?.calories ?? '0 ккал',
                        protein: data?.protein ?? '0 г',
                        fat: data?.fat ?? '0 г',
                        carbs: data?.carbs ?? '0 г',
                        schedule: data?.schedule || [],
                    };

                    setPlan(planData);
                } else {
                    setError("План харчування не знайдено");
                }
            } catch (err) {
                console.error("Помилка завантаження плану:", err);
                setError("Помилка при завантаженні даних");
            } finally {
                setLoading(false);
            }
        };

        fetchPlan();
    }, [id]);

    // === ФУНКЦІЯ АКТИВАЦІЇ ПЛАНУ ===
    const handleActivatePlan = async () => {
        if (!plan) return;
        if (!currentUser) {
            alert("Будь ласка, увійдіть в акаунт, щоб активувати план.");
            return;
        }

        setIsActivating(true);

        try {
            // 1. Витягуємо цифри з рядків (наприклад "1650 ккал" -> 1650)
            const maxCalories = parseInt(plan.calories.replace(/\D/g, '')) || 2000;
            const maxProtein = parseInt(plan.protein.replace(/\D/g, '')) || 100;
            const maxFat = parseInt(plan.fat.replace(/\D/g, '')) || 60;
            const maxCarbs = parseInt(plan.carbs.replace(/\D/g, '')) || 250;

            // 2. Беремо меню на перший день з розкладу
            const firstDay = plan.schedule[0];
            const dailyPlan = firstDay ? firstDay.meals.map(meal => ({
                mealType: meal.type, // "Сніданок", "Обід" тощо
                items: [{
                    title: meal.name,
                    calories: meal.kcal,
                    amount: "1 порція"
                }]
            })) : [];

            // 3. Формуємо об'єкт для сторінки Раціону (Diet.tsx)
            const newDietData = {
                activePlanId: plan.id,
                activePlanTitle: plan.title,
                overview: [
                    { title: 'Калорії', current: 0, max: maxCalories, unit: 'ккал', color: 'var(--accent-blue)' },
                    { title: 'Білки', current: 0, max: maxProtein, unit: 'г', color: '#ffcc00' },
                    { title: 'Жири', current: 0, max: maxFat, unit: 'г', color: '#ff6600' },
                    { title: 'Вуглеводи', current: 0, max: maxCarbs, unit: 'г', color: 'var(--accent-green)' }
                ],
                dailyPlan: dailyPlan,
                tracked: [] // Очищаємо список з'їденого для нового плану
            };

            // 4. Записуємо в колекцію user_diet
            const dietRef = doc(db, "user_diet", currentUser.uid);
            await setDoc(dietRef, newDietData);

            alert(`✅ План "${plan.title}" успішно активовано! Ваш раціон оновлено.`);

            // 5. Перекидаємо користувача на сторінку Раціону
            navigate('/diet');

        } catch (error) {
            console.error("Помилка активації плану:", error);
            alert("Не вдалося активувати план. Спробуйте ще раз.");
        } finally {
            setIsActivating(false);
        }
    };

    if (loading) {
        return (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--accent-green)' }}>
                <h2>Готуємо меню... ⏳</h2>
            </div>
        );
    }

    if (error || !plan) {
        return (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)', maxWidth: '620px', margin: '0 auto' }}>
                <h2 style={{ marginBottom: '1rem' }}>{error || "План харчування не знайдено"} 🕵️‍♂️</h2>
                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => navigate('/recipes')}
                        style={{ padding: '12px 24px', background: 'transparent', color: 'var(--accent-blue)', border: '1px solid var(--accent-blue)', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        ← Повернутися до рецептів
                    </button>
                    <button
                        onClick={async () => {
                            await uploadMealPlans();
                            window.location.reload();
                        }}
                        style={{ padding: '12px 24px', background: 'var(--accent-green)', color: 'var(--bg-dark)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        📥 ЗАВАНТАЖИТИ ПЛАНИ У FIREBASE
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            {isActivating && (
                <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: 'var(--accent-green)', color: '#000', borderRadius: '10px', marginBottom: '1rem', fontWeight: 'bold' }}>
                    ⚙️ Застосовуємо план харчування до вашого профілю...
                </div>
            )}

            {(!plan.schedule || plan.schedule.length === 0) && (
                <div style={{ textAlign: 'center', marginBottom: '20px', padding: '15px', backgroundColor: 'rgba(255, 71, 87, 0.1)', borderRadius: '10px' }}>
                    <p style={{ color: '#ff4757', marginBottom: '10px' }}>У цьому плані немає розкладу страв у базі даних.</p>
                    <button
                        onClick={async () => {
                            await uploadMealPlans();
                            window.location.reload();
                        }}
                        style={{ padding: '10px 20px', backgroundColor: '#ff4757', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        🔄 ОНОВИТИ БАЗУ ДАНИХ (Додати страви)
                    </button>
                </div>
            )}

            <ActivePlanDetail
                plan={plan}
                onActivatePlan={handleActivatePlan}
            />
        </div>
    );
};

export default ActivePlan;