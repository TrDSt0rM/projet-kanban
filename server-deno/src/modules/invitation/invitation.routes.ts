import { Router } from "@oak/oak";
import { authMiddleware } from "../../shared/middlewares/auth.middleware.ts";
import { invitationService } from "../../shared/container.ts";
import { 
    APIException, APIErrorCode, APIResponse, 
    InvitationDto
} from "../../shared/types/mod.ts";

export const router = new Router();

router.use(authMiddleware);

router.post("/boards/:boardId/invitations", async (ctx) => {
    const boardId = ctx.params.boardId!;
    const userPseudo = ctx.state.user?.pseudo;

    if (!userPseudo) {
        throw new APIException(APIErrorCode.UNAUTHORIZED, 401, "Utilisateur non authentifié");
    }

    // Récupération des données de la requête
    const invitationRequest = await ctx.request.body.json();
    const invitation = await invitationService.createInvitation(boardId, invitationRequest, userPseudo);

    const responseBody : APIResponse<InvitationDto> = {
        success: true,
        data: invitation,
    }
    
    ctx.response.status = 201;
    ctx.response.body = responseBody;
});

router.get("/invitations", async (ctx) => {
    const userPseudo = ctx.state.user?.pseudo;

    if (!userPseudo) {
        throw new APIException(APIErrorCode.UNAUTHORIZED, 401, "Utilisateur non authentifié");
    }

    const invitations = await invitationService.getInvitationsByUserPseudo(userPseudo);

    const responseBody : APIResponse<InvitationDto[]> = {
        success: true,
        data: invitations,
    }

    ctx.response.status = 200;
    ctx.response.body = responseBody;
});

router.post("/invitations/:boardId/accept", async (ctx) => {
    const boardId = ctx.params.boardId!;
    const userPseudo = ctx.state.user?.pseudo;

    if (!userPseudo) {
        throw new APIException(APIErrorCode.UNAUTHORIZED, 401, "Utilisateur non authentifié");
    }

    await invitationService.acceptInvitation(boardId, userPseudo);

    const responseBody : APIResponse<null> = {
        success: true,
        data: null,
    }
    ctx.response.status = 200;
    ctx.response.body = responseBody;
});

router.delete("/invitations/:boardId", async (ctx) => {
    const boardId = ctx.params.boardId!;
    const userPseudo = ctx.state.user?.pseudo;

    if (!userPseudo) {
        throw new APIException(APIErrorCode.UNAUTHORIZED, 401, "Utilisateur non authentifié");
    }

    await invitationService.declineInvitation(boardId, userPseudo);

    const responseBody : APIResponse<null> = {
        success: true,
        data: null,
    }
    ctx.response.status = 200;
    ctx.response.body = responseBody;
});

router.delete("/boards/:boardId/invitations/:userPseudo", async (ctx) => {
    const boardId = ctx.params.boardId!;
    const userPseudoToCancel = ctx.params.userPseudo!;
    const userPseudo = ctx.state.user?.pseudo;
    
    if (!userPseudo) {
        throw new APIException(APIErrorCode.UNAUTHORIZED, 401, "Utilisateur non authentifié");
    }

    await invitationService.cancelInvitation(boardId, userPseudoToCancel, userPseudo);

    const responseBody : APIResponse<null> = {
        success: true,
        data: null,
    }
    ctx.response.status = 200;
    ctx.response.body = responseBody;
});
