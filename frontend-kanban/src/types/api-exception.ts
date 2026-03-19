/**
 * @file server-deno/src/shared/types/api-errorcode.ts
 * @description This file contains the definition of the API error codes and the APIException class.
 * @version 1.0.0
 * @date 2026-03-12
 */

import { APIErrorCode } from "./mod.ts";

export class APIException extends Error {
    readonly code: APIErrorCode;
    readonly status: number;

    constructor(code: APIErrorCode, status: number, message: string) {
        super(message);
        this.code = code;
        this.status = status;
    }
}