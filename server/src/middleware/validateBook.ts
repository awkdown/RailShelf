import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// Define the allowed values for category and status
const CATEGORIES = [
    'history', 'signalling', 'photography', 'infrastructure',
] as const;

const STATUSES = ['owned', 'wishlist', 'lent out'] as const;

// Schema for creating a new book (POST)
export const createBookSchema = z.object({
    title: z
        .string()
        .min(1, 'Title is required')
        .max(200, 'Title must be 200 characters or fewer'),

    authorname: z
        .string()
        .regex(/^\D*$/, 'Author name cannot contain numbers')
        .min(1, 'Author name is required')
        .max(100, 'Author name must be 100 characters or fewer'),

    isbn: z
        .string()
        .refine((val) => {
            const digits = val.replace(/-/g, '');
            return /^\d{10}$|^\d{13}$/.test(digits);
        }, 'ISBN must be 10 or 13 digits (with or without dashes)')
        .optional(),

    publisher: z
        .string()
        .max(100, 'Publisher must be 100 characters or fewer')
        .optional(),

    year: z
        .number()
        .int('Year must be a whole number')
        .min(1800, 'Year must be 1800 or later')
        .max(new Date().getFullYear(), 'Year cannot be in the future')
        .optional(),

    category: z.enum(CATEGORIES).default('history'),

    status: z.enum(STATUSES).default('owned'),
});

// Schema for updating a book (PATCH) — all fields optional
export const updateBookSchema = createBookSchema.partial();

// Middleware for POST /api/books
export function validateBook(
    req: Request, res: Response, next: NextFunction
) {
    const result = createBookSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            error: 'Validation failed',
            details: result.error.issues.map((i) => ({
                field: i.path.join('.'),
                message: i.message,
            })),
        });
    }

    // Replace req.body with the validated data.
    // This strips any extra fields the client sent.
    req.body = result.data;
    next();
}

// Middleware for PATCH /api/books/:id
export function validateBookUpdate(
    req: Request, res: Response, next: NextFunction
) {
    const result = updateBookSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            error: 'Validation failed',
            details: result.error.issues.map((i) => ({
                field: i.path.join('.'),
                message: i.message,
            })),
        });
    }

    req.body = result.data;
    next();
}