import { URL_SERVER_TOMCAT } from "../../shared/container.ts";
import {
  APIErrorCode,
  APIException,
  TaskAssignRequest, TaskDto, TaskCreateRequest, TaskUpdateRequest, TaskMoveRequest, TaskPositionRequest,
} from "../../shared/types/mod.ts";
import { isTaskAssignRequest, isTaskDto, isTaskCreateRequest, isTaskUpdateRequest, isTaskMoveRequest, isTaskPositionRequest } from "../../shared/utils/typeguards.ts";
import { safeFetch } from "../../shared/utils/gateway.utils.ts";

export class TaskService {
  constructor() {}

    async getTasksByColumnId(columnId: string, userPseudo: string): Promise<TaskDto[]> {

        // Envoie la requête à Tomcat pour récupérer les tâches de la colonne
        const response = await safeFetch(`${URL_SERVER_TOMCAT}/columns/${columnId}/tasks`, {
            method: "GET",
            headers: {
                "X-User-Pseudo": userPseudo,
            },
        });

        // reponse diffent de 2**, on traite l'erreur
        if (!response.ok) {
            if (response.status === 404) {
                throw new APIException(APIErrorCode.NOT_FOUND, 404, "Colonne inconnue");
            } else if (response.status === 403) {
                throw new APIException(
                    APIErrorCode.FORBIDDEN,
                    403,
                    "Accès refusé, vous n'êtes pas membre du tableau",
                );
            }
            else {
                throw new APIException(
                    APIErrorCode.INTERNAL_SERVER_ERROR,
                    500,
                    "Erreur lors de la récupération des tâches",
                );
            }
        }

        // reponse 2**, on parse les tâches retournées
        const tasks = await response.json();

        // Vérification de la conformité des données retournées par Tomcat
        if (!Array.isArray(tasks) || !tasks.every(isTaskDto)) {
            throw new APIException(
                APIErrorCode.INTERNAL_SERVER_ERROR,
                500,
                "Données retournées par Tomcat non conformes à TaskDto[]",
            );
        }

        // Retourne les tâches de la colonne
        return tasks;
    }
    
    async createTask(columnId: string, task: TaskCreateRequest, userPseudo: string): Promise<TaskDto> {

        if(!isTaskCreateRequest(task)) {
            throw new APIException(APIErrorCode.BAD_REQUEST, 400, "Données de création de tableau invalides");
        }

        const response = await safeFetch(`${URL_SERVER_TOMCAT}/columns/${columnId}/tasks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-User-Pseudo": userPseudo,
            },
            body: JSON.stringify(task),
        });

        if (!response.ok) {
            throw new APIException(APIErrorCode.INTERNAL_SERVER_ERROR, 500, "Erreur lors de la création de la tâche");
        }

        const createdTask = await response.json();

        if (!isTaskDto(createdTask)) {
            throw new APIException(
                APIErrorCode.INTERNAL_SERVER_ERROR,
                500,
                "Données retournées par Tomcat non conformes à TaskDto",
            );
        }

        return createdTask;
    }

    async getTaskById(taskId: string, userPseudo: string): Promise<TaskDto> {
        const response = await safeFetch(`${URL_SERVER_TOMCAT}/tasks/${taskId}`, {
            method: "GET",
            headers: {
                "X-User-Pseudo": userPseudo,
            },
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new APIException(APIErrorCode.NOT_FOUND, 404, "Tâche inconnue");
            } else if (response.status === 403) {
                throw new APIException(
                    APIErrorCode.FORBIDDEN,
                    403,
                    "Accès refusé, vous n'êtes pas membre du tableau",
                );
            }
            else {
                throw new APIException(
                    APIErrorCode.INTERNAL_SERVER_ERROR,
                    500,
                    "Erreur lors de la récupération de la tâche",
                );
            }
        }

        const task = await response.json();

        if (!isTaskDto(task)) {
            throw new APIException(
                APIErrorCode.INTERNAL_SERVER_ERROR,
                500,
                "Données retournées par Tomcat non conformes à TaskDto",
            );
        }

        return task;
    }

    async updateTask(taskId: string, taskUpdate: TaskUpdateRequest, userPseudo: string): Promise<TaskDto> {

        if(!isTaskUpdateRequest(taskUpdate)) {
            throw new APIException(APIErrorCode.BAD_REQUEST, 400, "Données de mise à jour de tâche invalides");
        }

        const response = await safeFetch(`${URL_SERVER_TOMCAT}/tasks/${taskId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-User-Pseudo": userPseudo,
            },
            body: JSON.stringify(taskUpdate),
        });

        if (!response.ok) {
            throw new APIException(APIErrorCode.INTERNAL_SERVER_ERROR, 500, "Erreur lors de la mise à jour de la tâche");
        }

