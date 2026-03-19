import { URL_SERVER_TOMCAT } from "../../shared/container.ts";
import {
  APIErrorCode,
  APIException,
  UserUpdateRequest,
  UserUpdatePasswordRequest,
} from "../../shared/types/mod.ts";
import {
  isUserDto,
  isUserUpdatePasswordRequest,
} from "../../shared/utils/typeguards.ts";
import { safeFetch } from "../../shared/utils/gateway.utils.ts";
import { hashPassword } from "../../shared/utils/crypto.utils.ts";

export class UserService {
  constructor() {}

  /**
   * Récupère un utilisateur à partir de son pseudo en envoyant une requête au serveur Tomcat.
   * @param pseudo le pseudo de l'utilisateur à récupérer
   * @returns renvoie l'utilisateur correspondant au pseudo si la récupération a réussi, sinon lance une APIException avec un message d'erreur approprié
   * @throws 404 si aucun utilisateur ne correspond au pseudo
   * @throws 500 si une erreur interne se produit lors de la récupération de l'utilisateur depuis Tomcat
   * @throws 500 si les données retournées par Tomcat ne sont pas conformes à UserDto
   */
  async getUserByPseudo(pseudo: string) {
    const response = await safeFetch(
      `${URL_SERVER_TOMCAT}/api/users/search?pseudo=${pseudo}`,
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new APIException(
          APIErrorCode.NOT_FOUND,
          404,
          "ce pseudo ne correspond à aucun utilisateur",
        );
      }
      throw new APIException(
        APIErrorCode.INTERNAL_SERVER_ERROR,
        500,
        "Erreur interne Tomcat.",
      );
    }

    const user = await response.json();

    if (!isUserDto(user)) {
      throw new APIException(
        APIErrorCode.INTERNAL_SERVER_ERROR,
        500,
        "Données tomcat utilisateur invalides",
      );
    }

    return user;
  }

  /**
   * récupère tous les utilisateurs en envoyant une requête au serveur Tomcat.
   * @returns renvoie la liste de tous les utilisateurs si la récupération a réussi, sinon lance une APIException avec un message d'erreur approprié
   */
  async getUser() {
    // Envoie de la requête de récupération de tous les utilisateurs à Tomcat et récupération de la réponse
    const response = await safeFetch(`${URL_SERVER_TOMCAT}/api/admin/users`);
    const users = await response.json();

    // reponse diffent de 2**, on traite l'erreur
    if (!response.ok) {
      throw new APIException(
        APIErrorCode.INTERNAL_SERVER_ERROR,
        500,
        "Erreur interne Tomcat.",
      );
    }

    // vérifie que les données retournées par Tomcat sont conformes à UserDto[]
    if (!Array.isArray(users) || !users.every(isUserDto)) {
      throw new APIException(
        APIErrorCode.INTERNAL_SERVER_ERROR,
        500,
        "Données tomcat utilisateur invalides",
      );
    }

    return users;
  }

  /**
   * Met à jour un utilisateur existant en envoyant une requête au serveur Tomcat.
   * @param pseudo le pseudo de l'utilisateur à mettre à jour
   * @param updateUserRequest les modifications à apporter à l'utilisateur (role et/ou isActive)
   * @returns renvoie l'utilisateur mis à jour si la mise à jour a réussi, sinon lance une APIException avec un message d'erreur approprié
   * @throws 400 si les données de mise à jour de l'utilisateur sont invalides
   * @throws 500 si une erreur interne se produit lors de la mise à jour de l'utilisateur dans Tomcat
   */
  async updateUser(pseudo: string, updateUserRequest: UserUpdateRequest) {
    const response = await safeFetch(
      `${URL_SERVER_TOMCAT}/api/users?pseudo=${pseudo}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateUserRequest),
      },
    );

    if (!response.ok) {
      throw new APIException(
        APIErrorCode.INTERNAL_SERVER_ERROR,
        500,
        "Erreur interne Tomcat.",
      );
    }

    const updateUserResponse = await response.json();

    if (!isUserDto(updateUserResponse)) {
      throw new APIException(
        APIErrorCode.INTERNAL_SERVER_ERROR,
        500,
        "Données tomcat utilisateur invalides",
      );
    }

    return updateUserResponse;
  }

  async updatePassword(pseudo: string, newPassword: UserUpdatePasswordRequest) {
    // Hash du nouveau mot de passe avant de l'envoyer à Tomcat
    if (!isUserUpdatePasswordRequest(newPassword)) {
      throw new APIException(
        APIErrorCode.BAD_REQUEST,
        400,
        "Données de requête invalides",
      );
    }

    const hashedPassword = await hashPassword(newPassword.newPassword);

    // Envoie de la requête de mise à jour du mot de passe à Tomcat et récupération de la réponse
    const response = await safeFetch(
      `${URL_SERVER_TOMCAT}/api/users/me/password`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/text",
          "X-User-Pseudo": pseudo,
        },
        body: hashedPassword,
      },
    );

    // reponse diffent de 2**, on traite l'erreur
    if (!response.ok) {
      if (response.status === 404) {
        throw new APIException(
          APIErrorCode.NOT_FOUND,
          404,
          "ce pseudo ne correspond à aucun utilisateur",
        );
      }
      throw new APIException(
        APIErrorCode.INTERNAL_SERVER_ERROR,
        500,
        "Erreur interne Tomcat.",
      );
    }

    // reponse 2**, on considère que la mise à jour a réussi et on retourne void
    return;
  }

  /**
   * Supprime un utilisateur existant en envoyant une requête au serveur Tomcat.
   * @param pseudo le pseudo de l'utilisateur à supprimer
   * @returns renvoie true si la suppression a réussi, sinon lance une APIException avec un message d'erreur approprié
   */
  async deleteUser(pseudo: string) {
    // Envoie de la requête de suppression de l'utilisateur à Tomcat et récupération de la réponse
    const reponse = await safeFetch(`${URL_SERVER_TOMCAT}/api/users/me`, {
      method: "DELETE",
      headers: {
        "X-User-Pseudo": pseudo,
      },
    });

    // reponse diffent de 2**, on traite l'erreur
    if (!reponse.ok) {
      if (reponse.status === 403) {
        throw new APIException(
          APIErrorCode.FORBIDDEN,
          403,
          "Vous n'êtes pas autorisé à supprimer cet utilisateur",
        );
      }
      throw new APIException(
        APIErrorCode.INTERNAL_SERVER_ERROR,
        500,
        "Erreur interne Tomcat.",
      );
    }

    // reponse 2**, on considère que la suppression a réussi et on retourne true
    return true;
  }
}
