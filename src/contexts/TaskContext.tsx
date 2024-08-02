import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { storeTasks, getTasks } from '../utils/storage';
// import { schedulePushNotification, cancelScheduledNotification } from '../utils/notifications';

export interface Task {
    id: string;
    title: string;
    description: string;
    dueDate: Date;
    status: 'pending' | 'completed';
}

interface TaskContextData {
    tasks: Task[];
    addTask: (task: Omit<Task, 'id'>) => Promise<void>;
    updateTask: (task: Task) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
    filterTasks: (status?: 'pending' | 'completed', date?: Date) => Task[];
}

const TaskContext = createContext<TaskContextData>({} as TaskContextData);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            const storedTasks = await getTasks();
            setTasks(storedTasks);
        } catch (error) {
            console.error('Error loading tasks:', error);
        }
    };

    const saveTasks = async (newTasks: Task[]) => {
        try {
            await storeTasks(newTasks);
            setTasks(newTasks);
        } catch (error) {
            console.error('Error saving tasks:', error);
        }
    };

    const addTask = async (task: Omit<Task, 'id'>) => {
        const newTask: Task = { ...task, id: Date.now().toString() };
        const updatedTasks = [...tasks, newTask];
        await saveTasks(updatedTasks);
        // await schedulePushNotification(newTask.title, newTask.description, new Date(newTask.dueDate));
    };

    const updateTask = async (updatedTask: Task) => {
        const updatedTasks = tasks.map(task =>
            task.id === updatedTask.id ? updatedTask : task
        );
        await saveTasks(updatedTasks);
        // await cancelScheduledNotification(updatedTask.id);
        // await schedulePushNotification(updatedTask.title, updatedTask.description, new Date(updatedTask.dueDate));
    };

    const deleteTask = async (id: string) => {
        const updatedTasks = tasks.filter(task => task.id !== id);
        await saveTasks(updatedTasks);
        // await cancelScheduledNotification(id);
    };

    const filterTasks = (status?: 'pending' | 'completed', date?: Date) => {
        return tasks.filter(task => {
            const statusMatch = !status || task.status === status;
            const dateMatch = !date || new Date(task.dueDate).toDateString() === date.toDateString();
            return statusMatch && dateMatch;
        });
    };

    return (
        <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask, filterTasks }}>
            {children}
        </TaskContext.Provider>
    );
};

export function useTask() {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error('useTask must be used within a TaskProvider');
    }
    return context;
}
