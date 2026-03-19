/**
 * @file server-deno/src/modules/boardColumn/boardColumn.service.ts
 * @description This file contains the service for the boardColumn-related operations.
 * @version 1.0.0
 * @date 2026-03-19
 */
import { URL_SERVER_TOMCAT } from "../../shared/container.ts";
import { APIException, APIErrorCode } from "../../shared/types/mod.ts";
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
}