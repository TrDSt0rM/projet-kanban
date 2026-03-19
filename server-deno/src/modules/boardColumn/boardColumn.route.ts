/**
 * @file server-deno/src/modules/boardColumn/boardColumn.route.ts
 * @description This file contains the routes for the board column-related operations.
 * @version 1.0.0
 * @date 2026-03-19
 */

import { Router } from "@oak/oak";
import { authMiddleware } from "../../shared/middlewares/auth.middleware.ts";
import { boardColumnService } from "../../shared/container.ts";
import { 
    APIException, APIErrorCode, APIResponse, 
    BoardColumnDto
} from "../../shared/types/mod.ts";

export const router = new Router();

router.use(authMiddleware);

router.get("/boards/:boardId/columns", async (ctx) => {
    const boardId = ctx.params.boardId!;
    const userPseudo = ctx.state.user?.pseudo;

    // Vérification de l'authentification de l'utilisateur
    if (!userPseudo) {
        throw new APIException(APIErrorCode.UNAUTHORIZED, 401, "Utilisateur non authentifié");
    }

    // Récupération des colonnes du tableau depuis le service avec l'id du tableau
    const columns = await boardColumnService.getColumnsByBoardId(boardId);

    // Construction de la réponse
    const responseBody : APIResponse<BoardColumnDto[]> = {
        success: true,
        data: columns,
    }
    
    // Envoie de la réponse
    ctx.response.status = 200;
    ctx.response.body = responseBody;
});

router.post("/boards/:boardId/columns", async (ctx) => {
    const boardId = ctx.params.boardId!;
    const userPseudo = ctx.state.user?.pseudo;

    if (!userPseudo) {
        throw new APIException(APIErrorCode.UNAUTHORIZED, 401, "Utilisateur non authentifié");
    }
    const body = await ctx.request.body.json();

    const newColumn = await boardColumnService.createColumn(boardId, body, userPseudo);

    const responseBody: APIResponse<BoardColumnDto> = {
        success: true,
        data: newColumn,
    };

    ctx.response.status = 201;
    ctx.response.body = responseBody;
});

    router.put("/columns/:columnId", async (ctx) => {
    const columnId = ctx.params.columnId!;
    const userPseudo = ctx.state.user.pseudo;
    const body = await ctx.request.body.json();

    const updatedColumn = await boardColumnService.updateColumn(columnId, body, userPseudo);

    ctx.response.status = 200;
    ctx.response.body = { success: true, data: updatedColumn };
    });

    router.patch("/columns/:columnId/position", async (ctx) => {
    const columnId = ctx.params.columnId!;
    const userPseudo = ctx.state.user.pseudo;
    const body = await ctx.request.body.json();

    await boardColumnService.updateColumnPosition(columnId, body, userPseudo);

    ctx.response.status = 200;
    ctx.response.body = { success: true, data: null };
    });

    router.delete("/columns/:columnId", async (ctx) => {
    const columnId = ctx.params.columnId!;
    const userPseudo = ctx.state.user.pseudo;

    await boardColumnService.deleteColumn(columnId, userPseudo);

    ctx.response.status = 200;
    ctx.response.body = { success: true, data: null };
    });