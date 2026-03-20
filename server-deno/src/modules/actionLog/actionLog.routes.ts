import { Router } from "@oak/oak";
import { authMiddleware, adminOnlyMiddleware } from "../../shared/middlewares/auth.middleware.ts";
import { actionLogService } from "../../shared/container.ts";
import { APIException, APIErrorCode, APIResponse } from "../../shared/types/mod.ts";
import { ActionLogDto } from "./actionLog.type.ts";

export const router = new Router();

router.use(authMiddleware);

router.get("/boards/:boardId/logs", adminOnlyMiddleware, async (ctx) => {
    const boardId = ctx.params.boardId!;
    const userPseudo = ctx.state.user?.pseudo;

    // Vérification de l'authentification de l'utilisateur
    if (!userPseudo) {
        throw new APIException(APIErrorCode.UNAUTHORIZED, 401, "Utilisateur non authentifié");
    }

    const page = ctx.request.url.searchParams.get("page") ?? "0";
    const size = ctx.request.url.searchParams.get("size") ?? "10";

    // Récupération des logs d'actions du tableau depuis le service avec l'id du tableau
    const logs = await actionLogService.getActionLogsByBoardId(boardId, page, size, userPseudo);

    // Construction de la réponse
    const responseBody : APIResponse<ActionLogDto[]> = {
        success: true,
        data: logs,
    }
    ctx.response.status = 200;
    ctx.response.body = responseBody;
});

router.get("tasks/:taskId/logs/", adminOnlyMiddleware, async (ctx) => {
    const taskId = ctx.params.taskId!;
    const userPseudo = ctx.state.user?.pseudo;
    
    // Vérification de l'authentification de l'utilisateur
    if (!userPseudo) {
        throw new APIException(APIErrorCode.UNAUTHORIZED, 401, "Utilisateur non authentifié");
    }

    const page = ctx.request.url.searchParams.get("page") ?? "0";
    const size = ctx.request.url.searchParams.get("size") ?? "10";

    // Récupération des logs d'actions de la tâche depuis le service avec l'id de la tâche
    const logs = await actionLogService.getActionLogsByTaskId(taskId, page, size, userPseudo);

    // Construction de la réponse
    const responseBody : APIResponse<ActionLogDto[]> = {
        success: true,
        data: logs,
    }
    ctx.response.status = 200;
    ctx.response.body = responseBody;
});