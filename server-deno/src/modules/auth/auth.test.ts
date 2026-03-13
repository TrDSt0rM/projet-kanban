/**
 * @file server-deno/src/modules/auth/auth.test.ts
 * @description This file contains the tests for the authentication module, including tests for the AuthService and its methods.
 * @version 1.0.0
 * @date 2026-03-13
 */
import { assertEquals, assert, assertRejects } from "@std/assert";
import { authService } from "../../shared/container.ts";
import { APIException } from "../../shared/types/mod.ts";
import { hashPassword } from "../../shared/utils/crypto.utils.ts";

Deno.test("AuthService.login - Succès avec simulation Tomcat", async () => {
  // Création d'un faux utilisateur que Tomcat est censé renvoyer et de son mot de passe hashé pour "password123"
  const password = "password123";
  const passwordHash = await hashPassword(password);

  const mockUser = {
    pseudo: "testeur",
    role: "USER",
    isActive: 1,
    // Hash pour "password123"
    password: passwordHash
  };

  // Mock du fetch global
  const originalFetch = globalThis.fetch;
  globalThis.fetch = () => 
    Promise.resolve(new Response(JSON.stringify(mockUser), { status: 200 }));

  try {
    const result = await authService.login("testeur", "password123");

    assert(result.token); // Le token doit être généré
    assertEquals(result.user.pseudo, "testeur");
  } finally {
    globalThis.fetch = originalFetch; // Restauration du fetch
  }
});

Deno.test("AuthService.login - Échec si mot de passe incorrect", async () => {
  const mockUser = {
    pseudo: "testeur",
    role: "USER",
    isActive: 1,
    password: "faux_hash.faux_sel" // Hash incorrect pour simuler un mot de passe erroné
  };

  const originalFetch = globalThis.fetch;
  globalThis.fetch = () => Promise.resolve(new Response(JSON.stringify(mockUser), { status: 200 }));

  try {
    // On vérifie que le service lève bien une exception
    await assertRejects(
      async () => await authService.login("testeur", "mauvais_pass"),
      APIException,
      "Pseudo ou mot de passe invalide"
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});