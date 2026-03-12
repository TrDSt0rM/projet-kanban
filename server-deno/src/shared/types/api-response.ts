/**
 * @file server-deno/src/shared/types/api-exception.ts
 * @description This file contains the definition of the API response types, including success and failure responses, as well as the API error codes.
 * @version 1.0.0
 * @date 2026-03-12
 */

export type APIResponse<T> = APISuccess<T> | APIFailure;

interface APISuccess<T> {
  success: true;
  // error?: never;
  data: T;
}

export interface APIFailure {
  success: false;
  error: APIError;
  // data?: never;
}

export interface APIError {
  code: APIErrorCode;
  message: string;
}

export enum APIErrorCode {
  TIMEOUT = "TimeOut",
  NOT_FOUND = "NotFound",
  UNAUTHORIZED = "Unauthorized",
  FORBIDDEN = "Forbidden",
  VALIDATION_ERROR = "ValidationError",
  VOTE_ERROR = "VoteError",
  BAD_REQUEST = "BadRequest",
  INTERNAL_SERVER_ERROR = "InternalServerError",
}