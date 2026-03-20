import { URL_SERVER_TOMCAT } from "../../shared/container.ts";
import {
  APIErrorCode,
  APIException,
  TaskAssignRequest, TaskSummaryDto, TaskCreateRequest, TaskUpdateRequest, TaskMoveRequest, TaskPositionRequest,
} from "../../shared/types/mod.ts";
import { isTaskAssignRequest, isTaskSummaryDto, isTaskCreateRequest, isTaskUpdateRequest, isTaskMoveRequest, isTaskPositionRequest } from "../../shared/utils/typeguards.ts";
import { safeFetch } from "../../shared/utils/gateway.utils.ts";

export class TaskService {
    constructor() {}

    /**
     * Liste les tâches d'une colonne
     * @param columnId l'id de la colonne dont on veut récupérer les tâches
     * @param userPseudo le pseudo de l'utilisateur (pour le header X-User-Pseudo)
     * @returns un tableau de tâches
     */
    async getTasksByColumnId(columnId: string, userPseudo: string): Promise<TaskSummaryDto[]> {

        // Envoie la requête à Tomcat pour récupérer les tâches de la colonne
        const response = await safeFetch(`${URL_SERVER_TOMCAT}/api/columns/${columnId}/tasks`, {
            method: "GET",
            headers: {
                "X-User-Pseudo": userPseudo,
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
        const tasks = await response.json();

        // Vérification de la conformité des données retournées par Tomcat
        if (!Array.isArray(tasks) || !tasks.every(isTaskSummaryDto)) {
            throw new APIException(
                APIErrorCode.INTERNAL_SERVER_ERROR,
                500,
                "Données retournées par Tomcat non conformes à TaskSummaryDto[]",
            );
        }

        // Retourne les tâches de la colonne
        return tasks;
    }
    
    /**
     * Crée une nouvelle tâche dans une colonne
     * @param columnId l'id de la colonne dans laquelle créer la tâche
     * @param task les données de création de la tâche
     * @param userPseudo le pseudo de l'utilisateur (pour le header X-User-Pseudo)
     * @returns la tâche créée
     */
    async createTask(columnId: string, task: TaskCreateRequest, userPseudo: string): Promise<TaskSummaryDto> {

        // Validation des données de création de tâche
        if(!isTaskCreateRequest(task)) {
            throw new APIException(APIErrorCode.BAD_REQUEST, 400, "Données de création de tableau invalides");
        }

        // Envoie de la requête à Tomcat pour créer la tâche
        const response = await safeFetch(`${URL_SERVER_TOMCAT}/api/columns/${columnId}/tasks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-User-Pseudo": userPseudo,
            },
            body: JSON.stringify(task),
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

        // reponse 2**, on parse la tâche créée
        const createdTask = await response.json();
        if (!isTaskSummaryDto(createdTask)) {
            throw new APIException(
                APIErrorCode.INTERNAL_SERVER_ERROR,
                500,
                "Données retournées par Tomcat non conformes à TaskSummaryDto",
            );
        }

        // Retourne la tâche créée
        return createdTask;
    }

    /**
     * Récupère une tâche par son ID
     * @param taskId l'ID de la tâche à récupérer
     * @param userPseudo le pseudo de l'utilisateur (pour le header X-User-Pseudo)
     * @returns la tâche correspondante
     */
    async getTaskById(taskId: string, userPseudo: string): Promise<TaskSummaryDto> {
        // Envoie de la requête à Tomcat pour récupérer la tâche
        const response = await safeFetch(`${URL_SERVER_TOMCAT}/api/tasks/${taskId}`, {
            method: "GET",
            headers: {
                "X-User-Pseudo": userPseudo,
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

        // reponse 2**, on parse la tâche retournée
        const task = await response.json();
        if (!isTaskSummaryDto(task)) {
            throw new APIException(
                APIErrorCode.INTERNAL_SERVER_ERROR,
                500,
                "Données retournées par Tomcat non conformes à TaskSummaryDto",
            );
        }

        // Retourne la tâche correspondante
        return task;
    }

    /**
     * Met à jour une tâche
     * @param taskId l'id de la tâche à mettre à jour
     * @param taskUpdate les données de mise à jour de la tâche
     * @param userPseudo le pseudo de l'utilisateur (pour le header X-User-Pseudo)
     * @returns la tâche mise à jour
     */
    async updateTask(taskId: string, taskUpdate: TaskUpdateRequest, userPseudo: string): Promise<TaskSummaryDto> {

        // Validation des données de mise à jour de tâche
        if(!isTaskUpdateRequest(taskUpdate)) {
            throw new APIException(APIErrorCode.BAD_REQUEST, 400, "Données de mise à jour de tâche invalides");
        }

        // Envoie de la requête à Tomcat pour mettre à jour la tâche
        const response = await safeFetch(`${URL_SERVER_TOMCAT}/api/tasks/${taskId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-User-Pseudo": userPseudo,
            },
            body: JSON.stringify(taskUpdate),
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

        // reponse 2**, on parse la tâche mise à jour
        const updatedTask = await response.json();
        if (!isTaskSummaryDto(updatedTask)) {
            throw new APIException(
                APIErrorCode.INTERNAL_SERVER_ERROR,
                500,
                "Données retournées par Tomcat non conformes à TaskSummaryDto",
            );
        }

        // Retourne la tâche mise à jour
        return updatedTask;
    }

    /**
     * Supprime une tâche
     * @param taskId l'id de la tâche à supprimer
     * @param userPseudo le pseudo de l'utilisateur (pour le header X-User-Pseudo)
     * @returns void
     */
    async deleteTask(taskId: string, userPseudo: string): Promise<void> {

        // Envoie de la requête à Tomcat pour supprimer la tâche
        const response = await safeFetch(`${URL_SERVER_TOMCAT}/api/tasks/${taskId}`, {
            method: "DELETE",
            headers: {
                "X-User-Pseudo": userPseudo,
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

        // reponse 2**, la tâche a été supprimée avec succès
        return;
    }

    /**
     * Déplace une tâche
     * @param taskId l'id de la tâche à déplacer
     * @param taskMove l'id de la colonne de destination
     * @param userPseudo le pseudo de l'utilisateur (pour le header X-User-Pseudo)
     * @returns void
     */
    async moveTask(taskId: string, taskMove: TaskMoveRequest, userPseudo: string): Promise<void> {

        // Validation des données de déplacement de tâche
        if(!isTaskMoveRequest(taskMove)) {
            throw new APIException(APIErrorCode.BAD_REQUEST, 400, "Données de déplacement de tâche invalides");
        }

        // Envoie de la requête à Tomcat pour déplacer la tâche
        const response = await safeFetch(`${URL_SERVER_TOMCAT}/api/tasks/${taskId}/move`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "X-User-Pseudo": userPseudo,
            },
            body: JSON.stringify(taskMove),
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

        return;
    }

    /**
     * Met à jour la position d'une tâche
     * @param taskId l'id de la tâche à mettre à jour
     * @param taskPosition les nouvelles coordonnées de la tâche
     * @param userPseudo le pseudo de l'utilisateur (pour le header X-User-Pseudo)
     * @returns void
     */
    async updateTaskPosition(taskId: string, taskPosition: TaskPositionRequest, userPseudo: string): Promise<void> {

        // Validation des données de mise à jour de position de tâche
        if(!isTaskPositionRequest(taskPosition)) {
            throw new APIException(APIErrorCode.BAD_REQUEST, 400, "Données de mise à jour de position de tâche invalides");
        }

        // Envoie de la requête à Tomcat pour mettre à jour la position de la tâche
        const response = await safeFetch(`${URL_SERVER_TOMCAT}/api/tasks/${taskId}/position`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "X-User-Pseudo": userPseudo,
            },
            body: JSON.stringify(taskPosition),
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

        return;
    }

    /**
     * Assigne une tâche à un utilisateur
     * @param taskId l'id de la tâche à assigner
     * @param taskAssign le pseudo de l'utilisateur à qui assigner la tâche
     * @param userPseudo le pseudo de l'utilisateur (pour le header X-User-Pseudo)
     * @returns la tâche avec l'utilisateur assigné
     */
    async assignTask(taskId: string, taskAssign: TaskAssignRequest, userPseudo: string): Promise<TaskSummaryDto> {

        // Validation des données d'assignation de tâche
        if(!isTaskAssignRequest(taskAssign)) {
            throw new APIException(APIErrorCode.BAD_REQUEST, 400, "Données d'assignation de tâche invalides");
        }

        // Envoie de la requête à Tomcat pour assigner la tâche
        const response = await safeFetch(`${URL_SERVER_TOMCAT}/api/tasks/${taskId}/assign`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "X-User-Pseudo": userPseudo,
            },
            body: JSON.stringify(taskAssign),
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
        
        // reponse 2**, on parse la tâche retournée
        const assignedTask = await response.json();
        if(!isTaskSummaryDto(assignedTask)) {
            throw new APIException(
                APIErrorCode.INTERNAL_SERVER_ERROR,
                500,
                "Données retournées par Tomcat non conformes à TaskSummaryDto",
            );
        }
        
        // Retourne la tâche avec l'utilisateur assigné
        return assignedTask;
    }

    async searchTasksByKeyword(boardId: string, keyword: string, userPseudo: string): Promise<TaskSummaryDto[]> {

        // Envoie de la requête à Tomcat pour rechercher les tâches du tableau correspondant au mot-clé
        const response = await safeFetch(`${URL_SERVER_TOMCAT}/api/boards/${boardId}/tasks/search?keyword=${keyword}`, {
            method: "GET",
            headers: {
                "X-User-Pseudo": userPseudo,
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
        const tasks = await response.json();

        // Vérification de la conformité des données retournées par Tomcat
        if (!Array.isArray(tasks) || !tasks.every(isTaskSummaryDto)) {
            throw new APIException(
                APIErrorCode.INTERNAL_SERVER_ERROR,
                500,
                "Données retournées par Tomcat non conformes à TaskSummaryDto[]",
            );
        }

        // Retourne les tâches correspondant au mot-clé de recherche
        return tasks;
    }

    async searchTasksByPriority(boardId: string, priority: string, userPseudo: string): Promise<TaskSummaryDto[]> {

        // Envoie de la requête à Tomcat pour rechercher les tâches du tableau correspondant à la priorité
        const response = await safeFetch(`${URL_SERVER_TOMCAT}/api/boards/${boardId}/tasks/search?priority=${priority}`, {
            method: "GET",
            headers: {
                "X-User-Pseudo": userPseudo,
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
        const tasks = await response.json();

        // Vérification de la conformité des données retournées par Tomcat
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

        // Retourne les tâches correspondant à la priorité de recherche
        return tasks;
    }

    async searchTasksByAssignedTo(boardId: string, assignedTo: string, userPseudo: string): Promise<TaskSummaryDto[]> {

        // Envoie de la requête à Tomcat pour rechercher les tâches du tableau correspondant à un utilisateur assigné
        const response = await safeFetch(`${URL_SERVER_TOMCAT}/api/boards/${boardId}/tasks/search?assignedTo=${assignedTo}`, {
            method: "GET",
            headers: {
                "X-User-Pseudo": userPseudo,
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
        const tasks = await response.json();

        // Vérification de la conformité des données retournées par Tomcat
        if (!Array.isArray(tasks) || !tasks.every(isTaskSummaryDto)) {
            throw new APIException(
                APIErrorCode.INTERNAL_SERVER_ERROR,
                500,
                "Données retournées par Tomcat non conformes à TaskSummaryDto[]",
            );
        }

        // Retourne les tâches correspondant à l'utilisateur assigné
        return tasks;
    }

}