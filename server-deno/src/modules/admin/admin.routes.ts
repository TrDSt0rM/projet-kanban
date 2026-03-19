/**
 * @file server-deno/src/modules/admin/admin.routes.ts
 */
import { Router } from "@oak/oak";
import { authMiddleware } from "../../shared/middlewares/auth.middleware.ts";
import { adminService } from "../../shared/container.ts";
import { APIException, APIErrorCode, APIResponse, UserDto } from "../../shared/types/mod.ts";

export const router = new Router({ prefix: "/admin" });

// Toutes les routes admin nécessitent d'être connecté
router.use(authMiddleware);

/**
 * Middleware interne pour vérifier le rôle ADMIN
 */
const checkAdminRole = (ctx: any, next: any) => {
    if (ctx.state.user?.role !== "ADMIN") {
        throw new APIException(APIErrorCode.FORBIDDEN, 403, "Accès réservé aux administrateurs");
    }
    return next();
};

// GET /admin/users - Liste tous les utilisateurs
router.get("/users", checkAdminRole, async (ctx) => {
    const adminPseudo = ctx.state.user.pseudo;
    const users = await adminService.getAllUsers(adminPseudo);

    const responseBody: APIResponse<UserDto[]> = {
        success: true,
        data: users,
    };
    ctx.response.status = 200;
    ctx.response.body = responseBody;
});

// PATCH /admin/users/:pseudo - Modifier un utilisateur (role/isActive)
router.patch("/users/:pseudo", checkAdminRole, async (ctx) => {
    const adminPseudo = ctx.state.user.pseudo;
    const targetPseudo = ctx.params.pseudo!;
    const body = await ctx.request.body.json();

    const updatedUser = await adminService.updateUser(adminPseudo, targetPseudo, body);

    const responseBody: APIResponse<UserDto> = {
        success: true,
        data: updatedUser,
    };
    ctx.response.status = 200;
    ctx.response.body = responseBody;
});

// DELETE /admin/users/:pseudo - Supprimer un utilisateur
router.delete("/users/:pseudo", checkAdminRole, async (ctx) => {
    const adminPseudo = ctx.state.user.pseudo;
    const targetPseudo = ctx.params.pseudo!;

    await adminService.deleteUser(adminPseudo, targetPseudo);

    const responseBody: APIResponse<null> = {
        success: true,
        data: null,
    };
    ctx.response.status = 200;
    ctx.response.body = responseBody;
});