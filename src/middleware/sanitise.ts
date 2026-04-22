import { Request, Response, NextFunction } from 'express';
import sanitizeHtml from 'sanitize-html';

// Strip ALL HTML tags — no tags are allowed
const sanitiseOptions = { allowedTags: [], allowedAttributes: {} };

// Recursively sanitise all string values in an object
function sanitiseObject(obj: Record<string, unknown>): Record<string, unknown> {
    const cleaned: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
            cleaned[key] = sanitizeHtml(value, sanitiseOptions).trim();
        } else {
            cleaned[key] = value;
        }
    }

    return cleaned;
}

export function sanitiseBody(
    req: Request, _res: Response, next: NextFunction
) {
    if (req.body && typeof req.body === 'object') {
        req.body = sanitiseObject(req.body);
    }
    next();
}