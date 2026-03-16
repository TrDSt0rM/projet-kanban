/**
 * @file server-deno/src/utils/gateway.utils.ts
 * @description This file contains utility functions for the gateway, such as safeFetch to handle network errors when communicating with the Tomcat server.
 * @version 1.0.0
 * @date 2026-03-16
 */
import { APIException } from "../types/api-exception.ts";
import { APIErrorCode } from "../types/api-response.ts";

/**
 * Exécute un fetch de manière sécurisée en capturant les erreurs réseau (ex: Tomcat down).
 * Lance une APIException 503 si le serveur distant est injoignable.
 * @param url L'URL à laquelle faire la requête
 * @param options Les options de la requête (méthode, headers, body, etc.)
 * @returns La réponse du fetch si réussi
 * @throws APIException avec code 503 si une erreur réseau survient
 */
export async function safeFetch(url: string, options?: RequestInit): Promise<Response> {
    try {
        return await fetch(url, options);
    } catch (err) {
        console.error("GATEWAY_NETWORK_ERROR:", err);
        
        throw new APIException(
            APIErrorCode.INTERNAL_SERVER_ERROR,
            503, // Service Unavailable
            "Le serveur de données (Tomcat) est actuellement injoignable."
        );
    }
}