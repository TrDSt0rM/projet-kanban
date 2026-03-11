import { Router } from "@oak/oak";
import dbClient from "../config/db.ts";

const adminRouter = new Router();

adminRouter.get("/users", async (ctx) => {
  const result = await dbClient.execute(
    "SELECT pseudo, role, isActive FROM APP_USER",
  );
  ctx.response.body = result.rows;
});

adminRouter.post("/users", async (ctx) => {
  const body = await ctx.request.body.json();
  const { pseudo, password, role } = body;

  await dbClient.execute(
    "INSERT INTO APP_USER (pseudo, password, role) VALUES (?, ?, ?)",
    [pseudo, password, role || "USER"],
  );

  ctx.response.status = 201;
  ctx.response.body = { message: `Utilisateur ${pseudo} créé.` };
});

adminRouter.delete("/users/:pseudo", async (ctx) => {
  const pseudo = ctx.params.pseudo;
  await dbClient.execute("DELETE FROM APP_USER WHERE pseudo = ?", [pseudo]);
  ctx.response.body = { message: "Utilisateur supprimé." };
});

export default adminRouter;
