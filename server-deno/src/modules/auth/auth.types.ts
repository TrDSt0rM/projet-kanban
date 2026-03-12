/**
 * @file server-deno/src/modules/auth/auth.types.ts
 * @description This file contains the types for the authentication module, including DTOs for login and registration.
 * @version 1.0.0
 * @date 2026-03-12
 */
export interface LoginDto {
    pseudo: string;
    password: string;
}

export interface LoginResponseDto {
    token: string;
    user: {
        pseudo: string;
        role: string;
    };
}

export interface LoginPayload {
    pseudo: string;
    role: string,
    exp: number,
}

export interface RegisterDto {
    pseudo: string;
    password: string;
}