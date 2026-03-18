/**
 * @file server-deno/src/modules/auth/auth.service.ts
 * @description This file contains the service for the authentication-related operations.
 * @version 1.0.0
 * @date 2026-03-11
 */
import { isUserEntity } from "../../shared/utils/typeguards.ts";
import { URL_SERVER_TOMCAT } from "../../shared/container.ts";
import { APIException, APIErrorCode } from "../../shared/types/mod.ts";
import {
  createJWT,
  hashPassword,
  verifyPassword,
} from "../../shared/utils/crypto.utils.ts";
import { safeFetch } from "../../shared/utils/gateway.utils.ts";
import { mapTomcatToUserEntity, TomcatUserDto } from "./auth.mapper.ts";

export class AuthService {
  constructor() {}

  // connexion de l'utilisateur
  async login(pseudo: string, password: string) {
    // recupération de l'utilisateur en base de données
    const response = await safeFetch(
      `${URL_SERVER_TOMCAT}/api/internal/auth/user?pseudo=${pseudo}`,
    );

    if (!response.ok) {
      throw new APIException(
        APIErrorCode.NOT_FOUND,
        404,
        "Utilisateur inconnu",
      );
    }

    const rawData: TomcatUserDto = await response.json();

    const user = mapTomcatToUserEntity(rawData);

    if (!isUserEntity(user)) {
      throw new APIException(
        APIErrorCode.INTERNAL_SERVER_ERROR,
        500,
        "Données tomcat utilisateur invalides",
      );
    }

    // vérification de l'activation du compte
    if (user.isActive === 0) {
      throw new APIException(
        APIErrorCode.FORBIDDEN,
        403,
        "Utilisateur inactif",
      );
    }

    // vérification de la validité du mot de passe
    const valid = await verifyPassword(password, user.password);

    if (!valid) {
      throw new APIException(
        APIErrorCode.UNAUTHORIZED,
        401,
        "Pseudo ou mot de passe invalide",
      );
    }

    const token = await createJWT({ pseudo: user.pseudo, role: user.role });

    return {
      token,
      user: {
        pseudo: user.pseudo,
        role: user.role,
      },
    };
  }

  async register(pseudo: string, password: string) {
    // hachage du mot de passe avant enregistrement
    const hashedPassword = await hashPassword(password);

    const response = await safeFetch(`${URL_SERVER_TOMCAT}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pseudo, password: hashedPassword }),
    });

    if (!response.ok) {
        if (response.status === 409) {
            throw new APIException(APIErrorCode.CONFLICT, 409, "Ce pseudo est déjà utilisé");
        }
        throw new APIException(APIErrorCode.BAD_REQUEST, 400, "Échec de l'enregistrement");
    }

    return true;
  }
}
