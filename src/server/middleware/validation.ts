import Joi from 'joi';
import type { Request, Response, NextFunction } from 'express';

/**
 * Input validation middleware using Joi
 * Validates and sanitizes user inputs to prevent injection attacks
 */

// Common validation schemas
export const schemas = {
    // User login validation
    login: Joi.object({
        email: Joi.string().email().required().max(255).trim().lowercase(),
        password: Joi.string().required().min(1).max(255),
    }),

    // Patient registration validation
    patientRegistration: Joi.object({
        first_name: Joi.string().required().min(1).max(100).trim(),
        last_name: Joi.string().required().min(1).max(100).trim(),
        date_of_birth: Joi.date().required().max('now'),
        gender: Joi.string().valid('male', 'female', 'other').required(),
        phone: Joi.string().pattern(/^[0-9+\-\s()]+$/).max(20).required(),
        email: Joi.string().email().max(255).trim().lowercase().allow('', null),
        address: Joi.string().max(500).allow('', null),
        city: Joi.string().max(100).allow('', null),
        state: Joi.string().max(100).allow('', null),
        zip_code: Joi.string().max(20).allow('', null),
        emergency_contact: Joi.string().max(255).allow('', null),
        insurance: Joi.string().max(255).allow('', null),
        registration_type: Joi.string().valid('new', 'existing').allow('', null),
        // Next of Kin fields
        nok_full_name: Joi.string().max(200).allow('', null),
        nok_relationship: Joi.string().max(50).allow('', null),
        nok_phone: Joi.string().pattern(/^[0-9+\-\s()]+$/).max(20).allow('', null),
        nok_email: Joi.string().email().max(255).allow('', null),
        nok_address: Joi.string().max(500).allow('', null),
        // Demographics
        state_of_origin: Joi.string().max(100).allow('', null),
        lga: Joi.string().max(100).allow('', null),
        religion: Joi.string().max(50).allow('', null),
        tribe: Joi.string().max(100).allow('', null),
        employment_status: Joi.string().max(50).allow('', null),
    }),

    // ID parameter validation
    id: Joi.object({
        id: Joi.string().uuid().required(),
    }),

    // Pagination validation
    pagination: Joi.object({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(20),
        search: Joi.string().max(255).allow('', null),
        sortBy: Joi.string().max(50).allow('', null),
        sortOrder: Joi.string().valid('asc', 'desc').default('asc'),
    }),

    // Appointment validation
    appointment: Joi.object({
        patient_id: Joi.string().uuid().required(),
        doctor_id: Joi.string().uuid().required(),
        appointment_date: Joi.date().required().min('now'),
        appointment_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
        reason: Joi.string().max(500).required(),
        notes: Joi.string().max(1000).allow('', null),
    }),

    // Prescription validation
    prescription: Joi.object({
        patient_id: Joi.string().uuid().required(),
        doctor_id: Joi.string().uuid().required(),
        medication_name: Joi.string().max(255).required(),
        dosage: Joi.string().max(100).required(),
        frequency: Joi.string().max(100).required(),
        duration: Joi.string().max(100).required(),
        instructions: Joi.string().max(1000).allow('', null),
        quantity: Joi.number().integer().min(1).required(),
    }),

    // Lab test validation
    labTest: Joi.object({
        patient_id: Joi.string().uuid().required(),
        test_name: Joi.string().max(255).required(),
        test_type: Joi.string().max(100).required(),
        ordered_by: Joi.string().uuid().required(),
        notes: Joi.string().max(1000).allow('', null),
    }),

    // Payment validation
    payment: Joi.object({
        patient_id: Joi.string().uuid().required(),
        amount: Joi.number().positive().precision(2).required(),
        payment_method: Joi.string().valid('cash', 'card', 'transfer', 'insurance').required(),
        description: Joi.string().max(500).required(),
        reference: Joi.string().max(255).allow('', null),
    }),
};

/**
 * Validation middleware factory
 * @param schema - Joi schema to validate against
 * @param property - Request property to validate ('body', 'query', 'params')
 */
export const validate = (schema: Joi.ObjectSchema, property: 'body' | 'query' | 'params' = 'body') => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error, value } = schema.validate(req[property], {
            abortEarly: false, // Return all errors, not just the first one
            stripUnknown: true, // Remove unknown properties
            convert: true, // Convert types (e.g., string to number)
        });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message,
            }));

            return res.status(400).json({
                error: 'Validation failed',
                details: errors,
            });
        }

        // Safely update the request property
        if (property === 'body') {
            req.body = value;
        } else {
            // For query and params which might be getters, mutate the object
            // First clear existing keys
            const target = req[property];
            for (const key in target) {
                delete (target as any)[key];
            }
            // Then assign new values
            Object.assign(target, value);
        }
        next();
    };
};

/**
 * Sanitize string to prevent XSS
 * Removes potentially dangerous characters
 */
export const sanitizeString = (str: string): string => {
    if (!str) return str;

    return str
        .replace(/[<>]/g, '') // Remove < and >
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+\s*=/gi, '') // Remove event handlers like onclick=
        .trim();
};

/**
 * Sanitize object recursively
 */
export const sanitizeObject = (obj: any): any => {
    if (typeof obj === 'string') {
        return sanitizeString(obj);
    }

    if (Array.isArray(obj)) {
        return obj.map(sanitizeObject);
    }

    if (obj && typeof obj === 'object') {
        const sanitized: any = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                sanitized[key] = sanitizeObject(obj[key]);
            }
        }
        return sanitized;
    }

    return obj;
};

/**
 * General sanitization middleware
 * Applies to all request bodies
 */
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
    if (req.body) {
        req.body = sanitizeObject(req.body);
    }
    if (req.query) {
        const sanitized = sanitizeObject(req.query);
        // req.query is a getter, so we mutate the object
        for (const key in req.query) {
            delete (req.query as any)[key];
        }
        Object.assign(req.query, sanitized);
    }
    if (req.params) {
        const sanitized = sanitizeObject(req.params);
        // req.params is a getter, so we mutate the object
        for (const key in req.params) {
            delete (req.params as any)[key];
        }
        Object.assign(req.params, sanitized);
    }
    next();
};
