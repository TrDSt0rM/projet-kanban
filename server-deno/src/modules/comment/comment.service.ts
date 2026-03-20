import { URL_SERVER_TOMCAT } from "../../shared/container.ts";
import { 
    APIException, APIErrorCode,
    CommentCreateRequest, CommentDto, CommentUpdateRequest,
    AttachmentCreateRequest,
} from "../../shared/types/mod.ts";
import { isAttachmentCreateRequest, isCommentCreateRequest, isCommentDto, isCommentUpdateRequest } from "../../shared/utils/typeguards.ts";

export class CommentService {
    constructor() {}
    
    async createComment(taskId: string, commentCreateRequest: CommentCreateRequest, userPseudo: string): Promise<CommentDto> {

        // Validation des données de création de commentaire
        if(!isCommentCreateRequest(commentCreateRequest)) {
            throw new APIException(APIErrorCode.BAD_REQUEST, 400, "Données de création de commentaire invalides");
        }

        // Envoie de la requête de création de commentaire à Tomcat
        const response = await fetch(`${URL_SERVER_TOMCAT}/api/tasks/${taskId}/comments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-User-Pseudo": userPseudo, // Ajout du pseudo de l'utilisateur dans les headers pour l'authentification
            },
            body: JSON.stringify(commentCreateRequest),
        });

        // reponse diffent de 2**, on traite l'erreur
        if (!response.ok) {
            const error = await response.json();
            switch (response.status) {
                case 400:
                    throw new APIException(APIErrorCode.BAD_REQUEST, 400, error.message);
                case 403:
                    throw new APIException(APIErrorCode.FORBIDDEN, 403, error.message);
                case 404:
                    throw new APIException(APIErrorCode.NOT_FOUND, 404, error.message);
                default:
                    throw new APIException(
                        APIErrorCode.INTERNAL_SERVER_ERROR, 
                        500, 
                        "Erreur lors de la communication avec le serveur"
                    );
            }

        }

        // reponse 2**, on parse les tâches retournées
        const commentDto: CommentDto = await response.json();
        if (!isCommentDto(commentDto)) {
            throw new APIException(
                APIErrorCode.INTERNAL_SERVER_ERROR,
                500,
                "Réponse serveur invalide"
            );
        }
        
        // Retour du commentaire créé
        return commentDto;
    }

    async getCommentsByTaskId(taskId: string, userPseudo: string): Promise<CommentDto[]> {
        // Envoie de la requête de récupération des commentaires à Tomcat
        const response = await fetch(`${URL_SERVER_TOMCAT}/api/tasks/${taskId}/comments`, {
            method: "GET",
            headers: {
                "X-User-Pseudo": userPseudo, // Ajout du pseudo de l'utilisateur dans les headers pour l'authentification
            },
        });

        // reponse diffent de 2**, on traite l'erreur
        if (!response.ok) {
            const error = await response.json();
            switch (response.status) {
                case 400:
                    throw new APIException(APIErrorCode.BAD_REQUEST, 400, error.message);
                case 403:
                    throw new APIException(APIErrorCode.FORBIDDEN, 403, error.message);
                case 404:
                    throw new APIException(APIErrorCode.NOT_FOUND, 404, error.message);
                default:
                    throw new APIException(
                        APIErrorCode.INTERNAL_SERVER_ERROR, 
                        500, 
                        "Erreur lors de la communication avec le serveur"
                    );
            }
        }

        // reponse 2**, on parse les tâches retournées
        const commentsDtos: CommentDto[] = await response.json();
        if (!Array.isArray(commentsDtos) || !commentsDtos.every(isCommentDto)) {
            throw new APIException(
                APIErrorCode.INTERNAL_SERVER_ERROR,
                500,
                "Réponse serveur invalide"
            );
        }

        // Retour des commentaires récupérés
        return commentsDtos;
    }

    async updateComment(taskId: string, commentId: string, commentUpdateRequest: CommentUpdateRequest, userPseudo: string): Promise<CommentDto> {

        // Validation des données de mise à jour de commentaire
        if(!isCommentUpdateRequest(commentUpdateRequest)) {
            throw new APIException(APIErrorCode.BAD_REQUEST, 400, "Données de mise à jour de commentaire invalides");
        }

        // Envoie de la requête de mise à jour de commentaire à Tomcat
        const response = await fetch(`${URL_SERVER_TOMCAT}/api/tasks/${taskId}/comments/${commentId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-User-Pseudo": userPseudo, // Ajout du pseudo de l'utilisateur dans les headers pour l'authentification
            },
            body: JSON.stringify(commentUpdateRequest),
        });
        
