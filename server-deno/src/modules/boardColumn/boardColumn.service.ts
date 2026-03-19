/**
 * @file server-deno/src/modules/boardColumn/boardColumn.service.ts
 * @description This file contains the service for the boardColumn-related operations.
 * @version 1.0.0
 * @date 2026-03-19
 */
import { URL_SERVER_TOMCAT } from "../../shared/container.ts";
import { APIException, APIErrorCode, BoardColumnUpdateRequest, BoardColumnUpdatePositionRequest, BoardColumnCreateRequest } from "../../shared/types/mod.ts";
import { BoardColumnDto } from "../../shared/types/mod.ts";
import { safeFetch } from "../../shared/utils/gateway.utils.ts";

export class BoardColumnService {
    constructor() {}

    /**
     * Récupère les colonnes d'un tableau à partir de son id
     * @param boardId l'id du tableau dont on veut récupérer les colonnes
     * @returns les colonnes du tableau correspondant à l'id
     */
    async getColumnsByBoardId(boardId: string): Promise<BoardColumnDto[]> {
        
        // Appel à Tomcat pour récupérer les colonnes du tableau
        const response = await safeFetch(`${URL_SERVER_TOMCAT}/boards/${boardId}/columns`, {
            method: "GET",
        });

        // reponse différent de 2**, on traite l'erreur
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
                    "Erreur lors de la récupération des colonnes du tableau",
                );
            }
        }
        
        // reponse 2**, on parse les colonnes récupérées
        const columns: BoardColumnDto[] = await response.json();
        
        // on vérifie que les données retournées sont conformes à BoardColumnDto[]
        if (!Array.isArray(columns) || !columns.every(col => "idColumn" in col && "columnName" in col && "position" in col)) {
            throw new APIException(
                APIErrorCode.INTERNAL_SERVER_ERROR,
                500,
                "Données retournées par Tomcat non conformes à BoardColumnDto[]",
            );
        }
        return columns;
    }

    async updateColumn(columnId: string, data: BoardColumnUpdateRequest, userPseudo: string): Promise<BoardColumnDto> {
        const response = await safeFetch(`${URL_SERVER_TOMCAT}/api/columns/${columnId}`, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                "X-User-Pseudo": userPseudo 
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) throw new APIException(APIErrorCode.INTERNAL_SERVER_ERROR, response.status, "Erreur modification colonne");
        return await response.json();
    }

    async updateColumnPosition(columnId: string, data: BoardColumnUpdatePositionRequest, userPseudo: string): Promise<void> {
        const response = await safeFetch(`${URL_SERVER_TOMCAT}/api/columns/${columnId}/position`, {
            method: "PATCH",
            headers: { 
                "Content-Type": "application/json",
                "X-User-Pseudo": userPseudo 
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) throw new APIException(APIErrorCode.INTERNAL_SERVER_ERROR, response.status, "Erreur position colonne");
    }

    async deleteColumn(columnId: string, userPseudo: string): Promise<void> {
        const response = await safeFetch(`${URL_SERVER_TOMCAT}/api/columns/${columnId}`, {
            method: "DELETE",
            headers: { "X-User-Pseudo": userPseudo }
        });

        if (!response.ok) throw new APIException(APIErrorCode.INTERNAL_SERVER_ERROR, response.status, "Erreur suppression colonne");
    }

    /**
 * Crée une nouvelle colonne dans un tableau
 * @param boardId l'id du tableau
 * @param data les données de la colonne (BoardColumnCreateRequest)
 * @param userPseudo le pseudo de l'utilisateur (pour le header X-User-Pseudo)
 * @returns la colonne créée
 */
async createColumn(
    boardId: string, 
    data: BoardColumnCreateRequest, 
    userPseudo: string
): Promise<BoardColumnDto> {

    const response = await safeFetch(`${URL_SERVER_TOMCAT}/api/boards/${boardId}/columns`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-User-Pseudo": userPseudo
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        if (response.status === 403) {
            throw new APIException(
                APIErrorCode.FORBIDDEN, 
                403, 
                "Vous n'avez pas les droits pour ajouter une colonne à ce tableau"
            );
        }
        throw new APIException(
            APIErrorCode.INTERNAL_SERVER_ERROR, 
            response.status, 
            "Erreur lors de la création de la colonne sur Tomcat"
        );
    }

    const newColumn = await response.json();

    if (!newColumn || !newColumn.idColumn) {
        throw new APIException(
            APIErrorCode.INTERNAL_SERVER_ERROR, 
            500, 
            "Données de création invalides retournées par Tomcat"
        );
    }

    return newColumn;
}
}