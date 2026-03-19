/**
 * @file server-deno/src/modules/admin/admin.service.ts
 */
import { URL_SERVER_TOMCAT } from "../../shared/container.ts";
import { APIException, APIErrorCode, UserDto, UserUpdateRequest } from "../../shared/types/mod.ts";
import { safeFetch } from "../../shared/utils/gateway.utils.ts";

export class AdminService {
    constructor() {}

    /**
     * Récupère la liste de tous les utilisateurs (Admin uniquement)
     */
    async getAllUsers(adminPseudo: string): Promise<UserDto[]> {
        const response = await safeFetch(`${URL_SERVER_TOMCAT}/api/admin/users`, {
            method: "GET",
            headers: { "X-User-Pseudo": adminPseudo }
        });

        if (!response.ok) {
            throw new APIException(APIErrorCode.INTERNAL_SERVER_ERROR, response.status, "Erreur lors de la récupération des utilisateurs");
        }
        return await response.json();
    }

    /**
     * Met à jour un utilisateur (rôle ou activation)
     */
    async updateUser(adminPseudo: string, targetPseudo: string, data: UserUpdateRequest): Promise<UserDto> {
        const response = await safeFetch(`${URL_SERVER_TOMCAT}/api/admin/users/${targetPseudo}`, {
            method: "PATCH",
            headers: { 
                "Content-Type": "application/json",
                "X-User-Pseudo": adminPseudo 
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new APIException(APIErrorCode.INTERNAL_SERVER_ERROR, response.status, "Erreur lors de la mise à jour de l'utilisateur");
        }
        return await response.json();
    }

    /**
     * Supprime un utilisateur définitivement
     */
    async deleteUser(adminPseudo: string, targetPseudo: string): Promise<void> {
        const response = await safeFetch(`${URL_SERVER_TOMCAT}/api/admin/users/${targetPseudo}`, {
            method: "DELETE",
            headers: { "X-User-Pseudo": adminPseudo }
        });

        if (!response.ok) {
            throw new APIException(APIErrorCode.INTERNAL_SERVER_ERROR, response.status, "Erreur lors de la suppression de l'utilisateur");
        }
    }
}