export interface ActionLogDto {
    id: string,
    actionType: string,
    dateTime: string,
    targetId: string,
    targetType: string,
    userPseudo: string
}