        const updatedTask = await response.json();

        if (!isTaskDto(updatedTask)) {
            throw new APIException(
                APIErrorCode.INTERNAL_SERVER_ERROR,
                500,
                "Données retournées par Tomcat non conformes à TaskDto",
            );
        }

        return updatedTask;
    }

    async deleteTask(taskId: string, userPseudo: string): Promise<void> {
        const response = await safeFetch(`${URL_SERVER_TOMCAT}/tasks/${taskId}`, {
            method: "DELETE",
            headers: {
                "X-User-Pseudo": userPseudo,
            },
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new APIException(APIErrorCode.NOT_FOUND, 404, "Tâche inconnue");
            } else if (response.status === 403) {
                throw new APIException(
                    APIErrorCode.FORBIDDEN,
                    403,
                    "Accès refusé, vous n'êtes pas membre du tableau",
                );
            }
            else {
                throw new APIException(
                    APIErrorCode.INTERNAL_SERVER_ERROR,
                    500,
                    "Erreur lors de la suppression de la tâche",
                );
            }
        }

        return;
    }

    async moveTask(taskId: string, taskMove: TaskMoveRequest, userPseudo: string): Promise<TaskDto> {

        if(!isTaskMoveRequest(taskMove)) {
            throw new APIException(APIErrorCode.BAD_REQUEST, 400, "Données de déplacement de tâche invalides");
        }

        const response = await safeFetch(`${URL_SERVER_TOMCAT}/tasks/${taskId}/move`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "X-User-Pseudo": userPseudo,
            },
            body: JSON.stringify(taskMove),
        });

        if (!response.ok) {
            throw new APIException(APIErrorCode.INTERNAL_SERVER_ERROR, 500, "Erreur lors du déplacement de la tâche");
        }

        const movedTask = await response.json();

        if (!isTaskDto(movedTask)) {
            throw new APIException(
                APIErrorCode.INTERNAL_SERVER_ERROR,
                500,
                "Données retournées par Tomcat non conformes à TaskDto",
            );
        }

        return movedTask;
    }

    async updateTaskPosition(taskId: string, taskPosition: TaskPositionRequest, userPseudo: string): Promise<TaskDto> {

        // Validation des données de mise à jour de position de tâche
        if(!isTaskPositionRequest(taskPosition)) {
            throw new APIException(APIErrorCode.BAD_REQUEST, 400, "Données de mise à jour de position de tâche invalides");
        }

        // Envoie de la requête à Tomcat pour mettre à jour la position de la tâche
        const response = await safeFetch(`${URL_SERVER_TOMCAT}/tasks/${taskId}/position`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "X-User-Pseudo": userPseudo,
            },
            body: JSON.stringify(taskPosition),
        });
        
        // reponse diffent de 2**, on traite l'erreur
        if (!response.ok) {
            throw new APIException(APIErrorCode.INTERNAL_SERVER_ERROR, 500, "Erreur lors de la mise à jour de la position de la tâche");
        }

        // reponse 2**, on parse la tâche retournée
        const updatedTask = await response.json();
        if(!isTaskDto(updatedTask)) {
            throw new APIException(
                APIErrorCode.INTERNAL_SERVER_ERROR,
                500,
                "Données retournées par Tomcat non conformes à TaskDto",
            );
        }

        // Retourne la tâche avec la position mise à jour
        return updatedTask;
    }

    async assignTask(taskId: string, taskAssign: TaskAssignRequest, userPseudo: string): Promise<TaskDto> {

        // Validation des données d'assignation de tâche
        if(!isTaskAssignRequest(taskAssign)) {
            throw new APIException(APIErrorCode.BAD_REQUEST, 400, "Données d'assignation de tâche invalides");
        }

        // Envoie de la requête à Tomcat pour assigner la tâche
        const response = await safeFetch(`${URL_SERVER_TOMCAT}/tasks/${taskId}/assign`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "X-User-Pseudo": userPseudo,
            },
            body: JSON.stringify(taskAssign),
        });
        
        // reponse diffent de 2**, on traite l'erreur
        if (!response.ok) {
            throw new APIException(APIErrorCode.INTERNAL_SERVER_ERROR, 500, "Erreur lors de l'assignation de la tâche");
        }
        
        // reponse 2**, on parse la tâche retournée
        const assignedTask = await response.json();
        if(!isTaskDto(assignedTask)) {
            throw new APIException(
                APIErrorCode.INTERNAL_SERVER_ERROR,
                500,
                "Données retournées par Tomcat non conformes à TaskDto",
            );
        }
        
        // Retourne la tâche avec l'utilisateur assigné
        return assignedTask;
    }

    async searchTasksByKeyword(boardId: string, keyword: string, userPseudo: string): Promise<TaskDto[]> {

        // Envoie de la requête à Tomcat pour rechercher les tâches du tableau correspondant au mot-clé
        const response = await safeFetch(`${URL_SERVER_TOMCAT}/boards/${boardId}/tasks/search?keyword=${keyword}`, {
            method: "GET",
            headers: {
                "X-User-Pseudo": userPseudo,
            },
        });

        // reponse diffent de 2**, on traite l'erreur
        if (!response.ok) {
            if (response.status === 404) {
                throw new APIException(APIErrorCode.NOT_FOUND, 404, "Tableau inconnu");
            } else if (response.status === 403) {
                throw new APIException(
                    APIErrorCode.FORBIDDEN,
                    403,
                    "Accès refusé, vous n'êtes pas membre du tableau",
                );
            }
            else {
                throw new APIException(
                    APIErrorCode.INTERNAL_SERVER_ERROR,
                    500,
                    "Erreur lors de la recherche des tâches",
                );
            }
        }

        // reponse 2**, on parse les tâches retournées
        const tasks = await response.json();

        // Vérification de la conformité des données retournées par Tomcat
        if (!Array.isArray(tasks) || !tasks.every(isTaskDto)) {
            throw new APIException(
                APIErrorCode.INTERNAL_SERVER_ERROR,
                500,
                "Données retournées par Tomcat non conformes à TaskDto[]",
            );
        }

        // Retourne les tâches correspondant au mot-clé de recherche
        return tasks;
    }

    async searchTasksByPriority(boardId: string, priority: string, userPseudo: string): Promise<TaskDto[]> {

        // Envoie de la requête à Tomcat pour rechercher les tâches du tableau correspondant à la priorité
        const response = await safeFetch(`${URL_SERVER_TOMCAT}/boards/${boardId}/tasks/search?priority=${priority}`, {
            method: "GET",
            headers: {
                "X-User-Pseudo": userPseudo,
            },
        });

        // reponse diffent de 2**, on traite l'erreur
        if (!response.ok) {
            if (response.status === 404) {
                throw new APIException(APIErrorCode.NOT_FOUND, 404, "Tableau inconnu");
            } else if (response.status === 403) {
                throw new APIException(
                    APIErrorCode.FORBIDDEN,
                    403,
                    "Accès refusé, vous n'êtes pas membre du tableau",
                );
            }
            else {
                throw new APIException(
                    APIErrorCode.INTERNAL_SERVER_ERROR,
                    500,
                    "Erreur lors de la recherche des tâches",
                );
            }
        }

        // reponse 2**, on parse les tâches retournées
        const tasks = await response.json();

        // Vérification de la conformité des données retournées par Tomcat
        if (!Array.isArray(tasks) || !tasks.every(isTaskDto)) {
            throw new APIException(
                APIErrorCode.INTERNAL_SERVER_ERROR,
                500,
                "Données retournées par Tomcat non conformes à TaskDto[]",
            );
        }

        // Retourne les tâches correspondant à la priorité de recherche
        return tasks;
    }

    async searchTasksByAssignedTo(boardId: string, assignedTo: string, userPseudo: string): Promise<TaskDto[]> {

        // Envoie de la requête à Tomcat pour rechercher les tâches du tableau correspondant à un utilisateur assigné
        const response = await safeFetch(`${URL_SERVER_TOMCAT}/boards/${boardId}/tasks/search?assignedTo=${assignedTo}`, {
            method: "GET",
            headers: {
                "X-User-Pseudo": userPseudo,
            },
        });

        // reponse diffent de 2**, on traite l'erreur
        if (!response.ok) {
            if (response.status === 404) {
                throw new APIException(APIErrorCode.NOT_FOUND, 404, "Tableau inconnu");
            } else if (response.status === 403) {
                throw new APIException(
                    APIErrorCode.FORBIDDEN,
                    403,
                    "Accès refusé, vous n'êtes pas membre du tableau",
                );
            }
            else {
                throw new APIException(
                    APIErrorCode.INTERNAL_SERVER_ERROR,
                    500,
                    "Erreur lors de la recherche des tâches",
                );
            }
        }

        // reponse 2**, on parse les tâches retournées
        const tasks = await response.json();

        // Vérification de la conformité des données retournées par Tomcat
        if (!Array.isArray(tasks) || !tasks.every(isTaskDto)) {
            throw new APIException(
                APIErrorCode.INTERNAL_SERVER_ERROR,
                500,
                "Données retournées par Tomcat non conformes à TaskDto[]",
            );
        }

        // Retourne les tâches correspondant à l'utilisateur assigné
        return tasks;
    }

}