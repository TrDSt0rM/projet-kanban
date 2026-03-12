/**
 * @file server-deno/src/modules/auth/auth.service.ts
 * @description This file contains the service for the authentication-related operations.
 * @version 1.0.0
 * @date 2026-03-11
 */
import { UserRepository } from "../../shared/repositories/user.repository.ts";
import { isUserEntity } from "../../shared/utils/typeguards.ts";
import { APIException, APIErrorCode } from "../../shared/types/mod.ts";
import { createJWT, verifyPassword } from "../../shared/utils/crypto.utils.ts";

export class AuthService {

    // Injection de dependance du repository utilisateur
    constructor(private userRepo: UserRepository) {}

    // connexion de l'utilisateur
    async login(pseudo: string, password: string) {

        // recupération de l'utilisateur en base de données
        const response = await fetch(`http://localhost:8080/api/users/${pseudo}`);

        if (!response.ok) {
            throw new APIException(APIErrorCode.NOT_FOUND, 404, "Utilisateur inconnu");
        }

        const user = await response.json();

        if (!isUserEntity(user)){
            throw new APIException(APIErrorCode.INTERNAL_SERVER_ERROR, 500, "Données tomcat utilisateur invalides");
        }

        // vérification de l'activation du compte
        if (user.isActive === 0) {
            throw new APIException(APIErrorCode.FORBIDDEN, 403, "Utilisateur inactif");
        }

        // vérification de la validité du mot de passe
        const valid = await verifyPassword(password, user.password);
        
        if (!valid) {
            throw new APIException(APIErrorCode.UNAUTHORIZED, 401, "Pseudo ou mot de passe invalide");
        }

        const token = await createJWT({pseudo: user.pseudo, role: user.role});

        return {
            token,
            user:{
                pseudo: user.pseudo,
                role: user.role,
            },
        }

    }
}