/**
 * @file server-deno/src/utils/typeguard.ts
 * @description This file contains the type guards for the application.
 * @version 1.0.0
 * @date 2026-03-11
 */
import {
  SQLOutputValue,
  BoardCreateRequest, BoardDetailDto, BoardMemberDto,
  BoardMemberUpdateRequest, BoardSummaryDto, BoardUpdateRequest,
  BoardColumnDto, BoardColumnCreateRequest, BoardColumnUpdatePositionRequest, BoardColumnUpdateRequest,
  AttachmentCreateRequest, AttachmentDto,
  CommentCreateRequest, CommentDto, CommentUpdateRequest,
  UserDto, UserEntity, UserActivityDto, StatsDto,
  UserUpdateRequest, UserUpdatePasswordRequest,  
  InvitationCreateRequest, InvitationDto,
  TaskAssignRequest, TaskCreateRequest, TaskSummaryDto, TaskDetailDto, 
  TaskUpdateRequest, TaskMoveRequest, TaskPositionRequest,
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
    obj.tasks.every(isTaskSummaryDto)
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

export function isTaskAssignRequest(obj: unknown): obj is TaskAssignRequest {
    return !!obj && 
    typeof obj === "object" &&
    "pseudo" in obj &&
    (typeof obj.pseudo === "string" || obj.pseudo === null);
}

export function isTaskCreateRequest(obj: unknown): obj is TaskCreateRequest {
    return (
        !!obj &&
        typeof obj === "object" &&
        "taskName" in obj &&
        typeof obj.taskName === "string" &&
        "description" in obj &&
        (obj.description ? typeof obj.description === "string" : true)
    );
}

export function isTaskSummaryDto(obj: unknown): obj is TaskSummaryDto {
  return (
    !!obj &&
    typeof obj === "object" &&
    "idTask" in obj &&
    typeof obj.idTask === "string" &&
    "taskName" in obj &&
    typeof obj.taskName === "string" &&
    "description" in obj &&
    typeof obj.description === "string" &&
    "position" in obj &&
    typeof obj.position === "number" &&
    "priority" in obj &&
    typeof obj.priority === "string" &&
    ("expectedCompletionDate" in obj ? typeof obj.expectedCompletionDate === "string" : true) &&
    ("assignedTo" in obj ? typeof obj.assignedTo === "string" : true)
  );
}

export function isTaskDetailDto(obj: unknown): obj is TaskDetailDto {
  return (
    !!obj &&
    typeof obj === "object" &&
    isTaskSummaryDto(obj) &&
    "comments" in obj &&
    Array.isArray(obj.comments) &&
    obj.comments.every(isCommentDto) &&
    "taskAttachments" in obj &&
    Array.isArray(obj.taskAttachments) &&
    obj.taskAttachments.every(isAttachmentDto)
  );
}

export function isTaskMoveRequest(obj: unknown): obj is TaskMoveRequest {
    return !!obj && 
    typeof obj === "object" && 
    "targetColumnId" in obj && 
    typeof obj.targetColumnId === "string";
}

export function isTaskPositionRequest(obj: unknown): obj is TaskPositionRequest {
    return !!obj && 
    typeof obj === "object" && 
    "position" in obj && 
    typeof obj.position === "number";
}

export function isTaskUpdateRequest(obj: unknown): obj is TaskUpdateRequest {
    return !!obj && 
    typeof obj === "object" && 
    "taskName" in obj && 
    typeof obj.taskName === "string";
}

export function isCommentCreateRequest(obj: unknown): obj is CommentCreateRequest {
    return !!obj && 
    typeof obj === "object" && 
    "content" in obj && 
    typeof obj.content === "string";
}

export function isCommentUpdateRequest(obj: unknown): obj is CommentUpdateRequest {
    return !!obj && 
    typeof obj === "object" && 
    "content" in obj && 
    typeof obj.content === "string";
}

export function isCommentDto(obj: unknown): obj is CommentDto {
    return (
        !!obj &&
        typeof obj === "object" &&
        "commentId" in obj &&
        typeof obj.commentId === "string" &&
        "userId" in obj &&
        typeof obj.userId === "string" &&
        "message" in obj &&
        typeof obj.message === "string" &&
        "date" in obj &&
        typeof obj.date === "string" &&
        "attachments" in obj &&
        Array.isArray(obj.attachments) &&
        obj.attachments.every(isAttachmentDto)
    );
}

export function isAttachmentCreateRequest(obj: unknown): obj is AttachmentCreateRequest {
    return !!obj && 
    typeof obj === "object" && 
    "fileName" in obj && 
    typeof obj.fileName === "string" && 
    "empreinte" in obj && 
    typeof obj.empreinte === "string";
}

export function isAttachmentDto(obj: unknown): obj is AttachmentDto {
    return (
        !!obj &&
        typeof obj === "object" &&
        "fileId" in obj &&
        typeof obj.fileId === "string" &&
        "fileName" in obj &&
        typeof obj.fileName === "string" &&
        "empreinte" in obj &&
        typeof obj.empreinte === "string" &&
        "uploaderId" in obj &&
        typeof obj.uploaderId === "string" &&
        "uploaderDate" in obj &&
        typeof obj.uploaderDate === "string"
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
