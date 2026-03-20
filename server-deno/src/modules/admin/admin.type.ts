export interface StatsDto {
    totalUsers: number;
    totalBoards: number;
    totalTasks: number;
    userActivity: UserActivityDto[];
}

export interface UserActivityDto {
    pseudo: string;
    taskCount: number;
    boardCount: number;
}