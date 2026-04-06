// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Компоненти
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard/Dashboard.tsx';
import Training from './pages/Training/Training.tsx';
import Progress from './pages/Progress/Progress.tsx';
import Diet from './pages/Diet/Diet.tsx';
import Achievements from './pages/Achievement/Achievements.tsx';
import Goals from './pages/Goal/Goals.tsx';
import Calendar from './pages/Calendar/Calendar.tsx';
import Recipes from './pages/Recipe/Recipes.tsx';
import Exercises from './pages/Exercise/Exercises.tsx';
import Health from './pages/Health/Health.tsx';
import ActiveTraining from './pages/Training/ActiveTraining.tsx';
import ActiveRecipe from "./pages/Recipe/ActiveRecipe.tsx";
import ActivePlan from "./pages/Recipe/ActivePlan.tsx";
import ActiveExercise from "./pages/Exercise/ActiveExercise.tsx";

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="training" element={<Training />} />
                    <Route path="progress" element={<Progress />} />
                    <Route path="diet" element={<Diet />} />
                    <Route path="achievements" element={<Achievements />} />
                    <Route path="goals" element={<Goals />} />
                    <Route path="calendar" element={<Calendar />} />
                    <Route path="recipes" element={<Recipes />} />
                    <Route path="exercises" element={<Exercises />} />
                    <Route path="health" element={<Health />} />
                    <Route path="active-training/:id" element={<ActiveTraining />} />
                    <Route path="active-recipe/:id" element={<ActiveRecipe />} />
                    <Route path="active-plan/:id" element={<ActivePlan />} />
                    <Route path="active-exercise/:id" element={<ActiveExercise />} />

                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;