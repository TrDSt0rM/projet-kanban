/**
 * @file server-deno/src/utils/typeguard.ts
 * @description This file contains the type guards for the application.
 * @version 1.0.0
 * @date 2026-03-11
 */
import { SQLOutputValue, LoginDto, RegisterDto, UserEntity } from "../types/mod.ts";

/**
 * Vérifie si un objet est de type LoginDto
 * @param obj l'objet à vérifier
 * @returns true si l'objet est de type LoginDto, false sinon
 */
export function isLoginDto(obj: unknown): obj is LoginDto {
  return !!obj && typeof obj === "object" &&
    "pseudo" in obj && typeof obj.pseudo === "string" &&
    "password" in obj && typeof obj.password === "string";
}

export function isRegisterDto(
  obj: unknown,
): obj is RegisterDto {
  return !!obj && typeof obj === "object" &&
    "pseudo" in obj && typeof obj.pseudo === "string" &&
    "password" in obj && typeof obj.password === "string";
}

export function isUserEntity(obj: Record<string, SQLOutputValue>): obj is UserEntity {
  return !!obj && typeof obj === "object" &&
    "pseudo" in obj && typeof obj.pseudo === "string" &&
    "password" in obj && typeof obj.password === "string" &&
    "role" in obj && typeof obj.role === "string" &&
    "isActive" in obj && typeof obj.isActive === "number";
}