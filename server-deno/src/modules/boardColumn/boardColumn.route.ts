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
    BoardDetailDto, BoardMemberDto, BoardSummaryDto,
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
    
    // Vérification de l'authentification de l'utilisateur
    if (!userPseudo) {
        throw new APIException(APIErrorCode.UNAUTHORIZED, 401, "Utilisateur non authentifié");
    }
    
    // Récupération des données de la requête
    const body = await ctx.request.body.json();

    // Envoie des données à Tomcat pour créer une nouvelle colonne dans le tableau
    const newColumn = await boardColumnService.createColumn(boardId, body);
