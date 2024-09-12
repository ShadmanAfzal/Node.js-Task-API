import status_code from 'http-status-codes';

// Base class for HTTP-related errors
class HttpError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = 500;
  }
}

// Error class for 404 Not Found errors
export class NotFoundError extends HttpError {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = status_code.NOT_FOUND;
  }
}

// Error class for 401 Unauthorized errors
export class UnAuthorizedError extends HttpError {
  constructor(message: string) {
    super(message);
    this.name = 'UnAuthorizedError';
    this.statusCode = status_code.UNAUTHORIZED;
  }
}

// Error class for 400 Bad Request errors
export class BadRequestError extends HttpError {
  constructor(message: string) {
    super(message);
    this.name = 'BadRequestError';
    this.statusCode = status_code.BAD_REQUEST;
  }
}

// Error class for 500 Internal Server Error errors
export class InternalServerError extends HttpError {
  constructor(message: string) {
    super(message);
    this.name = 'InternalServerError';
    this.statusCode = status_code.INTERNAL_SERVER_ERROR;
  }
}

// Error class for 409 Conflict errors
export class ConflictError extends HttpError {
  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
    this.statusCode = status_code.CONFLICT;
  }
}

export default HttpError;
