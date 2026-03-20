export interface ActionLogDto {
    id: number,
    actionType: string,
    datetime: string,
    targetId: string,
    targetType: string,
    userPseudo: string
}

export interface PageableActionLogDto {
    content: ActionLogDto[],
    totalPages: number,
    totalElements: number,
    currentPage: number,
    first: boolean,
    last: boolean
}