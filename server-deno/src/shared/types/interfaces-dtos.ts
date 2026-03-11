/**
 * @file server-deno/src/types/interfacesDtos.ts
 * @description This file contains the interfaces for the DTOs used in the application.
 * @version 1.0.0
 * @date 2024-06-01
 */

/** =================================================
 * Interface Authentication
 ================================================= */
export interface UserDto {
    pseudo: string;
    role : string;
    isActive: boolean;
}

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

export interface RegisterDto {
    pseudo: string;
    password: string;
}

/** =================================================
 * Interface Main Entities
 ================================================= */
export interface BoardDto {
    id: string;
    name: string;
    owner: string;
    members: string[];
    columns: ColumnDto[];
}

export interface ColumnDto {
    id: string;
    name: string;
    order: number;
    tasks: TaskDto[];
}

export interface TaskDto {
    id: string;
    title: string;
    description: string;
    assignedTo: string;
    order: number;
    priority: string;
    expectedCompletionDate: string;
    status: string;
}

export interface CommentDtos {
    id: string;
    taskId: string;
    content: string; 
}