// src/pages/Recipe/ActiveRecipe.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';

// Firebase
import { db } from '../../firebase';
import { uploadRecipeDetails } from '../../services/seedDatabase';

// Компонент
import ActiveRecipeDetail from '../../components/cards/Recipe/ActiveRecipeDetail';
import '../../styles/recipe/ActiveRecipe.css';

// Типи
import type { Recipe, RecipeDetail } from '../../types';

const ActiveRecipe: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [detail, setDetail] = useState<RecipeDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFullRecipe = async () => {
            if (!id) return;
            try {
                // 1. Завантажуємо основну інфо (БЖВ, назва)
                const recipeRef = doc(db, "recipes", id);
                const recipeSnap = await getDoc(recipeRef);

                // 2. Завантажуємо деталі (інгредієнти, кроки)
                const detailRef = doc(db, "recipe_details", id);
                const detailSnap = await getDoc(detailRef);

                if (recipeSnap.exists()) {
                    setRecipe({ id: Number(recipeSnap.id), ...recipeSnap.data() } as unknown as Recipe);
                }
                if (detailSnap.exists()) {
                    setDetail(detailSnap.data() as RecipeDetail);
                }
            } catch (err) {
                console.error("Помилка завантаження рецепту:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchFullRecipe();
    }, [id]);

    if (loading) {
        return <div style={{ padding: '3rem', textAlign: 'center' }}><h2>Розігріваємо плиту... 🍳</h2></div>;
    }

    if (!recipe || !detail) {
        return (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <h2>Рецепт не знайдено 🕵️‍♂️</h2>
                <button className="btn-small" onClick={() => navigate('/recipes')} style={{ marginBottom: '20px' }}>
                    Повернутися до рецептів
                </button>
                <div>
                    <button
                        onClick={async () => {
                            await uploadRecipeDetails();
                            window.location.reload();
                        }}
                        style={{ padding: '10px 20px', backgroundColor: 'var(--accent-blue)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                    >
                        📥 Завантажити деталі рецептів у Firebase
                    </button>
                </div>
            </div>
        );
    }

    return <ActiveRecipeDetail recipe={recipe} detail={detail} />;
};

export default ActiveRecipe;