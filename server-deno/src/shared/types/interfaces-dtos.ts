/**
 * @file server-deno/src/types/interfacesDtos.ts
 * @description This file contains the interfaces for the DTOs used in the application.
 * @version 1.0.0
 * @date 2024-06-01
 */

/** =================================================
 * Interface User
 ================================================= */
export interface UserDto {
    pseudo: string;
    role : string;
    active: boolean;
}

export interface UserUpdatePasswordRequest {
    newPassword: string;
}

export interface UserUpdateRequest {
    role?: string;
    isActive?: boolean;
}

/** =================================================
 * Interface Board
 ================================================= */
export interface BoardCreateRequest {
    boardName: string;
}

export interface BoardDetailDto {
    idBoard: string;
    boardName: string;
    ownerPseudo: string;
    members: string[];
    columns: BoardColumnDto[];
}

export interface BoardMemberDto {
    idBoard: string;
    pseudo: string;
    memberRole: string;
}

export interface BoardMemberUpdateRequest {
    memberRole?: string;
}

export interface BoardSummaryDto {
    idBoard: string;
    boardName: string;
    ownerPseudo: string;
}

export interface BoardUpdateRequest {
    boardName?: string;
}

/** =================================================
 * Interface Column
 ================================================= */
export interface BoardColumnCreateRequest {
    columnName: string;
}

export interface BoardColumnDto {
    idColumn: string;
    columnName: string;
    position: number;
    tasks: TaskDto[];
}

export interface BoardColumnUpdatePositionRequest {
    newPosition: number;
}

export interface BoardColumnUpdateRequest {
    columnName?: string;
}

/* ==================================================
 * Interface Task
 ================================================= */
export interface TaskDto {
    id: string;
    title: string;
    description: string;
    position: number;
    priority: string;
    expectedCompletionDate?: string;
    assignedTo?: string;
}

export interface CommentDtos {
    id: string;
    taskId: string;
    content: string; 
}

/** =================================================
 * Interface Invitation
 ================================================= */
export interface InvitationCreateRequest {
    pseudo: string;
}

export interface InvitationDto {
    pseudo: string;
    idBoard: string;
    boardName: string;
    ownerPseudo: string;
    status: string; // InvitationStatus
}