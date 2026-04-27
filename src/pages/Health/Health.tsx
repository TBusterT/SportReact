// src/pages/Health/Health.tsx
import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';

// Стилі та Firebase
import '../../styles/health/health.css';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { uploadHealthDataToFirebase } from '../../services/seedHealthData';

// Компоненти
import HealthWidget from '../../components/cards/Health/HealthWidget.tsx';
import SleepAnalysisCard from '../../components/cards/Health/SleepAnalysisCard.tsx';
import BodyMetricsCard from '../../components/cards/Health/BodyMetricsCard.tsx';
import RecommendationCard from '../../components/cards/Health/RecommendationCard.tsx';

// Типи
import type { HealthDataStructure } from '../../types';

const Health: React.FC = () => {
    const { currentUser } = useAuth();

    const [healthData, setHealthData] = useState<HealthDataStructure | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // СТАНИ ДЛЯ ФОРМИ ОНОВЛЕННЯ ПАРАМЕТРІВ
    const [showForm, setShowForm] = useState(false);
    const [weightInput, setWeightInput] = useState('');
    const [fatInput, setFatInput] = useState('');
    const [muscleInput, setMuscleInput] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Завантаження даних з Firebase
    useEffect(() => {
        const fetchHealthData = async () => {
            if (!currentUser) return;
            try {
                const docRef = doc(db, "health_metrics", currentUser.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setHealthData(docSnap.data() as HealthDataStructure);
                } else {
                    console.log("Дані здоров'я не знайдені в базі.");
                }
            } catch (error) {
                console.error("Помилка читання даних:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHealthData();
    }, [currentUser]);

    // === ФУНКЦІЯ ЗБЕРЕЖЕННЯ ТА ВІДСТЕЖЕННЯ ІСТОРІЇ ===
    const handleSaveMetrics = async () => {
        if (!currentUser || !healthData) return;
        setIsSaving(true);

        try {
            const docRef = doc(db, "health_metrics", currentUser.uid);

            const newWeight = parseFloat(weightInput);
            const newFat = parseFloat(fatInput);
            const newMuscle = parseFloat(muscleInput);

            // 1. Створюємо запис для історії
            const today = new Date();
            const historyEntry = {
                date: today.toLocaleDateString('uk-UA'),
                timestamp: today.getTime(),
                weight: newWeight || null,
                fat: newFat || null,
                muscle: newMuscle || null
            };

            // 2. Оновлюємо поточні показники та вираховуємо тренди (різницю)
            const updatedMetrics = healthData.bodyMetrics.map(metric => {
                if (metric.name === 'Вага' && newWeight) {
                    const oldVal = parseFloat(metric.value);
                    const diff = newWeight - oldVal;
                    return {
                        ...metric,
                        value: `${newWeight} кг`,
                        trend: diff > 0 ? 'up' : 'down',
                        trendText: `${diff > 0 ? '↑' : '↓'} ${Math.abs(diff).toFixed(1)} кг`
                    };
                }
                if (metric.name === 'Відсоток жиру' && newFat) {
                    const oldVal = parseFloat(metric.value);
                    const diff = newFat - oldVal;
                    return {
                        ...metric,
                        value: `${newFat}%`,
                        trend: diff > 0 ? 'up' : 'down',
                        trendText: `${diff > 0 ? '↑' : '↓'} ${Math.abs(diff).toFixed(1)}%`
                    };
                }
                if (metric.name === "М'язова маса" && newMuscle) {
                    const oldVal = parseFloat(metric.value);
                    const diff = newMuscle - oldVal;
                    return {
                        ...metric,
                        value: `${newMuscle} кг`,
                        trend: diff > 0 ? 'up' : 'down',
                        trendText: `${diff > 0 ? '↑' : '↓'} ${Math.abs(diff).toFixed(1)} кг`
                    };
                }
                return metric;
            });

            // 3. Відправляємо в базу (оновлюємо поточні + додаємо в масив історії)
            await updateDoc(docRef, {
                bodyMetrics: updatedMetrics,
                metricsHistory: arrayUnion(historyEntry) // Додає запис, не видаляючи старі!
            });

            // 4. Оновлюємо стан на екрані
            setHealthData(prev => prev ? {
                ...prev,
                bodyMetrics: updatedMetrics,
                // Додаємо історію в локальний стейт (використовуємо any, щоб уникнути помилок типу, якщо його ще немає в types.ts)
                metricsHistory: [...((prev as any).metricsHistory || []), historyEntry]
            } : null);

            // Очищаємо форму
            setShowForm(false);
            setWeightInput('');
            setFatInput('');
            setMuscleInput('');

        } catch (error) {
            console.error("Помилка збереження метрик:", error);
            alert("Не вдалося зберегти дані.");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--accent-blue)' }}><h2>Завантаження показників... ⏳</h2></div>;
    }

    if (!healthData) {
        return (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
                <h2>У вас ще немає даних здоров'я 🩺</h2>
                <button
                    onClick={async () => {
                        if (currentUser) {
                            await uploadHealthDataToFirebase(currentUser.uid);
                            window.location.reload();
                        }
                    }}
                    style={{ background: 'var(--accent-green)', color: 'var(--bg-dark)', padding: '12px 24px', borderRadius: '10px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
                >
                    Завантажити тестові дані
                </button>
            </div>
        );
    }

    const historyLog = (healthData as any).metricsHistory || [];

    return (
        <div className="health-page">
            <header>
                <h1>Показники здоров'я</h1>
                <div className="user-profile">
                    <span>
                        Привіт, {currentUser?.email || 'Спортсмен'}! 🔥
                    </span>
                    <div className="avatar"></div>
                </div>
            </header>

            {/* СЕКЦІЯ 1: Головні віджети */}
            <div className="health-widgets">
                <HealthWidget icon={healthData.widgets.sleep.icon} color={healthData.widgets.sleep.color} title="Сон" value={healthData.widgets.sleep.time} status={healthData.widgets.sleep.status} statusClass={healthData.widgets.sleep.statusClass} />
                <HealthWidget icon={healthData.widgets.heartRate.icon} color={healthData.widgets.heartRate.color} title="Пульс (у спокої)" value={<span dangerouslySetInnerHTML={{ __html: healthData.widgets.heartRate.value }} />} status={healthData.widgets.heartRate.status} statusClass={healthData.widgets.heartRate.statusClass} />
                <HealthWidget icon={healthData.widgets.stress.icon} color={healthData.widgets.stress.color} title="Рівень стресу" value={healthData.widgets.stress.level}>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${healthData.widgets.stress.percentage}%`, backgroundColor: healthData.widgets.stress.color }} />
                    </div>
                </HealthWidget>
            </div>

            {/* СЕКЦІЯ 2: Аналітика та параметри тіла */}
            <div className="health-grid">
                <SleepAnalysisCard deepSleep={healthData.sleepAnalysis.deepSleep} quality={healthData.sleepAnalysis.quality} chartData={healthData.sleepAnalysis.chartData} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <BodyMetricsCard metrics={healthData.bodyMetrics} />

                    {/* КНОПКА ТА ФОРМА ОНОВЛЕННЯ ПАРАМЕТРІВ */}
                    <div style={{ backgroundColor: 'var(--bg-panel)', padding: '20px', borderRadius: '15px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showForm ? '15px' : '0' }}>
                            <h3 style={{ margin: 0 }}>Оновлення параметрів</h3>
                            <button
                                onClick={() => setShowForm(!showForm)}
                                style={{ background: 'transparent', color: 'var(--accent-blue)', border: '1px solid var(--accent-blue)', padding: '5px 15px', borderRadius: '8px', cursor: 'pointer' }}
                            >
                                {showForm ? 'Скасувати' : '+ Оновити'}
                            </button>
                        </div>

                        {showForm && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                    <input type="number" placeholder="Вага (кг)" value={weightInput} onChange={(e) => setWeightInput(e.target.value)} disabled={isSaving} style={{ padding: '10px', borderRadius: '8px', background: 'var(--bg-dark)', color: 'white', border: '1px solid var(--border-color)' }} />
                                    <input type="number" placeholder="Жир (%)" value={fatInput} onChange={(e) => setFatInput(e.target.value)} disabled={isSaving} style={{ padding: '10px', borderRadius: '8px', background: 'var(--bg-dark)', color: 'white', border: '1px solid var(--border-color)' }} />
                                </div>
                                <input type="number" placeholder="М'язова маса (кг)" value={muscleInput} onChange={(e) => setMuscleInput(e.target.value)} disabled={isSaving} style={{ padding: '10px', borderRadius: '8px', background: 'var(--bg-dark)', color: 'white', border: '1px solid var(--border-color)' }} />
                                <button
                                    onClick={handleSaveMetrics}
                                    disabled={isSaving || (!weightInput && !fatInput && !muscleInput)}
                                    style={{ padding: '12px', background: 'var(--accent-green)', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '5px' }}
                                >
                                    {isSaving ? 'Збереження...' : 'Зберегти в історію'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* СЕКЦІЯ 3: Історія змін (Аналітика відстеження) */}
            {historyLog.length > 0 && (
                <div style={{ marginTop: '2rem', backgroundColor: 'var(--bg-panel)', padding: '20px', borderRadius: '15px' }}>
                    <h2 style={{ marginBottom: '1rem' }}>Історія змін (Аналітика) 📈</h2>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                            <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                                <th style={{ padding: '10px' }}>Дата</th>
                                <th style={{ padding: '10px' }}>Вага</th>
                                <th style={{ padding: '10px' }}>Жир</th>
                                <th style={{ padding: '10px' }}>М'язи</th>
                            </tr>
                            </thead>
                            <tbody>
                            {/* Виводимо найновіші записи зверху */}
                            {[...historyLog].reverse().map((entry: any, index: number) => (
                                <tr key={index} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '10px', color: 'var(--accent-blue)' }}>{entry.date}</td>
                                    <td style={{ padding: '10px' }}>{entry.weight ? `${entry.weight} кг` : '-'}</td>
                                    <td style={{ padding: '10px' }}>{entry.fat ? `${entry.fat}%` : '-'}</td>
                                    <td style={{ padding: '10px' }}>{entry.muscle ? `${entry.muscle} кг` : '-'}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* СЕКЦІЯ 4: Рекомендації */}
            <div className="health-recommendations" style={{ marginTop: '2rem' }}>
                <h2>Щоденні рекомендації</h2>
                <div className="recommendations-list">
                    {healthData.recommendations.map((rec, idx) => (
                        <RecommendationCard key={idx} recommendation={rec} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Health;