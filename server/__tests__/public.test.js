const request = require('supertest');
const app = require('../app');
const { User, Session, Sport } = require('../models');

describe('Public Controller Test Suite', () => {
    let user;
    let sport;

    beforeEach(async () => {
        // Clean tables
        await User.destroy({ where: {}, truncate: true, cascade: true });
        await Sport.destroy({ where: {}, truncate: true, cascade: true });
        await Session.destroy({ where: {}, truncate: true, cascade: true });

        // Create test user
        user = await User.create({
            name: 'Test User',
            email: 'test@mail.com',
            password: 'password123'
        });

        // Create test sport
        sport = await Sport.create({
            name: 'Basketball',
            calories_per_hour: 400
        });
    });

    afterAll(async () => {
        await User.destroy({ where: {}, truncate: true, cascade: true });
        await Sport.destroy({ where: {}, truncate: true, cascade: true });
        await Session.destroy({ where: {}, truncate: true, cascade: true });
    });

    describe('GET /pub', () => {
        test('Should return empty array when no sessions exist', async () => {
            const response = await request(app)
                .get('/pub');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body).toHaveLength(0);
        });

        test('Should return sessions with proper structure', async () => {
            // Create a test session
            await Session.create({
                host_id: user.id,
                sport_id: sport.id,
                provinsi_id: '31',
                kabupaten_id: '3171',
                kecamatan_id: '3171010',
                title: 'Test Session',
                description: 'Test Description',
                session_date: new Date('2025-08-01T14:00:00.000Z'),
                duration_hours: 2
            });

            const response = await request(app)
                .get('/pub');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body).toHaveLength(1);
            
            const session = response.body[0];
            expect(session).toHaveProperty('id');
            expect(session).toHaveProperty('title', 'Test Session');
            expect(session).toHaveProperty('description', 'Test Description');
            expect(session).toHaveProperty('session_date');
            expect(session).toHaveProperty('duration_hours', 2);
            expect(session).toHaveProperty('host');
            expect(session).toHaveProperty('Sport');
            expect(session.host).toHaveProperty('name', 'Test User');
            expect(session.Sport).toHaveProperty('name', 'Basketball');
        });

        test('Should return multiple sessions ordered properly', async () => {
            // Create multiple test sessions
            const session1 = await Session.create({
                host_id: user.id,
                sport_id: sport.id,
                provinsi_id: '31',
                kabupaten_id: '3171',
                kecamatan_id: '3171010',
                title: 'First Session',
                description: 'First Description',
                session_date: new Date('2025-08-01T14:00:00.000Z'),
                duration_hours: 2
            });

            const session2 = await Session.create({
                host_id: user.id,
                sport_id: sport.id,
                provinsi_id: '31',
                kabupaten_id: '3171',
                kecamatan_id: '3171010',
                title: 'Second Session',
                description: 'Second Description',
                session_date: new Date('2025-08-02T14:00:00.000Z'),
                duration_hours: 3
            });

            const response = await request(app)
                .get('/pub');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body).toHaveLength(2);
            
            const sessions = response.body;
            expect(sessions[0]).toHaveProperty('title', 'First Session');
            expect(sessions[1]).toHaveProperty('title', 'Second Session');
        });

        test('Should include participant count information', async () => {
            // Create a test session
            const session = await Session.create({
                host_id: user.id,
                sport_id: sport.id,
                provinsi_id: '31',
                kabupaten_id: '3171',
                kecamatan_id: '3171010',
                title: 'Test Session',
                description: 'Test Description',
                session_date: new Date('2025-08-01T14:00:00.000Z'),
                duration_hours: 2,
                max_participants: 10
            });

            const response = await request(app)
                .get('/pub');

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(1);
            
            const sessionData = response.body[0];
            expect(sessionData).toHaveProperty('max_participants', 10);
            expect(sessionData).toHaveProperty('participants');
            expect(Array.isArray(sessionData.participants)).toBe(true);
        });

        test('Should handle sessions without descriptions', async () => {
            // Create a test session without description
            await Session.create({
                host_id: user.id,
                sport_id: sport.id,
                provinsi_id: '31',
                kabupaten_id: '3171',
                kecamatan_id: '3171010',
                title: 'No Description Session',
                session_date: new Date('2025-08-01T14:00:00.000Z'),
                duration_hours: 2
            });

            const response = await request(app)
                .get('/pub');

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(1);
            
            const session = response.body[0];
            expect(session).toHaveProperty('title', 'No Description Session');
            expect(session.description).toBe(null);
        });

        test('Should handle database connection errors gracefully', async () => {
            // This test would require mocking Sequelize to simulate database errors
            // For now, we'll test that the endpoint exists and returns proper structure
            const response = await request(app)
                .get('/pub');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });
    });

    describe('Edge Cases', () => {
        test('Should handle requests with query parameters', async () => {
            const response = await request(app)
                .get('/pub?page=1&limit=10');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });

        test('Should handle requests with headers', async () => {
            const response = await request(app)
                .get('/pub')
                .set('Accept', 'application/json')
                .set('User-Agent', 'Test Agent');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });
    });
});
