import { URL_SERVER_TOMCAT } from "../../shared/container.ts";
import { APIException, APIErrorCode } from "../../shared/types/mod.ts";
import { safeFetch } from "../../shared/utils/gateway.utils.ts";
import { ActionLogDto } from "./actionLog.type.ts";
import { isActionLogDto } from "./actionLog.typeguards.ts";

export class ActionLogService {
    constructor() {}

    /**
     * Récupère les logs d'actions d'un tableau à partir de son id
     * @param boardId l'id du tableau pour lequel on veut récupérer les logs d'actions
     * @param page la page des logs d'actions à récupérer
     * @param size le nombre de logs d'actions à récupérer par page
     * @param userPseudo le pseudo de l'utilisateur
     * @returns les logs d'actions du tableau
     */
    async getActionLogsByBoardId(boardId: string, page: string, size: string, userPseudo: string) : Promise<ActionLogDto[]> {
        // Construction de l'URL pour récupérer les logs d'actions du tableau
        const url = new URL(`${URL_SERVER_TOMCAT}/api/boards/${boardId}/logs`);
        url.searchParams.set("page", page);
        url.searchParams.set("size", size);

        console.log("URL appelée:", url.toString());

        // Envoie de la requête GET pour récupérer les logs d'actions du tableau
        const response = await safeFetch(url.toString(), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-User-Pseudo": userPseudo
            }
        });

        // reponse diffent de 2**, on traite l'erreur
        if (!response.ok) {
            const error = await response.json();
            console.log("Status Tomcat:", response.status);
            console.log("Erreur Tomcat:", error);
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

        // reponse 2**, on traite les données
        const actionLogs = await response.json();

        // Vérification de la conformité des données retournées par Tomcat
        if (!Array.isArray(actionLogs) || !actionLogs.every(isActionLogDto)) {
            throw new APIException(
                APIErrorCode.INTERNAL_SERVER_ERROR,
                500,
                "Données retournées par Tomcat non conformes à TaskSummaryDto[]",
            );
        }

        // Retour des logs d'actions du tableau
        return actionLogs;
    }

    /**
     * Récupère les logs d'actions d'une tâche à partir de son id
     * @param taskId l'id de la tâche pour laquelle on veut récupérer les logs d'actions
     * @param page la page des logs d'actions à récupérer
     * @param size le nombre de logs d'actions à récupérer par page
     * @param userPseudo le pseudo de l'utilisateur
     * @returns les logs d'actions de la tâche
     */
    async getActionLogsByTaskId(taskId: string, page: string, size: string, userPseudo: string) : Promise<ActionLogDto[]> {
        // Construction de l'URL pour récupérer les logs d'actions de la tâche
        const url = new URL(`${URL_SERVER_TOMCAT}/api/tasks/${taskId}/logs`);
        url.searchParams.set("page", page);
        url.searchParams.set("size", size);

        // Envoie de la requête GET pour récupérer les logs d'actions de la tâche
        const response = await safeFetch(url.toString(), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-User-Pseudo": userPseudo
            }
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

        // reponse 2**, on traite les données
        const actionLogs = await response.json();

        // Vérification de la conformité des données retournées par Tomcat
        if (!Array.isArray(actionLogs) || !actionLogs.every(isActionLogDto)) {
            throw new APIException(
                APIErrorCode.INTERNAL_SERVER_ERROR,
                500,
                "Données retournées par Tomcat non conformes à TaskSummaryDto[]",
            );
        }

        // Retour des logs d'actions de la tâche
        return actionLogs;
    }
}