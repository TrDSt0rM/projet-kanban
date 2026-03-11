/**
 * @file server-deno/src/modules/auth/auth.service.ts
 * @description This file contains the service for the authentication-related operations.
 * @version 1.0.0
 * @date 2026-03-11
 */
import { UserRepository } from "../../shared/repositories/user.repository.ts";

export class AuthService {

    // Injection de dependance du repository utilisateur
    constructor(private userRepo: UserRepository) {}

    // connexion de l'utilisateur
    async login(pseudo: string, password: string) {
        const user = await this.userRepo
    }
}