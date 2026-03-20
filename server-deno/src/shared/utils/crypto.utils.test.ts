/**
 * @file server-deno/src/shared/utils/crypto.test.ts
 * @description This file contains tests for the cryptographic utilities, including password hashing and JWT handling.
 * @version 1.0.0
 * @date 2026-03-20
 */
import { assertEquals, assertNotEquals, assertExists } from "@std/assert";
import { createJWT, verifyJWT, hashPassword, verifyPassword } from "./crypto.utils.ts";

// =====================
// createJWT
// =====================

Deno.test("createJWT — retourne une string non vide", async () => {
    const token = await createJWT({ pseudo: "alice", role: "USER" });
    assertExists(token);
    assertEquals(typeof token, "string");
    assertEquals(token.length > 0, true);
});

Deno.test("createJWT — retourne un JWT au format valide (3 parties séparées par des points)", async () => {
    const token = await createJWT({ pseudo: "alice", role: "USER" });
    const parts = token.split(".");
    assertEquals(parts.length, 3);
});

Deno.test("createJWT — deux appels avec le même payload retournent des tokens différents (exp différent)", async () => {
    const token1 = await createJWT({ pseudo: "alice", role: "USER" });
    await new Promise(resolve => setTimeout(resolve, 1000));
    const token2 = await createJWT({ pseudo: "alice", role: "USER" });
    assertNotEquals(token1, token2);
});

Deno.test("createJWT — fonctionne avec le rôle ADMIN", async () => {
    const token = await createJWT({ pseudo: "admin", role: "ADMIN" });
    assertExists(token);
    assertEquals(typeof token, "string");
});

// =====================
// verifyJWT
// =====================

Deno.test("verifyJWT — retourne le payload pour un token valide", async () => {
    const token = await createJWT({ pseudo: "alice", role: "USER" });
    const payload = await verifyJWT(token);
    assertExists(payload);
    assertEquals(payload?.pseudo, "alice");
    assertEquals(payload?.role, "USER");
});

Deno.test("verifyJWT — retourne null pour un token invalide", async () => {
    const payload = await verifyJWT("token.invalide.ici");
    assertEquals(payload, null);
});

Deno.test("verifyJWT — retourne null pour une string vide", async () => {
    const payload = await verifyJWT("");
    assertEquals(payload, null);
});

Deno.test("verifyJWT — retourne null pour un token falsifié", async () => {
    const token = await createJWT({ pseudo: "alice", role: "USER" });
    const parts = token.split(".");
    // Modifie la signature
    const falsifiedToken = `${parts[0]}.${parts[1]}.signaturefalsifiee`;
    const payload = await verifyJWT(falsifiedToken);
    assertEquals(payload, null);
});

Deno.test("verifyJWT — retourne null pour un token avec payload falsifié", async () => {
    const token = await createJWT({ pseudo: "alice", role: "USER" });
    const parts = token.split(".");
    // Modifie le payload en base64
    const falsifiedPayload = btoa(JSON.stringify({ pseudo: "hacker", role: "ADMIN" }));
    const falsifiedToken = `${parts[0]}.${falsifiedPayload}.${parts[2]}`;
    const payload = await verifyJWT(falsifiedToken);
    assertEquals(payload, null);
});

Deno.test("verifyJWT — le payload contient un champ exp", async () => {
    const token = await createJWT({ pseudo: "alice", role: "USER" });
    const payload = await verifyJWT(token);
    assertExists(payload?.exp);
    assertEquals(typeof payload?.exp, "number");
});

// =====================
// hashPassword
// =====================

Deno.test("hashPassword — retourne une string non vide", async () => {
    const hash = await hashPassword("monMotDePasse");
    assertExists(hash);
    assertEquals(typeof hash, "string");
    assertEquals(hash.length > 0, true);
});

Deno.test("hashPassword — le hash contient un séparateur point (hash.salt)", async () => {
    const hash = await hashPassword("monMotDePasse");
    const parts = hash.split(".");
    assertEquals(parts.length, 2);
    assertEquals(parts[0].length > 0, true); // hash
    assertEquals(parts[1].length > 0, true); // salt
});

Deno.test("hashPassword — deux hashs du même mot de passe sont différents (salt aléatoire)", async () => {
    const hash1 = await hashPassword("monMotDePasse");
    const hash2 = await hashPassword("monMotDePasse");
    assertNotEquals(hash1, hash2);
});

