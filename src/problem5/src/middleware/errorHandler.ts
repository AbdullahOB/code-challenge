import { Request, Response, NextFunction } from 'express';

export interface CustomError extends Error {
    statusCode?: number;
    isOperational?: boolean;
}

export const errorHandler = (
    err: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    console.error('Error:', err);

    // Default error values
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    let isOperational = err.isOperational || false;

    // Handle specific error types
    if (err.message.includes('Email already exists')) {
        statusCode = 409;
        message = 'Email already exists';
        isOperational = true;
    }

    if (err.message.includes('SQLITE_CONSTRAINT')) {
        statusCode = 400;
        message = 'Database constraint violation';
        isOperational = true;
    }

    if (err.message.includes('ENOENT')) {
        statusCode = 404;
        message = 'File not found';
        isOperational = true;
    }

    // Development vs Production error responses
    const errorResponse: any = {
        status: 'error',
        message: message
    };

    if (process.env.NODE_ENV === 'development') {
        errorResponse.stack = err.stack;
        errorResponse.details = {
            name: err.name,
            isOperational
        };
    }

    res.status(statusCode).json(errorResponse);
};

export const asyncHandler = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

export const createError = (message: string, statusCode: number = 500): CustomError => {
    const error = new Error(message) as CustomError;
    error.statusCode = statusCode;
    error.isOperational = true;
    return error;
};