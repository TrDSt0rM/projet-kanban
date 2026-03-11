import client from "./database/database.ts";
import { UserRepository } from "./repositories/user.repository.ts";
import { AuthService } from "../modules/auth/auth.service.ts";

// connexion mariadb
const db = client; 

// Création du Repository en lui donnant la DB
export const userRepository = new UserRepository(db);

// Création du service avec injection du repository
export const authService = new AuthService(userRepository);