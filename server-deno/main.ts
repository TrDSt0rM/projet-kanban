import { Application, Router } from "@oak/oak";
import { oakCors } from "@tajpouria/cors";

// =========== Router Setup ==========

const router = new Router();

router.get("/", (ctx) => {
  ctx.response.body = "Hello, World!";
});

// ========== Utility Functions ==========

export function add(a: number, b: number): number {
  return a + b;
}

if (import.meta.main) {
  console.log("Add 2 + 3 =", add(2, 3));
}

// =========== Main Application Code ==========

const PROTOCOL = "http";
const HOSTNAME = "localhost";
const PORT = 8000;
const ADDRESS = `${PROTOCOL}://${HOSTNAME}:${PORT}`;

const app = new Application();

app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener(
  "listen",
  () => console.log(`Server listening on ${ADDRESS}`),
);

if (import.meta.main) {
  await app.listen({ hostname: HOSTNAME, port: PORT });
}

export { app }; 


