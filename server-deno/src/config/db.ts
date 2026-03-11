import { Client } from "mysql";
import "dotenv";

const dbClient = await new Client().connect({
  hostname: Deno.env.get("DB_HOSTNAME") || "localhost",
  username: Deno.env.get("DB_USERNAME") || "",
  db: Deno.env.get("DB_NAME") || "",
  password: Deno.env.get("DB_PASSWORD") || "",
  port: Number(Deno.env.get("DB_PORT")) || 3306,
});

export default dbClient;
