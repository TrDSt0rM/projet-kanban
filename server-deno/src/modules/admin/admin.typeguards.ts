import { StatsDto, UserActivityDto } from "./admin.type.ts";

export function isStatsDto(obj: unknown): obj is StatsDto {
    return (
        !!obj &&
        typeof obj === "object" &&
        "totalUsers" in obj &&
        typeof obj.totalUsers === "number" &&
        "totalBoards" in obj &&
        typeof obj.totalBoards === "number" &&
        "totalTasks" in obj &&
        typeof obj.totalTasks === "number" &&
        "userActivity" in obj &&
        Array.isArray(obj.userActivity) &&
        obj.userActivity.every(isUserActivityDto)
    );
}

export function isUserActivityDto(obj: unknown): obj is UserActivityDto {
    return (
        !!obj &&
        typeof obj === "object" &&
        "pseudo" in obj &&
        typeof obj.pseudo === "string" &&
        "taskCount" in obj &&
        typeof obj.taskCount === "number" &&
        "boardCount" in obj &&
        typeof obj.boardCount === "number"
    );
}