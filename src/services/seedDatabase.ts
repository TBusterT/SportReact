import {collection, writeBatch, doc, setDoc} from 'firebase/firestore';
// db імпортується зверху файла
 import { db } from '../firebase';



export const uploadTrainingsToFirebase = async () => {
    const trainingsData = [
        // ... (ТУТ МАЄ БУТИ ТВІЙ МАСИВ З 50 ТРЕНУВАНЬ) ...
        {
            "id": 1,
            "title": "Фулбоді силове тренування",
            "image": "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg",
            "badge": "Середній",
            "duration": "50 хв",
            "calories": "450 ккал",
            "description": "Комплекс на все тіло: присідання, жим лежачи, тяга штанги.",
            "category": "Силові"
        },
        {
            "id": 2,
            "title": "Тренування ніг та сідниць",
            "image": "https://images.pexels.com/photos/2294361/pexels-photo-2294361.jpeg",
            "badge": "Середній",
            "duration": "45 хв",
            "calories": "380 ккал",
            "description": "Присідання, випади та румунська тяга.",
            "category": "Силові"
        },
        {
            "id": 3,
            "title": "Груди та плечі",
            "image": "https://images.pexels.com/photos/2261477/pexels-photo-2261477.jpeg",
            "badge": "Профі",
            "duration": "40 хв",
            "calories": "420 ккал",
            "description": "Жим штанги та гантелей для розвитку грудей.",
            "category": "Силові"
        },
        {
            "id": 4,
            "title": "Спина та біцепс",
            "image": "https://images.pexels.com/photos/1431282/pexels-photo-1431282.jpeg",
            "badge": "Середній",
            "duration": "35 хв",
            "calories": "350 ккал",
            "description": "Підтягування та тяга верхнього блоку.",
            "category": "Силові"
        },
        {
            "id": 5,
            "title": "Силове для новачків",
            "image": "https://images.pexels.com/photos/4753996/pexels-photo-4753996.jpeg",
            "badge": "Новачок",
            "duration": "30 хв",
            "calories": "280 ккал",
            "description": "Базові вправи з легкою вагою.",
            "category": "Силові"
        },
        {
            "id": 6,
            "title": "Трицепс та плечі",
            "image": "https://images.pexels.com/photos/6456306/pexels-photo-6456306.jpeg",
            "badge": "Середній",
            "duration": "40 хв",
            "calories": "360 ккал",
            "description": "Французький жим та розгинання рук.",
            "category": "Силові"
        },
        {
            "id": 7,
            "title": "Система 5x5",
            "image": "https://images.pexels.com/photos/2261485/pexels-photo-2261485.jpeg",
            "badge": "Профі",
            "duration": "55 хв",
            "calories": "500 ккал",
            "description": "Силова програма для росту сили.",
            "category": "Силові"
        },
        {
            "id": 8,
            "title": "Руки та передпліччя",
            "image": "https://images.pexels.com/photos/3838389/pexels-photo-3838389.jpeg",
            "badge": "Середній",
            "duration": "25 хв",
            "calories": "220 ккал",
            "description": "Згинання рук з гантелями.",
            "category": "Силові"
        },
        {
            "id": 9,
            "title": "Домашні гантелі",
            "image": "https://images.pexels.com/photos/6456297/pexels-photo-6456297.jpeg",
            "badge": "Новачок",
            "duration": "35 хв",
            "calories": "310 ккал",
            "description": "Комплекс вправ з гантелями вдома.",
            "category": "Силові"
        },
        {
            "id": 10,
            "title": "Спина та трапеція",
            "image": "https://images.pexels.com/photos/6455825/pexels-photo-6455825.jpeg",
            "badge": "Профі",
            "duration": "45 хв",
            "calories": "390 ккал",
            "description": "Шраги та тяги штанги.",
            "category": "Силові"
        },
        {
            "id": 11,
            "title": "Ранкова йога",
            "image": "https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg",
            "badge": "Новачок",
            "duration": "20 хв",
            "calories": "130 ккал",
            "description": "Легка йога для пробудження.",
            "category": "Йога"
        },
        {
            "id": 12,
            "title": "Йога на гнучкість",
            "image": "https://images.pexels.com/photos/4324020/pexels-photo-4324020.jpeg",
            "badge": "Середній",
            "duration": "35 хв",
            "calories": "160 ккал",
            "description": "Глибока розтяжка.",
            "category": "Йога"
        },
        {
            "id": 13,
            "title": "Вечірня релакс-йога",
            "image": "https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg",
            "badge": "Новачок",
            "duration": "25 хв",
            "calories": "110 ккал",
            "description": "Розслаблення перед сном.",
            "category": "Йога"
        },
        {
            "id": 14,
            "title": "Vinyasa Yoga",
            "image": "https://images.pexels.com/photos/317155/pexels-photo-317155.jpeg",
            "badge": "Середній",
            "duration": "40 хв",
            "calories": "280 ккал",
            "description": "Динамічний потік асан.",
            "category": "Йога"
        },
        {
            "id": 15,
            "title": "Йога для постави",
            "image": "https://images.pexels.com/photos/4498151/pexels-photo-4498151.jpeg",
            "badge": "Новачок",
            "duration": "30 хв",
            "calories": "140 ккал",
            "description": "Вправи для здорової спини.",
            "category": "Йога"
        },
        {
            "id": 16,
            "title": "HIIT жироспалювання",
            "image": "https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg",
            "badge": "Профі",
            "duration": "30 хв",
            "calories": "520 ккал",
            "description": "Інтенсивні інтервали.",
            "category": "Кардіо"
        },
        {
            "id": 17,
            "title": "Табата тренування",
            "image": "https://images.pexels.com/photos/1954525/pexels-photo-1954525.jpeg",
            "badge": "Середній",
            "duration": "18 хв",
            "calories": "380 ккал",
            "description": "20 секунд роботи.",
            "category": "Кардіо"
        },
        {
            "id": 18,
            "title": "Кардіо бокс",
            "image": "https://images.pexels.com/photos/4761671/pexels-photo-4761671.jpeg",
            "badge": "Новачок",
            "duration": "25 хв",
            "calories": "310 ккал",
            "description": "Удари та рух.",
            "category": "Кардіо"
        },
        {
            "id": 19,
            "title": "Інтервальний біг",
            "image": "https://raceexpert.com.ua/image/catalog/uploads/2021/01/interval-beg-1-1024x538.jpg",
            "badge": "Середній",
            "duration": "40 хв",
            "calories": "480 ккал",
            "description": "Спринти та відновлення.",
            "category": "Кардіо"
        },
        {
            "id": 20,
            "title": "HIIT екстрим",
            "image": "https://images.pexels.com/photos/2780762/pexels-photo-2780762.jpeg",
            "badge": "Профі",
            "duration": "22 хв",
            "calories": "580 ккал",
            "description": "Максимальна інтенсивність.",
            "category": "Кардіо"
        },
        {
            "id": 21,
            "title": "Планка та прес",
            "image": "https://images.pexels.com/photos/4325462/pexels-photo-4325462.jpeg",
            "badge": "Середній",
            "duration": "15 хв",
            "calories": "160 ккал",
            "description": "Сильний прес.",
            "category": "Без обладнання"
        },
        {
            "id": 22,
            "title": "Віджимання та присідання",
            "image": "https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg",
            "badge": "Новачок",
            "duration": "20 хв",
            "calories": "210 ккал",
            "description": "Класичний bodyweight.",
            "category": "Без обладнання"
        },
        {
            "id": 23,
            "title": "Бурпі комплекс",
            "image": "https://images.pexels.com/photos/6456140/pexels-photo-6456140.jpeg",
            "badge": "Середній",
            "duration": "25 хв",
            "calories": "290 ккал",
            "description": "Вибухова витривалість.",
            "category": "Без обладнання"
        },
        {
            "id": 24,
            "title": "Випади вдома",
            "image": "https://images.pexels.com/photos/6456303/pexels-photo-6456303.jpeg",
            "badge": "Новачок",
            "duration": "18 хв",
            "calories": "180 ккал",
            "description": "Ноги та баланс.",
            "category": "Без обладнання"
        },
        {
            "id": 25,
            "title": "Статичний фітнес",
            "image": "https://images.pexels.com/photos/6455798/pexels-photo-6455798.jpeg",
            "badge": "Середній",
            "duration": "30 хв",
            "calories": "250 ккал",
            "description": "Ізометричні вправи.",
            "category": "Без обладнання"
        },
        {
            "id": 26,
            "title": "Тренування кору",
            "image": "https://images.pexels.com/photos/6456144/pexels-photo-6456144.jpeg",
            "badge": "Середній",
            "duration": "25 хв",
            "calories": "230 ккал",
            "description": "Планки та скручування.",
            "category": "Спина та Кори"
        },
        {
            "id": 27,
            "title": "Сильний кор",
            "image": "https://images.pexels.com/photos/414029/pexels-photo-414029.jpeg",
            "badge": "Профі",
            "duration": "20 хв",
            "calories": "220 ккал",
            "description": "Стабілізація корпусу.",
            "category": "Спина та Кори"
        },
        {
            "id": 28,
            "title": "Спина вдома",
            "image": "https://images.pexels.com/photos/3757376/pexels-photo-3757376.jpeg",
            "badge": "Новачок",
            "duration": "30 хв",
            "calories": "260 ккал",
            "description": "Вправи для спини.",
            "category": "Спина та Кори"
        },
        {
            "id": 29,
            "title": "Стабільність корпусу",
            "image": "https://images.pexels.com/photos/4498606/pexels-photo-4498606.jpeg",
            "badge": "Середній",
            "duration": "25 хв",
            "calories": "230 ккал",
            "description": "Баланс та кор.",
            "category": "Спина та Кори"
        },
        {
            "id": 30,
            "title": "Тренування постави",
            "image": "https://images.pexels.com/photos/6456288/pexels-photo-6456288.jpeg",
            "badge": "Новачок",
            "duration": "18 хв",
            "calories": "150 ккал",
            "description": "Антисутулість.",
            "category": "Спина та Кори"
        },
        {
            "id": 31,
            "title": "HIIT + сила",
            "image": "https://images.pexels.com/photos/4754146/pexels-photo-4754146.jpeg",
            "badge": "Профі",
            "duration": "35 хв",
            "calories": "420 ккал",
            "description": "Комбінація сили і кардіо.",
            "category": "Кардіо"
        },
        {
            "id": 32,
            "title": "Кардіо танці",
            "image": "https://images.pexels.com/photos/3757957/pexels-photo-3757957.jpeg",
            "badge": "Новачок",
            "duration": "30 хв",
            "calories": "290 ккал",
            "description": "Танцювальний фітнес.",
            "category": "Кардіо"
        },
        {
            "id": 33,
            "title": "Спринт тренування",
            "image": "https://cdn.create.vista.com/api/media/small/150627196/stock-photo-sportswoman-on-starting-line",
            "badge": "Середній",
            "duration": "35 хв",
            "calories": "410 ккал",
            "description": "Спринти на максимум.",
            "category": "Кардіо"
        },
        {
            "id": 34,
            "title": "Стрибки та координація",
            "image": "https://images.pexels.com/photos/3823039/pexels-photo-3823039.jpeg",
            "badge": "Середній",
            "duration": "28 хв",
            "calories": "330 ккал",
            "description": "Пліометричні вправи.",
            "category": "Кардіо"
        },
        {
            "id": 35,
            "title": "Функціональний фітнес",
            "image": "https://images.pexels.com/photos/4753986/pexels-photo-4753986.jpeg",
            "badge": "Середній",
            "duration": "40 хв",
            "calories": "390 ккал",
            "description": "Функціональні рухи.",
            "category": "Силові"
        },
        {
            "id": 36,
            "title": "Тренування пресу",
            "image": "https://images.pexels.com/photos/4325460/pexels-photo-4325460.jpeg",
            "badge": "Середній",
            "duration": "20 хв",
            "calories": "200 ккал",
            "description": "Ізоляція пресу.",
            "category": "Спина та Кори"
        },
        {
            "id": 37,
            "title": "Силові підтягування",
            "image": "https://img.tsn.ua/cached/266/tsn-135859377404ec64163c97d964721c31/thumbs/1200x630/41/d1/4a337beeb7851ff275865be056b0d141.jpeg",
            "badge": "Профі",
            "duration": "30 хв",
            "calories": "320 ккал",
            "description": "Тренування на турніку.",
            "category": "Силові"
        },
        {
            "id": 38,
            "title": "Гантелі + кардіо",
            "image": "https://images.pexels.com/photos/6456153/pexels-photo-6456153.jpeg",
            "badge": "Середній",
            "duration": "33 хв",
            "calories": "360 ккал",
            "description": "Силові інтервали.",
            "category": "Кардіо"
        },
        {
            "id": 39,
            "title": "Домашній фітнес",
            "image": "https://images.pexels.com/photos/4325472/pexels-photo-4325472.jpeg",
            "badge": "Новачок",
            "duration": "25 хв",
            "calories": "270 ккал",
            "description": "Тренування вдома.",
            "category": "Без обладнання"
        },
        {
            "id": 40,
            "title": "Bodyweight інтенсив",
            "image": "https://cdn.betterme.world/articles/wp-content/uploads/2025/05/BP-117-bodyweight-workout-split.png",
            "badge": "Профі",
            "duration": "28 хв",
            "calories": "310 ккал",
            "description": "Інтенсив без ваг.",
            "category": "Без обладнання"
        },
        {
            "id": 41,
            "title": "Силова витривалість",
            "image": "https://images.pexels.com/photos/6456290/pexels-photo-6456290.jpeg",
            "badge": "Середній",
            "duration": "45 хв",
            "calories": "430 ккал",
            "description": "Багато повторень.",
            "category": "Силові"
        },
        {
            "id": 42,
            "title": "Фітнес для спини",
            "image": "https://kamyanske.com.ua/wp-content/uploads/2023/12/uprajneniya-na-moshnuyu-spinu-cover.jpg",
            "badge": "Новачок",
            "duration": "30 хв",
            "calories": "240 ккал",
            "description": "Зміцнення спини.",
            "category": "Спина та Кори"
        },
        {
            "id": 43,
            "title": "Йога баланс",
            "image": "https://images.pexels.com/photos/3822356/pexels-photo-3822356.jpeg",
            "badge": "Середній",
            "duration": "32 хв",
            "calories": "170 ккал",
            "description": "Баланс і координація.",
            "category": "Йога"
        },
        {
            "id": 44,
            "title": "Power Yoga",
            "image": "https://images.pexels.com/photos/4662438/pexels-photo-4662438.jpeg",
            "badge": "Профі",
            "duration": "40 хв",
            "calories": "310 ккал",
            "description": "Силова йога.",
            "category": "Йога"
        },
        {
            "id": 45,
            "title": "Stretching",
            "image": "https://images.pexels.com/photos/4325470/pexels-photo-4325470.jpeg",
            "badge": "Новачок",
            "duration": "20 хв",
            "calories": "120 ккал",
            "description": "Розтяжка всього тіла.",
            "category": "Йога"
        },
        {
            "id": 46,
            "title": "Cross Training",
            "image": "https://images.pexels.com/photos/4753929/pexels-photo-4753929.jpeg",
            "badge": "Профі",
            "duration": "38 хв",
            "calories": "470 ккал",
            "description": "Комбіноване тренування.",
            "category": "Кардіо"
        },
        {
            "id": 47,
            "title": "Core Stability",
            "image": "https://images.pexels.com/photos/6456157/pexels-photo-6456157.jpeg",
            "badge": "Середній",
            "duration": "24 хв",
            "calories": "210 ккал",
            "description": "Стабільність корпусу.",
            "category": "Спина та Кори"
        },
        {
            "id": 48,
            "title": "Lower Body Blast",
            "image": "https://cdn.media.amplience.net/i/thegymgroup/The_Gym_Group_Asset-Generic-Member_Doing_Glute_Bridge_At_A_Lower_Body_Gym_Class?fmt=auto&h=545&w=1024&sm=c&qlt=default&$qlt$&$poi$",
            "badge": "Середній",
            "duration": "34 хв",
            "calories": "370 ккал",
            "description": "Ноги та сідниці.",
            "category": "Силові"
        },
        {
            "id": 49,
            "title": "Upper Body Strength",
            "image": "https://images.pexels.com/photos/6456301/pexels-photo-6456301.jpeg",
            "badge": "Середній",
            "duration": "36 хв",
            "calories": "360 ккал",
            "description": "Груди, спина, плечі.",
            "category": "Силові"
        },
        {
            "id": 50,
            "title": "Total Body Workout",
            "image": "https://builtwithscience.com/wp-content/uploads/2025/01/Full-body-workout-plan-cover-image-1.webp",
            "badge": "Профі",
            "duration": "45 хв",
            "calories": "480 ккал",
            "description": "Комплекс на все тіло.",
            "category": "Силові"
        }


        // ... просто встав сюди весь свій скопійований JSON масив
    ];

    try {
        console.log("Починаємо завантаження 50 тренувань...");

        // Використовуємо Batch (Пакетний запис), щоб завантажити все за 1 раз, а не 50 окремих запитів
        const batch = writeBatch(db);
        const trainingsRef = collection(db, "trainings"); // Назва нашої колекції

        trainingsData.forEach((training) => {
            // Створюємо новий документ. Замість авто-генерованого ID ми можемо використати ID з твого JSON (наприклад "1", "2"...)
            const docRef = doc(trainingsRef, training.id.toString());
            batch.set(docRef, training);
        });

        // Відправляємо весь пакет у Firebase
        await batch.commit();

        alert("✅ Всі 50 тренувань успішно завантажені у Firebase!");
    } catch (error) {
        console.error("Помилка завантаження тренувань: ", error);
        alert("Помилка! Дивись консоль.");
    }
};

