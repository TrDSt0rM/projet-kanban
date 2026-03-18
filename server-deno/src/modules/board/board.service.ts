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
  BoardDto,
  CreateBoardRequest,
  BoardMemberDto,
} from "../../shared/types/mod.ts";
import { isBoardDto, isBoardMemberDto } from "../../shared/utils/typeguards.ts";
import { safeFetch } from "../../shared/utils/gateway.utils.ts";

export class BoardService {
  constructor() {}

  async getBoardById(id: string) {
    const response = await safeFetch(
      `${URL_SERVER_TOMCAT}/api/boards/user/${id}`,
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

    const board = await response.json();

    if (!isBoardDto(board)) {
      throw new APIException(
        APIErrorCode.INTERNAL_SERVER_ERROR,
        500,
        "Données tomcat board invalides (format inattendu)",
      );
    }

    return board;
  }

  async getBoardByPseudo(pseudo: string) {
    const response = await safeFetch(
      `${URL_SERVER_TOMCAT}/api/boards?userPseudo=${pseudo}`,
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new APIException(
          APIErrorCode.NOT_FOUND,
          404,
          "ce pseudo ne correspond à aucun tableau",
        );
      }
      throw new APIException(
        APIErrorCode.INTERNAL_SERVER_ERROR,
        500,
        "Erreur interne Tomcat.",
      );
    }

    const boards: BoardDto[] = await response.json();

    if (
      !Array.isArray(boards) ||
      (boards.length > 0 && !boards.every(isBoardDto))
    ) {
      throw new APIException(
        APIErrorCode.INTERNAL_SERVER_ERROR,
        500,
        "Données tomcat tableau invalides",
      );
    }

    return boards;
  }

  /**
   * Méthode pour créer un tableau en envoyant une requête à Tomcat. Génère un id unique pour le tableau et construit le tableau à créer à partir des données reçues en paramètre.
   * @param request les données de la requête de création du tableau
   * @param owner le pseudo de l'utilisateur propriétaire du tableau
   * @returns renvoie le tableau créé si la création a réussi, sinon lance une APIException avec un message d'erreur approprié
   */
  async createBoard(request: CreateBoardRequest, owner: string) {
    const boardId = crypto.randomUUID();
    const newBoard = {
      id: boardId,
      name: request.name,
      ownerPseudo: owner,
      members: [owner],
      columns: [],
    };

    const response = await safeFetch(`${URL_SERVER_TOMCAT}/api/boards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newBoard),
    });

    if (!response.ok) {
      const errorDetail = await response.text();
      console.error("Erreur Tomcat lors de la création:", errorDetail);
      throw new APIException(
        APIErrorCode.INTERNAL_SERVER_ERROR,
        500,
        "Erreur lors de la création du tableau sur le serveur distant",
      );
    }

    const createdBoard = await response.json();

    if (!isBoardDto(createdBoard)) {
      throw new APIException(
        APIErrorCode.INTERNAL_SERVER_ERROR,
        500,
        "Le tableau créé par Tomcat est invalide",
      );
    }

    return createdBoard;
  }

  async modifyBoard(id: string) {
    const response = await safeFetch(`${URL_SERVER_TOMCAT}/api/boards/${id}`, {
      method: "PUT",
    });

    if (!response.ok) {
      throw new APIException(
        APIErrorCode.INTERNAL_SERVER_ERROR,
        500,
        "Erreur lors de la modification du tableau",
      );
    }

    const modifiedBoard = await response.json();

    if (!isBoardDto(modifiedBoard)) {
      throw new APIException(
        APIErrorCode.INTERNAL_SERVER_ERROR,
        500,
        "Données tomcat tableau invalides après modification",
      );
    }

    return modifiedBoard;
  }

  async deleteBoard(id: string) {
    const response = await safeFetch(`${URL_SERVER_TOMCAT}/api/boards/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new APIException(
        APIErrorCode.INTERNAL_SERVER_ERROR,
        500,
        "Erreur lors de la suppression du tableau",
      );
    }

    return true;
  }

  async getBoardMembers(id: string) {
    const response = await safeFetch(
      `${URL_SERVER_TOMCAT}/api/boards/${id}/members`,
    );

    if (!response.ok) {
      throw new APIException(
        APIErrorCode.INTERNAL_SERVER_ERROR,
        500,
        "Erreur lors de la récupération des membres du tableau",
      );
    }

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

    return members;
  }

  async removeBoardMember(boardId: string, memberPseudo: string) {
    const response = await safeFetch(
      `${URL_SERVER_TOMCAT}/api/boards/${boardId}/members/${memberPseudo}`,
      {
        method: "DELETE",
      },
    );

    if (!response.ok) {
      throw new APIException(
        APIErrorCode.INTERNAL_SERVER_ERROR,
        500,
        "Erreur lors de la suppression du membre du tableau",
      );
    }

    return true;
  }
}
