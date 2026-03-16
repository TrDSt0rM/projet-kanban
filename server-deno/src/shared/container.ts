import { AuthService } from "../modules/auth/auth.service.ts";
import { BoardService } from "../modules/board/board.service.ts";

// Initialisation des services
export const authService = new AuthService();
export const boardService = new BoardService();

export const URL_SERVER_TOMCAT = "http://localhost:8080";