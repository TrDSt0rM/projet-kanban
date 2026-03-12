import { Router } from "@oak/oak";
import { isLoginDto } from "../../shared/utils/typeguards.ts";
import { authService } from "../../shared/container.ts"
import { APIErrorCode, APIException, APIResponse } from "../../shared/types/mod.ts";
import { LoginResponseDto } from "./auth.types.ts";

export const router = new Router({ prefix: "/auth" });

router.post("/login", async (ctx) => {
    try {
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

    } catch (err) {
        console.error(err);
        throw new APIException(APIErrorCode.INTERNAL_SERVER_ERROR, 500, "Internal server error");
    }
});