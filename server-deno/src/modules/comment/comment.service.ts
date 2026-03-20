import { URL_SERVER_TOMCAT } from "../../shared/container.ts";
import { 
    APIException, APIErrorCode,
    CommentCreateRequest, CommentDto, CommentUpdateRequest,
    AttachmentCreateRequest, AttachmentDto
} from "../../shared/types/mod.ts";
import { isAttachmentCreateRequest, isAttachmentDto, isCommentCreateRequest, isCommentDto, isCommentUpdateRequest } from "../../shared/utils/typeguards.ts";

export class CommentService {
    constructor() {}
    
    /**
     * Créer un commentaire
     */
    async createComment(taskId: string, commentCreateRequest: CommentCreateRequest, userPseudo: string): Promise<CommentDto> {
        if(!isCommentCreateRequest(commentCreateRequest)) {
            throw new APIException(APIErrorCode.BAD_REQUEST, 400, "Données de création de commentaire invalides");
        }

        const response = await fetch(`${URL_SERVER_TOMCAT}/api/tasks/${taskId}/comments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-User-Pseudo": userPseudo,
            },
            body: JSON.stringify(commentCreateRequest),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new APIException(APIErrorCode.INTERNAL_SERVER_ERROR, response.status, error.message);
        }

        const commentDto: CommentDto = await response.json();
        if (!isCommentDto(commentDto)) {
            throw new APIException(APIErrorCode.INTERNAL_SERVER_ERROR, 500, "Réponse serveur invalide");
        }
        
        return commentDto;
    }

    /**
     * Récupérer les commentaires d'une tâche
     */
    async getCommentsByTaskId(taskId: string, userPseudo: string): Promise<CommentDto[]> {
        const response = await fetch(`${URL_SERVER_TOMCAT}/api/tasks/${taskId}/comments`, {
            headers: { "X-User-Pseudo": userPseudo }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Erreur Tomcat:", errorText);
            throw new APIException(APIErrorCode.INTERNAL_SERVER_ERROR, 500, "Erreur lors de la récupération des commentaires");
        }

        const data = await response.json();
        
        return (data || []).map((c: any) => ({
            ...c,
            attachments: c.attachments || []
        }));
    }

    /**
     * Mettre à jour un commentaire
     */
    async updateComment(taskId: string, commentId: string, commentUpdateRequest: CommentUpdateRequest, userPseudo: string): Promise<CommentDto> {
        if(!isCommentUpdateRequest(commentUpdateRequest)) {
            throw new APIException(APIErrorCode.BAD_REQUEST, 400, "Données de mise à jour de commentaire invalides");
        }

        const response = await fetch(`${URL_SERVER_TOMCAT}/api/tasks/${taskId}/comments/${commentId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-User-Pseudo": userPseudo,
            },
            body: JSON.stringify(commentUpdateRequest),
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new APIException(APIErrorCode.INTERNAL_SERVER_ERROR, response.status, error.message);
        }

        const commentDto: CommentDto = await response.json();
        if (!isCommentDto(commentDto)) {
            throw new APIException(APIErrorCode.INTERNAL_SERVER_ERROR, 500, "Réponse serveur invalide");
        }
        
        return commentDto;
    }

    /**
     * Supprimer un commentaire
     */
    async deleteComment(taskId: string, commentId: string, userPseudo: string): Promise<void> {
        const response = await fetch(`${URL_SERVER_TOMCAT}/api/tasks/${taskId}/comments/${commentId}`, {
            method: "DELETE",
            headers: {
                "X-User-Pseudo": userPseudo,
            },
        });
        
        if (!response.ok) {
            throw new APIException(APIErrorCode.INTERNAL_SERVER_ERROR, response.status, "Erreur lors de la suppression");
        }
    }

