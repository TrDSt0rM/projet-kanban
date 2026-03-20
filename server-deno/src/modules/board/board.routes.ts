/**
 * @file server-deno/src/modules/board/board.routes.ts
 * @description This file contains the routes for the board-related operations.
 * @version 1.0.0
 * @date 2026-03-16
 */
import { Router } from "@oak/oak";
import { authMiddleware } from "../../shared/middlewares/auth.middleware.ts";
import { boardService } from "../../shared/container.ts";
import { 
    APIException, APIErrorCode, APIResponse, 
    BoardDetailDto, BoardSummaryDto,
    BoardMemberDto
} from "../../shared/types/mod.ts";

export const router = new Router({ prefix: "/boards" });

router.use(authMiddleware);

/**
 * Récupère tous les tableau d'un utilisateur à partir de son pseudo (propriétaire ou collaborateur)
 * @route GET /boards
 * @param pseudo le pseudo de l'utilisateur dont on veut récupérer les tableaux
 * @returns les tableaux correspondant au pseudo de l'utilisateur
 * @throws 404 si aucun tableau ne correspond au pseudo de l'utilisateur
 * @throws 500 si une erreur interne se produit lors de la récupération du tableau depuis Tomcat
 * @throws 500 si les données retournées par Tomcat ne sont pas conformes à BoardSummaryDto
 */
router.get("/", async (ctx) => {

    // Récupération du pseudo depuis les paramètres de l'URL
    const userPseudo = ctx.state.user?.pseudo;
    if (!userPseudo) {
        throw new APIException(APIErrorCode.UNAUTHORIZED, 401, "Utilisateur non authentifié");
    }
    // Récupération des tableaux depuis le service avec le pseudo de l'utilisateur
    const boards = await boardService.getBoardByPseudo(userPseudo);

    // Construction de la réponse
    const responseBody : APIResponse<BoardSummaryDto[]> = {
        success: true,
        data: boards,
    }
    
    // Envoi de la réponse
    ctx.response.status = 200;
    ctx.response.body = responseBody;
});

/**
 * Récupère un tableau à partir de son id
 * @route GET /boards/:boardId
 * @param boardId l'id du tableau à récupérer
 * @returns le tableau correspondant à l'id
 * @throws 404 si aucun tableau ne correspond à l'id
 * @throws 500 si une erreur interne se produit lors de la récupération du tableau depuis Tomcat
 * @throws 500 si les données retournées par Tomcat ne sont pas conformes à BoardDetailDto
 */
router.get("/:boardId", async (ctx) => {
    const boardId = ctx.params.boardId!;
    const userPseudo = ctx.state.user?.pseudo;

    // Vérification de l'authentification de l'utilisateur
    if (!userPseudo) {
        throw new APIException(APIErrorCode.UNAUTHORIZED, 401, "Utilisateur non authentifié");
    }

    // Récupération du tableau depuis le service avec l'id du tableau
    const board = await boardService.getBoardById(boardId, userPseudo);
    
    
    // Construction de la réponse
    const responseBody : APIResponse<BoardDetailDto> = {
        success: true,
        data: board,
    }
    ctx.response.status = 200;
    ctx.response.body = responseBody;
});

/**
 * Crée un tableau en envoyant une requête à Tomcat. Génère un id unique pour le tableau et construit le tableau à créer à partir des données reçues en paramètre.
 * @route POST /boards
 * @param request les données de la requête de création du tableau
 * @param owner le pseudo de l'utilisateur propriétaire du tableau
 * @returns renvoie le tableau créé si la création a réussi, sinon lance une APIException avec un message d'erreur approprié
 * @throws 400 si les données de création du tableau sont invalides
 * @throws 401 si l'utilisateur n'est pas authentifié
 * @throws 500 si une erreur interne se produit lors de la création du tableau dans Tomcat
 */
router.post("/", async (ctx) => {
    // Récupération des données de la requête
    const createdBoardRequest = await ctx.request.body.json();

    // Vérification que le pseudo de l'utilisateur est présent dans le contexte
    const userPseudo = ctx.state.user?.pseudo;
    if (!userPseudo) {
        throw new APIException(APIErrorCode.UNAUTHORIZED, 401, "Utilisateur non authentifié");
    }

    // Création du tableau en utilisant le service de tableau et récupération du tableau créé
    const createdBoard = await boardService.createBoard(createdBoardRequest, userPseudo);

    // Création de la réponse avec le tableau créé
    const responseBody : APIResponse<BoardSummaryDto> = {
        success: true,
        data: createdBoard,
    };
    ctx.response.status = 201;
    ctx.response.body = responseBody;
});

/**
 * Modifie un tableau à partir de son id. Seul le propriétaire du tableau peut modifier le tableau.
 * @route PUT /boards/:id
 * @param id l'id du tableau à modifier
 * @param request les données de la requête de modification du tableau
 * @returns le tableau modifié si la modification a réussi, sinon lance une APIException avec un message d'erreur approprié
 * @throws 400 si les données de modification du tableau sont invalides
 * @throws 401 si l'utilisateur n'est pas authentifié
 * @throws 403 si l'utilisateur n'est pas le propriétaire du tableau
 * @throws 500 si une erreur interne se produit lors de la modification du tableau dans Tomcat
 * @throws 500 si les données retournées par Tomcat ne sont pas conformes à BoardDto
 */
