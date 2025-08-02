import Joi from 'joi';

export const createUserSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.empty': 'Name is required',
            'string.min': 'Name must be at least 2 characters long',
            'string.max': 'Name cannot exceed 100 characters'
        }),

    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please provide a valid email address',
            'string.empty': 'Email is required'
        }),

    age: Joi.number()
        .integer()
        .min(16)
        .max(120)
        .optional()
        .messages({
            'number.base': 'Age must be a number',
            'number.integer': 'Age must be a whole number',
            'number.min': 'Age must be at least 16',
            'number.max': 'Age cannot exceed 120'
        }),

    department: Joi.string()
        .max(50)
        .optional()
        .allow(null, '')
        .messages({
            'string.max': 'Department cannot exceed 50 characters'
        }),

    salary: Joi.number()
        .precision(2)
        .min(0)
        .max(999999.99)
        .optional()
        .messages({
            'number.base': 'Salary must be a number',
            'number.min': 'Salary cannot be negative',
            'number.max': 'Salary cannot exceed 999,999.99'
        })
});

export const updateUserSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(100)
        .optional()
        .messages({
            'string.min': 'Name must be at least 2 characters long',
            'string.max': 'Name cannot exceed 100 characters'
        }),

    email: Joi.string()
        .email()
        .optional()
        .messages({
            'string.email': 'Please provide a valid email address'
        }),

    age: Joi.number()
        .integer()
        .min(16)
        .max(120)
        .optional()
        .messages({
            'number.base': 'Age must be a number',
            'number.integer': 'Age must be a whole number',
            'number.min': 'Age must be at least 16',
            'number.max': 'Age cannot exceed 120'
        }),

    department: Joi.string()
        .max(50)
        .optional()
        .allow(null, '')
        .messages({
            'string.max': 'Department cannot exceed 50 characters'
        }),

    salary: Joi.number()
        .precision(2)
        .min(0)
        .max(999999.99)
        .optional()
        .messages({
            'number.base': 'Salary must be a number',
            'number.min': 'Salary cannot be negative',
            'number.max': 'Salary cannot exceed 999,999.99'
        }),

    is_active: Joi.boolean()
        .optional()
        .messages({
            'boolean.base': 'is_active must be a boolean value'
        })
});

export const userFiltersSchema = Joi.object({
    name: Joi.string().max(100).optional(),
    email: Joi.string().email().optional(),
    department: Joi.string().max(50).optional(),
    is_active: Joi.boolean().optional(),
    min_age: Joi.number().integer().min(0).max(120).optional(),
    max_age: Joi.number().integer().min(0).max(120).optional(),
    min_salary: Joi.number().min(0).optional(),
    max_salary: Joi.number().min(0).optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sort_by: Joi.string().valid('name', 'email', 'age', 'salary', 'created_at').default('created_at'),
    sort_order: Joi.string().valid('ASC', 'DESC').default('DESC')
}).custom((value, helpers) => {
    // Custom validation: max_age should be greater than min_age
    if (value.min_age && value.max_age && value.min_age > value.max_age) {
        return helpers.error('custom.invalidAgeRange');
    }

    // Custom validation: max_salary should be greater than min_salary
    if (value.min_salary && value.max_salary && value.min_salary > value.max_salary) {
        return helpers.error('custom.invalidSalaryRange');
    }

    return value;
}).messages({
    'custom.invalidAgeRange': 'Maximum age must be greater than minimum age',
    'custom.invalidSalaryRange': 'Maximum salary must be greater than minimum salary'
});

export const idParamSchema = Joi.object({
    id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'ID must be a number',
            'number.integer': 'ID must be a whole number',
            'number.positive': 'ID must be a positive number',
            'any.required': 'ID is required'
        })
});