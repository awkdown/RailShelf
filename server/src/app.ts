import express from "express";
import path from "path";
import { Request, Response, NextFunction } from 'express';
import prisma from "./lib/prisma";
import {requireAuth } from "./middleware/auth";
import {validateBook, validateBookUpdate} from "./middleware/validateBook";
import {errorHandler} from "./middleware/errorHandler";
import authRouter from './routes/auth';
import { sanitiseBody } from './middleware/sanitise';
import cors from "cors";

const app = express();

/**
 * Middleware
 */

// parse JSON request bodies
app.use(express.json());

// Sanitise all incoming string fields
app.use(sanitiseBody);

// Allow the frontend to make cross-origin requests to this API.
// In production, FRONTEND_URL will be set to your Vercel URL.
// In development, it falls back to localhost:5173 (Vite's dev server).
app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
    })
);


// Authentication routes
app.use('/auth', authRouter);

// Simple request logger
app.use((req: Request, res: Response, next: NextFunction) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
});

//defines a route for http://localhost:3000/index.html
app.use(express.static('public'));

/**
 * API endpoints
 */

// Serve the homepage
app.get("/", (_req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

// Health check endpoint
// Hosting platforms ping this URL to verify the server is alive.
// Returns a simple JSON object with the current status and timestamp.
app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
    });
});


// Return all books as JSON
app.get("/api/books", async (req, res) => {
    const search = req.query.search as string | undefined;
    const category = req.query.category as string | undefined;

    const books = await prisma.book.findMany({
        where: {
            ...(category && {
                category: { equals: category, mode: "insensitive" },
            }),
            ...(search && {
                OR: [
                    { title: { contains: search, mode: "insensitive" } },
                    { author: {name: {contains: search, mode: "insensitive"}} },
                    { isbn: { contains: search } },
                ],
            }),
        },
        include: { author: true },
    });

    res.json(books);
});

//get book with specific id
app.get("/api/books/:id", async (_req, res) => {

    const book = await prisma.book.findUnique({
        where: {id: Number(_req.params.id)},
    })

    if (!book) {
        return res.status(404).json({error: `Book with id ${_req.params.id} not found`});
    }

    res.json(book);
});

app.get('/api/test-error', (req, res, next) => {
    next(new Error('This is a test error!'));
});


//add a new book
app.post("/api/books",requireAuth, validateBook, async (req, res) => {
    const { title, authorname, isbn, publisher, year, category, status } = req.body;

    try {
        const newBook = await prisma.book.create({
            data: {
                title, isbn, publisher, year, category, status,
                author: {
                    connectOrCreate: {
                        where: {name: authorname},
                        create: {name: authorname},
                    },
                },
            },
            include: { author: true },
        });
        res.status(201).json(newBook);
    } catch(error) {
        res.status(500).json({error: "Could not create book"});
    }
});

//update a book
app.patch("/api/books/:id", requireAuth, validateBookUpdate, async (_req, res) => {
    try {
        const book = await prisma.book.update({
            where: {id: Number(_req.params.id)},
            data: _req.body,
        });
        res.json(book);
    } catch(error) {
        return res.status(404).json({error: `Book with id ${_req.params.id} not found`});
    }
});

//delete book
app.delete("/api/books/:id", requireAuth, async (_req, res) => {
    try {
        const book = await prisma.book.delete({
            where: {id: Number(_req.params.id)},
        });
        res.json(book);
    } catch (error) {
        return res.status(404).json({error: `Book with id ${_req.params.id} not found`});
    }
});


/**
 * Error handling middleware
 */

app.use((req, res) => {
    res.status(404).json({ error: `Route ${req.url} not found` });
});

app.use(errorHandler);

export default app;