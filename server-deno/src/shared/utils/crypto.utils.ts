import { randomBytes, scrypt } from "node:crypto";
import { jwtVerify, SignJWT } from "@panva/jose";

import { LoginPayload } from "../../modules/auth/auth.types.ts";
import { isLoginPayload } from "../../modules/auth/auth.typeguads.ts";

const JWT_SECRET = "projet-kanban-SOR-SI-2026"; 
const JWT_KEY = new TextEncoder().encode(JWT_SECRET);

export async function createJWT(
  payload: Omit<LoginPayload, "exp">,
): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h")
    .sign(JWT_KEY);
}

export async function verifyJWT(token: string): Promise<LoginPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_KEY);

    if (!isLoginPayload(payload)) {
      return null;
    }

    return payload;
  } catch (err) {
    console.error("JWT verification failed:", err);
    return null;
  }
}

export function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");

  return new Promise((resolve, reject) => {
    scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(`${derivedKey.toString("hex")}.${salt}`);
    });
  });
}

/**
 * Méthode 
 * @param password le mot de passe à vérifier
 * @param storedHash le mot de passe stocké en base
 */
export function verifyPassword(
  password: string,
  storedHash: string,
): Promise<boolean> {
  const [hash, salt] = storedHash.split(".");

  return new Promise((resolve, reject) => {
    scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(hash === derivedKey.toString("hex"));
    });
  });
}
