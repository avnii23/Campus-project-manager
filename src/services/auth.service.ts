import { request } from "./api-client";
import type {
    LoginRequest,
    RegisterRequest,
    AuthResponse,
    MeResponse,
} from "@/types/auth";

const TOKEN_KEY = "campuspm_token";

export const authService = {
    async login(data: LoginRequest) {
        const response = await request<AuthResponse>("/api/auth/login", {
            method: "POST",
            body: JSON.stringify(data),
        });

        localStorage.setItem(TOKEN_KEY, response.token);

        return response;
    },

    async register(data: RegisterRequest) {
        const response = await request<AuthResponse>("/api/auth/register", {
            method: "POST",
            body: JSON.stringify(data),
        });

        localStorage.setItem(TOKEN_KEY, response.token);

        return response;
    },

    async me() {
        return request<MeResponse>("/api/auth/me");
    },

    logout() {
        localStorage.removeItem(TOKEN_KEY);
    },

    getToken() {
        return localStorage.getItem(TOKEN_KEY);
    },

    isAuthenticated() {
        return !!this.getToken();
    },
};