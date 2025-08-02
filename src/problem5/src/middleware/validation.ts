import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export interface ValidationError {
    field: string;
    message: string;
}

export const validateBody = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
            convert: true
        });

        if (error) {
            const validationErrors: ValidationError[] = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));

            res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                errors: validationErrors
            });
            return;
        }

        req.body = value;
        next();
    };
};

export const validateQuery = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const { error, value } = schema.validate(req.query, {
            abortEarly: false,
            stripUnknown: true,
            convert: true
        });

        if (error) {
            const validationErrors: ValidationError[] = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));

            res.status(400).json({
                status: 'error',
                message: 'Query validation failed',
                errors: validationErrors
            });
            return;
        }

        req.query = value;
        next();
    };
};

export const validateParams = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const { error, value } = schema.validate(req.params, {
            abortEarly: false,
            stripUnknown: true,
            convert: true
        });

        if (error) {
            const validationErrors: ValidationError[] = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));

            res.status(400).json({
                status: 'error',
                message: 'Parameter validation failed',
                errors: validationErrors
            });
            return;
        }

        req.params = value;
        next();
    };
};