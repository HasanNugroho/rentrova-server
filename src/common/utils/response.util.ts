import type { ApiResponse, ApiErrorResponse, PaginationMeta } from '../interfaces/response.interface.ts';

export class ResponseUtil {
  static success<T>(data: T, message = 'Success', meta?: PaginationMeta): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
      ...(meta && { meta }),
    };
  }

  static error(message: string, code = 500, errors?: string[]): ApiErrorResponse {
    return {
      success: false,
      message,
      code,
      ...(errors && { errors }),
    };
  }

  static created<T>(data: T, message = 'Resource created successfully'): ApiResponse<T> {
    return this.success(data, message);
  }

  static updated<T>(data: T, message = 'Resource updated successfully'): ApiResponse<T> {
    return this.success(data, message);
  }

  static deleted(message = 'Resource deleted successfully'): ApiResponse<null> {
    return this.success(null, message);
  }

  static notFound(message = 'Resource not found'): ApiErrorResponse {
    return this.error(message, 404);
  }

  static badRequest(message = 'Bad request', errors?: string[]): ApiErrorResponse {
    return this.error(message, 400, errors);
  }

  static unauthorized(message = 'Unauthorized'): ApiErrorResponse {
    return this.error(message, 401);
  }

  static forbidden(message = 'Forbidden'): ApiErrorResponse {
    return this.error(message, 403);
  }

  static conflict(message = 'Conflict'): ApiErrorResponse {
    return this.error(message, 409);
  }

  static internalError(message = 'Internal server error'): ApiErrorResponse {
    return this.error(message, 500);
  }
}
