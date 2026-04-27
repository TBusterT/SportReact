// src/services/seedHealthData.ts
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const uploadHealthDataToFirebase = async (userId: string) => {
    // Твій JSON об'єкт з даними
    const healthData = {
        widgets: {
            sleep: { time: "7 год 20 хв", status: "Оптимально", statusClass: "good", icon: "🌙", color: "#9b59b6" },
            heartRate: { value: "62 <span style='font-size: 0.8rem; font-weight: normal'>уд/хв</span>", status: "Відмінно", statusClass: "good", icon: "❤️", color: "#e74c3c" },
            stress: { level: "Низький", percentage: 25, color: "#f1c40f", icon: "🧘‍♂️" }
        },
        sleepAnalysis: {
            deepSleep: "1 год 45 хв",
            quality: 88,
            chartData: [20, 80, 40, 90, 30, 75, 20]
        },
        bodyMetrics: [
            { name: "Вага", value: "78.5 кг", trend: "down", trendText: "↓ 0.5 кг" },
            { name: "Індекс маси тіла (ІМТ)", value: "23.4", isBadge: true, badgeText: "Норма", badgeClass: "normal" },
            { name: "Відсоток жиру", value: "16%", trend: "down", trendText: "↓ 0.2%" },
            { name: "М'язова маса", value: "42.1 кг", trend: "up", trendText: "↑ 0.3 кг" }
        ],
        recommendations: [
            { icon: "💧", title: "Не забувайте про гідратацію", text: "Випийте ще мінімум 1 літр води до кінця дня, щоб підтримати оптимальний водний баланс." },
            { icon: "🚶‍♂️", title: "Час розім'ятись", text: "Ви сидите вже понад 2 години. Зробіть коротку 5-хвилинну прогулянку або розтяжку." },
            { icon: "🍎", title: "Додайте вітамінів", text: "Сьогодні у вашому раціоні бракує клітковини. З'їжте яблуко або додайте овочевий салат на вечерю." }
        ]
    };

    try {
        console.log("Завантажуємо дані здоров'я...");

        // Зберігаємо як один документ, де ID документа = ID користувача
        // Це дозволить нам дуже легко і швидко діставати ці дані
        const docRef = doc(db, "health_metrics", userId);
        await setDoc(docRef, healthData);

        alert("✅ Дані здоров'я успішно завантажені!");
        window.location.reload(); // Перезавантажуємо сторінку, щоб побачити нові дані
    } catch (error) {
        console.error("Помилка завантаження даних здоров'я: ", error);
        alert("Помилка! Дивіться консоль.");
    }
};