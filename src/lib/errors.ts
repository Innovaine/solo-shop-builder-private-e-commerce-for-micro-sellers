// Structured error handling with error codes
// Provides consistent error responses across all API routes

export enum ErrorCode {
  // Authentication errors (1xxx)
  UNAUTHORIZED = 'AUTH_001',
  TOKEN_EXPIRED = 'AUTH_002',
  TOKEN_INVALID = 'AUTH_003',
  TOKEN_ALREADY_USED = 'AUTH_004',
  RATE_LIMIT_EXCEEDED = 'AUTH_005',
  
  // Validation errors (2xxx)
  INVALID_INPUT = 'VAL_001',
  MISSING_FIELD = 'VAL_002',
  
  // Resource errors (3xxx)
  NOT_FOUND = 'RES_001',
  ALREADY_EXISTS = 'RES_002',
  
  // Server errors (5xxx)
  INTERNAL_ERROR = 'SRV_001',
  DATABASE_ERROR = 'SRV_002',
  EMAIL_ERROR = 'SRV_003',
}

export interface ErrorResponse {
  error: string
  code: ErrorCode
  message: string
  timestamp: string
  requestId?: string
  details?: unknown
}

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    public message: string,
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message)
    this.name = 'AppError'
  }

  toJSON(): ErrorResponse {
    return {
      error: this.name,
      code: this.code,
      message: this.message,
      timestamp: new Date().toISOString(),
      details: this.details,
    }
  }
}

// Factory functions for common errors
export const Errors = {
  Unauthorized: (message = 'Authentication required') =>
    new AppError(ErrorCode.UNAUTHORIZED, message, 401),
  
  TokenExpired: (message = 'Token has expired') =>
    new AppError(ErrorCode.TOKEN_EXPIRED, message, 403),
  
  TokenInvalid: (message = 'Invalid token') =>
    new AppError(ErrorCode.TOKEN_INVALID, message, 403),
  
  TokenAlreadyUsed: (message = 'Token already used') =>
    new AppError(ErrorCode.TOKEN_ALREADY_USED, message, 403),
  
  RateLimitExceeded: (message = 'Too many requests') =>
    new AppError(ErrorCode.RATE_LIMIT_EXCEEDED, message, 429),
  
  InvalidInput: (message = 'Invalid input', details?: unknown) =>
    new AppError(ErrorCode.INVALID_INPUT, message, 400, details),
  
  MissingField: (field: string) =>
    new AppError(ErrorCode.MISSING_FIELD, `Missing required field: ${field}`, 400),
  
  NotFound: (resource: string) =>
    new AppError(ErrorCode.NOT_FOUND, `${resource} not found`, 404),
  
  AlreadyExists: (resource: string) =>
    new AppError(ErrorCode.ALREADY_EXISTS, `${resource} already exists`, 400),
  
  InternalError: (message = 'Internal server error') =>
    new AppError(ErrorCode.INTERNAL_ERROR, message, 500),
  
  DatabaseError: (message = 'Database error') =>
    new AppError(ErrorCode.DATABASE_ERROR, message, 500),
  
  EmailError: (message = 'Email service error') =>
    new AppError(ErrorCode.EMAIL_ERROR, message, 500),
}

// Helper to format error response
export function formatErrorResponse(
  error: unknown,
  requestId?: string
): { response: ErrorResponse; status: number } {
  if (error instanceof AppError) {
    return {
      response: { ...error.toJSON(), requestId },
      status: error.statusCode,
    }
  }
  
  // Handle unknown errors
  const message = error instanceof Error ? error.message : 'Unknown error'
  return {
    response: {
      error: 'InternalError',
      code: ErrorCode.INTERNAL_ERROR,
      message,
      timestamp: new Date().toISOString(),
      requestId,
    },
    status: 500,
  }
}
