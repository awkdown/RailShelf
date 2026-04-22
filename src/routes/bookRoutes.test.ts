// Supertest lets us send HTTP requests to our Express app
// without starting a real server on a port
import request from 'supertest';

// Import the app (not index.ts — we don't want to call listen())
import app from '../app';

// Group all tests for the GET /api/books endpoint together
describe('GET /api/books', () => {

    it('returns a 200 status code', async () => {
        // request(app) wraps our Express app so we can send fake HTTP requests.
        // .get('/api/books') sends a GET request to that route.
        // 'await' waits for the response — this is async because it
        // simulates a real HTTP request/response cycle.
        const response = await request(app).get('/api/books');

        // Check that the HTTP status code is 200 (OK)
        expect(response.status).toBe(200);
    });

    it('returns JSON', async () => {
        const response = await request(app).get('/api/books');

        // .toMatch() checks if a string matches a regular expression.
        // We check that the Content-Type header contains 'application/json'.
        expect(response.headers['content-type'])
            .toMatch(/application\/json/);
    });

    it('returns an array', async () => {
        const response = await request(app).get('/api/books');

        // response.body is the parsed JSON from the response.
        // Supertest automatically parses JSON for us.
        expect(Array.isArray(response.body)).toBe(true);
    });

});

describe('POST /api/books', () => {

    it('rejects a book with no title', async () => {
        const response = await request(app)
            .post('/api/books')          // Send a POST request
            .send({ authorname: 'Someone' });  // With this JSON body

        // The validation middleware should reject this and return 400
        expect(response.status).toBe(400);
    });

    it('returns validation errors in the response body', async () => {
        const response = await request(app)
            .post('/api/books')
            .send({});  // Completely empty body — should fail

        // .toHaveProperty() checks that the object has a specific key.
        // We expect the error response to include an 'error' field.
        expect(response.body).toHaveProperty('error');
    });

});
