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
import { isBoardColumnCreateRequest, isBoardColumnDto, isBoardColumnPositionUpdateRequest, isBoardColumnUpdateRequest } from "../../shared/utils/typeguards.ts";

export class BoardColumnService {
    constructor() {}

    /**
     * Récupère les colonnes d'un tableau à partir de son id
     * @param boardId l'id du tableau dont on veut récupérer les colonnes
     * @param userPseudo le pseudo de l'utilisateur (pour le header X-User-Pseudo)
     * @returns les colonnes du tableau correspondant à l'id
     */
    async getColumnsByBoardId(boardId: string, userPseudo: string): Promise<BoardColumnDto[]> {
        
        // Appel à Tomcat pour récupérer les colonnes du tableau
        const response = await safeFetch(`${URL_SERVER_TOMCAT}/api/boards/${boardId}/columns`, {
            method: "GET",
            headers: { 
                "X-User-Pseudo": userPseudo
            }
        });

        // reponse différent de 2**, on traite l'erreur
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
        
        // reponse 2**, on parse les colonnes récupérées
        const columns: BoardColumnDto[] = await response.json();
        
        // on vérifie que les données retournées sont conformes à BoardColumnDto[]
        if (!Array.isArray(columns) || !columns.every(isBoardColumnDto)) {
            throw new APIException(
                APIErrorCode.INTERNAL_SERVER_ERROR,
                500,
                "Données retournées par Tomcat non conformes à BoardColumnDto[]",
            );
        }
        return columns;
    }

    /**
     * Crée une nouvelle colonne dans un tableau
     * @param boardId l'id du tableau
     * @param request les données de la colonne (BoardColumnCreateRequest)
     * @param userPseudo le pseudo de l'utilisateur (pour le header X-User-Pseudo)
     * @returns la colonne créée
     */
    async createColumn(boardId: string, request: BoardColumnCreateRequest, userPseudo: string): Promise<BoardColumnDto> {

        // Validation des données de création
        if(!isBoardColumnCreateRequest(request)) {
            throw new APIException(APIErrorCode.BAD_REQUEST, 400, "Données de création de colonne invalides");
        }

        // Appel à Tomcat pour créer la colonne
        const response = await safeFetch(`${URL_SERVER_TOMCAT}/api/boards/${boardId}/columns`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-User-Pseudo": userPseudo
            },
            body: JSON.stringify(request),
        });

        // reponse différent de 2**, on traite l'erreur
        if (!response.ok) {
            const error = await response.json();
            
            switch (response.status) {
                case 400:
                    throw new APIException(APIErrorCode.BAD_REQUEST, 400, error.message);
                case 403:
                    throw new APIException(APIErrorCode.FORBIDDEN, 403, error.message);
                case 404:
                    throw new APIException(APIErrorCode.NOT_FOUND, 404, error.message);
                case 409:
                    throw new APIException(APIErrorCode.CONFLICT, 409, error.message);
                default:
                    throw new APIException(
                        APIErrorCode.INTERNAL_SERVER_ERROR, 
                        500, 
                        "Erreur lors de la communication avec le serveur"
                    );
            }
        }

        // reponse 2**, on parse la colonne créée
        const newColumn = await response.json();
        if (!isBoardColumnDto(newColumn)) {
            throw new APIException(
                APIErrorCode.INTERNAL_SERVER_ERROR, 
                500, 
                "Données de création invalides retournées par Tomcat"
            );
        }

        // on retourne la colonne créée
        return newColumn;
    }

    /**
     * Modifie une colonne à partir de son id
     * @param columnId l'id de la colonne à modifier
     * @param data les données de la colonne à modifier (nom)
     * @param userPseudo le pseudo de l'utilisateur (pour le header X-User-Pseudo)
     * @returns la colonne modifiée
     */
    async updateColumn(columnId: string, data: BoardColumnUpdateRequest, userPseudo: string): Promise<BoardColumnDto> {

        // Validation des données de mise à jour
        if(!isBoardColumnUpdateRequest(data)) {
            throw new APIException(APIErrorCode.BAD_REQUEST, 400, "Données de mise à jour invalides");
        }

        // Appel à Tomcat pour modifier la colonne
        const response = await safeFetch(`${URL_SERVER_TOMCAT}/api/columns/${columnId}`, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                "X-User-Pseudo": userPseudo 
            },
            body: JSON.stringify(data),
        });

        // reponse différent de 2**, on traite l'erreur
        // reponse différent de 2**, on traite l'erreur
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

        // reponse 2**, on parse la colonne modifiée
        const updatedColumn = await response.json();
        if(!isBoardColumnDto(updatedColumn)) {
            throw new APIException(
                APIErrorCode.INTERNAL_SERVER_ERROR,
                500,
                "Données retournées par Tomcat non conformes à BoardColumnDto",
            );
        }

        // on retourne la colonne modifiée
        return updatedColumn;
    }

    /**
     * Modifie la position d'une colonne à partir de son id
     * @param columnId l'id de la colonne à modifier
     * @param position les données de la colonne à modifier (nouvelle position)
     * @param userPseudo le pseudo de l'utilisateur (pour le header X-User-Pseudo)
     * @return void
     */
    async updateColumnPosition(columnId: string, position: BoardColumnUpdatePositionRequest, userPseudo: string): Promise<void> {

        // Validation des données de mise à jour de position
        if (!isBoardColumnPositionUpdateRequest(position)) {
            throw new APIException(APIErrorCode.BAD_REQUEST, 400, "Données de mise à jour de position invalides");
        }

        // Appel à Tomcat pour modifier la position de la colonne
        const response = await safeFetch(`${URL_SERVER_TOMCAT}/api/columns/${columnId}/position`, {
            method: "PATCH",
            headers: { 
                "Content-Type": "application/json",
                "X-User-Pseudo": userPseudo 
            },
            body: JSON.stringify(position),
        });

        // reponse différent de 2**, on traite l'erreur
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

       return;
    }

    /**
     * Supprime une colonne à partir de son id
     * @param columnId l'id de la colonne à supprimer
     * @param userPseudo le pseudo de l'utilisateur (pour le header X-User-Pseudo)
     */
    async deleteColumn(columnId: string, userPseudo: string): Promise<void> {
        
        // Appel à Tomcat pour supprimer la colonne
        const response = await safeFetch(`${URL_SERVER_TOMCAT}/api/columns/${columnId}`, {
            method: "DELETE",
            headers: { "X-User-Pseudo": userPseudo }
        });

        // reponse différent de 2**, on traite l'erreur
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

        // reponse 2**, on ne retourne rien
        return;        
    }

}