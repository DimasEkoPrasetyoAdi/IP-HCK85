const request = require('supertest');
const app = require('../app');
const { User } = require('../models');
const { hashPassword } = require('../helpers/bcrypt');

describe('Authentication Test Suite', () => {
    beforeAll(async () => {
        await User.create({
            email: 'test@mail.com',
            password: hashPassword('password123'),
            name: 'Test User'
        });
    });

    afterAll(async () => {
        await User.destroy({ truncate: true, cascade: true });
    });

    describe('POST /login', () => {
        test('Sukses login dengan kredensial yang benar', async () => {
            const response = await request(app)
                .post('/login')
                .send({
                    email: 'test@mail.com',
                    password: 'password123'
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('access_token');
        });

        test('Gagal login dengan password yang salah', async () => {
            const response = await request(app)
                .post('/login')
                .send({
                    email: 'test@mail.com',
                    password: 'wrongpassword'
                });

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('message', 'Invalid email or password');
        });
    });

    describe('POST /register', () => {
        test('Sukses mendaftar pengguna baru', async () => {
            const response = await request(app)
                .post('/register')
                .send({
                    email: 'newuser@mail.com',
                    password: 'password123',
                    name: 'New User'
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body).toHaveProperty('email', 'newuser@mail.com');
        });

        test('Gagal mendaftar pengguna baru dengan email yang sudah terdaftar', async () => {
            const response = await request(app)
                .post('/register')
                .send({
                    email: 'test@mail.com',
                    password: 'password123',
                    name: 'Test User'
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Email sudah terdaftar');
        });
    });
});