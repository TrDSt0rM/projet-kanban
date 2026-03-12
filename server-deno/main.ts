import { Application, Router } from "@oak/oak";
import { oakCors } from "@tajpouria/cors";
import adminRouter from "./src/routes/admin.ts";
import { router as authRouter } from "./src/modules/auth/auth.routes.ts";

// ---------- HTTP Router --------------------------------

const rootRouter = new Router();

// ---------- Application --------------------------------

const PROTOCOL = "http";
const HOSTNAME = "localhost";
const PORT = 8000;
const ADDRESS = `${PROTOCOL}://${HOSTNAME}:${PORT}`;

const app = new Application();

rootRouter.use(
  "/api/admin",
  adminRouter.routes(),
  adminRouter.allowedMethods(),
);

app.use(oakCors());
app.use(rootRouter.routes(), rootRouter.allowedMethods());
app.use(authRouter.routes(), authRouter.allowedMethods());

app.addEventListener("listen", () => {
  console.log(`Server backend Deno (Sécurité) listening on ${ADDRESS}`);
});

if (import.meta.main) {
  await app.listen({ hostname: HOSTNAME, port: PORT });
}

export { app };
