import React from 'react';
import { useSearchParams } from 'react-router-dom';

const HealthPanel: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const updateFilter = (key: string, value: string) => {
        setSearchParams(prev => {
            prev.set(key, value);
            return prev;
        });
    };

    const currentMood = searchParams.get('mood') || 'normal';

    return (
        <div className="health-sidebar">
            {/* Самопочуття */}
            <div className="sidebar-group">
                <h3>Самопочуття</h3>
                <div className="mood-tracker">
                    <button
                        className={`mood-btn ${currentMood === 'terrible' ? 'active' : ''}`}
                        onClick={() => updateFilter('mood', 'terrible')}
                        title="Жахливо"
                    >
                        😫
                    </button>
                    <button
                        className={`mood-btn ${currentMood === 'tired' ? 'active' : ''}`}
                        onClick={() => updateFilter('mood', 'tired')}
                        title="Втома"
                    >
                        🥱
                    </button>
                    <button
                        className={`mood-btn ${currentMood === 'normal' ? 'active' : ''}`}
                        onClick={() => updateFilter('mood', 'normal')}
                        title="Нормально"
                    >
                        😐
                    </button>
                    <button
                        className={`mood-btn ${currentMood === 'good' ? 'active' : ''}`}
                        onClick={() => updateFilter('mood', 'good')}
                        title="Добре"
                    >
                        🙂
                    </button>
                    <button
                        className={`mood-btn ${currentMood === 'great' ? 'active' : ''}`}
                        onClick={() => updateFilter('mood', 'great')}
                        title="Чудово"
                    >
                        🤩
                    </button>
                </div>
            </div>

            {/* Швидкий запис */}
            <div className="sidebar-group">
                <h3>Швидкий запис</h3>
                <div className="quick-actions">
                    <button
                        className="quick-log-btn"
                        onClick={() => alert('💧 Додано 250мл води!')}
                    >
                        <span className="icon">💧</span> + Склянка води
                    </button>
                    <button
                        className="quick-log-btn"
                        onClick={() => alert('⚖️ Відкрито форму оновлення ваги')}
                    >
                        <span className="icon">⚖️</span> Оновити вагу
                    </button>
                    <button
                        className="quick-log-btn"
                        onClick={() => alert('🌙 Відкрито форму сну')}
                    >
                        <span className="icon">🌙</span> Записати сон
                    </button>
                </div>
            </div>

            {/* Синхронізація */}
            <div className="sidebar-group">
                <h3>Синхронізація</h3>
                <div className="sync-list">
                    <div className="sync-item">
                        <span>🍏 Apple Health</span>
                        <label className="switch">
                            <input type="checkbox" defaultChecked />
                            <span className="slider round"></span>
                        </label>
                    </div>
                    <div className="sync-item">
                        <span>⌚ Google Fit</span>
                        <label className="switch">
                            <input type="checkbox" />
                            <span className="slider round"></span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HealthPanel;