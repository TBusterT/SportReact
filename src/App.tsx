// src/App.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Компоненти захисту та макету
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Сторінка авторизації (Вхід + Реєстрація)
import Auth from './pages/Auth/Auth';

// Всі сторінки додатку
import Dashboard from './pages/Dashboard/Dashboard';
import Training from './pages/Training/Training';
import Progress from './pages/Progress/Progress';
import Diet from './pages/Diet/Diet';
import Achievements from './pages/Achievement/Achievements';
import Goals from './pages/Goal/Goals';
import Calendar from './pages/Calendar/Calendar';
import Recipes from './pages/Recipe/Recipes';
import Exercises from './pages/Exercise/Exercises';
import Health from './pages/Health/Health';
import ActiveTraining from './pages/Training/ActiveTraining';
import ActiveRecipe from './pages/Recipe/ActiveRecipe';
import ActivePlan from './pages/Recipe/ActivePlan';
import ActiveExercise from './pages/Exercise/ActiveExercise';

const App: React.FC = () => {
    return (
        <AuthProvider>
            <Routes>
                {/* === ПУБЛІЧНІ МАРШРУТИ (БЕЗ САЙДБАРУ) === */}
                <Route path="/auth" element={<Auth />} />
                <Route path="/login" element={<Navigate to="/auth" replace />} />
                <Route path="/register" element={<Navigate to="/auth" replace />} />

                {/* === ПРИВАТНІ МАРШРУТИ (ЗАХИЩЕНІ + З САЙДБАРОМ) === */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<Layout />}>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/training" element={<Training />} />
                        <Route path="/progress" element={<Progress />} />
                        <Route path="/diet" element={<Diet />} />
                        <Route path="/achievements" element={<Achievements />} />
                        <Route path="/goals" element={<Goals />} />
                        <Route path="/calendar" element={<Calendar />} />
                        <Route path="/recipes" element={<Recipes />} />
                        <Route path="/exercises" element={<Exercises />} />
                        <Route path="/health" element={<Health />} />
                        <Route path="/active-training/:id" element={<ActiveTraining />} />
                        <Route path="/active-recipe/:id" element={<ActiveRecipe />} />
                        <Route path="/active-plan/:id" element={<ActivePlan />} />
                        <Route path="/active-exercise/:id" element={<ActiveExercise />} />
                    </Route>
                </Route>
            </Routes>
        </AuthProvider>
    );
};

export default App;