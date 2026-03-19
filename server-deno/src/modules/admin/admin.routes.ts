/**
 * @file server-deno/src/modules/admin/admin.routes.ts
 */
import { Router } from "@oak/oak";
import { authMiddleware, adminOnlyMiddleware } from "../../shared/middlewares/auth.middleware.ts";
import { adminService } from "../../shared/container.ts";
import { APIException, APIErrorCode, APIResponse, UserDto } from "../../shared/types/mod.ts";

export const router = new Router({ prefix: "/admin" });

// Toutes les routes admin nécessitent d'être connecté
router.use(authMiddleware);

/**
 * GET /admin/users - Récupérer tous les utilisateurs (admin only)
 * @returns la liste de tous les utilisateurs du système
 * @throws 401 si l'utilisateur n'est pas authentifié ou n'est pas admin
 * @throws 500 si une erreur interne se produit lors de la récupération des utilisateurs depuis Tomcat
 * @throws 500 si les données retournées par Tomcat ne sont pas conformes à UserDto[]
 */
router.get("/users", adminOnlyMiddleware, async (ctx) => {
    const adminPseudo = ctx.state.user?.pseudo;

    // Vérification de l'authentification de l'utilisateur
    if (!adminPseudo) {
        throw new APIException(APIErrorCode.UNAUTHORIZED, 401, "Utilisateur non authentifié");
    }

    // Récupération de tous les utilisateurs depuis le service
    const users = await adminService.getAllUsers();

    // Construction de la réponse
    const responseBody: APIResponse<UserDto[]> = {
        success: true,
        data: users,
    };
    ctx.response.status = 200;
    ctx.response.body = responseBody;
});

/**
 * PATCH /admin/users/:pseudo - Modifier un utilisateur (role/isActive)
 * @param pseudo le pseudo de l'utilisateur à modifier
 * @param body les données à modifier (role et/ou isActive)
 * @returns les informations mises à jour de l'utilisateur
 * @throws 401 si l'utilisateur n'est pas authentifié ou n'est pas admin
 * @throws 404 si l'utilisateur cible n'existe pas
 * @throws 500 si une erreur interne se produit lors de la mise à jour de l'utilisateur depuis Tomcat
 */
router.patch("/users/:pseudo", adminOnlyMiddleware, async (ctx) => {
    const adminPseudo = ctx.state.user?.pseudo;
    const targetPseudo = ctx.params.pseudo!;

    if (!adminPseudo) {
        throw new APIException(APIErrorCode.UNAUTHORIZED, 401, "Utilisateur non authentifié");
    }

    // Récupération des données de la requête
    const body = await ctx.request.body.json();

    // Mise à jour de l'utilisateur depuis le service
    const updatedUser = await adminService.updateUser(targetPseudo, body);

    // Construction de la réponse
    const responseBody: APIResponse<UserDto> = {
        success: true,
        data: updatedUser,
    };
    ctx.response.status = 200;
    ctx.response.body = responseBody;
});

/**
 * DELETE /admin/users/:pseudo - Supprimer un utilisateur
 * @param pseudo le pseudo de l'utilisateur à supprimer
 * @returns une réponse indiquant la suppression réussie
 * @throws 401 si l'utilisateur n'est pas authentifié ou n'est pas admin
 * @throws 404 si l'utilisateur cible n'existe pas
 * @throws 500 si une erreur interne se produit lors de la suppression de l'utilisateur depuis Tomcat
 */
router.delete("/users/:pseudo", adminOnlyMiddleware, async (ctx) => {
    const adminPseudo = ctx.state.user?.pseudo;
    const targetPseudo = ctx.params.pseudo!;

    // Vérification de l'authentification de l'utilisateur
    if (!adminPseudo) {
        throw new APIException(APIErrorCode.UNAUTHORIZED, 401, "Utilisateur non authentifié");
    }

    // Suppression de l'utilisateur depuis le service
    await adminService.deleteUser(targetPseudo);

    // Construction de la réponse
    const responseBody: APIResponse<null> = {
        success: true,
        data: null,
    };
    ctx.response.status = 200;
    ctx.response.body = responseBody;
});

router.patch("/users/:pseudo/role", adminOnlyMiddleware, async (ctx) => {
    const targetPseudo = ctx.params.pseudo!;
    const { role } = await ctx.request.body.json();
    await adminService.updateRole(targetPseudo, role);
    ctx.response.status = 200;
    ctx.response.body = { success: true };
});