// src/components/cards/TrackedItemCard.tsx
import React from 'react';
import type { TrackedItem } from '../../../types';

interface TrackedItemCardProps {
    item: TrackedItem;
}

const TrackedItemCard: React.FC<TrackedItemCardProps> = ({ item }) => {
    return (
        <div className="tracked-item">
            <span className="tracked-name">{item.name}</span>
            <span className="tracked-cal">{item.calories} ккал</span>
        </div>
    );
};

export default TrackedItemCard;