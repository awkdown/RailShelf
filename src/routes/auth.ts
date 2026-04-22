import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const SALT_ROUNDS = 10;

// POST /auth/register
router.post('/register', async (req, res) => {
    const { email, password, name } = req.body;

    // Basic validation
    if (!email || !password) {
        return res.status(400).json({
            error: 'Email and password are required',
        });
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({
        where: { email },
    });

    if (existing) {
        return res.status(409).json({
            error: 'An account with this email already exists',
        });
    }

    // Hash the password — NEVER store plain text
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create the user with the hashed password
    const user = await prisma.user.create({
        data: { email, password: hashedPassword, name },
    });

    // Return user info (but NEVER the password hash)
    res.status(201).json({
        id: user.id,
        email: user.email,
        name: user.name,
    });
});

// POST /auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            error: 'Email and password are required',
        });
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        return res.status(401).json({
            error: 'Invalid email or password',
        });
    }

    // Compare the supplied password with the stored hash
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        return res.status(401).json({
            error: 'Invalid email or password',
        });
    }

    // Password is correct — create a JWT
    const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
    res.json({ token });
});

export default router;