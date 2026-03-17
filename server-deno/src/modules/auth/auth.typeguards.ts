/**
 * @file server-deno/src/modules/auth/auth.typeguads.ts
 * @description This file contains the type guards for the authentication module, including checks for LoginDto.
 * @version 1.0.0
 * @date 2026-03-12
 */
import { LoginDto, LoginPayload } from "./auth.types.ts";

export function isLoginDto(obj: unknown): obj is LoginDto {
  return !!obj && typeof obj === "object" &&
    "pseudo" in obj && typeof obj.pseudo === "string" &&
    "password" in obj && typeof obj.password === "string";
}

export function isLoginPayload(obj: unknown): obj is LoginPayload {
  return !!obj && typeof obj === "object" &&
    "pseudo" in obj && typeof obj.pseudo === "string" &&
    "role" in obj && typeof obj.role === "string" &&
    "exp" in obj && typeof obj.exp === "number";
}

export function isRegisterDto(obj: unknown): obj is LoginDto {
  return !!obj && typeof obj === "object" &&
    "pseudo" in obj && typeof obj.pseudo === "string" &&
    "password" in obj && typeof obj.password === "string";
}

