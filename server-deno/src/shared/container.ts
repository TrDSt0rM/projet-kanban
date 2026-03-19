import { AuthService } from "../modules/auth/auth.service.ts";
import { BoardService } from "../modules/board/board.service.ts";
import { BoardColumnService } from "../modules/boardColumn/boardColumn.service.ts";
//import { CommentService } from "../modules/comment/comment.service.ts";
//import { TaskService } from "../modules/task/task.service.ts";
import { InvitationService } from "../modules/invitation/invitation.service.ts";
import { UserService } from "../modules/user/user.service.ts";

// Initialisation des services
export const authService = new AuthService();
export const boardService = new BoardService();
export const boardColumnService = new BoardColumnService();
//export const taskService = new TaskService();
//export const commentService = new CommentService();
export const invitationService = new InvitationService();
export const userService = new UserService();

export const URL_SERVER_TOMCAT = "http://localhost:8080";