    /**
     * Ajouter une pièce jointe à un commentaire (JSON)
     */
    async addAttachmentToComment(taskId: string, commentId: string, attachment: AttachmentCreateRequest, userPseudo: string): Promise<CommentDto> {
        if(!isAttachmentCreateRequest(attachment)) {
            throw new APIException(APIErrorCode.BAD_REQUEST, 400, "Données de pièce jointe invalides");
        }

        const response = await fetch(`${URL_SERVER_TOMCAT}/api/tasks/${taskId}/comments/${commentId}/attachments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-User-Pseudo": userPseudo,
            },
            body: JSON.stringify(attachment),
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new APIException(APIErrorCode.INTERNAL_SERVER_ERROR, response.status, error.message);
        }

        return await response.json();
    }

    /**
     * Uploader un fichier binaire pour un commentaire spécifique
     */
    async uploadAttachmentToComment(taskId: string, commentId: string, file: File, userPseudo: string): Promise<CommentDto> {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(`${URL_SERVER_TOMCAT}/api/tasks/${taskId}/comments/${commentId}/attachments/upload`, {
            method: "POST",
            headers: {
                "X-User-Pseudo": userPseudo,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new APIException(APIErrorCode.INTERNAL_SERVER_ERROR, response.status, "Erreur upload commentaire");
        }

        return await response.json();
    }

    /**
     * Ajouter une pièce jointe à une tâche (JSON)
     */
    async addAttachmentToTask(taskId: string, attachment: AttachmentCreateRequest, userPseudo: string): Promise<AttachmentDto> {
        if(!isAttachmentCreateRequest(attachment)) {
            throw new APIException(APIErrorCode.BAD_REQUEST, 400, "Données invalides");
        }

        const response = await fetch(`${URL_SERVER_TOMCAT}/api/tasks/${taskId}/attachments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-User-Pseudo": userPseudo,
            },
            body: JSON.stringify(attachment),
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new APIException(APIErrorCode.INTERNAL_SERVER_ERROR, response.status, error.message);
        }

        return await response.json();
    }

    /**
     * Récupérer les pièces jointes d'une tâche
     */
    async getAttachmentsByTaskId(taskId: string, userPseudo: string): Promise<AttachmentDto[]> {
        const response = await fetch(`${URL_SERVER_TOMCAT}/api/tasks/${taskId}/attachments`, {
            method: "GET",
            headers: { "X-User-Pseudo": userPseudo },
        });

        if (!response.ok) {
            throw new APIException(APIErrorCode.INTERNAL_SERVER_ERROR, response.status, "Erreur récupération fichiers");
        }

        const attachmentsDtos: AttachmentDto[] = await response.json();
        return attachmentsDtos || [];
    }

    /**
     * Supprimer une pièce jointe
     */
    async deleteAttachmentFromTask(taskId: string, fileId: string, userPseudo: string): Promise<void> {
        const response = await fetch(`${URL_SERVER_TOMCAT}/api/tasks/${taskId}/attachments/${fileId}`, {
            method: "DELETE",
            headers: { "X-User-Pseudo": userPseudo },
        });

        if (!response.ok) {
            throw new APIException(APIErrorCode.INTERNAL_SERVER_ERROR, response.status, "Erreur suppression fichier");
        }
    }

    /**
     * Récupérer le contenu binaire d'un fichier
     */
    async getAttachmentFile(fileId: string, userPseudo: string): Promise<Response> {
        const response = await fetch(`${URL_SERVER_TOMCAT}/api/files/${fileId}`, {
            method: "GET",
            headers: { "X-User-Pseudo": userPseudo },
        });

        if (!response.ok) {
            throw new APIException(APIErrorCode.NOT_FOUND, 404, "Fichier introuvable");
        }

        return response;
    }
    
    /**
     * Uploader un fichier binaire lié à une tâche
     */
    async uploadAttachment(taskId: string, file: File, userPseudo: string): Promise<AttachmentDto> {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(`${URL_SERVER_TOMCAT}/api/tasks/${taskId}/attachments/upload`, {
            method: "POST",
            headers: { "X-User-Pseudo": userPseudo },
            body: formData,
        });

        if (!response.ok) {
            throw new APIException(APIErrorCode.INTERNAL_SERVER_ERROR, response.status, "Erreur lors de l'upload");
        }

        return await response.json();
    }
}