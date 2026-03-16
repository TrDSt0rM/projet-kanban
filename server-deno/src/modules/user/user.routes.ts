/**
 * @file server-deno/src/modules/user/user.routes.ts
 * @description This file contains the routes for the user-related operations.
 * @version 1.0.0
 * @date 2026-03-11
 */
import { Router } from "@oak/oak";
import { authMiddleware } from "../../shared/middlewares/auth.middleware.ts";
import { userService } from "../../shared/container.ts";
import { APIException, APIErrorCode, APIResponse, UserDto } from "../../shared/types/mod.ts";
import { isUpdateUserRequest } from "../../shared/utils/typeguards.ts";

export const router = new Router({ prefix: "/users" });

router.use(authMiddleware);

/**
 * Récupère un utilisateur à partir de son pseudo
 * @route GET /users/:pseudo
 * @param pseudo le pseudo de l'utilisateur à récupérer
 * @returns l'utilisateur correspondant au pseudo
 * @throws 404 si aucun utilisateur ne correspond au pseudo
 * @throws 500 si une erreur interne se produit lors de la récupération de l'utilisateur depuis Tomcat
 * @throws 500 si les données retournées par Tomcat ne sont pas conformes à UserDto
 */
router.get("/:pseudo", async (ctx) => {
    const pseudo = ctx.params.pseudo;

    const response = await userService.getUserByPseudo(pseudo);

    const responseBody : APIResponse<UserDto> = {
        success: true,
        data: response,
    }

    ctx.response.status = 200;
    ctx.response.body = responseBody;
});

// router.post("/", async (ctx) => {}); Méthode de création d'utilisateur non nécessaire 
// car les utilisateurs sont créés via la méthode register de l'authentification 

/**
 * Met à jour un utilisateur à partir de son pseudo et des données de mise à jour (role et/ou isActive)
 * @route PUT /users/:pseudo
 * @param pseudo le pseudo de l'utilisateur à mettre à jour
 * @param updateUserRequest les modifications à apporter à l'utilisateur (role et/ou isActive)
 * @returns l'utilisateur mis à jour
 * @throws 400 si les données de mise à jour de l'utilisateur sont invalides
 * @throws 401 si l'utilisateur n'est pas autorisé à modifier cet utilisateur (non admin ou pseudo différent du token)
 * @throws 500 si une erreur interne se produit lors de la mise à jour de l'utilisateur dans Tomcat
 * @throws 500 si les données retournées par Tomcat ne sont pas conformes à UserDto
 */
router.put("/:pseudo", async (ctx) => {
    const pseudo = ctx.params.pseudo;
    const updateUserRequest = await ctx.request.body.json();

    if (!isUpdateUserRequest(updateUserRequest)) {
        throw new APIException(APIErrorCode.BAD_REQUEST, 400, "Données de requête invalides");
    }

    // Vérification que l'utilisateur est admin ou que le pseudo de l'utilisateur correspond à celui du token
    if (ctx.state.user.role !== "admin" && ctx.state.user.pseudo !== pseudo) {
        throw new APIException(APIErrorCode.UNAUTHORIZED, 401, "Vous n'êtes pas autorisé à modifier cet utilisateur");
    }

    const reponse = await userService.updateUser(pseudo, updateUserRequest);
    
    const responseBody : APIResponse<UserDto> = {
        success: true,
        data: reponse,
    }

    ctx.response.status = 200;
    ctx.response.body = responseBody;
});

/**
 * Supprime un utilisateur à partir de son pseudo
 * @route DELETE /users/:pseudo
 * @param pseudo le pseudo de l'utilisateur à supprimer
 * @returns null si la suppression a réussi
 * @throws 401 si l'utilisateur n'est pas autorisé à supprimer cet utilisateur (non admin ou pseudo différent du token)
 * @throws 500 si une erreur interne se produit lors de la suppression de l'utilisateur dans Tomcat
 * @throws 500 si les données retournées par Tomcat ne sont pas conformes à UserDto
 */
router.delete("/:pseudo", async (ctx) => {
    if (!(ctx.state.user.pseudo == ctx.params.pseudo) || (ctx.state.user.role != "admin")) {
        throw new APIException(APIErrorCode.UNAUTHORIZED, 401, "Vous n'êtes pas autorisé à supprimer cet utilisateur");
    }
    
    await userService.deleteUser(ctx.params.pseudo);

    const responseBody : APIResponse<null> = {
        success: true,
        data: null,
    }
    
    ctx.response.status = 200;
    ctx.response.body = responseBody;
});
