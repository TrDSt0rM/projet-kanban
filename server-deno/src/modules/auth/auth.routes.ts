import { Router } from "@oak/oak";
import { isLoginDto } from "../../shared/utils/typeguards.ts";
import { authService } from "../../shared/container.ts"

const router = new Router({ prefix: "/auth" });

router.post("/login", async (ctx) => {
    try {
        const body = await ctx.request.body.json();
        
        // typeguard
        if (!isLoginDto(body)){
            ctx.response.status = 400;
            ctx.response.body = { message: "Invalid request." };
            return;
        }

        const result = await authService.login(body.pseudo);
        
        ctx.response.status = 200;
        ctx.response.body = {
            success: true,
            data: result,
        }
    } catch (err) {
        console.error(err);
        ctx.response.status = 500;
        ctx.response.body = { message: "Fail to login." };   
    }
});