         // reponse diffent de 2**, on traite l'erreur
        if (!response.ok) {
            const error = await response.json();
            switch (response.status) {
                case 400:
                    throw new APIException(APIErrorCode.BAD_REQUEST, 400, error.message);
                case 403:
                    throw new APIException(APIErrorCode.FORBIDDEN, 403, error.message);
                case 404:
                    throw new APIException(APIErrorCode.NOT_FOUND, 404, error.message);
                default:
                    throw new APIException(
                        APIErrorCode.INTERNAL_SERVER_ERROR, 
                        500, 
                        "Erreur lors de la communication avec le serveur"
                    );
            }
        }

        // reponse 2**, on parse le commentaire retourné
        const commentDto: CommentDto = await response.json();
        if (!isCommentDto(commentDto)) {
            throw new APIException(
                APIErrorCode.INTERNAL_SERVER_ERROR,
                500,
                "Réponse serveur invalide"
            );
        }
        
        // Retour du commentaire mis à jour
        return commentDto;
    }

    async deleteComment(taskId: string, commentId: string, userPseudo: string): Promise<void> {
        // Envoie de la requête de suppression de commentaire à Tomcat
        const response = await fetch(`${URL_SERVER_TOMCAT}/api/tasks/${taskId}/comments/${commentId}`, {
            method: "DELETE",
            headers: {
                "X-User-Pseudo": userPseudo, // Ajout du pseudo de l'utilisateur dans les headers pour l'authentification
            },
        });
        
         // reponse diffent de 2**, on traite l'erreur
        if (!response.ok) {
            const error = await response.json();
            switch (response.status) {
                case 400:
                    throw new APIException(APIErrorCode.BAD_REQUEST, 400, error.message);
                case 403:
                    throw new APIException(APIErrorCode.FORBIDDEN, 403, error.message);
                case 404:
                    throw new APIException(APIErrorCode.NOT_FOUND, 404, error.message);
                default:
                    throw new APIException(
                        APIErrorCode.INTERNAL_SERVER_ERROR,
                        500,
                        "Erreur lors de la communication avec le serveur"
                    );
            }
        }

        // reponse 2**, on considère que la suppression a réussi
        return;
    }

    async addAttachmentToComment(taskId: string, commentId: string, attachment: AttachmentCreateRequest, userPseudo: string): Promise<CommentDto> {

        // Validation des données de création de pièce jointe
        if(!isAttachmentCreateRequest(attachment)) {
            throw new APIException(APIErrorCode.BAD_REQUEST, 400, "Données de création de pièce jointe invalides");
        }

        // Envoie de la requête d'ajout de pièce jointe à Tomcat
        const response = await fetch(`${URL_SERVER_TOMCAT}/api/tasks/${taskId}/comments/${commentId}/attachments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-User-Pseudo": userPseudo, // Ajout du pseudo de l'utilisateur dans les headers pour l'authentification
            },
            body: JSON.stringify(attachment),
        });
        
        // reponse diffent de 2**, on traite l'erreur
        if (!response.ok) {
            const error = await response.json();
            switch (response.status) {
                case 400:
                    throw new APIException(APIErrorCode.BAD_REQUEST, 400, error.message);
                case 403:
                    throw new APIException(APIErrorCode.FORBIDDEN, 403, error.message);
                case 404:
                    throw new APIException(APIErrorCode.NOT_FOUND, 404, error.message);
                default:
                    throw new APIException(
                        APIErrorCode.INTERNAL_SERVER_ERROR,
                        500,
                        "Erreur lors de la communication avec le serveur"
                    );
            }
        }

        // reponse 2**, on parse le commentaire retourné
        const commentDto: CommentDto = await response.json();
        if (!isCommentDto(commentDto)) {
            throw new APIException(
                APIErrorCode.INTERNAL_SERVER_ERROR,
                500,
                "Réponse serveur invalide"
            );
        }
        
        // Retour du commentaire mis à jour avec la nouvelle pièce jointe
        return commentDto;
    }
}