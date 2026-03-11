/**
 * @file server-deno/src/routes/boardRoutes.ts
 * @author Alex Plociennik
 * @description This file contains the routes for the board-related operations.
 * @version 1.0.0
 * @date 2024-06-01
 */

import { Router } from "@oak/oak";

export const boardRouter = new Router({ prefix: "/boards" });

boardRouter.get("/:boardId", (ctx) => {
    const boardId = ctx.params.boardId;
    ctx.response.body = `Get board with ID: ${boardId}`;
});