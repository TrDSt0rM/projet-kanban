/**
 * @file server-deno/src/modules/admin/admin.service.ts
 */
import { URL_SERVER_TOMCAT } from "../../shared/container.ts";
import { APIException, APIErrorCode, UserDto, UserUpdateRequest } from "../../shared/types/mod.ts";
import { safeFetch } from "../../shared/utils/gateway.utils.ts";
import { isUserDto, isUserUpdateRequest } from "../../shared/utils/typeguards.ts";
import { StatsDto } from "./admin.type.ts";
import { isStatsDto } from "./admin.typeguards.ts";

export class AdminService {
    constructor() {}

    /**
     * Récupère la liste de tous les utilisateurs du système
     * @returns une liste de tous les utilisateurs du système
     */
    async getAllUsers(): Promise<UserDto[]> {
        const response = await safeFetch(`${URL_SERVER_TOMCAT}/api/admin/users`, {
            method: "GET",
        });

        if (!response.ok) {
            throw new APIException(APIErrorCode.INTERNAL_SERVER_ERROR, response.status, "Erreur lors de la récupération des utilisateurs");
        }
         
        const users: UserDto[] = await response.json();
        if (!Array.isArray(users) || !users.every(isUserDto)){
            throw new APIException(
                APIErrorCode.INTERNAL_SERVER_ERROR,
                500,
                "Erreur lors de la récupération des utilisateurs"
            );
        }
        return users;
    }

    /**
     * Met à jour les informations d'un utilisateur (activation/désactivation)
     * @param targetPseudo le pseudo de l'utilisateur à mettre à jour
     * @param data les données de mise à jour (isActive)
     * @returns l'utilisateur mis à jour
     */
    async updateUser(targetPseudo: string, data: UserUpdateRequest): Promise<UserDto> {
        
        // Validation des données de mise à jour
        if(!isUserUpdateRequest(data)) {
            throw new APIException(
                APIErrorCode.BAD_REQUEST,
                400,
                "Données de mise à jour invalides"
            );
        }

        // Envoie de la requête de mise à jour à Tomcat
        const url = `${URL_SERVER_TOMCAT}/api/admin/users/${targetPseudo}/activate`;
        const response = await safeFetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        // reponse diffent de 2**, on traite l'erreur
        if (!response.ok) {
            throw new APIException(APIErrorCode.INTERNAL_SERVER_ERROR, response.status, "Tomcat a refusé l'activation");
        }

        // reponse 2**, on parse le user récupéré
        const updatedUser: UserDto = await response.json();
        if (!isUserDto(updatedUser)) {
            throw new APIException(
                APIErrorCode.INTERNAL_SERVER_ERROR,
                500,
                "Données retournées par Tomcat non conformes à UserDto",
            );
        }

        // On retourne le user mis à jour
        return updatedUser;
    }

    /**
     * Met à jour le rôle d'un utilisateur (ADMIN/USER)
     * @param targetPseudo le pseudo de l'utilisateur à mettre à jour
     * @param role le rôle à attribuer à l'utilisateur (ADMIN ou USER)
     * @returns
     */
    async updateRole(targetPseudo: string, role: UserUpdateRequest): Promise<UserDto> {
        
        // Validation des données de mise à jour
        if(isUserUpdateRequest(role)){
            throw new APIException(
                APIErrorCode.BAD_REQUEST,
                400,
                "Données de mise à jour invalides"
            );
        }

        // Envoie de la requête de mise à jour à Tomcat
        const response = await safeFetch(`${URL_SERVER_TOMCAT}/api/admin/users/${targetPseudo}/role`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(role),
        });

        // reponse diffent de 2**, on traite l'erreur
        if (!response.ok) {
            throw new APIException(APIErrorCode.INTERNAL_SERVER_ERROR, response.status, "Erreur changement rôle");
        }
        
        // reponse 2**, on parse le user récupéré
        const updatedUser: UserDto = await response.json();
        if (!isUserDto(updatedUser)) {
            throw new APIException(
                APIErrorCode.INTERNAL_SERVER_ERROR,
                500,
                "Données retournées par Tomcat non conformes à UserDto",
            );
        }
        return updatedUser;
    }

    /**
     * Supprime un utilisateur du système
     * @param targetPseudo le pseudo de l'utilisateur à supprimer
     * @returns une réponse indiquant la suppression réussie
     */
    async deleteUser(targetPseudo: string): Promise<void> {

        // Envoie de la requête de suppression à Tomcat
        const response = await safeFetch(`${URL_SERVER_TOMCAT}/api/admin/users/${targetPseudo}`, {
            method: "DELETE",
        });

        // reponse diffent de 2**, on traite l'erreur
        if (!response.ok) {
            throw new APIException(APIErrorCode.INTERNAL_SERVER_ERROR, response.status, "Erreur lors de la suppression de l'utilisateur");
        }

        return;
    }

    async getStats(): Promise<StatsDto> {
        const response = await safeFetch(`${URL_SERVER_TOMCAT}/api/admin/stats`, {
            method: "GET",
        });

        if(!response.ok) {
            const error = await response.json();

            switch(response.status) {
                case 400:
                    throw new APIException(APIErrorCode.BAD_REQUEST, response.status, error.message || "Requête invalide");
                case 401:
                    throw new APIException(APIErrorCode.UNAUTHORIZED, response.status, error.message || "Non autorisé");
                case 403:
                    throw new APIException(APIErrorCode.FORBIDDEN, response.status, error.message || "Accès interdit");
                default:
                    throw new APIException(APIErrorCode.INTERNAL_SERVER_ERROR, response.status, error.message || "Erreur lors de la récupération des statistiques");
            }
        }

        const stats: StatsDto = await response.json();
        if (!isStatsDto(stats)) {
            throw new APIException(
                APIErrorCode.INTERNAL_SERVER_ERROR,
                500,
                "Données retournées par Tomcat non conformes à StatsDto",
            );
        }

        return stats;
    }
}