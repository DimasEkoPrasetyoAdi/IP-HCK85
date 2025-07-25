const request = require('supertest');
const app = require('../app');
const { User, Session, Sport, SessionParticipant, sequelize } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

describe('Session Endpoints', () => {
    let user, sport, authToken, anotherUser, anotherAuthToken;

    beforeEach(async () => {
        await sequelize.sync({ force: true });

        // Create test user
        const hashedPassword = await bcrypt.hash('password123', 10);
        user = await User.create({
            email: 'test@example.com',
            password: hashedPassword,
            name: 'Test User'
        });

        // Create another test user
        anotherUser = await User.create({
            email: 'another@example.com',
            password: hashedPassword,
            name: 'Another User'
        });

        // Create test sport
        sport = await Sport.create({
            name: 'Football',
            calories_per_hour: 400
        });

        // Generate JWT tokens
        authToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret');
        anotherAuthToken = jwt.sign({ id: anotherUser.id }, process.env.JWT_SECRET || 'secret');
    });

    afterAll(async () => {
        await sequelize.close();
    });

    describe('GET /sessions', () => {
        beforeEach(async () => {
            await Session.create({
                sport_id: sport.id,
                host_id: user.id,
                session_date: new Date('2024-12-31'),
                duration_hours: 2,
                provinsi_id: '31',
                kabupaten_id: '3171',
                kecamatan_id: '3171010',
                title: 'Test Session',
                description: 'Test Description'
            });
        });

        it('should get all sessions with authentication', async () => {
            const response = await request(app)
                .get('/sessions')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('sessions');
            expect(Array.isArray(response.body.sessions)).toBe(true);
            expect(response.body.sessions.length).toBeGreaterThan(0);
        });

        it('should fail without authentication', async () => {
            const response = await request(app)
                .get('/sessions');

            expect(response.status).toBe(401);
        });
    });

    describe('POST /sessions', () => {
        it('should create a new session successfully', async () => {
            const sessionData = {
                sport_id: sport.id,
                session_date: '2024-12-31T10:00:00.000Z',
                duration_hours: 2,
                provinsi_id: '31',
                kabupaten_id: '3171',
                kecamatan_id: '3171010',
                title: 'New Session',
                description: 'New Description'
            };

            const response = await request(app)
                .post('/sessions')
                .set('Authorization', `Bearer ${authToken}`)
                .send(sessionData);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message');
            expect(response.body).toHaveProperty('session');
            expect(response.body.session.title).toBe(sessionData.title);
        });

        it('should fail without authentication', async () => {
            const sessionData = {
                sportId: sport.id,
                date: '2024-12-31',
                location: 'New Stadium',
                title: 'New Session',
                description: 'New Description'
            };

            const response = await request(app)
                .post('/sessions')
                .send(sessionData);

            expect(response.status).toBe(401);
        });

        it('should fail with invalid data', async () => {
            const invalidData = {
                sport_id: 'invalid',
                session_date: 'invalid-date'
            };

            const response = await request(app)
                .post('/sessions')
                .set('Authorization', `Bearer ${authToken}`)
                .send(invalidData);

            expect(response.status).toBe(400);
        });
    });

    describe('GET /sessions/:id', () => {
        let session;

        beforeEach(async () => {
            session = await Session.create({
                sport_id: sport.id,
                host_id: user.id,
                session_date: new Date('2024-12-31'),
                duration_hours: 2,
                provinsi_id: '31',
                kabupaten_id: '3171',
                kecamatan_id: '3171010',
                title: 'Test Session',
                description: 'Test Description'
            });
        });

        it('should get session by ID', async () => {
            const response = await request(app)
                .get(`/sessions/${session.id}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('session');
            expect(response.body.session.id).toBe(session.id);
        });

        it('should return 404 for non-existent session', async () => {
            const response = await request(app)
                .get('/sessions/99999')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(404);
        });
    });

    describe('PUT /sessions/:id', () => {
        let session;

        beforeEach(async () => {
            session = await Session.create({
                sport_id: sport.id,
                host_id: user.id,
                session_date: new Date('2024-12-31'),
                duration_hours: 2,
                provinsi_id: '31',
                kabupaten_id: '3171',
                kecamatan_id: '3171010',
                title: 'Test Session',
                description: 'Test Description'
            });
        });

        it('should update session successfully by host', async () => {
            const updateData = {
                title: 'Updated Session',
                description: 'Updated Description'
            };

            const response = await request(app)
                .put(`/sessions/${session.id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(updateData);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message');
            expect(response.body.session.title).toBe(updateData.title);
        });

        it('should fail when non-host tries to update', async () => {
            const updateData = {
                title: 'Updated Session'
            };

            const response = await request(app)
                .put(`/sessions/${session.id}`)
                .set('Authorization', `Bearer ${anotherAuthToken}`)
                .send(updateData);

            expect(response.status).toBe(403);
        });

        it('should return 404 for non-existent session', async () => {
            const response = await request(app)
                .put('/sessions/99999')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ title: 'Updated' });

            expect(response.status).toBe(404);
        });
    });

    describe('DELETE /sessions/:id', () => {
        let session;

        beforeEach(async () => {
            session = await Session.create({
                sport_id: sport.id,
                host_id: user.id,
                session_date: new Date('2024-12-31'),
                duration_hours: 2,
                provinsi_id: '31',
                kabupaten_id: '3171',
                kecamatan_id: '3171010',
                title: 'Test Session',
                description: 'Test Description'
            });
        });

        it('should delete session successfully by host', async () => {
            const response = await request(app)
                .delete(`/sessions/${session.id}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message');

            // Verify session is deleted
            const deletedSession = await Session.findByPk(session.id);
            expect(deletedSession).toBeNull();
        });

        it('should fail when non-host tries to delete', async () => {
            const response = await request(app)
                .delete(`/sessions/${session.id}`)
                .set('Authorization', `Bearer ${anotherAuthToken}`);

            expect(response.status).toBe(403);
        });

        it('should return 404 for non-existent session', async () => {
            const response = await request(app)
                .delete('/sessions/99999')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(404);
        });
    });
});