Deno.test("hashPassword — deux mots de passe différents donnent des hashs différents", async () => {
    const hash1 = await hashPassword("motDePasse1");
    const hash2 = await hashPassword("motDePasse2");
    assertNotEquals(hash1, hash2);
});

Deno.test("hashPassword — fonctionne avec un mot de passe vide", async () => {
    const hash = await hashPassword("");
    assertExists(hash);
    assertEquals(typeof hash, "string");
});

Deno.test("hashPassword — fonctionne avec des caractères spéciaux", async () => {
    const hash = await hashPassword("P@ssw0rd!#€&*()");
    assertExists(hash);
    assertEquals(typeof hash, "string");
});

Deno.test("hashPassword — fonctionne avec un mot de passe très long", async () => {
    const longPassword = "a".repeat(1000);
    const hash = await hashPassword(longPassword);
    assertExists(hash);
    assertEquals(typeof hash, "string");
});

// =====================
// verifyPassword
// =====================

Deno.test("verifyPassword — retourne true pour un mot de passe correct", async () => {
    const password = "monMotDePasse";
    const hash = await hashPassword(password);
    const result = await verifyPassword(password, hash);
    assertEquals(result, true);
});

Deno.test("verifyPassword — retourne false pour un mot de passe incorrect", async () => {
    const hash = await hashPassword("monMotDePasse");
    const result = await verifyPassword("mauvaisMotDePasse", hash);
    assertEquals(result, false);
});

Deno.test("verifyPassword — retourne false pour une string vide contre un hash valide", async () => {
    const hash = await hashPassword("monMotDePasse");
    const result = await verifyPassword("", hash);
    assertEquals(result, false);
});

Deno.test("verifyPassword — retourne true pour un mot de passe vide hashé puis vérifié", async () => {
    const hash = await hashPassword("");
    const result = await verifyPassword("", hash);
    assertEquals(result, true);
});

Deno.test("verifyPassword — retourne false si le hash est modifié", async () => {
    const hash = await hashPassword("monMotDePasse");
    const parts = hash.split(".");
    const falsifiedHash = `hashinvalide.${parts[1]}`;
    const result = await verifyPassword("monMotDePasse", falsifiedHash);
    assertEquals(result, false);
});

Deno.test("verifyPassword — retourne false si le salt est modifié", async () => {
    const hash = await hashPassword("monMotDePasse");
    const parts = hash.split(".");
    const falsifiedHash = `${parts[0]}.saltinvalide`;
    const result = await verifyPassword("monMotDePasse", falsifiedHash);
    assertEquals(result, false);
});

Deno.test("verifyPassword — fonctionne avec des caractères spéciaux", async () => {
    const password = "P@ssw0rd!#€&*()";
    const hash = await hashPassword(password);
    const result = await verifyPassword(password, hash);
    assertEquals(result, true);
});

Deno.test("verifyPassword — fonctionne avec un mot de passe très long", async () => {
    const password = "a".repeat(1000);
    const hash = await hashPassword(password);
    const result = await verifyPassword(password, hash);
    assertEquals(result, true);
});

// =====================
// Intégration createJWT + verifyJWT
// =====================

Deno.test("Intégration — token créé avec USER est bien vérifié", async () => {
    const token = await createJWT({ pseudo: "alice", role: "USER" });
    const payload = await verifyJWT(token);
    assertEquals(payload?.pseudo, "alice");
    assertEquals(payload?.role, "USER");
});

Deno.test("Intégration — token créé avec ADMIN est bien vérifié", async () => {
    const token = await createJWT({ pseudo: "admin", role: "ADMIN" });
    const payload = await verifyJWT(token);
    assertEquals(payload?.pseudo, "admin");
    assertEquals(payload?.role, "ADMIN");
});

// =====================
// Intégration hashPassword + verifyPassword
// =====================

Deno.test("Intégration — hash puis verify retourne toujours true pour le bon mot de passe", async () => {
    const passwords = ["simple", "C0mpl3x!", "  espaces  ", "123456", "🔑emoji"];
    for (const password of passwords) {
        const hash = await hashPassword(password);
        const result = await verifyPassword(password, hash);
        assertEquals(result, true, `Échec pour le mot de passe: ${password}`);
    }
});

Deno.test("Intégration — hash puis verify retourne toujours false pour un mauvais mot de passe", async () => {
    const hash = await hashPassword("correct");
    const wrongPasswords = ["incorrect", "CORRECT", "correct ", " correct", ""];
    for (const wrong of wrongPasswords) {
        const result = await verifyPassword(wrong, hash);
        assertEquals(result, false, `Devrait être false pour: ${wrong}`);
    }
});