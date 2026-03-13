import { Router } from "@oak/oak";
import { isLoginDto, isRegisterDto } from "../../shared/utils/typeguards.ts";
import { authService } from "../../shared/container.ts"
import { APIErrorCode, APIException, APIResponse } from "../../shared/types/mod.ts";
import { LoginResponseDto } from "./auth.types.ts";

export const router = new Router({ prefix: "/auth" });

/**
 * Route de connexion d'un utilisateur
 * @route POST /auth/login
 * @body { pseudo: string, password: string }
 * @response 200 - Connexion réussie avec un token JWT
 * @response 400 - Requête invalide (ex: données manquantes ou invalides)
 * @response 401 - Pseudo ou mot de passe incorrect
 * @response 403 - Utilisateur inactif
 * @response 404 - Utilisateur non trouvé
 * @response 500 - Erreur interne du serveur
 * 
 * Cette route permet à un utilisateur de se connecter en fournissant son pseudo et son mot de passe.
 * Si les informations sont correctes, un token JWT est généré et renvoyé dans la réponse.
 */
router.post("/login", async (ctx) => {
        const body = await ctx.request.body.json();
        
        // typeguard
        if (!isLoginDto(body)){
            throw new APIException(APIErrorCode.BAD_REQUEST, 400, "Invalid request body");
        }

        // appel du service de connexion
        const result = await authService.login(body.pseudo, body.password);
        
        // construction et envoie de la reponse
        const responseBody: APIResponse<LoginResponseDto> = {
            success: true,
            data: result,
        };

        ctx.response.status = 200;
        ctx.response.body = responseBody;

});

/**
 * Route d'enregistrement d'un nouvel utilisateur
 * @route POST /auth/register
 * @body { pseudo: string, password: string }
 * @response 201 - Utilisateur créé avec succès
 * @response 400 - Requête invalide (ex: données manquantes ou invalides)
 * @response 500 - Erreur interne du serveur
 * 
 * Cette route permet à un nouvel utilisateur de s'enregistrer en fournissant un pseudo et un mot de passe.
 */
router.post("/register", async (ctx) => {
    try {
        const body = await ctx.request.body.json();

        // typeguard

        if (!isRegisterDto(body)){
            throw new APIException(APIErrorCode.BAD_REQUEST, 400, "Invalid request body");
        }

        // appel du service d'enregistrement
        const result = await authService.register(body.pseudo, body.password);

        if (!result) {
            throw new APIException(APIErrorCode.BAD_REQUEST, 400, "Failed to register user");
        }
        // construction et envoie de la reponse
        const responseBody: APIResponse<null> = {
            success: true,
            data: null,
        };

        ctx.response.status = 201;
        ctx.response.body = responseBody;

    } catch (err) {
        if (err instanceof APIException) {
            ctx.response.status = err.status;
            ctx.response.body = { success: false, error: { code: err.code, message: err.message } };
        } else {
            console.error(err);
            ctx.response.status = 500;
            ctx.response.body = { success: false, error: { code: APIErrorCode.INTERNAL_SERVER_ERROR, message: "Erreur serveur" } };
        }
    }
});