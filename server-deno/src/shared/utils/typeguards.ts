/**
 * @file server-deno/src/utils/typeguard.ts
 * @description This file contains the type guards for the application.
 * @version 1.0.0
 * @date 2026-03-11
 */
import {
  SQLOutputValue,
  UserDto,
  UserEntity,
  UpdateUserRequest,
  BoardColumnDto,
  TaskDto,
  BoardDto,
  CreateBoardRequest,
  UpdateBoardRequest,
  BoardMemberDto,
} from "../types/mod.ts";
import { LoginDto, RegisterDto } from "../../modules/auth/auth.types.ts";

/* ==================================================
 * Type guards pour les DTOs d'authentification
 ================================================= */

/**
 * Vérifie si un objet est de type LoginDto
 * @param obj l'objet à vérifier
 * @returns true si l'objet est de type LoginDto, false sinon
 */
export function isLoginDto(obj: unknown): obj is LoginDto {
  return (
    !!obj &&
    typeof obj === "object" &&
    "pseudo" in obj &&
    typeof obj.pseudo === "string" &&
    "password" in obj &&
    typeof obj.password === "string"
  );
}

export function isRegisterDto(obj: unknown): obj is RegisterDto {
  return (
    !!obj &&
    typeof obj === "object" &&
    "pseudo" in obj &&
    typeof obj.pseudo === "string" &&
    "password" in obj &&
    typeof obj.password === "string"
  );
}

export function isUserEntity(
  obj: Record<string, SQLOutputValue>,
): obj is UserEntity {
  return (
    !!obj &&
    typeof obj === "object" &&
    "pseudo" in obj &&
    typeof obj.pseudo === "string" &&
    "password" in obj &&
    typeof obj.password === "string" &&
    "role" in obj &&
    typeof obj.role === "string" &&
    "isActive" in obj &&
    typeof obj.isActive === "boolean"
  );
}

/* ==================================================
 * Type guards pour les DTOs de tableau
 ================================================= */

export function isBoardDto(obj: unknown): obj is BoardDto {
  return (
    !!obj &&
    typeof obj === "object" &&
    "id" in obj &&
    typeof obj.id === "string" &&
    "name" in obj &&
    typeof obj.name === "string"
  );
}

export function isCreateBoardRequest(obj: unknown): obj is CreateBoardRequest {
  return (
    !!obj &&
    typeof obj === "object" &&
    "name" in obj &&
    typeof obj.name === "string"
  );
}

export function isUpdateBoardRequest(obj: unknown): obj is UpdateBoardRequest {
  return (
    !!obj &&
    typeof obj === "object" &&
    ("name" in obj ? typeof obj.name === "string" : true)
  );
}

export function isBoardMemberDto(obj: unknown): obj is BoardMemberDto {
  return (
    !!obj &&
    typeof obj === "object" &&
    "pseudo" in obj &&
    typeof obj.pseudo === "string" &&
    "role" in obj &&
    typeof obj.role === "string"
  );
}

/* ==================================================
 * Type guards pour les DTOs les colonnes et les tâches
 ================================================= */

export function isBoardColumnDto(obj: unknown): obj is BoardColumnDto {
  return (
    !!obj &&
    typeof obj === "object" &&
    "id" in obj &&
    typeof obj.id === "string" &&
    "name" in obj &&
    typeof obj.name === "string" &&
    "position" in obj &&
    typeof obj.position === "number" &&
    "tasks" in obj &&
    Array.isArray(obj.tasks) &&
    obj.tasks.every(isTaskDto)
  );
}

export function isTaskDto(obj: unknown): obj is TaskDto {
  return (
    !!obj &&
    typeof obj === "object" &&
    "id" in obj &&
    typeof obj.id === "string" &&
    "title" in obj &&
    typeof obj.title === "string" &&
    "description" in obj &&
    typeof obj.description === "string" &&
    "position" in obj &&
    typeof obj.position === "number" &&
    "priority" in obj &&
    typeof obj.priority === "string" &&
    ("expectedCompletionDate" in obj
      ? typeof obj.expectedCompletionDate === "string"
      : true) &&
    ("assignedTo" in obj ? typeof obj.assignedTo === "string" : true)
  );
}

/* ==================================================
 * Type guards pour les DTOs d'utilisateur
 ================================================= */

export function isUserDto(obj: unknown): obj is UserDto {
  return (
    !!obj &&
    typeof obj === "object" &&
    "pseudo" in obj &&
    typeof obj.pseudo === "string" &&
    "role" in obj &&
    typeof obj.role === "string" &&
    "isActive" in obj &&
    typeof obj.isActive === "boolean"
  );
}

export function isUpdateUserRequest(obj: unknown): obj is UpdateUserRequest {
  return (
    !!obj &&
    typeof obj === "object" &&
    ("role" in obj ? typeof obj.role === "string" : true) &&
    ("isActive" in obj ? typeof obj.isActive === "boolean" : true) &&
    ("password" in obj ? typeof obj.password === "string" : true)
  );
}
