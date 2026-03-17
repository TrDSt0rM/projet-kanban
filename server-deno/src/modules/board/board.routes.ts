/**
 * @file server-deno/src/modules/board/board.routes.ts
 * @description This file contains the routes for the board-related operations.
 * @version 1.0.0
 * @date 2026-03-16
 */
import { Router } from "@oak/oak";
import { authMiddleware } from "../../shared/middlewares/auth.middleware.ts";
import { boardService } from "../../shared/container.ts";
import { isCreateBoardRequest, isUpdateBoardRequest } from "../../shared/utils/typeguards.ts";
import { 
    APIException, APIErrorCode, APIResponse, 
    BoardDto, BoardMemberDto 
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
 * @throws 500 si les données retournées par Tomcat ne sont pas conformes à BoardDto
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
    const responseBody : APIResponse<BoardDto[]> = {
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
 * @throws 500 si les données retournées par Tomcat ne sont pas conformes à BoardDto
 */
router.get("/:boardId", async (ctx) => {
    const boardId = ctx.params.boardId!;
    const board = await boardService.getBoardById(boardId);

    const responseBody : APIResponse<BoardDto> = {
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
    if(! isCreateBoardRequest(createdBoardRequest)){
        throw new APIException(APIErrorCode.VALIDATION_ERROR, 400, "Données de création de tableau invalides");
    }

    // Vérification que le pseudo de l'utilisateur est présent dans le contexte
    const userPseudo = ctx.state.user?.pseudo;
    if (!userPseudo) {
        throw new APIException(APIErrorCode.UNAUTHORIZED, 401, "Utilisateur non authentifié");
    }

    // Création du tableau en utilisant le service de tableau et récupération du tableau créé
    const createdBoard = await boardService.createBoard(createdBoardRequest, userPseudo);

    // Création de la réponse avec le tableau créé
    const responseBody : APIResponse<BoardDto> = {
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

    if (!userPseudo) {
        throw new APIException(APIErrorCode.UNAUTHORIZED, 401, "Utilisateur non authentifié");
    }

    if (!isUpdateBoardRequest(updateBoardRequest)) {
        throw new APIException(APIErrorCode.VALIDATION_ERROR, 422, "Données de mise à jour de tableau invalides");
    }

    const response = await boardService.modifyBoard(boardId);

    const responseBody : APIResponse<BoardDto> = {
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

    // Récupération du board depuis le service avec l'id du tableau
    const board = await boardService.getBoardById(boardId);

    //contrôle que le pseudo de l'utilisateur correspond au propriétaire du tableau
    if (board.owner !== userPseudo) {
        throw new APIException(APIErrorCode.FORBIDDEN, 403, "Seul le propriétaire du tableau peut le supprimer");
    }

    await boardService.deleteBoard(boardId);

    const responseBody : APIResponse<null> = {
        success: true,
        data: null,
    };
    ctx.response.status = 200;
    ctx.response.body = responseBody;
});

/**
 * Récupère les membres d'un tableau à partir de l'id du tableau
 * @route GET /boards/:id/members
 * @param id l'id du tableau dont on veut récupérer les membres
 * @returns les membres du tableau correspondant à l'id
 * @throws 404 si aucun tableau ne correspond à l'id
 * @throws 500 si une erreur interne se produit lors de la récupération des membres depuis Tomcat
 * @throws 500 si les données retournées par Tomcat ne sont pas conformes à BoardMemberDto
 */
router.get("/:id/members", async (ctx) => {
    const boardId = ctx.params.id!;
    
    const members = await boardService.getBoardMembers(boardId);

    const responseBody : APIResponse<BoardMemberDto[]> = {
        success: true,
        data: members,
    };

    ctx.response.status = 200;
    ctx.response.body = responseBody;
});

/**
 * Supprime un membre d'un tableau à partir de l'id du tableau et du pseudo de l'utilisateur à supprimer. Seul le propriétaire du tableau peut supprimer un membre.
 * @route DELETE /boards/:id/members/:userPseudo
 * @param id l'id du tableau dont on veut supprimer un membre
 * @param userPseudo le pseudo de l'utilisateur à supprimer du tableau
 * @returns null si la suppression a réussi, sinon lance une APIException avec un message d'erreur approprié
 * @throws 401 si l'utilisateur n'est pas authentifié
 * @throws 403 si l'utilisateur n'est pas le propriétaire du tableau
 * @throws 500 si une erreur interne se produit lors de la suppression du membre dans Tomcat
 */
router.delete("/:id/members/:userPseudo", async (ctx) => {
    const boardId = ctx.params.id!;
    const userPseudo = ctx.params.userPseudo!;

    // check si l'utilsateur est le propriétaire du tableau
    const board = await boardService.getBoardById(boardId);
    if (board.owner !== ctx.state.user.pseudo) {
        throw new APIException(APIErrorCode.FORBIDDEN, 403, "Seul le propriétaire du tableau peut supprimer un membre");
    }

    await boardService.removeBoardMember(boardId, userPseudo);
    
    const responseBody : APIResponse<null> = {
        success: true,
        data: null,
    };

    ctx.response.status = 200;
    ctx.response.body = responseBody;
});    