export const uploadRecipesAndPlans = async () => {
    // Твій JSON з рецептами
    const recipesData = [
        { "id": 1, "title": "Корисні сирники в духовці", "image": "https://images.unsplash.com/photo-1494390248081-4e521a5940db?auto=format&fit=crop&w=400&q=60", "time": "20 хв", "calories": 280, "protein": 25, "fat": 8, "carbs": 20, "description": "Ніжні сирники з рисовим борошном без зайвої олії. Ідеально на сніданок.", "category": "Сніданки" },
        { "id": 2, "title": "Поке-боул з лососем", "image": "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=400&q=60", "time": "15 хв", "calories": 450, "protein": 30, "fat": 18, "carbs": 45, "description": "Кіноа, свіжий лосось, авокадо, едамаме та легкий соєвий соус.", "category": "Обіди" },
        { "id": 3, "title": "Салат з куркою та грейпфрутом", "image": "https://images.unsplash.com/photo-1547496502-affa22d38842?auto=format&fit=crop&w=400&q=60", "time": "10 хв", "calories": 320, "protein": 28, "fat": 12, "carbs": 15, "description": "Легкий білковий салат із цитрусовою заправкою для ідеальної вечері.", "category": "Вечері" },
        { "id": 4, "title": "Протеїновий ягідний смузі", "image": "https://images.unsplash.com/photo-1559715745-e1b33a271c8f?auto=format&fit=crop&w=400&q=60", "time": "5 хв", "calories": 210, "protein": 24, "fat": 4, "carbs": 22, "description": "Швидкий перекус після тренування. Змішайте ягоди, банан та скуб протеїну.", "category": "Перекуси" },
        { "id": 5, "title": "Чіа-пудинг з манго", "image": "https://images.unsplash.com/photo-1563805042-7684c8a9e9cb?auto=format&fit=crop&w=400&q=60", "time": "10 хв", "calories": 180, "protein": 6, "fat": 9, "carbs": 18, "description": "Легкий та корисний десерт на кокосовому молоці.", "category": "Десерти" }
    ];

    // Базові плани харчування (щоб сторінка не була порожньою)
    const mealPlansData = [
        { "id": 1, "title": "Схуднення (Дефіцит)", "description": "1500 ккал / день. Високий вміст білка.", "duration": "4 тижні", "image": "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=400&q=60" },
        { "id": 2, "title": "Набір маси", "description": "3000 ккал / день. Багато складних вуглеводів.", "duration": "8 тижнів", "image": "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=400&q=60" }
    ];

    try {
        console.log("Завантажуємо рецепти та плани...");
        const batch = writeBatch(db);

        // 1. Записуємо рецепти
        const recipesRef = collection(db, "recipes");
        recipesData.forEach((recipe) => {
            const docRef = doc(recipesRef, recipe.id.toString());
            batch.set(docRef, recipe);
        });

        // 2. Записуємо плани харчування
        const plansRef = collection(db, "meal_plans");
        mealPlansData.forEach((plan) => {
            const docRef = doc(plansRef, plan.id.toString());
            batch.set(docRef, plan);
        });

        await batch.commit();
        alert("✅ Рецепти та плани харчування завантажено!");
    } catch (error) {
        console.error("Помилка:", error);
    }
};

