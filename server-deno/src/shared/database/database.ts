// src/shared/database/database.ts
import { MysqlClient } from "@db/mysql";

// Recupération des infos du .env
const host = Deno.env.get("DB_HOSTNAME") || "localhost";
const port = Deno.env.get("DB_PORT") || "3306";
const user = Deno.env.get("DB_USERNAME") || "";
const pass = Deno.env.get("DB_PASSWORD") || "";
const name = Deno.env.get("DB_NAME") || "";

// Construition de la chaîne de connexion au format mysql://user:pass@host:port/db
const connectionString = `mysql://${user}:${pass}@${host}:${port}/${name}`;

// Instantiation du client avec la chaîne
const client = new MysqlClient(connectionString);

// Connexion
await client.connect();

export default client;