router.put("/:id", async (ctx) => {
    const boardId = ctx.params.id!;
    const userPseudo = ctx.state.user?.pseudo;
    const updateBoardRequest = await ctx.request.body.json();

    // Verifie si le token est valide et contient un pseudo d'utilisateur
    if (!userPseudo) {
        throw new APIException(APIErrorCode.UNAUTHORIZED, 401, "Utilisateur non authentifié");
    }

    // Modification du tableau en utilisant le service de tableau et récupération du tableau modifié
    const response = await boardService.modifyBoard(boardId, updateBoardRequest, userPseudo);

    // Création de la réponse avec le tableau modifié
    const responseBody : APIResponse<BoardSummaryDto> = {
        success: true,
        data: response,
    };

    ctx.response.status = 200;
    ctx.response.body = responseBody;
});

/**
 * Supprime un tableau à partir de son id. Seul le propriétaire du tableau peut supprimer le tableau.
 * @route DELETE /boards/:id
 * @param id l'id du tableau à supprimer
 * @returns null si la suppression a réussi, sinon lance une APIException avec un message d'erreur approprié
 * @throws 401 si l'utilisateur n'est pas authentifié
 * @throws 403 si l'utilisateur n'est pas le propriétaire du tableau
 * @throws 500 si une erreur interne se produit lors de la suppression du tableau dans Tomcat
 * @throws 500 si les données retournées par Tomcat ne sont pas conformes à BoardDto
 */
router.delete("/:id", async (ctx) => {

    const boardId = ctx.params.id!;
    const userPseudo = ctx.state.user?.pseudo;

    // Vérification que le pseudo de l'utilisateur est présent dans le contexte
    if (!userPseudo) {
        throw new APIException(APIErrorCode.UNAUTHORIZED, 401, "Utilisateur non authentifié");
    }

    // Suppression du tableau en utilisant le service de tableau et récupération du résultat de la suppression
    const result = await boardService.deleteBoard(boardId, userPseudo);

    // Verifie si la suppression a réussi
    if (!result) {
        throw new APIException(
            APIErrorCode.INTERNAL_SERVER_ERROR,
            500,
            "Erreur lors de la suppression du tableau",
        );
    }

    // Création de la réponse avec null pour indiquer que la suppression a réussi
    const responseBody : APIResponse<null> = {
        success: true,
        data: null,
    };
    ctx.response.status = 200;
    ctx.response.body = responseBody;
});

/**
 * Récupère les membres d'un tableau à partir de l'id du tableau. Seul les membres du tableau peuvent récupérer les membres du tableau.
 * @route GET /boards/:boardId/members
 * @param boardId l'id du tableau dont on veut récupérer les membres
 * @returns les membres du tableau si la récupération a réussi, sinon lance une APIException avec un message d'erreur approprié
 * @throws 401 si l'utilisateur n'est pas authentifié
 * @throws 403 si l'utilisateur n'est pas membre du tableau
 * @throws 404 si aucun tableau ne correspond à l'id
 * @throws 500 si une erreur interne se produit lors de la récupération des membres du tableau dans Tomcat
 * @throws 500 si les données retournées par Tomcat ne sont pas conformes à BoardMemberDto[]
 */
router.get("/:boardId/members", async (ctx) => {
    const boardId = ctx.params.boardId!;
    const userPseudo = ctx.state.user?.pseudo;

    // Vérification que le pseudo de l'utilisateur est présent dans le contexte
    if (!userPseudo) {
        throw new APIException(APIErrorCode.UNAUTHORIZED, 401, "Utilisateur non authentifié");
    }

    // Récupération des membres du tableau en utilisant le service de tableau et récupération des membres du tableau
    const members = await boardService.getBoardMembers(boardId, userPseudo);

    // Création de la réponse avec les membres du tableau
    const responseBody : APIResponse<BoardMemberDto[]> = {
        success: true,
        data: members,
    }
    ctx.response.status = 200;
    ctx.response.body = responseBody;
});

/**
 * Supprime un membre d'un tableau à partir de l'id du tableau et du pseudo de l'utilisateur à supprimer. Seul le propriétaire du tableau peut supprimer un membre.
 * @route DELETE /boards/:id/members/:memberPseudo
 * @param id l'id du tableau dont on veut supprimer un membre
 * @param userPseudo le pseudo de l'utilisateur à supprimer du tableau
 * @returns null si la suppression a réussi, sinon lance une APIException avec un message d'erreur approprié
 * @throws 401 si l'utilisateur n'est pas authentifié
 * @throws 403 si l'utilisateur n'est pas le propriétaire du tableau
 * @throws 500 si une erreur interne se produit lors de la suppression du membre dans Tomcat
 */
router.delete("/:id/members/:memberPseudo", async (ctx) => {
    const boardId = ctx.params.id!;
    const memberPseudo = ctx.params.memberPseudo!;
    const userPseudo = ctx.state.user?.pseudo;

    // Vérification que le pseudo de l'utilisateur est présent dans le contexte
    if (!userPseudo) {
        throw new APIException(APIErrorCode.UNAUTHORIZED, 401, "Utilisateur non authentifié");
    }

    // Suppression d'un membre du tableau en utilisant le service de tableau et récupération du résultat de la suppression
    await boardService.removeBoardMember(boardId, memberPseudo, userPseudo);

    // Création de la réponse avec null pour indiquer que la suppression a réussi
    const responseBody : APIResponse<null> = {
        success: true,
        data: null,
    };
    ctx.response.status = 200;
    ctx.response.body = responseBody;
});    
