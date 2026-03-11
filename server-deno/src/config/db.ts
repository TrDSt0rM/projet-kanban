import { Client } from "https://deno.land/x/mysql@v2.12.1/mod.ts";
import "https://deno.land/x/dotenv@v3.2.2/load.ts";

const dbClient = await new Client().connect({
  hostname: Deno.env.get("DB_HOSTNAME") || "localhost",
  username: Deno.env.get("DB_USERNAME") || "",
  db: Deno.env.get("DB_NAME") || "",
  password: Deno.env.get("DB_PASSWORD") || "",
  port: Number(Deno.env.get("DB_PORT")) || 3306,
});

export default dbClient;
