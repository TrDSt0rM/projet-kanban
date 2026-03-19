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

/**
 * GET /boards/:boardId/columns - Récupérer les colonnes d'un tableau
 * @param boardId l'id du tableau dont on veut récupérer les colonnes
 * @return les colonnes du tableau correspondant à l'id
 * @throws 401 si l'utilisateur n'est pas authentifié
 * @throws 404 si le tableau cible n'existe pas ou si l'utilisateur n'est pas membre du tableau
 * @throws 500 si une erreur interne se produit lors de la récupération des colonnes depuis Tomcat
 * @throws 500 si les données retournées par Tomcat ne sont pas conformes à BoardColumnDto[]
 */
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

/**
 * POST /boards/:boardId/columns - Créer une nouvelle colonne dans un tableau
 * @param boardId l'id du tableau dans lequel créer la colonne
 * @param body les données de la colonne à créer (nom)
 * @return la colonne créée
 * @throws 401 si l'utilisateur n'est pas authentifié
 * @throws 404 si le tableau cible n'existe pas
 * @throws 500 si une erreur interne se produit lors de la création de la colonne depuis Tomcat
 * @throws 500 si les données retournées par Tomcat ne sont pas conformes à BoardColumnDto
 */
router.post("/boards/:boardId/columns", async (ctx) => {
    const boardId = ctx.params.boardId!;
    const userPseudo = ctx.state.user?.pseudo;

    // Vérification de l'authentification de l'utilisateur
    if (!userPseudo) {
        throw new APIException(APIErrorCode.UNAUTHORIZED, 401, "Utilisateur non authentifié");
    }
    
    // Récupération des données de la requête
    const body = await ctx.request.body.json();

    // Création de la colonne depuis le service
    const newColumn = await boardColumnService.createColumn(boardId, body, userPseudo);

    // Construction de la réponse
    const responseBody: APIResponse<BoardColumnDto> = {
        success: true,
        data: newColumn,
    };
    ctx.response.status = 201;
    ctx.response.body = responseBody;
});

/**
 * PUT /columns/:columnId - Modifier une colonne
 * @param columnId l'id de la colonne à modifier
 * @param body les données de la colonne à modifier (nom)
 * @return la colonne modifiée
 * @throws 401 si l'utilisateur n'est pas authentifié
 * @throws 404 si la colonne cible n'existe pas ou si l'utilisateur n'est pas membre du tableau auquel appartient la colonne
 * @throws 500 si une erreur interne se produit lors de la modification de la colonne depuis Tomcat
 * @throws 500 si les données retournées par Tomcat ne sont pas conformes à BoardColumnDto
 */
router.put("/columns/:columnId", async (ctx) => {
    const columnId = ctx.params.columnId!;
    const userPseudo = ctx.state.user.pseudo;
    const body = await ctx.request.body.json();

    const updatedColumn = await boardColumnService.updateColumn(columnId, body, userPseudo);

    ctx.response.status = 200;
    ctx.response.body = { success: true, data: updatedColumn };
});

/**
 * PATCH /columns/:columnId/position - Modifier la position d'une colonne
 * @param columnId l'id de la colonne à modifier
 * @param body les données de la colonne à modifier (nouvelle position)
 * @return void
 * @throws 401 si l'utilisateur n'est pas authentifié
 * @throws 404 si la colonne cible n'existe pas ou si l'utilisateur n'est pas membre du tableau auquel appartient la colonne
 * @throws 500 si une erreur interne se produit lors de la modification de la position de la colonne depuis Tomcat
 * @throws 500 si les données retournées par Tomcat ne sont pas conformes à BoardColumnDto
 */
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