export interface Task {
    id: string;
    title: string;
    description: string;
    dueDate: Date;
    status: 'pending' | 'completed';
}

export interface UserInfo {
    name: string,
    email: string,
    password: string,
}

export interface formObjectLogin {
    email: string,
    password: string
}

export interface formObjectRegister {
    name: string,
    email: string,
    password: string
}

export interface formParams {
    value: string,
    name: string
}