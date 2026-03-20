/**
 * @file server-deno/src/modules/board/board.service.ts
 * @description This file contains the service for the board-related operations.
 * @version 1.0.0
 * @date 2026-03-16
 */
import { URL_SERVER_TOMCAT } from "../../shared/container.ts";
import {
  APIErrorCode,
  APIException,
  BoardMemberDto,
  BoardSummaryDto,
  BoardCreateRequest,
  BoardUpdateRequest,
  BoardDetailDto,
} from "../../shared/types/mod.ts";
import { isBoardCreateRequest, isBoardDetailDto, isBoardMemberDto, isBoardSummaryDto, isBoardUpdateRequest } from "../../shared/utils/typeguards.ts";
import { safeFetch } from "../../shared/utils/gateway.utils.ts";

export class BoardService {
  constructor() {}

  /**
   * Méthode pour récupérer les tableaux d'un utilisateur à partir de son pseudo.
   * @param pseudo le pseudo de l'utilisateur dont on veut récupérer les tableaux
   * @returns les tableaux correspondant au pseudo de l'utilisateur
   */
  async getBoardByPseudo(pseudo: string): Promise<BoardSummaryDto[]> {

    // Envoie de la requête à Tomcat pour récupérer les tableaux de l'utilisateur
    const response = await safeFetch(
      `${URL_SERVER_TOMCAT}/api/boards`, {
        method: "GET",
        headers: {
          "X-User-Pseudo": pseudo,
        },
      },
    );

    // reponse diffent de 2**, on traite l'erreur
    if (!response.ok) {
      const error = await response.json();
    
      switch (response.status) {
        case 400:
          throw new APIException(APIErrorCode.BAD_REQUEST, 400, error.message);
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

    // reponse 2**, on parse les tableaux récupérés
    const boards: BoardSummaryDto[] = await response.json();
    if (
      !Array.isArray(boards) ||
      (boards.length > 0 && !boards.every(isBoardSummaryDto))
    ) {
      throw new APIException(
        APIErrorCode.INTERNAL_SERVER_ERROR,
        500,
        "Données tomcat tableau invalides",
      );
    }

    // on retourne les tableaux récupérés
    return boards;
  }

  /**
   * Récupère un tableau à partir de son id en envoyant une requête au serveur Tomcat.
   * @param id l'id du tableau à récupérer
   * @param me le pseudo de l'utilisateur qui effectue la requête
   * @returns renvoie le tableau correspondant à l'id si la récupération a réussi, sinon lance une APIException avec un message d'erreur approprié
   */
  async getBoardById(id: string, me: string): Promise<BoardDetailDto> {
    const response = await safeFetch(
      `${URL_SERVER_TOMCAT}/api/boards/${id}`,{
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        "X-User-Pseudo": me,
      }},

    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new APIException(APIErrorCode.NOT_FOUND, 404, "Tableau inconnu");
      }
      throw new APIException(
        APIErrorCode.INTERNAL_SERVER_ERROR,
        500,
        "Erreur interne Tomcat.",
      );
    }

    const boardDetail = await response.json();

    if (!isBoardDetailDto(boardDetail)) {
      throw new APIException(
        APIErrorCode.INTERNAL_SERVER_ERROR,
        500,
        "Données tomcat board invalides (format inattendu)",
      );
    }

    return boardDetail;
  }

