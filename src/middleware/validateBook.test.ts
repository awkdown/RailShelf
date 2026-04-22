// Import the schema we want to test — this is the same schema
// your route middleware uses to validate incoming book data
import { createBookSchema } from './validateBook';

// describe() groups related tests together under a label.
// Think of it as a chapter heading in a test report.
// When Jest runs, it will display: 'createBookSchema > accepts a valid book...'
describe('createBookSchema', () => {

    // it() defines a single test case. The string describes what you expect to happen.
    // Each it() block is independent — if one fails, the others still run.
    it('accepts a valid book with all fields', () => {

        // Create a plain object with valid data — this simulates req.body
        const input = {
            title: 'British Railway Signalling',
            authorname: 'Geoffrey Kichenside',
            isbn: '9780711008980',
            publisher: 'Ian Allan',
            year: 1963,
            category: 'signalling',
            status: 'owned',
        };

        // safeParse() validates the data against the schema WITHOUT throwing an error.
        // It returns an object like { success: true, data: {...} }
        // or { success: false, error: {...} }
        const result = createBookSchema.safeParse(input);

        // expect() is Jest's assertion function — it checks a value.
        // .toBe(true) checks for an exact match (=== comparison).
        // If result.success is NOT true, the test fails with a clear error message.
        expect(result.success).toBe(true);
    });

    it('accepts a book with only the required fields', () => {
        // Only title and authorname are required — all other fields are optional.
        // This test confirms the schema does not demand every field.
        const input = {
            title: 'The Railway Children',
            authorname: 'E. Nesbit',
        };
        const result = createBookSchema.safeParse(input);
        expect(result.success).toBe(true);
    });

    it('rejects a book with no title', () => {
        // Missing the required 'title' field — should fail validation
        const input = { authorname: 'Someone' };
        const result = createBookSchema.safeParse(input);

        // We expect success to be false — the schema should reject this input
        expect(result.success).toBe(false);
    });

    it('rejects a book with an empty title', () => {
        // A title made of only spaces should not count as valid
        const input = { title: '   ', authorname: 'Someone' };
        const result = createBookSchema.safeParse(input);
        expect(result.success).toBe(false);
    });

    it('rejects a year in the future', () => {
        const input = {
            title: 'Future Book',
            authorname: 'Time Traveller',
            year: 2099,  // This should be rejected by the .max() rule
        };
        const result = createBookSchema.safeParse(input);
        expect(result.success).toBe(false);
    });

    it('rejects an invalid ISBN format', () => {
        const input = {
            title: 'Bad ISBN Book',
            authorname: 'Someone',
            isbn: 'not-a-real-isbn',  // Must be exactly 10 or 13 digits
        };
        const result = createBookSchema.safeParse(input);
        expect(result.success).toBe(false);
    });

    it('rejects an invalid category', () => {
        const input = {
            title: 'Some Book',
            authorname: 'Someone',
            category: 'cooking',  // Not in the allowed list of categories
        };
        const result = createBookSchema.safeParse(input);
        expect(result.success).toBe(false);
    });

    it('rejects an author name containing numbers', () => {
        const input = {
            title: 'Some Book',
            authorname: 'John Smith 2',
        };
        const result = createBookSchema.safeParse(input);
        expect(result.success).toBe(false);
    });

});
