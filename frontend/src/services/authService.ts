import api from "../api/api";

export interface LoginRequest {
    email: string;
    password: string;
}

export async function login(data: LoginRequest) {
    const response = await api.post("/auth/login", data);
    return response.data;
}

export async function register(payload: {
    full_name: string;
    email: string;
    password: string;
}) {
    const response = await api.post("/auth/register", payload);
    return response.data;
}