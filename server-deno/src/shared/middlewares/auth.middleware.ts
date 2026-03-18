import { Context, Next, State } from "@oak/oak";
import { verifyJWT } from "../utils/crypto.utils.ts";
import { APIErrorCode, APIException } from "../types/mod.ts";
import { LoginPayload } from "../../modules/auth/auth.types.ts";

export interface AuthContext extends Context {
  state: AuthState;
}

export interface AuthState extends State {
  user?: LoginPayload;
}

/**
 * Vérifie que la requête contient un token JWT valide dans l'en-tête Authorization et ajoute les informations de l'utilisateur au contexte de la requête.
 * @param ctx le contexte de la requête, qui doit être de type AuthContext pour que les informations de l'utilisateur puissent être ajoutées à ctx.state.user
 * @param next la fonction à appeler pour passer au middleware suivant si le token est valide
 * @throws 401 si le token est manquant, mal formaté ou invalide
 */
export async function authMiddleware(ctx: AuthContext, next: Next) {
  const authHeader = ctx.request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new APIException(APIErrorCode.UNAUTHORIZED, 401, "Token manquant ou mal formaté");
  }

  const token = authHeader.substring(7);
  const payload = await verifyJWT(token);

  if (!payload) {
    throw new APIException(APIErrorCode.UNAUTHORIZED, 401, "Token invalide");
  }

  ctx.state.user = payload;

  await next();
}

/**
 * Vérifie que l'utilisateur authentifié a le rôle d'administrateur pour accéder à certaines routes.
 * @param ctx le contexte de la requête, qui doit être de type AuthContext pour que les informations de l'utilisateur puissent être vérifiées
 * @param next la fonction à appeler pour passer au middleware suivant si l'utilisateur a le rôle d'administrateur
 * @throws 403 si l'utilisateur n'a pas le rôle d'administrateur
 */
export async function adminOnlyMiddleware(ctx: AuthContext, next: Next) {
  if (!(ctx.state.user?.role == "ADMIN")) {
    throw new APIException(APIErrorCode.UNAUTHORIZED, 403, "Accès admin requis");
  }

  await next();
}
