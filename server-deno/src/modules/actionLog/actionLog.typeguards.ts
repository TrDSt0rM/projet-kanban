import { ActionLogDto, PageableActionLogDto } from "./actionLog.type.ts";

export function isActionLogDto(obj: unknown): obj is ActionLogDto {
    return (
        !!obj &&
        typeof obj === "object" &&
        "id" in obj &&
        typeof obj.id === "number" &&
        "actionType" in obj &&
        typeof obj.actionType === "string" &&
        "datetime" in obj &&
        typeof obj.datetime === "string" &&
        "targetId" in obj &&
        typeof obj.targetId === "string" &&
        "targetType" in obj &&
        typeof obj.targetType === "string" &&
        "userPseudo" in obj &&
        (typeof obj.userPseudo === "string" || obj.userPseudo === null)
    );
}

export function isPageableActionLogDto(obj: unknown): obj is PageableActionLogDto {
    return (
        !!obj &&
        typeof obj === "object" &&
        "content" in obj &&
        Array.isArray(obj.content) &&
        obj.content.every(isActionLogDto) &&
        "totalPages" in obj &&
        typeof obj.totalPages === "number" &&
        "totalElements" in obj &&
        typeof obj.totalElements === "number" &&
        "currentPage" in obj &&
        typeof obj.currentPage === "number" &&
        "first" in obj &&
        typeof obj.first === "boolean" &&
        "last" in obj &&
        typeof obj.last === "boolean"
    );
}   