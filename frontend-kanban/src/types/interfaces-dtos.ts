/**
 * @file server-deno/src/types/interfacesDtos.ts
 * @description This file contains the interfaces for the DTOs used in the application.
 * @version 1.0.0
 * @date 2024-06-01
 */

/** =================================================
 * Interface Statistique
 ================================================= */
export interface UserActivityDto {
    pseudo: string;
    taskCount: number;
    boardCount: number;
}

export interface StatsDto {
    totalUsers: number;
    totalBoards: number;
    totalTasks: number;
    userActivity: UserActivityDto[];
}

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
    tasks: TaskSummaryDto[];
}

export interface BoardColumnUpdatePositionRequest {
    position: number;
}

export interface BoardColumnUpdateRequest {
    columnName?: string;
}

/* ==================================================
 * Interface Task
 ================================================= */
export interface TaskAssignRequest {
    pseudo: string | null;
}

export interface TaskCreateRequest {
    taskName: string;
    description?: string;
    priority?: string;
    limitDate?: string; // Format ISO LocalDate
    assignedUserPseudo?: string;
}

export interface TaskSummaryDto {
    idTask: string;
    taskName: string;
    description: string | null;
    position: number;
    priority: string | null;
    limitDate: string | null;
    assignedUserPseudo: string | null;
}

export interface TaskDetailDto extends TaskSummaryDto {
    comments: CommentDto[];
    taskAttachments: AttachmentDto[];
}

export interface TaskMoveRequest {
    targetColumnId: string;
}

export interface TaskPositionRequest {
    position: number;
}

export interface TaskUpdateRequest {
    taskName: string;
    description?: string | null;
    priority?: string | null;
    limitDate?: string | null;
}

/** =================================================
 * Interface Comment
 ================================================= */
export interface AttachmentDto{
    fileId: string;
    fileName: string;
    empreinte: string;
    uploaderId: string; // pseudo
    uploaderDate: string;
}
export interface AttachmentCreateRequest {
    fileName: string;
    empreinte: string;
}

export interface CommentCreateRequest {
    message: string;
}
export interface CommentDto {
    commentId: string;
    userId: string;
    message: string;
    date: string;
    attachments: AttachmentDto[];
}

export interface CommentUpdateRequest {
    message: string;
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
    status: string;
}