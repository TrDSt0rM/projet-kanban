/**
 * @file server-deno/src/shared/utils/crypto.test.ts
 * @description This file contains tests for the cryptographic utilities, including password hashing and JWT handling.
 * @version 1.0.0
 * @date 2026-03-12
 */
import { assertEquals, assert } from "@std/assert";
import { hashPassword, verifyPassword, createJWT, verifyJWT } from "./crypto.utils.ts";

Deno.test("CryptoUtils - Hachage et vérification de mot de passe", async () => {
  const password = "monPasswordSecurise";
  const hash = await hashPassword(password);
  
  // Vérifie que le format est bien hash.sel
  assert(hash.includes("."));
  
  const isValid = await verifyPassword(password, hash);
  assertEquals(isValid, true);
  
  const isInvalid = await verifyPassword("mauvaisPass", hash);
  assertEquals(isInvalid, false);
});

Deno.test("CryptoUtils - Génération et vérification de JWT", async () => {
  const payload = { pseudo: "admin", role: "ADMIN" };
  const token = await createJWT(payload);
  
  assert(token.length > 0);
  
  const decoded = await verifyJWT(token);
  assertEquals(decoded?.pseudo, "admin");
  assertEquals(decoded?.role, "ADMIN");
});