import { Router } from "@oak/oak";
import { authMiddleware } from "../../shared/middlewares/auth.middleware.ts";
import { commentService } from "../../shared/container.ts";
import { 
    APIException, APIErrorCode, APIResponse, 
    CommentDto
} from "../../shared/types/mod.ts";

export const router = new Router();

router.use(authMiddleware);

/**
 * POST /tasks/:taskId/comments - Créer un commentaire sur une tâche
 * @param taskId l'id de la tâche sur laquelle créer le commentaire
 * @param body les données du commentaire à créer (contenu)
 * @return le commentaire créé
 * @throws 401 si l'utilisateur n'est pas authentifié
 * @throws 403 si l'utilisateur n'est pas membre du tableau auquel appartient la tâche
 * @throws 404 si la tâche cible n'existe pas
 * @throws 500 si une erreur interne se produit lors de la création du commentaire depuis Tomcat
 * @throws 500 si les données retournées par Tomcat ne sont pas conformes à CommentDto
 */
router.post("/tasks/:taskId/comments", async (ctx) => {
    const taskId = ctx.params.taskId!;
    const userPseudo = ctx.state.user?.pseudo;
    
    // Vérification de l'authentification de l'utilisateur
    if (!userPseudo) {
        throw new APIException(APIErrorCode.UNAUTHORIZED, 401, "Utilisateur non authentifié");
    }

    // Récupération des données de la requête
    const body = await ctx.request.body.json();

    const comment = await commentService.createComment(taskId, body, userPseudo);

    // Construction de la réponse
    const responseBody : APIResponse<CommentDto> = {
        success: true,
        data: comment,
    }    
    ctx.response.status = 201;
    ctx.response.body = responseBody;
});

router.get("/tasks/:taskId/comments", async (ctx) => {
    const taskId = ctx.params.taskId!;
    const userPseudo = ctx.state.user?.pseudo;

    // Vérification de l'authentification de l'utilisateur
    if (!userPseudo) {
        throw new APIException(APIErrorCode.UNAUTHORIZED, 401, "Utilisateur non authentifié");
    }
    
    // Récupération des commentaires de la tâche depuis le service avec l'id de la tâche
    const comments = await commentService.getCommentsByTaskId(taskId, userPseudo);

    // Construction de la réponse
    const responseBody : APIResponse<CommentDto[]> = {
        success: true,
        data: comments,
    }
    
    // Envoie de la réponse
    ctx.response.status = 200;
    ctx.response.body = responseBody;
});

router.put("/tasks/:taskId/comments/:commentId", async (ctx) => {
    const taskId = ctx.params.taskId!;
    const commentId = ctx.params.commentId!;
    const userPseudo = ctx.state.user?.pseudo;
    
    // Vérification de l'authentification de l'utilisateur
    if (!userPseudo) {
        throw new APIException(APIErrorCode.UNAUTHORIZED, 401, "Utilisateur non authentifié");
    }

    // Récupération des données de la requête
    const body = await ctx.request.body.json();

    const updatedComment = await commentService.updateComment(taskId, commentId, body, userPseudo);
    
    // Construction de la réponse
    const responseBody : APIResponse<CommentDto> = {
        success: true,
        data: updatedComment,
    }    
    ctx.response.status = 200;
    ctx.response.body = responseBody;
});

router.post("/tasks/:taskId/comments/:commentId/attachments", async (ctx) => {
    const taskId = ctx.params.taskId!;
    const commentId = ctx.params.commentId!;
    const userPseudo = ctx.state.user?.pseudo;
    
    // Vérification de l'authentification de l'utilisateur
    if (!userPseudo) {
        throw new APIException(APIErrorCode.UNAUTHORIZED, 401, "Utilisateur non authentifié");
    }

    // Récupération des données de la requête
    const body = await ctx.request.body.json();

    const updatedComment = await commentService.addAttachmentToComment(taskId, commentId, body, userPseudo);

    // Construction de la réponse
    const responseBody : APIResponse<CommentDto> = {
        success: true,
        data: updatedComment,
    }    
    ctx.response.status = 200;
    ctx.response.body = responseBody;
});