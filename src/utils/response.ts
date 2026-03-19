export class ResponseUtil {
  static success<T>(data: T, message?: string) {
    return {
      success: true,
      data,
      ...(message && { message }),
    };
  }

  static error(error: string, code: string) {
    return {
      success: false,
      error,
      code,
    };
  }
}
