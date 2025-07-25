const request = require('supertest');
const app = require('../app');
const { User, Session, Sport, SessionParticipant } = require('../models');

describe('Participant Test Suite', () => {
    let token;
    let userId;
    let sessionId;

    beforeAll(async () => {
        // Clean up
        await SessionParticipant.destroy({ where: {}, truncate: true, cascade: true });
        await Session.destroy({ where: {}, truncate: true, cascade: true });
        await User.destroy({ where: {}, truncate: true, cascade: true });
        await Sport.destroy({ where: {}, truncate: true, cascade: true });

        // Create test user
        const userResponse = await request(app)
            .post('/register')
            .send({
                email: 'test@mail.com',
                password: 'password123',
                name: 'Test User'
            });
        userId = userResponse.body.id;

        // Login to get token
        const loginResponse = await request(app)
            .post('/login')
            .send({
                email: 'test@mail.com',
                password: 'password123'
            });
        token = loginResponse.body.access_token;

        // Create test sport
        const sport = await Sport.create({
            name: 'Basketball',
            calories_per_hour: 400
        });

        // Create test session
        const sessionResponse = await request(app)
            .post('/sessions')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Test Session',
                description: 'Test Description',
                session_date: '2025-08-01T14:00:00.000Z',
                duration_hours: 2,
                sport_id: sport.id,
                provinsi_id: '31',
                kabupaten_id: '3171',
                kecamatan_id: '3171010'
            });
        sessionId = sessionResponse.body.id;
    });

    afterAll(async () => {
        await SessionParticipant.destroy({ where: {}, truncate: true, cascade: true });
        await Session.destroy({ where: {}, truncate: true, cascade: true });
        await User.destroy({ where: {}, truncate: true, cascade: true });
        await Sport.destroy({ where: {}, truncate: true, cascade: true });
    });

    describe('POST /participants', () => {
        test('Sukses bergabung dengan sesi', async () => {
            const response = await request(app)
                .post('/participants')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    session_id: sessionId
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message');
        });

        test('Gagal bergabung dengan sesi tanpa otentikasi', async () => {
            const response = await request(app)
                .post('/participants')
                .send({
                    session_id: sessionId
                });

            expect(response.status).toBe(401);
        });

        test('Gagal bergabung dengan sesi dengan session_id yang tidak valid', async () => {
            const response = await request(app)
                .post('/participants')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    session_id: 99999
                });

            expect(response.status).toBe(404);
        });
    });

    describe('DELETE /participants/:session_id', () => {
        beforeEach(async () => {
            // Join session first
            await request(app)
                .post('/participants')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    session_id: sessionId
                });
        });

        test('Sukses meninggalkan sesi', async () => {
            const response = await request(app)
                .delete(`/participants/${sessionId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message');
        });

        test('Gagal meninggalkan sesi', async () => {
            const response = await request(app)
                .delete(`/participants/${sessionId}`);

            expect(response.status).toBe(401);
        });
    });
});
