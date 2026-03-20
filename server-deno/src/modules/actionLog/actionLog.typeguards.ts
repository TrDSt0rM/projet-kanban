import { ActionLogDto } from "./actionLog.type.ts";

export function isActionLogDto(obj: unknown): obj is ActionLogDto {
    return (
        !!obj &&
        typeof obj === "object" &&
        "id" in obj &&
        typeof obj.id === "string" &&
        "actionType" in obj &&
        typeof obj.actionType === "string" &&
        "dateTime" in obj &&
        typeof obj.dateTime === "string" &&
        "targetId" in obj &&
        typeof obj.targetId === "string" &&
        "targetType" in obj &&
        typeof obj.targetType === "string" &&
        "userPseudo" in obj &&
        typeof obj.userPseudo === "string"
    );
}