const request = require('supertest');
const app = require('../app');
const { User, sequelize } = require('../models');
const bcrypt = require('bcryptjs');

describe('Authentication Endpoints', () => {
    beforeEach(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    describe('POST /register', () => {
        it('should register a new user successfully', async () => {
            const userData = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            };

            const response = await request(app)
                .post('/register')
                .send(userData);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body).toHaveProperty('email');
            expect(response.body.email).toBe(userData.email);
        });

        it('should fail with duplicate email', async () => {
            const userData = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            };

            // First registration
            await request(app)
                .post('/register')
                .send(userData);

            // Second registration with same email
            const response = await request(app)
                .post('/register')
                .send(userData);

            expect(response.status).toBe(400);
        });

        it('should fail with invalid email format', async () => {
            const userData = {
                name: 'Test User',
                email: 'invalid-email',
                password: 'password123'
            };

            const response = await request(app)
                .post('/register')
                .send(userData);

            expect(response.status).toBe(400);
        });

        it('should fail with missing required fields', async () => {
            const userData = {
                email: 'test@example.com'
                // Missing name and password
            };

            const response = await request(app)
                .post('/register')
                .send(userData);

            expect(response.status).toBe(400);
        });
    });

    describe('POST /login', () => {
        beforeEach(async () => {
            // Create test user with hashed password
            const hashedPassword = await bcrypt.hash('password123', 10);
            await User.create({
                name: 'Test User',
                email: 'test@example.com',
                password: hashedPassword
            });
        });

        it('should login successfully with correct credentials', async () => {
            const loginData = {
                email: 'test@example.com',
                password: 'password123'
            };

            const response = await request(app)
                .post('/login')
                .send(loginData);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('access_token');
        });

        it('should fail with incorrect password', async () => {
            const loginData = {
                email: 'test@example.com',
                password: 'wrongpassword'
            };

            const response = await request(app)
                .post('/login')
                .send(loginData);

            expect(response.status).toBe(401);
        });

        it('should fail with non-existent email', async () => {
            const loginData = {
                email: 'nonexistent@example.com',
                password: 'password123'
            };

            const response = await request(app)
                .post('/login')
                .send(loginData);

            expect(response.status).toBe(401);
        });

        it('should fail with missing credentials', async () => {
            const loginData = {
                email: 'test@example.com'
                // Missing password
            };

            const response = await request(app)
                .post('/login')
                .send(loginData);

            expect(response.status).toBe(500); // bcrypt error for undefined password
        });
    });
});
