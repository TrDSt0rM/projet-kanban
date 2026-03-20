import { Router } from "@oak/oak";
import { authMiddleware } from "../../shared/middlewares/auth.middleware.ts";
import { commentService } from "../../shared/container.ts";
import { 
    APIException, APIErrorCode, APIResponse, 
    CommentDto,
    AttachmentDto
} from "../../shared/types/mod.ts";

export const router = new Router();

router.use(authMiddleware);

/**
 * POST /tasks/:taskId/comments - Créer un commentaire sur une tâche
 * @param taskId l'id de la tâche sur laquelle créer le commentaire
 * @param body les données du commentaire à créer (message)
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

/**
 * GET /tasks/:taskId/comments - Récupérer les commentaires d'une tâche
 * @param taskId l'id de la tâche dont on veut récupérer les commentaires
 * @return les commentaires de la tâche correspondant à l'id
 * @throws 401 si l'utilisateur n'est pas authentifié
 * @throws 403 si l'utilisateur n'est pas membre du tableau auquel appartient la tâche
 * @throws 404 si la tâche cible n'existe pas ou si l'utilisateur n'est pas membre du tableau
 * @throws 500 si une erreur interne se produit lors de la récupération des commentaires depuis Tomcat
 * @throws 500 si les données retournées par Tomcat ne sont pas conformes à CommentDto[]
 */
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

/**
 * PUT /tasks/:taskId/comments/:commentId - Mettre à jour un commentaire d'une tâche
 * @param taskId l'id de la tâche à laquelle appartient le commentaire
 * @param commentId l'id du commentaire à mettre à jour
 * @param body les données du commentaire à mettre à jour (message)
 * @return le commentaire mis à jour
 * @throws 401 si l'utilisateur n'est pas authentifié
 * @throws 403 si l'utilisateur n'est pas membre du tableau auquel appartient la tâche ou si l'utilisateur n'est pas l'auteur du commentaire
 * @throws 404 si la tâche cible n'existe pas ou si le commentaire cible n'existe pas ou si l'utilisateur n'est pas membre du tableau
 * @throws 500 si une erreur interne se produit lors de la mise à jour du commentaire depuis Tomcat
 * @throws 500 si les données retournées par Tomcat ne sont pas conformes à CommentDto
 */
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

/**
 * DELETE /tasks/:taskId/comments/:commentId - Supprimer un commentaire d'une tâche
 * @param taskId l'id de la tâche à laquelle appartient le commentaire
 * @param commentId l'id du commentaire à supprimer
 * @return null
 * @throws 401 si l'utilisateur n'est pas authentifié
 * @throws 403 si l'utilisateur n'est pas membre du tableau auquel appartient la tâche ou si l'utilisateur n'est pas l'auteur du commentaire
 * @throws 404 si la tâche cible n'existe pas ou si le commentaire cible n'existe pas ou si l'utilisateur n'est pas membre du tableau
 * @throws 500 si une erreur interne se produit lors de la suppression du commentaire depuis Tomcat
 */
router.delete("/tasks/:taskId/comments/:commentId", async (ctx) => {
    const taskId = ctx.params.taskId!;
    const commentId = ctx.params.commentId!;
    const userPseudo = ctx.state.user?.pseudo;
    
    // Vérification de l'authentification de l'utilisateur
    if (!userPseudo) {
        throw new APIException(APIErrorCode.UNAUTHORIZED, 401, "Utilisateur non authentifié");
    }

    await commentService.deleteComment(taskId, commentId, userPseudo);

    // Construction de la réponse
    const responseBody : APIResponse<null> = {
        success: true,
        data: null,
    }    
    ctx.response.status = 200;
    ctx.response.body = responseBody;
});

/**
 * POST /tasks/:taskId/comments/:commentId/attachments - Ajouter une pièce jointe à un commentaire
 * @param taskId l'id de la tâche à laquelle appartient le commentaire
 * @param commentId l'id du commentaire auquel ajouter la pièce jointe
 * @param body les données de la pièce jointe à ajouter (nom du fichier, empreinte)
 * @return le commentaire mis à jour avec la nouvelle pièce jointe
 * @throws 401 si l'utilisateur n'est pas authentifié
 * @throws 403 si l'utilisateur n'est pas membre du tableau auquel appartient la tâche ou si l'utilisateur n'est pas l'auteur du commentaire
 * @throws 404 si la tâche cible n'existe pas ou si le commentaire cible n'existe pas ou si l'utilisateur n'est pas membre du tableau
 * @throws 500 si une erreur interne se produit lors de l'ajout de la pièce jointe depuis Tomcat
 * @throws 500 si les données retournées par Tomcat ne sont pas conformes à CommentDto
 */
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

