import { Application } from "@oak/oak";
import { oakCors } from "@tajpouria/cors";
import { router as adminRouter } from "./src/modules/admin/admin.routes.ts";
import { router as authRouter } from "./src/modules/auth/auth.routes.ts";
import { router as boardRouter } from "./src/modules/board/board.routes.ts";
import { router as userRouter } from "./src/modules/user/user.routes.ts";
import { errorMiddleware } from "./src/shared/middlewares/error.middleware.ts";

// ---------- Configuration --------------------------------

const PROTOCOL = "http";
const HOSTNAME = "localhost";
const PORT = 8000;
const ADDRESS = `${PROTOCOL}://${HOSTNAME}:${PORT}`;

const app = new Application();

// ---------- Middlewares Globaux ---------------------------

app.use(oakCors({
    origin: "http://localhost:5173",
    optionsSuccessStatus: 200,
}));

// 2. Gestionnaire d'erreurs
app.use(errorMiddleware);

// ---------- Enregistrement des Routes ---------------------

app.use(adminRouter.routes(), adminRouter.allowedMethods());
app.use(authRouter.routes(), authRouter.allowedMethods());
app.use(boardRouter.routes(), boardRouter.allowedMethods());
app.use(userRouter.routes(), userRouter.allowedMethods());

// ---------- Démarrage du Serveur --------------------------

app.addEventListener("listen", () => {
  console.log(`Server backend Deno (Sécurité) listening on ${ADDRESS}`);
});

if (import.meta.main) {
  await app.listen({ hostname: HOSTNAME, port: PORT });
}

export { app };