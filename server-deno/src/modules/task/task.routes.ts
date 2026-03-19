import { Router } from "@oak/oak";
import { authMiddleware } from "../../shared/middlewares/auth.middleware.ts";
import { taskService } from "../../shared/container.ts";
import { 
    APIException, APIErrorCode, APIResponse, TaskSummaryDto
} from "../../shared/types/mod.ts";

export const router = new Router();

router.use(authMiddleware);

router.get("/columns/:columnId/tasks", async (ctx) => {
    const columnId = ctx.params.columnId!;
    const userPseudo = ctx.state.user?.pseudo;

    // Vérification de l'authentification de l'utilisateur
    if (!userPseudo) {
        throw new APIException(APIErrorCode.UNAUTHORIZED, 401, "Utilisateur non authentifié");
    }

    // Récupération des tâches de la colonne depuis le service
    const tasks = await taskService.getTasksByColumnId(columnId, userPseudo);
    
    // Construction de la réponse
    const responseBody : APIResponse<TaskSummaryDto[]> = {
        success: true,
        data: tasks,
    }
    
    // Envoi de la réponse
    ctx.response.status = 200;
    ctx.response.body = responseBody;
});

router.post("/columns/:columnId/tasks", async (ctx) => {
    const columnId = ctx.params.columnId!;
    const userPseudo = ctx.state.user?.pseudo;

    // Vérification de l'authentification de l'utilisateur
    if (!userPseudo) {
        throw new APIException(APIErrorCode.UNAUTHORIZED, 401, "Utilisateur non authentifié");
    }

    // Récupération des données de la requête
    const taskRequest = await ctx.request.body.json();

    // Création de la tâche depuis le service
    const task = await taskService.createTask(columnId, taskRequest, userPseudo);
    
    // Construction de la réponse
    const responseBody : APIResponse<TaskSummaryDto> = {
        success: true,
        data: task,
    }
    
    // Envoi de la réponse
    ctx.response.status = 201;
    ctx.response.body = responseBody;
});

router.get("/tasks/:taskId", async (ctx) => {
    const taskId = ctx.params.taskId!;
    const userPseudo = ctx.state.user?.pseudo;
    
    // Vérification de l'authentification de l'utilisateur
    if (!userPseudo) {
        throw new APIException(APIErrorCode.UNAUTHORIZED, 401, "Utilisateur non authentifié");
    }

    // Récupération de la tâche depuis le service 
    const task = await taskService.getTaskById(taskId, userPseudo);

    // Construction de la réponse
    const responseBody : APIResponse<TaskSummaryDto> = {
        success: true,
        data: task,
    }
    
    // Envoi de la réponse
    ctx.response.status = 200;
    ctx.response.body = responseBody;
});

router.put("/tasks/:taskId", async (ctx) => {
    const taskId = ctx.params.taskId!;
    const userPseudo = ctx.state.user?.pseudo;

    // Vérification de l'authentification de l'utilisateur
    if (!userPseudo) {
        throw new APIException(APIErrorCode.UNAUTHORIZED, 401, "Utilisateur non authentifié");
    }

    // Récupération des données de la requête
    const taskUpdateRequest = await ctx.request.body.json();

    // Mise à jour de la tâche depuis le service
    const updatedTask = await taskService.updateTask(taskId, taskUpdateRequest, userPseudo);

    // Construction de la réponse
    const responseBody : APIResponse<TaskSummaryDto> = {
        success: true,
        data: updatedTask,
    }
    
    // Envoi de la réponse
    ctx.response.status = 200;
    ctx.response.body = responseBody;
});

