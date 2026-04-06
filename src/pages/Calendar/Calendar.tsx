// src/pages/Calendar.tsx
import React, { useState } from 'react';

// Підключаємо стилі
import '../../styles/calendar/calendar.css';

// Дані
import dashData from '../../data/dashboard/dashboard.json';
import calendarData from '../../data/calendar/calendar.json';

// Компонент картки події
import CalendarEventCard from '../../components/cards/Calendar/CalendarEventCard.tsx';

// Типи
import type { CalendarEvent } from '../../types';

const Calendar: React.FC = () => {
    // === БЕЗПЕЧНА ОБРОБКА JSON ===
    const rawData = calendarData as unknown;
    const events: CalendarEvent[] = Array.isArray(rawData)
        ? (rawData as CalendarEvent[])
        : (rawData as { events?: CalendarEvent[] }).events || [];

    // --- СТАН ДЛЯ НАВІГАЦІЇ ---
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentWeekStart, setCurrentWeekStart] = useState(() => {
        const date = new Date();
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(date.setDate(diff));
    });

    const monthNames = ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'];
    const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];

    // Навігація місяців
    const nextMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    const prevMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));

    // Навігація тижнів
    const nextWeek = () => setCurrentWeekStart(prev => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 7));
    const prevWeek = () => setCurrentWeekStart(prev => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() - 7));

    // --- ЛОГІКА МІСЯЧНОГО КАЛЕНДАРЯ ---
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    let firstDayIndex = new Date(currentYear, currentMonth, 1).getDay() - 1;
    if (firstDayIndex === -1) firstDayIndex = 6;

    const formatDateStr = (year: number, month: number, day: number) => {
        const m = (month + 1).toString().padStart(2, '0');
        const d = day.toString().padStart(2, '0');
        return `${year}-${m}-${d}`;
    };

    const isToday = (year: number, month: number, day: number) => {
        const today = new Date();
        return today.getFullYear() === year &&
            today.getMonth() === month &&
            today.getDate() === day;
    };

    // --- ЛОГІКА ТИЖНЕВОГО РОЗКЛАДУ ---
    const weekDays = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(currentWeekStart);
        d.setDate(d.getDate() + i);
        return d;
    });

    return (
        <>
            <header>
                <h1>Календар тренувань</h1>
                <div className="user-profile">
                    <span>Привіт, {dashData.user.name}! 🔥 {dashData.user.streak} днів серії</span>
                    <div className="avatar"></div>
                </div>
            </header>

            {/* --- МІСЯЧНИЙ КАЛЕНДАР --- */}
            <div className="calendar-controls">
                <button className="btn-prev" onClick={prevMonth}>&lt; Попередній</button>
                <h2>{monthNames[currentMonth]} {currentYear}</h2>
                <button className="btn-next" onClick={nextMonth}>Наступний &gt;</button>
            </div>

            <div className="calendar-grid">
                {daysOfWeek.map(day => (
                    <div key={`header-${day}`} className="calendar-header">{day}</div>
                ))}

                {/* Порожні клітинки на початку місяця */}
                {Array.from({ length: firstDayIndex }).map((_, i) => (
                    <div key={`empty-${i}`} className="calendar-day empty"></div>
                ))}

                {/* Дні місяця */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dateStr = formatDateStr(currentYear, currentMonth, day);
                    const dayEvents = events.filter(e => e.date === dateStr);
                    const todayClass = isToday(currentYear, currentMonth, day) ? 'today' : '';

                    return (
                        <div key={`day-${day}`} className={`calendar-day ${todayClass}`}>
                            <div className="day-number">{day}</div>
                            <div className="day-events">
                                {dayEvents.map(event => (
                                    <CalendarEventCard
                                        key={event.id}
                                        event={event}
                                        variant="month"
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* --- ТИЖНЕВИЙ РОЗКЛАД --- */}
            <div className="week-view">
                <div className="calendar-controls">
                    <button className="btn-prev" onClick={prevWeek}>&lt; Попередній тиждень</button>
                    <h2>Розклад на тиждень</h2>
                    <button className="btn-next" onClick={nextWeek}>Наступний тиждень &gt;</button>
                </div>

                <div className="week-grid">
                    {weekDays.map((date, idx) => {
                        const dateStr = formatDateStr(date.getFullYear(), date.getMonth(), date.getDate());
                        const dayEvents = events.filter(e => e.date === dateStr);

                        return (
                            <div key={`week-day-${idx}`} className="week-day">
                                <h3>
                                    {daysOfWeek[idx]}
                                    <span className="week-day-date">
                                        {date.getDate()} {monthNames[date.getMonth()].toLowerCase()}
                                    </span>
                                </h3>
                                {dayEvents.length === 0 ? (
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                        Вихідний
                                    </p>
                                ) : (
                                    <ul>
                                        {dayEvents.map(event => (
                                            <CalendarEventCard
                                                key={event.id}
                                                event={event}
                                                variant="week"
                                            />
                                        ))}
                                    </ul>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default Calendar;