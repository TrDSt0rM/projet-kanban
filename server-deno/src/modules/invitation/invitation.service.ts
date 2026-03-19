import { URL_SERVER_TOMCAT } from "../../shared/container.ts";
import {
  APIErrorCode,
  APIException,
  InvitationCreateRequest,
  InvitationDto,
} from "../../shared/types/mod.ts";
import { isInvitationCreateDto, isInvitationDto } from "../../shared/utils/typeguards.ts";
import { safeFetch } from "../../shared/utils/gateway.utils.ts";

export class InvitationService {
    constructor() {}

    async createInvitation(boardId: string, invitationRequest: InvitationCreateRequest, ownerPseudo: string): Promise<InvitationDto> {

        if(!isInvitationCreateDto(invitationRequest)) {
            throw new APIException(
                APIErrorCode.BAD_REQUEST,
                400,
                "Données de requête d'invitation invalides",
            );
        }

        const response = await safeFetch(`${URL_SERVER_TOMCAT}/boards/${boardId}/invitations`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-User-Pseudo": ownerPseudo,
            },
            body: JSON.stringify({  }),
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new APIException(APIErrorCode.NOT_FOUND, 404, "Tableau inconnu");
            } else if (response.status === 403) {
                throw new APIException(
                    APIErrorCode.FORBIDDEN,
                    403,
                    "Accès refusé, vous n'êtes pas membre du tableau",
                );
            } else {
                throw new APIException(
                    APIErrorCode.INTERNAL_SERVER_ERROR,
                    500,
                    "Erreur lors de la création de l'invitation",
                );
            }
        }

        const invitation: InvitationDto = await response.json();

        if (!isInvitationDto(invitation)) {
            throw new APIException(
                APIErrorCode.INTERNAL_SERVER_ERROR,
                500,
                "Données retournées par Tomcat non conformes à InvitationDto",
            );
        }

        return invitation;
    }

    async getInvitationsByUserPseudo(userPseudo: string): Promise<InvitationDto[]> {
        const response = await safeFetch(`${URL_SERVER_TOMCAT}/invitations`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-User-Pseudo": userPseudo,
            },
        });

        if (!response.ok) {
            throw new APIException(
                APIErrorCode.INTERNAL_SERVER_ERROR,
                500,
                "Erreur lors de la récupération des invitations",
            );
        }

        const invitations: InvitationDto[] = await response.json();
        
        if (!Array.isArray(invitations) || !invitations.every(isInvitationDto)) {
            throw new APIException(
                APIErrorCode.INTERNAL_SERVER_ERROR,
                500,
                "Données retournées par Tomcat non conformes à InvitationDto[]",
            );
        }

        return invitations;
    }

    async acceptInvitation(boardId: string, userPseudo: string): Promise<void> {
        const response = await safeFetch(`${URL_SERVER_TOMCAT}/invitations/${boardId}/accept`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ pseudo: userPseudo }),
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new APIException(APIErrorCode.NOT_FOUND, 404, "Tableau inconnu");
            } else if (response.status === 403) {
                throw new APIException(
                    APIErrorCode.FORBIDDEN,
                    403,
                    "Accès refusé, vous n'êtes pas membre du tableau",
                );
            } else {
                throw new APIException(
                    APIErrorCode.INTERNAL_SERVER_ERROR,
                    500,
                    "Erreur lors de l'acceptation de l'invitation",
                );
            }
        }
    }

    async declineInvitation(boardId: string, userPseudo: string): Promise<void> {
        const response = await safeFetch(`${URL_SERVER_TOMCAT}/invitations/${boardId}/decline`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ pseudo: userPseudo }),
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new APIException(APIErrorCode.NOT_FOUND, 404, "Tableau inconnu");
            } else if (response.status === 403) {
                throw new APIException(
                    APIErrorCode.FORBIDDEN,
                    403,
                    "Accès refusé, vous n'êtes pas membre du tableau",
                );
            } else {
                throw new APIException(
                    APIErrorCode.INTERNAL_SERVER_ERROR,
                    500,
                    "Erreur lors du refus de l'invitation",
                );
            }
        }
    }

    async cancelInvitation(boardId: string, userPseudoToCancel: string, requesterPseudo: string): Promise<void> {
        const response = await safeFetch(`${URL_SERVER_TOMCAT}/boards/${boardId}/invitations/${userPseudoToCancel}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "X-User-Pseudo": requesterPseudo,
            },
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new APIException(APIErrorCode.NOT_FOUND, 404, "Tableau ou utilisateur inconnu");
            } else if (response.status === 403) {
                throw new APIException(
                    APIErrorCode.FORBIDDEN,
                    403,
                    "Accès refusé, vous n'êtes pas le propriétaire du tableau",
                );
            } else {
                throw new APIException(
                    APIErrorCode.INTERNAL_SERVER_ERROR,
                    500,
                    "Erreur lors de l'annulation de l'invitation",
                );
            }
        }
    }
}