router.delete("/tasks/:taskId", async (ctx) => {
    const taskId = ctx.params.taskId!;
    const userPseudo = ctx.state.user?.pseudo;

    // Vérification de l'authentification de l'utilisateur
    if (!userPseudo) {
        throw new APIException(APIErrorCode.UNAUTHORIZED, 401, "Utilisateur non authentifié");
    }

    // Suppression de la tâche depuis le service
    await taskService.deleteTask(taskId, userPseudo);

    // Construction de la réponse
    const responseBody : APIResponse<null> = {
        success: true,
        data: null,
    }
    
    // Envoi de la réponse
    ctx.response.status = 204;
    ctx.response.body = responseBody;
});

router.patch("/tasks/:taskId/move", async (ctx) => {
    const taskId = ctx.params.taskId!;
    const userPseudo = ctx.state.user?.pseudo;

    // Vérification de l'authentification de l'utilisateur
    if (!userPseudo) {
        throw new APIException(APIErrorCode.UNAUTHORIZED, 401, "Utilisateur non authentifié");
    }

    // Récupération des données de la requête
    const taskMoveRequest = await ctx.request.body.json();

    // Déplacement de la tâche depuis le service
    await taskService.moveTask(taskId, taskMoveRequest, userPseudo);

    // Construction de la réponse
    const responseBody : APIResponse<null> = {
        success: true,
        data: null,
    }
    
    // Envoi de la réponse
    ctx.response.status = 204;
    ctx.response.body = responseBody;
});

router.patch("/tasks/:taskId/position", async (ctx) => {
    const taskId = ctx.params.taskId!;
    const userPseudo = ctx.state.user?.pseudo;
    
    // Vérification de l'authentification de l'utilisateur
    if (!userPseudo) {
        throw new APIException(APIErrorCode.UNAUTHORIZED, 401, "Utilisateur non authentifié");
    }

    // Récupération des données de la requête
    const taskPositionRequest = await ctx.request.body.json();
    
    // Mise à jour de la position de la tâche depuis le service
    await taskService.updateTaskPosition(taskId, taskPositionRequest, userPseudo);

    // Construction de la réponse
    const responseBody : APIResponse<null> = {
        success: true,
        data: null,
    }
    
    // Envoi de la réponse
    ctx.response.status = 204;
    ctx.response.body = responseBody;
});

router.patch("/tasks/:taskId/assign", async (ctx) => {
    const taskId = ctx.params.taskId!;
    const userPseudo = ctx.state.user?.pseudo;
    
    // Vérification de l'authentification de l'utilisateur
    if (!userPseudo) {
        throw new APIException(APIErrorCode.UNAUTHORIZED, 401, "Utilisateur non authentifié");
    }

    // Récupération des données de la requête
    const taskAssignRequest = await ctx.request.body.json();
    
    // Assignation de la tâche depuis le service
    const assignedTask = await taskService.assignTask(taskId, taskAssignRequest, userPseudo);

    // Construction de la réponse
    const responseBody : APIResponse<TaskSummaryDto> = {
        success: true,
        data: assignedTask,
    }

    // Envoi de la réponse
    ctx.response.status = 200;
    ctx.response.body = responseBody;
});

router.get("/boards/:boardId/tasks/search", async (ctx) => {
    const boardId = ctx.params.boardId!;
    const userPseudo = ctx.state.user?.pseudo;

    if (!userPseudo) {
        throw new APIException(APIErrorCode.UNAUTHORIZED, 401, "Utilisateur non authentifié");
    }

    const keyword = ctx.request.url.searchParams.get("keyword");
    const priority = ctx.request.url.searchParams.get("priority");
    const assignedTo = ctx.request.url.searchParams.get("assignedTo");

    let tasks: TaskSummaryDto[] = []; 

    if (keyword) {
        tasks = await taskService.searchTasksByKeyword(boardId, keyword, userPseudo);
    } else if (priority) {
        tasks = await taskService.searchTasksByPriority(boardId, priority, userPseudo);
    } else if (assignedTo) {
        tasks = await taskService.searchTasksByAssignedTo(boardId, assignedTo, userPseudo);
    }

    ctx.response.status = 200;
    ctx.response.body = { 
        success: true, 
        data: tasks 
    };
});
