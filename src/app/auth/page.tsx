/* eslint-disable @next/next/no-img-element */
'use client'
import { useState } from "react";
import "./auth.scss";

export default function AuthOptions() {
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    const handleShowLogin = () => {
        setShowLogin(true);
        setShowRegister(false);
    };

    const handleShowRegister = () => {
        setShowRegister(true);
        setShowLogin(false);
    };

    return (
        <>
            <div className="chat-app__auth">
                <h2 className="chat-app__auth-title">
                    Вы не вошли в систему
                </h2>
                <div className="chat-app__auth-buttons">
                    {!showLogin && !showRegister && (
                        <>
                            <button className="chat-app__auth-button" onClick={handleShowLogin}>Войти</button>
                            <button className="chat-app__auth-button" onClick={handleShowRegister}>Зарегистрироваться</button>
                        </>
                    )}
                </div>
                {showLogin && (
                    <>
                        <Login />
                        <button className="chat-app__auth-button alt" onClick={handleShowRegister}>Регистрация</button>
                    </>
                )}
                {showRegister && (
                    <>
                        <Register />
                        <button className="chat-app__auth-button alt" onClick={handleShowLogin}>Вход</button>
                    </>
                )}
            </div>
            <img src="https://st4.depositphotos.com/2673929/27392/i/450/depositphotos_273926318-stock-photo-white-office-interior-with-meeting.jpg" alt="" className='chat-app__auth-image' />
        </>
    );
};

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleRegister = () => {
        if (!email || !password || !confirmPassword || !username) {
            setError('Все поля должны быть заполнены');
            return;
        }
        if (username.length < 3 || username.length > 15) {
            setError('Имя пользователя должно содержать от 3 до 15 символов');
            return;
        }
        if (password !== confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }
        if (password.length < 3 || password.length > 15) {
            setError('Пароль должен содержать от 3 до 15 символов');
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Введите корректный адрес электронной почты');
            return;
        }
        setError('');
    };

    return (
        <div className="register">
            <h2 className="register__title">Регистрация</h2>
            {error && <div className="register__error">{error}</div>}
            <input
                className="register__input"
                name="text"
                placeholder="Имя пользователя (от 3 до 15 символов)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                className="register__input"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                className="register__input"
                name="password"
                autoComplete='true'
                type={showPassword ? 'text' : 'password'}
                placeholder="Пароль (от 3 до 15 символов)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <input
                className="register__input"
                name='password'
                autoComplete='true'
                type={showPassword ? 'text' : 'password'}
                placeholder="Повторите пароль"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <label className="register__show-password">
                <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                />
                Показать пароль
            </label>
            <button className="register__button" onClick={handleRegister}>Продолжить</button>
        </div>
    );
};

// Login Component
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = () => {
        if (!email || !password) {
            setError('Все поля должны быть заполнены');
            return;
        }
        setError('');
    };

    return (
        <div className="login">
            <h2 className="login__title">Вход</h2>
            {error && <div className="login__error">{error}</div>}
            <input
                className="login__input"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                className="login__input"
                name="password"
                placeholder="Пароль"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button className="login__button" onClick={handleLogin}>Продолжить</button>
        </div>
    );
};
