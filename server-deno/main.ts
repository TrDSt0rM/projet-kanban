import { Application, Router } from "@oak/oak";
import { oakCors } from "@tajpouria/cors";
import adminRouter from "./src/routes/admin.ts";

const app = new Application();
const rootRouter = new Router();

const PROTOCOL = "http";
const HOSTNAME = "localhost";
const PORT = 8000;
const ADDRESS = `${PROTOCOL}://${HOSTNAME}:${PORT}`;

rootRouter.use(
  "/api/admin",
  adminRouter.routes(),
  adminRouter.allowedMethods(),
);

app.use(oakCors());
app.use(rootRouter.routes());
app.use(rootRouter.allowedMethods());

app.addEventListener("listen", () => {
  console.log(`Server backend Deno (Sécurité) listening on ${ADDRESS}`);
});

if (import.meta.main) {
  await app.listen({ hostname: HOSTNAME, port: PORT });
}

export { app };
