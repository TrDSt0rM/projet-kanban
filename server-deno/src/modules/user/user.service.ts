import { URL_SERVER_TOMCAT } from "../../shared/container.ts";
import {
  APIErrorCode,
  APIException,
  UpdateUserRequest,
} from "../../shared/types/mod.ts";
import { isUserDto } from "../../shared/utils/typeguards.ts";
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
      `${URL_SERVER_TOMCAT}/api/users?pseudo=${pseudo}`,
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
   * Met à jour un utilisateur existant en envoyant une requête au serveur Tomcat.
   * @param pseudo le pseudo de l'utilisateur à mettre à jour
   * @param updateUserRequest les modifications à apporter à l'utilisateur (role et/ou isActive)
   * @returns renvoie l'utilisateur mis à jour si la mise à jour a réussi, sinon lance une APIException avec un message d'erreur approprié
   * @throws 400 si les données de mise à jour de l'utilisateur sont invalides
   * @throws 500 si une erreur interne se produit lors de la mise à jour de l'utilisateur dans Tomcat
   */
  async updateUser(pseudo: string, updateUserRequest: UpdateUserRequest) {
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

  /**
   * Supprime un utilisateur existant en envoyant une requête au serveur Tomcat.
   * @param pseudo le pseudo de l'utilisateur à supprimer
   * @returns renvoie null si la suppression a réussi, sinon lance une APIException avec un message d'erreur approprié
   * @throws 500 si une erreur interne se produit lors de la suppression de l'utilisateur dans Tomcat
   */
  async deleteUser(pseudo: string) {
    const reponse = await safeFetch(
      `${URL_SERVER_TOMCAT}/api/users?pseudo=${pseudo}`,
      {
        method: "DELETE",
      },
    );

    if (!reponse.ok) {
      throw new APIException(
        APIErrorCode.INTERNAL_SERVER_ERROR,
        500,
        "Erreur interne Tomcat.",
      );
    }
  }
}
