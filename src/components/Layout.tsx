import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
    return (
        <>
            {/* Сайдбар завжди зліва */}
            <Sidebar />

            {/* Головна частина екрану */}
            <main className="main-content">

                {/* Outlet - це "дірка", куди React буде підставляти контент сторінки (Дашборд, Тренування тощо) */}
                <Outlet />

                {/* Футер теж можна залишити тут, щоб він був на всіх сторінках */}
                <footer className="main-footer">
                    <div className="footer-content">
                        <p>&copy; 2026 FitMonitor. Всі права захищено.</p>
                        <ul className="footer-links">
                            <li><a href="#">Про нас</a></li>
                            <li><a href="#">Контакти</a></li>
                            <li><a href="#">Умови використання</a></li>
                            <li><a href="#">Політика конфіденційності</a></li>
                        </ul>
                    </div>
                </footer>
            </main>
        </>
    );
};

export default Layout;