export const uploadAchievements = async () => {
    const achievementsData = [
        { "id": 1, "title": "Новачок", "description": "Виконати перше тренування", "icon": "https://cdn-icons-png.flaticon.com/512/3144/3144866.png", "points": 50, "isUnlocked": true, "unlockedDate": "10.01.2026", "current": 1, "target": 1, "unit": "" },
        { "id": 2, "title": "Серія 5 днів", "description": "Тренуватися 5 днів поспіль", "icon": "https://cdn-icons-png.flaticon.com/512/5987/5987825.png", "points": 150, "isUnlocked": true, "unlockedDate": "15.02.2026", "current": 5, "target": 5, "unit": " дн" },
        { "id": 3, "title": "10 000 кроків", "description": "Пройти 10 000 кроків за день", "icon": "https://cdn-icons-png.flaticon.com/512/8146/8146757.png", "points": 100, "isUnlocked": false, "unlockedDate": null, "current": 8432, "target": 10000, "unit": " кр" },
        { "id": 4, "title": "Калорійний майстер", "description": "Дотримуватися калорійної норми 7 днів", "icon": "https://cdn-icons-png.flaticon.com/512/3063/3063080.png", "points": 200, "isUnlocked": true, "unlockedDate": "20.02.2026", "current": 7, "target": 7, "unit": " дн" },
        { "id": 5, "title": "50 тренувань", "description": "Виконати загалом 50 тренувань", "icon": "https://cdn-icons-png.flaticon.com/512/2936/2936886.png", "points": 500, "isUnlocked": false, "unlockedDate": null, "current": 24, "target": 50, "unit": "" },
        { "id": 6, "title": "Водний баланс", "description": "Випити 2.5 л води щодня протягом тижня", "icon": "https://cdn-icons-png.flaticon.com/512/3105/3105807.png", "points": 150, "isUnlocked": false, "unlockedDate": null, "current": 1.5, "target": 2.5, "unit": " л" }
    ];

    try {
        console.log("Завантажуємо досягнення...");
        const batch = writeBatch(db);
        const achRef = collection(db, "achievements");

        achievementsData.forEach((ach) => {
            const docRef = doc(achRef, ach.id.toString());
            batch.set(docRef, ach);
        });

        await batch.commit();
        alert("✅ Досягнення успішно завантажено!");
    } catch (error) {
        console.error("Помилка:", error);
    }
};
export const uploadCalendarEvents = async () => {
    const calendarData = [
        { "id": 1, "date": "2026-03-02", "title": "Силове тренування", "duration": "45 хв", "status": "completed" },
        { "id": 2, "date": "2026-03-04", "title": "HIIT", "duration": "30 хв", "status": "completed" },
        { "id": 3, "date": "2026-03-06", "title": "Кардіо", "duration": "25 хв", "status": "completed" },
        { "id": 4, "date": "2026-03-23", "title": "Йога", "duration": "20 хв", "status": "planned" },
        { "id": 5, "date": "2026-03-25", "title": "Силове (Ноги)", "duration": "50 хв", "status": "planned" },
        { "id": 6, "date": "2026-03-27", "title": "Розтяжка", "duration": "15 хв", "status": "planned" },
        { "id": 7, "date": "2026-04-01", "title": "Фулбоді", "duration": "40 хв", "status": "planned" }
    ];

    try {
        console.log("Завантажуємо події календаря...");
        const batch = writeBatch(db);
        const eventsRef = collection(db, "calendar_events");

        calendarData.forEach((event) => {
            const docRef = doc(eventsRef, event.id.toString());
            batch.set(docRef, event);
        });

        await batch.commit();
        alert("✅ Календар успішно завантажено!");
    } catch (error) {
        console.error("Помилка:", error);
    }
};