  /**
   * Méthode pour créer un tableau en envoyant une requête à Tomcat. Génère un id unique pour le tableau et construit le tableau à créer à partir des données reçues en paramètre.
   * @param request les données de la requête de création du tableau
   * @param owner le pseudo de l'utilisateur propriétaire du tableau
   * @returns renvoie le tableau créé si la création a réussi, sinon lance une APIException avec un message d'erreur approprié
   */
  async createBoard(request: BoardCreateRequest, owner: string): Promise<BoardSummaryDto> {

    // Validation des données de création du tableau
    if(! isBoardCreateRequest(request)){
        throw new APIException(APIErrorCode.VALIDATION_ERROR, 400, "Données de création de tableau invalides");
    }

    // Envoie de la requête de création à Tomcat
    const response = await safeFetch(`${URL_SERVER_TOMCAT}/api/boards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-User-Pseudo": owner,
      },
      body: JSON.stringify(request),
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

    // reponse 2**, on parse le tableau créé
    const createdBoard = await response.json();
    if (!isBoardSummaryDto(createdBoard)) {
      throw new APIException(
        APIErrorCode.INTERNAL_SERVER_ERROR,
        500,
        "Le tableau créé par Tomcat est invalide",
      );
    }

    // on retourne le tableau créé
    return createdBoard;
  }

  /**
   * Modifie un tableau en envoyant une requête au serveur Tomcat.
   * @param id l'id du tableau à modifier
   * @param updateBoardRequest les données de la requête de mise à jour du tableau
   * @param userPseudo le pseudo de l'utilisateur qui effectue la modification
   * @returns le tableau modifié si la modification a réussi, sinon lance une APIException avec un message d'erreur approprié
   */
  async modifyBoard(id: string, updateBoardRequest: BoardUpdateRequest, userPseudo: string): Promise<BoardSummaryDto> {

    // Validation des données de mise à jour du tableau
    if (!isBoardUpdateRequest(updateBoardRequest)) {
        throw new APIException(APIErrorCode.VALIDATION_ERROR, 400, "Données de mise à jour de tableau invalides");
    }

    // Envoie de la requête de modification à Tomcat
    const response = await safeFetch(`${URL_SERVER_TOMCAT}/api/boards/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-User-Pseudo": userPseudo,
      },
      body: JSON.stringify(updateBoardRequest),
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
          throw new APIException(APIErrorCode.INTERNAL_SERVER_ERROR, 500, "Erreur lors de la communication avec le serveur");
      }
    }

    // reponse 2**, on parse le tableau modifié
    const modifiedBoard = await response.json();
    if (!isBoardSummaryDto(modifiedBoard)) {
      throw new APIException(
        APIErrorCode.INTERNAL_SERVER_ERROR,
        500,
        "Données tomcat tableau invalides après modification",
      );
    }

    // on retourne le tableau modifié
    return modifiedBoard;
  }

  /**
   * Supprime un tableau en envoyant une requête au serveur Tomcat.
   * @param id l'id du tableau à supprimer
   * @param userPseudo le pseudo de l'utilisateur qui effectue la suppression
   * @returns true si la suppression a réussi, sinon lance une APIException avec un message d'erreur approprié
   */
  async deleteBoard(id: string, userPseudo: string) {

    // Envoie de la requête de suppression à Tomcat
    const response = await safeFetch(`${URL_SERVER_TOMCAT}/api/boards/${id}`, {
      method: "DELETE",
      headers: {
        "X-User-Pseudo": userPseudo,
      },
    });

    // reponse diffent de 2**, on traite l'erreur
    if (!response.ok) {
      if (response.status === 404) {
        throw new APIException(
          APIErrorCode.NOT_FOUND,
          404,
          "Tableau inconnu",
        );
      } else if (response.status === 403) {
        throw new APIException(
          APIErrorCode.FORBIDDEN,
          403,
          "Accès refusé, vous n'êtes pas le propriétaire du tableau",
        );
      } else {
        throw new APIException(
          APIErrorCode.INTERNAL_SERVER_ERROR,
          500,
          "Erreur lors de la suppression du tableau",
        );
      }
    }

    // reponse 2**, on retourne true pour indiquer que la suppression a réussi
    return true;
  }

  /**
   * Récupère les membres d'un tableau en envoyant une requête au serveur Tomcat.
   * @param id l'id du tableau dont on veut récupérer les membres
   * @param userPseudo le pseudo de l'utilisateur qui effectue la requête
   * @returns les membres du tableau si la récupération a réussi, sinon lance une APIException avec un message d'erreur approprié
   */
  async getBoardMembers(id: string, userPseudo: string): Promise<BoardMemberDto[]> {

    // Envoie de la requête à Tomcat pour récupérer les membres du tableau
    const response = await safeFetch(
      `${URL_SERVER_TOMCAT}/api/boards/${id}/members`,
      {
        headers: {
          "X-User-Pseudo": userPseudo,
        },
      }
    );

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

    // reponse 2**, on parse les membres récupérés
    const members: BoardMemberDto[] = await response.json();
    if (
      !Array.isArray(members) ||
      (members.length > 0 && !members.every(isBoardMemberDto))
    ) {
      throw new APIException(
        APIErrorCode.INTERNAL_SERVER_ERROR,
        500,
        "Données membres reçues de Tomcat invalides",
      );
    }

    // on retourne les membres récupérés
    return members;
  }

  /**
   * Supprime un membre d'un tableau en envoyant une requête au serveur Tomcat.
   * @param boardId l'id du tableau dont on veut supprimer un membre
   * @param memberPseudo le pseudo de l'utilisateur à supprimer du tableau
   * @returns true si la suppression a réussi, sinon lance une APIException avec un message d'erreur approprié
   */
  async removeBoardMember(boardId: string, memberPseudo: string, userPseudo: string): Promise<boolean> {
    const response = await safeFetch(
      `${URL_SERVER_TOMCAT}/api/boards/${boardId}/members/${memberPseudo}`,
      {
        method: "DELETE",
        headers: {
          "X-User-Pseudo": userPseudo,
        },
      },
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new APIException(APIErrorCode.NOT_FOUND, 404, "Membre inconnu");
      } else if (response.status === 403) {
        throw new APIException(
          APIErrorCode.FORBIDDEN,
          403,
          "Accès refusé, vous n'êtes pas le propriétaire du tableau",
        );
      } else {
        throw new APIException(
          APIErrorCode.INTERNAL_SERVER_ERROR,
          500,
          "Erreur lors de la suppression du membre du tableau",
        );
      }
    }

    return true;
  }
}