router.post("/tasks/:taskId/attachments", async (ctx) => {
    const taskId = ctx.params.taskId!;
    const userPseudo = ctx.state.user?.pseudo;
    
    // Vérification de l'authentification de l'utilisateur
    if (!userPseudo) {
        throw new APIException(APIErrorCode.UNAUTHORIZED, 401, "Utilisateur non authentifié");
    }
    
    // Récupération des données de la requête
    const body = await ctx.request.body.json();

    const attachment = await commentService.addAttachmentToTask(taskId, body, userPseudo);
    
    // Construction de la réponse
    const responseBody : APIResponse<AttachmentDto> = {
        success: true,
        data: attachment
    };
    ctx.response.status = 201;
    ctx.response.body = responseBody;
});

/**
 * GET /tasks/:taskId/attachments - Récupérer les pièces jointes d'une tâche
 * @param taskId l'id de la tâche dont on veut récupérer les pièces jointes
 * @return les pièces jointes de la tâche correspondant à l'id
 * @throws 401 si l'utilisateur n'est pas authentifié
 * @throws 403 si l'utilisateur n'est pas membre du tableau auquel appartient la tâche
 * @throws 404 si la tâche cible n'existe pas ou si l'utilisateur n'est pas membre du tableau
 * @throws 500 si une erreur interne se produit lors de la récupération des pièces jointes depuis Tomcat
 * @throws 500 si les données retournées par Tomcat ne sont pas conformes à AttachmentDto[]
 */
router.get("/tasks/:taskId/attachments", async (ctx) => {
    const taskId = ctx.params.taskId!;
    const userPseudo = ctx.state.user?.pseudo;
    
    // Vérification de l'authentification de l'utilisateur
    if (!userPseudo) {
        throw new APIException(APIErrorCode.UNAUTHORIZED, 401, "Utilisateur non authentifié");
    }
    
    // Récupération des pièces jointes de la tâche depuis le service avec l'id de la tâche
    const attachments = await commentService.getAttachmentsByTaskId(taskId, userPseudo);

    // Construction de la réponse
    const responseBody : APIResponse<AttachmentDto[]> = {
        success: true,
        data: attachments,
    }    
    ctx.response.status = 200;
    ctx.response.body = responseBody;
});

/**
 * DELETE /tasks/:taskId/attachments/:attachmentId - Supprimer une pièce jointe d'une tâche
 * @param taskId l'id de la tâche à laquelle appartient la pièce jointe
 * @param attachmentId l'id de la pièce jointe à supprimer
 * @return null
 * @throws 401 si l'utilisateur n'est pas authentifié
 * @throws 403 si l'utilisateur n'est pas membre du tableau auquel appartient la tâche ou si l'utilisateur n'est pas l'auteur de la pièce jointe
 * @throws 404 si la tâche cible n'existe pas ou si la pièce jointe cible n'existe pas ou si l'utilisateur n'est pas membre du tableau
 * @throws 500 si une erreur interne se produit lors de la suppression de la pièce jointe depuis Tomcat
 */
router.delete("/tasks/:taskId/attachments/:attachmentId", async (ctx) => {
    const taskId = ctx.params.taskId!;
    const attachmentId = ctx.params.attachmentId!;
    const userPseudo = ctx.state.user?.pseudo;
    
    // Vérification de l'authentification de l'utilisateur
    if (!userPseudo) {
        throw new APIException(APIErrorCode.UNAUTHORIZED, 401, "Utilisateur non authentifié");
    }

    // Suppression de la pièce jointe depuis le service
    await commentService.deleteAttachmentFromTask(taskId, attachmentId, userPseudo);

    // Construction de la réponse
    const responseBody : APIResponse<null> = {
        success: true,
        data: null,
    }    
    ctx.response.status = 200;
    ctx.response.body = responseBody;
});

/**
 * GET /files/:fileId - Télécharger/Voir une pièce jointe
 */
router.get("/files/:fileId", async (ctx) => {
    const fileId = ctx.params.fileId!;
    const userPseudo = ctx.state.user?.pseudo;

    if (!userPseudo) {
        throw new APIException(APIErrorCode.UNAUTHORIZED, 401, "Non authentifié");
    }

    try {
        // On récupère la réponse brute du serveur Tomcat
        const fileResponse = await commentService.getAttachmentFile(fileId, userPseudo);
        
        // On transfère les headers importants (Type de fichier, Content-Length)
        ctx.response.type = fileResponse.headers.get("Content-Type") || "application/octet-stream";
        
        // On envoie le corps du fichier
        ctx.response.body = fileResponse.body;
    } catch (err) {
        ctx.response.status = 404;
        ctx.response.body = { success: false, message: "Fichier introuvable" };
    }
});


