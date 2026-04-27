// src/pages/Auth.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    type User,
} from 'firebase/auth';
import { auth } from '../../firebase.ts';

const Auth: React.FC = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });

        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
            }

            navigate('/');
        } catch (error: unknown) {
            const code =
                typeof error === 'object' && error !== null && 'code' in error
                    ? String((error as { code?: string }).code)
                    : '';

            if (code === 'auth/invalid-credential') {
                setErrorMsg('Неправильний email або пароль.');
            } else if (code === 'auth/email-already-in-use') {
                setErrorMsg('Цей email вже зареєстрований.');
            } else if (code === 'auth/weak-password') {
                setErrorMsg('Пароль має містити щонайменше 6 символів.');
            } else {
                setErrorMsg('Сталася помилка під час авторизації.');
            }
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/auth');
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Невідома помилка';
            alert(`Помилка виходу: ${message}`);
        }
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '24px',
                boxSizing: 'border-box',
                flex: '1 1 100%',
            }}
        >
            <div
                style={{
                    backgroundColor: 'var(--bg-panel)',
                    padding: '2.5rem',
                    borderRadius: '20px',
                    border: '1px solid var(--border-color)',
                    width: '100%',
                    maxWidth: '400px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    boxSizing: 'border-box',
                }}
            >
                <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.8rem' }}>
                    {currentUser ? 'Мій Профіль' : isLogin ? 'Вхід у FitMonitor' : 'Реєстрація'}
                </h2>

                {currentUser ? (
                    <div style={{ textAlign: 'center' }}>
                        <div
                            style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--accent-blue)',
                                margin: '0 auto 1rem',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                fontSize: '2rem',
                            }}
                        >
                            👤
                        </div>

                        <p style={{ color: 'var(--text-muted)', marginBottom: '5px' }}>Ви увійшли як:</p>
                        <p style={{ fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '2rem' }}>
                            {currentUser.email}
                        </p>

                        <button
                            onClick={handleLogout}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '10px',
                                backgroundColor: 'transparent',
                                color: '#ff4757',
                                border: '1px solid #ff4757',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: '0.3s',
                            }}
                        >
                            Вийти з акаунту
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Email</label>
                            <input
                                type="email"
                                placeholder="ваша@пошта.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{
                                    padding: '12px 15px',
                                    borderRadius: '10px',
                                    border: '1px solid var(--border-color)',
                                    backgroundColor: 'var(--bg-dark)',
                                    color: 'var(--text-main)',
                                    outline: 'none',
                                    width: '100%',
                                    boxSizing: 'border-box',
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Пароль</label>
                            <input
                                type="password"
                                placeholder="Мінімум 6 символів"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{
                                    padding: '12px 15px',
                                    borderRadius: '10px',
                                    border: '1px solid var(--border-color)',
                                    backgroundColor: 'var(--bg-dark)',
                                    color: 'var(--text-main)',
                                    outline: 'none',
                                    width: '100%',
                                    boxSizing: 'border-box',
                                }}
                            />
                        </div>

                        {errorMsg && (
                            <div
                                style={{
                                    color: '#ff4757',
                                    fontSize: '0.9rem',
                                    textAlign: 'center',
                                    backgroundColor: 'rgba(255, 71, 87, 0.1)',
                                    padding: '10px',
                                    borderRadius: '8px',
                                }}
                            >
                                {errorMsg}
                            </div>
                        )}

                        <button
                            type="submit"
                            style={{
                                marginTop: '10px',
                                padding: '14px',
                                borderRadius: '10px',
                                backgroundColor: 'var(--accent-green)',
                                color: 'var(--bg-dark)',
                                border: 'none',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                transition: '0.3s',
                            }}
                        >
                            {isLogin ? 'Увійти' : 'Створити акаунт'}
                        </button>

                        <p
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setErrorMsg(null);
                            }}
                            style={{
                                textAlign: 'center',
                                marginTop: '10px',
                                fontSize: '0.95rem',
                                color: 'var(--text-muted)',
                                cursor: 'pointer',
                            }}
                        >
                            {isLogin ? 'Немає акаунту? ' : 'Вже є акаунт? '}
                            <span style={{ color: 'var(--accent-blue)', fontWeight: 'bold' }}>
                {isLogin ? 'Зареєструйтесь' : 'Увійдіть'}
              </span>
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Auth;