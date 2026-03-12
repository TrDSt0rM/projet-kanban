import { Router } from "@oak/oak";
import dbClient from "../shared/database/database.ts";

const authRouter = new Router();

authRouter.post("/login", async (ctx) => {
  const body = await ctx.request.body.json();
  const { pseudo, password } = body;

  // 1. Chercher l'utilisateur dans la DB
  const result = await dbClient.query(
    "SELECT pseudo, role, isActive FROM APP_USER WHERE pseudo = ? AND password = ?",
    [pseudo, password],
  );

  const user = result;

  // 2. Vérification
  if (!user) {
    ctx.response.status = 401;
    ctx.response.body = { message: "Identifiants incorrects." };
    return;
  }

  if (user.isActive === 0) {
    ctx.response.status = 403;
    ctx.response.body = { message: "Ce compte est désactivé." };
    return;
  }

  // 3. Succès (Plus tard on générera un JWT ici)
  ctx.response.status = 200;
  ctx.response.body = {
    user: {
      pseudo: user.pseudo,
      role: user.role,
    },
  };
});

export default authRouter;
