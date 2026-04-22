import { Request, Response, NextFunction } from 'express';

export function errorHandler(
    err: Error, req: Request, res: Response, next: NextFunction
) {
    console.error(`[ERROR] ${err.message}`);
    console.error(err.stack);

    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message,
    });
}