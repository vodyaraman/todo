'use client'
import React, { useEffect, useState } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store, authSlice, todoSlice, AuthState, ToDoState, useLoginMutation } from './redux';

const LoginPage = ({ onLogin }: { onLogin: () => void }) => {
    const dispatch = useDispatch();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [login, { isLoading, isError }] = useLoginMutation();

    const handleLogin = async () => {
        try {
            const response = await login({ email: username, password }).unwrap();
            if (response.token) {
                localStorage.setItem('token', response.token);
                onLogin();
                dispatch(authSlice.actions.login());
            }
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <input placeholder="Email" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleLogin} disabled={isLoading}>Login</button>
            {isError && <p style={{ color: 'red' }}>Login failed. Please try again.</p>}
        </div>
    );
};

const ToDoPage = () => {
    const dispatch = useDispatch();
    const tasks = useSelector((state: { todo: ToDoState }) => state.todo.tasks);
    const filter = useSelector((state: { todo: ToDoState }) => state.todo.filter);
    const [taskText, setTaskText] = useState('');

    const filteredTasks = tasks.filter((task) => {
        if (filter === 'active') return !task.completed && !task.deleted;
        if (filter === 'completed') return task.completed && !task.deleted;
        if (filter === 'trash') return task.deleted;
        return !task.deleted;
    });

    const handleAddTask = () => {
        if (taskText.trim()) {
            dispatch(todoSlice.actions.addTask(taskText));
            setTaskText('');
        }
    };

    return (
        <div>
            <h1>To-Do List</h1>
            <input placeholder="New task" value={taskText} onChange={(e) => setTaskText(e.target.value)} />
            <button onClick={handleAddTask}>Add Task</button>
            <div>
                <button onClick={() => dispatch(todoSlice.actions.setFilter('all'))}>All</button>
                <button onClick={() => dispatch(todoSlice.actions.setFilter('active'))}>Active</button>
                <button onClick={() => dispatch(todoSlice.actions.setFilter('completed'))}>Completed</button>
                <button onClick={() => dispatch(todoSlice.actions.setFilter('trash'))}>Trash</button>
            </div>
            <ul>
                {filteredTasks.map((task) => (
                    <li key={task.id}>
                        <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>{task.text}</span>
                        <button onClick={() => dispatch(todoSlice.actions.toggleComplete(task.id))}>
                            {task.completed ? 'Undo' : 'Complete'}
                        </button>
                        {filter === 'trash' ? (
                            <button onClick={() => dispatch(todoSlice.actions.restoreTask(task.id))}>Restore</button>
                        ) : (
                            <button onClick={() => dispatch(todoSlice.actions.deleteTask(task.id))}>Delete</button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

const HomePage = () => {
    const isAuthenticated = useSelector((state: { auth: AuthState }) => state.auth.isAuthenticated);
    const dispatch = useDispatch();

    useEffect(() => {
        const savedAuth = localStorage.getItem('token');
        if (savedAuth) dispatch(authSlice.actions.login());
    }, [dispatch]);

    const handleLogin = () => {
        dispatch(authSlice.actions.login());
    };

    const handleLogout = () => {
        dispatch(authSlice.actions.logout());
        localStorage.removeItem('token');
    };

    return (
        <div>
            {isAuthenticated ? (
                <>
                    <button onClick={handleLogout}>Logout</button>
                    <ToDoPage />
                </>
            ) : (
                <LoginPage onLogin={handleLogin} />
            )}
        </div>
    );
};

const MyApp = () => (
    <Provider store={store}>
        <HomePage />
    </Provider>
);

export default MyApp;
