import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, UserInfo } from '../types';

export const storeUser = async (user: UserInfo) => {
    try {
        await AsyncStorage.setItem('@user', JSON.stringify(user));
    } catch (e) {
        console.error('Failed to save user to storage', e);
    }
};

export const getUser = async (): Promise<UserInfo | null> => {
    try {
        const jsonValue = await AsyncStorage.getItem('@user');
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.error('Failed to get user from storage', e);
        return null;
    }
};

export const removeUser = async () => {
    try {
        await AsyncStorage.removeItem('@user');
    } catch (e) {
        console.error('Failed to remove user from storage', e);
    }
};

export const storeTasks = async (tasks: Task[]) => {
    try {
        await AsyncStorage.setItem('@tasks', JSON.stringify(tasks));
    } catch (e) {
        console.error('Failed to save tasks to storage', e);
    }
};

export const getTasks = async (): Promise<Task[]> => {
    try {
        const jsonValue = await AsyncStorage.getItem('@tasks');
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        console.error('Failed to get tasks from storage', e);
        return [];
    }
};