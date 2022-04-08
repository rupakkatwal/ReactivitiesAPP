export interface User {
    userName: string;
    displayName: string;
    token: string;
    image?: string;
}

export interface UserFormValues {
    userName?: string;
    displayName?: string;
    email: string;
    password: string;
}