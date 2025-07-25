const request = require('supertest');
const app = require('../app');
const { User } = require('../models');
const jwt = require('jsonwebtoken');

describe('Middleware Test Suite', () => {
    let user;
    let validToken;
    let invalidToken = 'invalid.jwt.token';

    beforeEach(async () => {
        await User.destroy({ where: {}, truncate: true, cascade: true });
        
        // Create test user
        user = await User.create({
            name: 'Test User',
            email: 'test@mail.com',
            password: 'password123'
        });

        // Create valid token
        validToken = jwt.sign({ userId: user.id }, process.env.SECRET || 'secret');
    });

    afterAll(async () => {
        await User.destroy({ where: {}, truncate: true, cascade: true });
    });

    describe('Authentication Middleware', () => {
        test('Should allow access with valid token in Authorization header', async () => {
            const response = await request(app)
                .get('/sessions')
                .set('Authorization', `Bearer ${validToken}`);

            expect(response.status).not.toBe(401);
        });

        test('Should deny access without Authorization header', async () => {
            const response = await request(app)
                .get('/sessions');

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('message', 'Access token required');
        });

        test('Should deny access with malformed Authorization header', async () => {
            const response = await request(app)
                .get('/sessions')
                .set('Authorization', 'NotBearer token');

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('message', 'Access token required');
        });

        test('Should deny access with invalid token', async () => {
            const response = await request(app)
                .get('/sessions')
                .set('Authorization', `Bearer ${invalidToken}`);

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('message', 'Invalid token');
        });

        test('Should deny access with expired token', async () => {
            const expiredToken = jwt.sign(
                { userId: user.id }, 
                process.env.SECRET || 'secret',
                { expiresIn: '-1h' } // Already expired
            );

            const response = await request(app)
                .get('/sessions')
                .set('Authorization', `Bearer ${expiredToken}`);

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('message', 'Invalid token');
        });

        test('Should deny access with token for non-existent user', async () => {
            const nonExistentUserToken = jwt.sign(
                { userId: 99999 }, 
                process.env.SECRET || 'secret'
            );

            const response = await request(app)
                .get('/sessions')
                .set('Authorization', `Bearer ${nonExistentUserToken}`);

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('message', 'Invalid token');
        });

        test('Should deny access with token missing userId', async () => {
            const invalidPayloadToken = jwt.sign(
                { someOtherField: 'value' }, 
                process.env.SECRET || 'secret'
            );

            const response = await request(app)
                .get('/sessions')
                .set('Authorization', `Bearer ${invalidPayloadToken}`);

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('message', 'Invalid token');
        });
    });

    describe('Error Handler Middleware', () => {
        test('Should handle validation errors properly', async () => {
            const response = await request(app)
                .post('/register')
                .send({
                    email: 'invalid-email',
                    password: '', 
                    name: ''
                });

            expect(response.status).toBe(400);
        });

        test('Should handle unique constraint violations', async () => {
            const userData = {
                email: 'test@mail.com',
                password: 'password123',
                name: 'Test User'
            };

            // Create first user
            await request(app).post('/register').send(userData);

            // Try to create duplicate
            const response = await request(app)
                .post('/register')
                .send(userData);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message');
        });

        test('Should handle 404 errors for non-existent resources', async () => {
            const response = await request(app)
                .get('/sessions/99999')
                .set('Authorization', `Bearer ${validToken}`);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'Session not found');
        });

        test('Should handle unknown routes with 404', async () => {
            const response = await request(app)
                .get('/unknown-route');

            expect(response.status).toBe(404);
        });
    });
});