export const uploadDietData = async (userId: string) => {
    const dietData = {
        overview: [
            { title: "Калорії", current: 1450, max: 2200, unit: "ккал", color: "var(--accent-blue)" },
            { title: "Білки", current: 85, max: 150, unit: "г", color: "#ffcc00" },
            { title: "Жири", current: 45, max: 70, unit: "г", color: "#ff6600" },
            { title: "Вуглеводи", current: 180, max: 250, unit: "г", color: "#00ccff" }
        ],
        dailyPlan: [
            { mealType: "Сніданок", items: [{ title: "Вівсянка з фруктами", image: "https://shuba.life/static/content/thumbs/1824x912/4/77/l3m5er---c2x1x50px50p-up--577158fab636fd16662e3066057b4774.jpg", calories: 350, macros: "Б: 10г Ж: 5г В: 60г", description: "Вівсяні пластівці з бананом, яблуком та горіхами." }] },
            { mealType: "Обід", items: [{ title: "Курка з овочами", image: "https://shuba.life/static/content/thumbs/1824x912/c/60/dgalsd---c2x1x50px50p-up--4d930786b59547b5807211f9b8b2160c.jpg", calories: 500, macros: "Б: 40г Ж: 15г В: 50г", description: "Грильована курка з броколі та рисом." }] },
            { mealType: "Вечеря", items: [{ title: "Салат з тунцем", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQhsp9kRfXbg8uszY1QONcHOD4VH0HuvxGqQ&s", calories: 400, macros: "Б: 30г Ж: 20г В: 25г", description: "Тунець з листям салату, помідорами та оливковою олією." }] },
            { mealType: "Перекуси", items: [{ title: "Йогурт з ягодами", image: "https://img-global.cpcdn.com/recipes/6bd17a8678386be2/680x781cq80/domashnii-ioghurt-s-iaghodami-%D0%BE%D1%81%D0%BD%D0%BE%D0%B2%D0%BD%D0%B5-%D1%84%D0%BE%D1%82%D0%BE-%D1%80%D0%B5%D1%86%D0%B5%D0%BF%D1%82%D0%B0.jpg", calories: 200, macros: "Б: 15г Ж: 5г В: 25г", description: "Грецький йогурт з полуницею та мигдалем." }] }
        ],
        tracked: [
            { name: "Яблуко (1 шт)", calories: 80 },
            { name: "Банан (1 шт)", calories: 105 }
        ]
    };

    try {
        console.log("Завантажуємо дані раціону...");
        const docRef = doc(db, "user_diet", userId);
        await setDoc(docRef, dietData);
        alert("✅ Раціон успішно завантажено!");
    } catch (error) {
        console.error("Помилка:", error);
    }
};

export const uploadExercises = async () => {
    const exercisesData = [
        { "id": 1, "title": "Класичні віджимання", "image": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=800&q=60", "muscle": "Груди", "difficulty": "Новачок", "description": "Базова вправа з власною вагою для розвитку грудних м'язів, трицепсів та передньої дельти.", "equipment": "Власна вага (Килимок за бажанням)", "steps": ["Прийміть упор лежачи. Руки поставте трохи ширше за плечі.", "Тіло повинно утворювати пряму лінію від голови до п'ят. Напружте прес та сідниці.", "На вдиху повільно опустіться вниз, згинаючи руки в ліктях, поки груди майже не торкнуться підлоги.", "На видиху потужним рухом виштовхніть себе у вихідне положення."], "mistakes": ["Прогинання попереку (таз провисає вниз).", "Лікті розведені занадто широко (під кутом 90 градусів до тулуба).", "Неповна амплітуда (опускання лише на кілька сантиметрів)."] },
        { "id": 2, "title": "Присідання (Squats)", "image": "https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?auto=format&fit=crop&w=800&q=60", "muscle": "Ноги", "difficulty": "Новачок", "description": "Головна багатосуглобова вправа для розвитку квадрицепсів, сідниць та задньої поверхні стегна.", "equipment": "Власна вага", "steps": ["Поставте ноги на ширині плечей або трохи ширше, носки злегка розгорнуті назовні.", "Тримайте спину рівною, погляд спрямований вперед.", "На вдиху почніть відводити таз назад, ніби сідаєте на невидимий стілець.", "Опустіться до паралелі стегон з підлогою (або нижче, якщо дозволяє гнучкість).", "На видиху, відштовхуючись п'ятами, поверніться у вихідне положення."], "mistakes": ["Зведення колін всередину під час підйому.", "Відривання п'ят від підлоги.", "Надмірний нахил тулуба вперед."] },
        { "id": 3, "title": "Підтягування на турніку", "image": "https://images.unsplash.com/photo-1599058917200-4cb0a4527181?auto=format&fit=crop&w=800&q=60", "muscle": "Спина", "difficulty": "Середній", "description": "Найкраща вправа з власною вагою для побудови широкої V-подібної спини та міцних біцепсів.", "equipment": "Турнік", "steps": ["Візьміться за перекладину прямим хватом (долоні від себе) трохи ширше за плечі.", "Повисніть на прямих руках, злегка прогніться в грудях.", "На видиху підтягніть тіло вгору, зводячи лопатки, поки підборіддя не опиниться над перекладиною.", "На вдиху плавно та підконтрольно опустіться у вихідне положення."], "mistakes": ["Використання ривків та розгойдування тіла (кіпінг).", "Тяга тільки за рахунок біцепсів, без включення м'язів спини (лопаток).", "Різке падіння вниз після підйому."] },
        { "id": 4, "title": "Планка на ліктях", "image": "https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?auto=format&fit=crop&w=800&q=60", "muscle": "Прес", "difficulty": "Універсал", "description": "Ізометрична вправа для зміцнення м'язів кору (прес, поперек, стабілізатори).", "equipment": "Килимок", "steps": ["Прийміть упор лежачи, але спирайтеся не на долоні, а на передпліччя (лікті строго під плечима).", "Ноги витягнуті, упор на носки.", "Напружте прес, сідниці та ноги. Тіло має бути абсолютно прямою лінією.", "Утримуйте це положення максимально довго, дихайте рівно і спокійно."], "mistakes": ["Піднятий занадто високо таз.", "Провисання попереку (може призвести до болю в спині).", "Затримка дихання під час виконання."] }
    ];

    try {
        console.log("Завантажуємо гід по вправам...");
        const batch = writeBatch(db);
        const exRef = collection(db, "exercises");

        exercisesData.forEach((ex) => {
            const docRef = doc(exRef, ex.id.toString());
            batch.set(docRef, ex);
        });

        await batch.commit();
        alert("✅ Вправи успішно завантажено в базу!");
    } catch (error) {
        console.error("Помилка:", error);
    }
};

export const uploadGoals = async (userId: string) => {
    const goalsData = [
        { "id": 1, "type": "weight", "title": "Схуднути / Вага", "description": "Скинути зайве до літнього сезону", "current": 3, "target": 5, "unit": "кг", "deadline": "2026-06-01", "status": "active", "image": "https://images.unsplash.com/photo-1526506114868-45ad6ce11516?auto=format&fit=crop&w=400&q=60" },
        { "id": 2, "type": "workouts", "title": "Кількість тренувань", "description": "Пройти програму 'Сила і рельєф'", "current": 12, "target": 20, "unit": "занять", "deadline": "2026-04-15", "status": "active", "image": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=60" },
        { "id": 3, "type": "steps", "title": "Кроки на день", "description": "Звичка більше ходити пішки", "current": 10000, "target": 10000, "unit": "кроків", "deadline": "2026-02-28", "status": "completed", "image": "https://images.unsplash.com/photo-1552674605-15c2145efa38?auto=format&fit=crop&w=400&q=60" },
        { "id": 4, "type": "muscle", "title": "Набрати м'язи", "description": "Збільшити м'язову масу спини та рук", "current": 2.5, "target": 4, "unit": "кг", "deadline": "2026-05-30", "status": "active", "image": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=400&q=60" }
    ];

    try {
        console.log("Завантажуємо цілі...");
        const batch = writeBatch(db);
        const goalsRef = collection(db, "goals");

        goalsData.forEach((goal) => {
            // Щоб у різних користувачів не співпадали ID (наприклад "1"),
            // ми робимо унікальний ID: "ID_користувача_ID_цілі"
            const docRef = doc(goalsRef, `${userId}_${goal.id}`);

            // Зберігаємо ціль + обов'язково додаємо userId
            batch.set(docRef, { ...goal, userId: userId });
        });

        await batch.commit();
        alert("✅ Цілі успішно завантажено!");
    } catch (error) {
        console.error("Помилка:", error);
    }
};

export const uploadProgressData = async (userId: string) => {
    const progressData = {
        overall: {
            workouts: 124,
            calories: 45678,
            steps: 1234567,
            streak: 5
        },
        charts: {
            stepsWeekly: [8200, 9100, 7500, 10200, 8800, 9500, 8432],
            caloriesMonthly: [1200, 1500, 1100, 1800, 1400, 1600, 1345]
        },
        history: [
            { id: 1, title: "Силове тренування (Фулбоді)", duration: "45 хв", calories: 400, date: "20.03.2026", timestamp: "2026-03-20", image: "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg" },
            { id: 11, title: "Ранкова Йога", duration: "20 хв", calories: 120, date: "19.03.2026", timestamp: "2026-03-19", image: "https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg" },
            { id: 16, title: "HIIT Спалювання жиру", duration: "30 хв", calories: 500, date: "18.03.2026", timestamp: "2026-03-18", image: "https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg" }
        ]
    };

    try {
        console.log("Завантажуємо статистику прогресу...");
        // Прив'язуємо документ до конкретного користувача
        const docRef = doc(db, "user_progress", userId);
        await setDoc(docRef, progressData);
        alert("✅ Прогрес успішно завантажено!");
    } catch (error) {
        console.error("Помилка:", error);
    }
};

export const uploadDashboardData = async (userId: string) => {
    const dashData = {
        streak: 5,
        widgets: {
            steps: { current: 8432, target: 10000 },
            calories: { current: 450, target: 600 },
            activeTime: { current: 45, target: 60 },
            water: { current: 1.5, target: 2.5 }
        }
    };

    try {
        console.log("Завантажуємо дані дашборду...");
        const docRef = doc(db, "user_dashboard", userId);
        await setDoc(docRef, dashData);
        alert("✅ Дані дашборду успішно завантажено!");
    } catch (error) {
        console.error("Помилка:", error);
    }
};



export const uploadWorkoutDetails = async () => {
    const detailsData = {
        "1": {
            "video": "https://www.w3schools.com/html/mov_bbb.mp4",
            "fullDescription": "Це комплексне силове тренування (Фулбоді) створене для опрацювання всіх основних груп м'язів за один сеанс. Виконуйте рухи підконтрольно.",
            "tips": [
                "Тримайте спину рівною під час присідань",
                "Робіть видих на зусиллі",
                "Не поспішайте, фокусуйтеся на техніці"
            ]
        },
        "5": {
            "video": "https://www.w3schools.com/html/mov_bbb.mp4",
            "fullDescription": "Ідеальний старт для тих, хто тільки починає свій шлях у фітнесі. Легкі ваги, безпечні амплітуди та фокус на нейром'язовому зв'язку.",
            "tips": [
                "Слідкуйте за диханням",
                "Відпочивайте 60 секунд між підходами"
            ]
        }
    };

    try {
        console.log("Завантажуємо деталі тренувань...");
        const batch = writeBatch(db);
        const detailsRef = collection(db, "workout_details");

        // Проходимося по ключах об'єкта ("1", "5")
        for (const [id, data] of Object.entries(detailsData)) {
            const docRef = doc(detailsRef, id); // ID документа буде таким самим, як ID тренування
            batch.set(docRef, data);
        }

        await batch.commit();
        alert("✅ Деталі тренувань успішно завантажено!");
    } catch (error) {
        console.error("Помилка:", error);
    }
};


export const uploadMealPlans = async () => {
    // Твій ПОВНИЙ масив даних із розкладом страв
    const mealPlansData = [
        {
            "id": 1,
            "title": "Збалансоване схуднення",
            "badge": "Популярне",
            "image": "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1000&q=80",
            "description": "1500 - 1800 ккал/день. Оптимальне співвідношення БЖВ для поступової втрати ваги без відчуття голоду.",
            "calories": "1650 ккал",
            "protein": "120 г",
            "fat": "55 г",
            "carbs": "160 г",
            "schedule": [
                {
                    "day": "День 1",
                    "meals": [
                        {"type": "Сніданок", "name": "Вівсянка з ягодами та горіхами", "kcal": 350},
                        {"type": "Обід", "name": "Куряча грудка з кіноа та свіжими овочами", "kcal": 450},
                        {"type": "Перекус", "name": "Грецький йогурт з медом", "kcal": 150},
                        {"type": "Вечеря", "name": "Запечена біла риба з броколі", "kcal": 400}
                    ]
                },
                {
                    "day": "День 2",
                    "meals": [
                        {"type": "Сніданок", "name": "Омлет з 3 яєць зі шпинатом", "kcal": 320},
                        {"type": "Обід", "name": "Гречаний суп з індичкою", "kcal": 400},
                        {"type": "Перекус", "name": "Жменя мигдалю та яблуко", "kcal": 200},
                        {"type": "Вечеря", "name": "Салат з тунцем та оливковою олією", "kcal": 380}
                    ]
                }
            ]
        },
        {
            "id": 2,
            "title": "Білкова дієта (Набір маси)",
            "badge": "Для м'язів",
            "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80",
            "description": "2500+ ккал/день. Підвищений вміст білка та складних вуглеводів для ефективного росту м'язів.",
            "calories": "2800 ккал",
            "protein": "180 г",
            "fat": "80 г",
            "carbs": "320 г",
            "schedule": [
                {
                    "day": "Тренувальний день",
                    "meals": [
                        {"type": "Сніданок", "name": "5 яєць, вівсянка (100г) на молоці", "kcal": 650},
                        {"type": "Перекус", "name": "Протеїновий шейк, банан", "kcal": 300},
                        {"type": "Обід", "name": "Макарони твердих сортів (120г) з яловичиною", "kcal": 700},
                        {"type": "Вечеря", "name": "Стейк із лосося, рис, овочевий мікс", "kcal": 650},
                        {"type": "Перед сном", "name": "Домашній сир (200г)", "kcal": 200}
                    ]
                }
            ]
        },
        {
            "id": 3,
            "title": "Вегетаріанський раціон",
            "badge": "Здоров'я",
            "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1000&q=80",
            "description": "Повноцінне меню без м'яса, збагачене рослинними білками, залізом та вітамінами.",
            "calories": "1900 ккал",
            "protein": "90 г",
            "fat": "65 г",
            "carbs": "240 г",
            "schedule": [
                {
                    "day": "День 1",
                    "meals": [
                        {"type": "Сніданок", "name": "Смузі-боул з насінням чіа та ківі", "kcal": 400},
                        {"type": "Обід", "name": "Запечений тофу з бататом та стручковою квасолею", "kcal": 550},
                        {"type": "Вечеря", "name": "Сочевичний крем-суп з грінками", "kcal": 450}
                    ]
                }
            ]
        }
    ];

    try {
        console.log("Оновлюємо плани харчування в базі даних...");
        const batch = writeBatch(db);
        const plansRef = collection(db, "meal_plans");

        mealPlansData.forEach((plan) => {
            const docRef = doc(plansRef, plan.id.toString());
            // batch.set перепише існуючі документи (або створить нові), додавши туди schedule!
            batch.set(docRef, plan);
        });

        await batch.commit();
        alert("✅ Плани харчування (разом із розкладом страв) успішно завантажено в Firebase!");
    } catch (error) {
        console.error("Помилка завантаження планів:", error);
        alert("Помилка при завантаженні планів у базу.");
    }
};

export const uploadRecipeDetails = async () => {
    const detailsData = {
        "1": {
            "servings": 2,
            "ingredients": [
                "300 г кисломолочного сиру (5%)",
                "1 куряче яйце",
                "2 ст. л. рисового борошна (плюс трохи для обвалювання)",
                "Підсолоджувач за смаком (стевія/еритрит)",
                "Дрібка солі",
                "Кілька крапель ванільного екстракту"
            ],
            "steps": [
                "Добре розімніть сир виделкою. Якщо хочете ідеальну текстуру — перебийте його блендером.",
                "Додайте до сиру яйце, дрібку солі, підсолоджувач та ваніль. Ретельно перемішайте.",
                "Додайте рисове борошно і замісіть м'яке, злегка липке тісто.",
                "Сформуйте сирники (зручно робити це за допомогою склянки на дошці), злегка обваляйте їх у борошні.",
                "Викладіть на пергамент і випікайте в розігрітій до 180°C духовці близько 20 хвилин до золотистої скоринки."
            ]
        },
        "2": {
            "servings": 1,
            "ingredients": [
                "100 г філе слабосолоного лосося",
                "50 г кіноа (в сухому вигляді)",
                "Половина авокадо",
                "30 г бобів едамаме",
                "Кілька помідорів чері",
                "1 ст. л. соєвого соусу",
                "Кунжут для посипки"
            ],
            "steps": [
                "Відваріть кіноа згідно з інструкцією на упаковці та дайте охолонути.",
                "Наріжте лосось та авокадо середніми кубиками. Помідори чері розріжте навпіл.",
                "Викладіть у глибоку миску (боул) основу з кіноа.",
                "Зверху секціями розкладіть лосось, авокадо, едамаме та помідори.",
                "Полийте соєвим соусом та посипте кунжутом. Смачного!"
            ]
        }
    };

    try {
        const batch = writeBatch(db);
        const ref = collection(db, "recipe_details");

        Object.entries(detailsData).forEach(([id, data]) => {
            const docRef = doc(ref, id);
            batch.set(docRef, data);
        });

        await batch.commit();
        alert("✅ Деталі рецептів завантажено у Firebase!");
    } catch (err) {
        console.error(err);
    }
};