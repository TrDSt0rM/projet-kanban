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
    isActive: boolean;
}

export interface UpdateUserRequest {
    role?: string;
    isActive?: boolean;
}

/** =================================================
 * Interface Main Entities
 ================================================= */
export interface BoardDto {
    id: string;
    name: string;
    owner: string;
    members: string[];
    columns: BoardColumnDto[];
}

export interface CreateBoardRequest {
    name: string;
}

export interface UpdateBoardRequest {
    name?: string;
}

export interface BoardMemberDto {
    pseudo: string;
    role: string;
}

export interface BoardColumnDto {
    id: string;
    name: string;
    position: number;
    tasks: TaskDto[];
}

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