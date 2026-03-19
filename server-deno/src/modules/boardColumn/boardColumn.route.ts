/**
 * @file server-deno/src/modules/boardColumn/boardColumn.route.ts
 * @description This file contains the routes for the board column-related operations.
 * @version 1.0.0
 * @date 2026-03-19
 */

import { Router } from "@oak/oak";
import { authMiddleware } from "../../shared/middlewares/auth.middleware.ts";
import { userService } from "../../shared/container.ts";

export const router = new Router();

router.use(authMiddleware);

router.get("/boards/:boardId/columns", async (ctx) => {
    const boardId = ctx.params.boardId!;
    const userPseudo = ctx.state.user?.pseudo;

    // Vérification de l'authentification de l'utilisateur
    if (!userPseudo) {
            throw new APIException(APIErrorCode.UNAUTHORIZED, 401, "Utilisateur non authentifié");
        }

    const columns = await userService.getColumnsByBoardId(boardId);