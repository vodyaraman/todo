/* eslint-disable @next/next/no-img-element */
'use client'
import { useState } from "react";
import { useLoginMutation, useRegisterMutation } from "../redux";
import { useDispatch } from 'react-redux';
import { authSlice } from '../redux';
import "./auth.scss";

export default function AuthComponent() {
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
        <div className="main">
            <div className="auth">
                <h2 className="auth-title">
                    Вы не вошли в систему
                </h2>
                <div className="auth-buttons">
                    {!showLogin && !showRegister && (
                        <>
                            <button className="auth-button" onClick={handleShowLogin}>Войти</button>
                            <button className="auth-button" onClick={handleShowRegister}>Зарегистрироваться</button>
                        </>
                    )}
                </div>
                {showLogin && (
                    <>
                        <Login />
                        <button className="auth-button alt" onClick={handleShowRegister}>Регистрация</button>
                    </>
                )}
                {showRegister && (
                    <>
                        <Register />
                        <button className="auth-button alt" onClick={handleShowLogin}>Вход</button>
                    </>
                )}
            </div>
            <img src="https://funlines.in/cdn/shop/files/rn-image_picker_lib_temp_7c2c7585-524f-4708-85f1-fce88861738d.jpg?v=1694517780&width=1946" alt="" className='auth-image' />
        </div>
    );
};

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [register, { isLoading, isError }] = useRegisterMutation();
    const dispatch = useDispatch();

    const handleRegister = async () => {
        if (!email || !password || !confirmPassword) {
            setError('Все поля должны быть заполнены');
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

        try {
            const response = await register({ email, password }).unwrap();
            if (response) {
                console.log('Регистрация прошла успешно:', response);
                dispatch(authSlice.actions.login());
                localStorage.setItem('isAuthenticated', 'true')
                window.location.href = '/';
            }
        } catch (err) {
            console.error('Ошибка регистрации:', err);
        }
    };

    return (
        <div className="register">
            <h2 className="register__title">Регистрация</h2>
            {error && <div className="register__error">{error}</div>}
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
            <button className="register__button" onClick={handleRegister} disabled={isLoading}>Продолжить</button>
            {isError && <div className="register__error">Ошибка регистрации. Пожалуйста, попробуйте снова.</div>}
        </div>
    );
};

// Login Component
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [login, { isLoading, isError }] = useLoginMutation();
    const dispatch = useDispatch();

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Все поля должны быть заполнены');
            return;
        }
        setError('');

        try {
            const response = await login({ email, password }).unwrap();
            if (response.token) {
                localStorage.setItem('token', response.token);
                console.log('Вход выполнен успешно:', response);
                dispatch(authSlice.actions.login()); // Обновляем состояние аутентификации
                localStorage.setItem('isAuthenticated', 'true')
                window.location.href = '/';
            }
        } catch (err) {
            console.error('Ошибка входа:', err);
            setError('Неверные учетные данные. Пожалуйста, попробуйте снова.');
        }
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
            <button className="login__button" onClick={handleLogin} disabled={isLoading}>Продолжить</button>
            {isError && <div className="login__error">Ошибка входа. Пожалуйста, попробуйте снова.</div>}
        </div>
    );
};
