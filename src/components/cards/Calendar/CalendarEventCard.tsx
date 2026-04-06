// src/components/cards/CalendarEventCard.tsx
import React from 'react';
import type { CalendarEvent } from '../../../types';

interface CalendarEventCardProps {
    event: CalendarEvent;
    variant: 'month' | 'week';
}

const CalendarEventCard: React.FC<CalendarEventCardProps> = ({ event, variant }) => {
    if (variant === 'month') {
        return (
            <div className={`event ${event.status}`}>
                {event.title}
            </div>
        );
    }

    // variant === 'week'
    return (
        <li className={event.status}>
            {event.title}
            {event.duration && (
                <span style={{ marginLeft: '8px', fontSize: '0.85rem', opacity: 0.7 }}>
                    ({event.duration})
                </span>
            )}
        </li>
    );
};

export default CalendarEventCard;