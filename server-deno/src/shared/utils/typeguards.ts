/**
 * @file server-deno/src/utils/typeguard.ts
 * @description This file contains the type guards for the application.
 * @version 1.0.0
 * @date 2026-03-11
 */
import {
  SQLOutputValue,
  BoardCreateRequest,
  BoardDetailDto,
  BoardMemberDto,
  BoardMemberUpdateRequest,
  BoardSummaryDto,
  UserDto,
  UserEntity,
  BoardColumnDto,
  TaskDto,
  BoardUpdateRequest,
  UserUpdateRequest,
  UserUpdatePasswordRequest,
  BoardColumnCreateRequest,
  BoardColumnUpdatePositionRequest,
  BoardColumnUpdateRequest,
  InvitationCreateRequest,
  InvitationDto,
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

export function isBoardCreateRequest(obj: unknown): obj is BoardCreateRequest {
  return (
    !!obj &&
    typeof obj === "object" &&
    "boardName" in obj &&
    typeof obj.boardName === "string"
  );
}

export function isBoardDetailDto(obj: unknown): obj is BoardDetailDto {
  return (
    !!obj &&
    typeof obj === "object" &&
    "idBoard" in obj &&
    typeof obj.idBoard === "string" &&
    "boardName" in obj &&
    typeof obj.boardName === "string" &&
    "ownerPseudo" in obj &&
    typeof obj.ownerPseudo === "string" &&
    "members" in obj &&
    Array.isArray(obj.members) &&
    "columns" in obj &&
    Array.isArray(obj.columns)
  );
}

export function isBoardMemberDto(obj: unknown): obj is BoardMemberDto {
  return (
    !!obj &&
    typeof obj === "object" &&
    "idBoard" in obj &&
    typeof obj.idBoard === "string" &&
    "pseudo" in obj &&
    typeof obj.pseudo === "string" &&
    "memberRole" in obj &&
    typeof obj.memberRole === "string"
  );
}

export function isBoardMemberUpdateRequest(obj: unknown): obj is BoardMemberUpdateRequest {
  return (
    !!obj &&
    typeof obj === "object" &&
    ("memberRole" in obj ? typeof obj.memberRole === "string" : true)
  );
}

export function isBoardSummaryDto(obj: unknown): obj is BoardSummaryDto {
  return (
    !!obj &&
    typeof obj === "object" &&
    "idBoard" in obj &&
    typeof obj.idBoard === "string" &&
    "boardName" in obj &&
    typeof obj.boardName === "string" &&
    "ownerPseudo" in obj &&
    typeof obj.ownerPseudo === "string"
  );
}

export function isBoardUpdateRequest(obj: unknown): obj is BoardUpdateRequest {
  return (
    !!obj &&
    typeof obj === "object" &&
    ("boardName" in obj ? typeof obj.boardName === "string" : true)
  );
}

/* ==================================================
 * Type guards pour les DTOs les colonnes
 ================================================= */

export function isBoardColumnDto(obj: unknown): obj is BoardColumnDto {
  return (
    !!obj &&
    typeof obj === "object" &&
    "idColumn" in obj &&
    typeof obj.idColumn === "string" &&
    "ColumnName" in obj &&
    typeof obj.ColumnName === "string" &&
    "position" in obj &&
    typeof obj.position === "number" &&
    "tasks" in obj &&
    Array.isArray(obj.tasks) &&
    obj.tasks.every(isTaskDto)
  );
}

export function isBoardColumnCreateRequest(obj: unknown): obj is BoardColumnCreateRequest {
    return !!obj &&
    typeof obj === "object" &&
    "columnName" in obj &&
    typeof obj.columnName === "string";
}

export function isBoardColumnPositionUpdateRequest(obj: unknown): obj is BoardColumnUpdatePositionRequest {
    return !!obj && 
    typeof obj === "object" && 
    "position" in obj && 
    typeof obj.position === "number";
}

export function isBoardColumnUpdateRequest(obj: unknown): obj is BoardColumnUpdateRequest {
    return !!obj &&
    typeof obj === "object" &&
    "columnName" in obj &&
    typeof obj.columnName === "string";
}

export function isInvitationCreateDto(obj: unknown): obj is InvitationCreateRequest {
    return !!obj &&
    typeof obj === "object" &&
    "pseudo" in obj &&
    typeof obj.pseudo === "string";
}

export function isInvitationDto(obj: unknown): obj is InvitationDto {
    return (
        !!obj &&
        typeof obj === "object" &&
        "pseudo" in obj &&
        typeof obj.pseudo === "string" &&
        "idBoard" in obj &&
        typeof obj.idBoard === "string" &&
        "boardName" in obj &&
        typeof obj.boardName === "string" &&
        "ownerPseudo" in obj &&
        typeof obj.ownerPseudo === "string" &&
        "status" in obj &&
        typeof obj.status === "string"
    );
}

/* ==================================================
 * Type guards pour les DTOs de tâche
 ================================================= */

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
    "active" in obj &&
    typeof obj.active === "boolean"
  );
}

export function isUserUpdateRequest(obj: unknown): obj is UserUpdateRequest {
  return (
    !!obj &&
    typeof obj === "object" &&
    ("role" in obj ? typeof obj.role === "string" : true) &&
    ("isActive" in obj ? typeof obj.isActive === "boolean" : true) &&
    ("password" in obj ? typeof obj.password === "string" : true)
  );
}

export function isUserUpdatePasswordRequest(obj: unknown): obj is UserUpdatePasswordRequest {
  return (
    !!obj &&
    typeof obj === "object" &&
    "newPassword" in obj &&
    typeof obj.newPassword === "string"
  );
}
