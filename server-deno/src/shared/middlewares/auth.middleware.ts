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

export async function adminOnlyMiddleware(ctx: AuthContext, next: Next) {
  if (!(ctx.state.user?.role == "ADMIN")) {
    throw new APIException(APIErrorCode.UNAUTHORIZED, 403, "Accès admin requis");
  }

  await next();
}
