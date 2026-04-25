// prisma/seed.ts
// This script populates the database with sample data for development.
// Run it with: npx prisma db seed

import prisma from '../src/lib/prisma';
import bcrypt from 'bcrypt';

async function main() {

    // -- Step 1: Clean up existing data --
    // Delete in this order because of foreign key constraints:
    // books reference authors, so books must be deleted first.
    await prisma.book.deleteMany();
    await prisma.author.deleteMany();
    await prisma.user.deleteMany();
    console.log('Cleared existing data.');

    // -- Step 2: Create a test user --
    // bcrypt.hash() takes the plain-text password and a salt rounds
    // value (10 is standard). The result is a one-way hash that can
    // be verified at login but cannot be reversed.
    const hashedPassword = await bcrypt.hash('SecurePassword123', 10);

    await prisma.user.create({
        data: {
            email: 'jiminy@railshelf.com',
            password: hashedPassword,
        },
    });
    console.log('User created: jiminy@railshelf.com');

    // -- Step 3: Create sample books with authors --
    // Each book uses connectOrCreate for the author, which means:
    // - If an author with that name already exists, link to them
    // - If not, create a new author record
    // This is the same pattern used in the POST /api/books route.
    const books = [
        {
            title: 'British Railway Signalling',
            authorName: 'Geoffrey Kichenside',
            isbn: '9780711008980',
            publisher: 'Ian Allan',
            year: 1963,
            category: 'signalling',
            status: 'owned',
        },
        {
            title: 'The Settle & Carlisle Railway',
            authorName: 'W.R. Mitchell',
            isbn: '9780711706354',
            publisher: 'Dalesman',
            year: 1994,
            category: 'history',
            status: 'owned',
        },
        {
            title: 'Track Layout Diagrams of the GWR',
            authorName: 'R.A. Cooke',
            isbn: '9780950963006',
            publisher: 'R.A. Cooke',
            year: 1988,
            category: 'infrastructure',
            status: 'wishlist',
        },
    ];

    for (const book of books) {
        await prisma.book.create({
            data: {
                title: book.title,
                isbn: book.isbn,
                publisher: book.publisher,
                year: book.year,
                category: book.category,
                status: book.status,
                author: {
                    connectOrCreate: {
                        where: { name: book.authorName },
                        create: { name: book.authorName },
                    },
                },
            },
        });
        console.log(`Book created: ${book.title}`);
    }

    console.log('Seeding complete!');
}

// Run the main function, then disconnect from the database.
// If anything goes wrong, log the error and exit with a failure code.
main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
