/**
 * @file server-deno/src/modules/board/board.service.ts
 * @description This file contains the service for the board-related operations.
 * @version 1.0.0
 * @date 2026-03-16
 */
import { URL_SERVER_TOMCAT } from "../../shared/container.ts";
import { APIErrorCode, APIException, BoardDto, CreateBoardRequest, BoardMemberDto } from "../../shared/types/mod.ts";
import { isBoardDto, isBoardMemberDto } from "../../shared/utils/typeguards.ts";
import { safeFetch } from "../../shared/utils/gateway.utils.ts";

export class BoardService {

    constructor() {}

    async getBoardById(id: string) {
        const response = await safeFetch(`${URL_SERVER_TOMCAT}/boards/user/${id}`);
        
        if (!response.ok) {
            if (response.status === 404) {
            throw new APIException(APIErrorCode.NOT_FOUND, 404, "Tableau inconnu");
            }
            throw new APIException(APIErrorCode.INTERNAL_SERVER_ERROR, 500, "Erreur interne Tomcat.");
        }

        const board = await response.json();

        if(! isBoardDto(board)){
            throw new APIException(APIErrorCode.INTERNAL_SERVER_ERROR, 500, "Données tomcat board invalides");
        }
    
        return board;
    }

    async getBoardByPseudo(pseudo: string) {
        const response = await safeFetch(`${URL_SERVER_TOMCAT}/boards?userPseudo=${pseudo}`);

        if (!response.ok) {
            if (response.status === 404) {
                throw new APIException(APIErrorCode.NOT_FOUND, 404, "ce pseudo ne correspond à aucun tableau");
            }
            throw new APIException(APIErrorCode.INTERNAL_SERVER_ERROR, 500, "Erreur interne Tomcat.");
        }

        const boards: BoardDto[] = await response.json();

        if(!boards || boards.every(isBoardDto)){
            throw new APIException(APIErrorCode.INTERNAL_SERVER_ERROR, 500, "Données tomcat tableau invalides");
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

        // Création d'un id unique pour le tableau et du tableau à créer
        const boardId = crypto.randomUUID();
        const newBoard: BoardDto = {
            id: boardId,
            name: request.name,
            ownerPseudo: owner,
            members: [owner],
            columns: [],
        }

        // envoie de la requête de création du tableau à Tomcat
        const response = await safeFetch(`${URL_SERVER_TOMCAT}/boards`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newBoard),
        });

        // Récupération du tableau créé depuis la réponse de Tomcat
        const createdBoard = await response.json();

        // Vérification de la réponse de Tomcat et des données retournées
        if (!response.ok){
            throw new APIException(APIErrorCode.INTERNAL_SERVER_ERROR, 500, "Erreur lors de la création du tableau");
        }
        if(!isBoardDto(createdBoard)){
            throw new APIException(APIErrorCode.INTERNAL_SERVER_ERROR, 500, "Données tomcat tableau invalides");
        }

        // Retour du tableau créé
        return createdBoard;
    }

    // à vérifier
    async modifyBoard(id: string) {
        const response = await safeFetch(`${URL_SERVER_TOMCAT}/boards/${id}`, {
            method: "PUT",
        });
        
        if (!response.ok) {
            throw new APIException(APIErrorCode.INTERNAL_SERVER_ERROR, 500, "Erreur lors de la modification du tableau");
        }

        const modifiedBoard = await response.json();

        if(! isBoardDto(modifiedBoard)){
            throw new APIException(APIErrorCode.INTERNAL_SERVER_ERROR, 500, "Données tomcat tableau invalides");
        }

        return modifiedBoard;
    }


    async deleteBoard(id: string) {
        const response = await safeFetch(`${URL_SERVER_TOMCAT}/boards/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new APIException(APIErrorCode.INTERNAL_SERVER_ERROR, 500, "Erreur lors de la suppression du tableau");
        }

        return true;
    }

    async getBoardMembers(id: string) {
        const response = await safeFetch(`${URL_SERVER_TOMCAT}/boards/${id}/members`);
        
        if (!response.ok) {
            throw new APIException(APIErrorCode.INTERNAL_SERVER_ERROR, 500, "Erreur lors de la récupération des membres du tableau");
        }

        const members: BoardMemberDto[] = await response.json();

        if(!members || members.every(isBoardMemberDto)){
            throw new APIException(APIErrorCode.INTERNAL_SERVER_ERROR, 500, "Données tomcat membres du tableau invalides");
        }

        return members;
    }

    async removeBoardMember(boardId: string, memberPseudo: string) {
        const response = await safeFetch(`${URL_SERVER_TOMCAT}/boards/${boardId}/members/${memberPseudo}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new APIException(APIErrorCode.INTERNAL_SERVER_ERROR, 500, "Erreur lors de la suppression du membre du tableau");
        }

        return true;
    }
}