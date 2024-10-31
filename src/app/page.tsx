'use client'
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { todoSlice, ToDoState } from './redux';
import './page.scss';

const ToDoPage = () => {
    const dispatch = useDispatch();
    const tasks = useSelector((state: { todo: ToDoState }) => state.todo.tasks);
    const filter = useSelector((state: { todo: ToDoState }) => state.todo.filter);
    const [taskText, setTaskText] = useState('');

    useEffect(() => {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            dispatch(todoSlice.actions.setTasks(JSON.parse(savedTasks)));
        }
    }, [dispatch]);

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
            localStorage.setItem('tasks', JSON.stringify([...tasks, {
                id: Date.now(),
                text: taskText,
                completed: false,
                deleted: false,
            }]));
        }
    };

    const handleDeleteTask = (taskId : number) => {
        dispatch(todoSlice.actions.deleteTask(taskId));
        const updatedTasks = tasks.map((task) => 
            task.id === taskId ? { ...task, deleted: true } : task
        );
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    };

    const handleDeleteAllTasks = () => {
        const ok = confirm("Delete all tasks?");
        if (ok) {
            dispatch(todoSlice.actions.deleteAllTasks());
            localStorage.removeItem('tasks');
        }
    };

    return (
        <div className='to-do-page'>
            <h1>To-Do List</h1>
            <div className='task-input'>
                <input
                    placeholder="New task"
                    value={taskText}
                    onChange={(e) => setTaskText(e.target.value)}
                />
                <button className='add-task-button' onClick={handleAddTask}>Add Task</button>
            </div>
            <div className='filter-buttons'>
                <button onClick={() => dispatch(todoSlice.actions.setFilter('all'))}>All</button>
                <button onClick={() => dispatch(todoSlice.actions.setFilter('active'))}>Active</button>
                <button onClick={() => dispatch(todoSlice.actions.setFilter('completed'))}>Completed</button>
                <button onClick={() => dispatch(todoSlice.actions.setFilter('trash'))}>Trash</button>
            </div>
            {tasks.length > 0 && <button className='delete-all-button' onClick={handleDeleteAllTasks}>Delete All Tasks</button>}
            <ul className='task-list'>
                {filteredTasks.map((task) => (
                    <li key={task.id} className={task.completed ? 'completed' : ''}>
                        <span>{task.text} {task.completed && <span>✅</span>}</span>
                        <button className='complete-button'
                            onClick={() => {
                                dispatch(todoSlice.actions.toggleComplete(task.id));
                                const updatedTasks = tasks.map((t) =>
                                    t.id === task.id ? { ...t, completed: !t.completed } : t
                                );
                                localStorage.setItem('tasks', JSON.stringify(updatedTasks));
                            }}>
                            {task.completed ? 'Undo' : 'Complete'}
                        </button>
                        {filter === 'trash' ? (
                            <button className='restore-button' onClick={() => {
                                dispatch(todoSlice.actions.restoreTask(task.id));
                                const updatedTasks = tasks.map((t) =>
                                    t.id === task.id ? { ...t, deleted: false } : t
                                );
                                localStorage.setItem('tasks', JSON.stringify(updatedTasks));
                            }}>Restore</button>
                        ) : (
                            <button className='delete-button' onClick={() => handleDeleteTask(task.id)}>Delete</button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

const HomePage = () => {
    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        window.location.href = "/auth";
    };

    return (
        <div className='home-page'>
            <button className='logout-button' onClick={handleLogout}>Logout</button>
            <ToDoPage />
        </div>
    );
};

export default function MyApp() {
    const [isAuthenticated, setIsAuthenticated] = useState("");

    useEffect(() => {
        const authStatus = localStorage.getItem('isAuthenticated');
        if (authStatus) setIsAuthenticated(authStatus);
        if (!authStatus) {
            window.location.href = "/auth";
        }
    }, []);

    if (isAuthenticated === null) {
        return null; // Отображаем null до тех пор, пока состояние не будет инициализировано
    }

    return (
        <div className='my-app'>
            {isAuthenticated ? (
                <HomePage />
            ) : (
                null
            )}
        </div>
    );
};