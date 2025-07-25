const request = require('supertest');
const app = require('../app');
const { User, Session, Sport } = require('../models');
const jwt = require('jsonwebtoken');

// Mock Google Generative AI
jest.mock('@google/generative-ai', () => {
    return {
        GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
            getGenerativeModel: jest.fn().mockReturnValue({
                generateContent: jest.fn()
            })
        }))
    };
});

const { GoogleGenerativeAI } = require('@google/generative-ai');

describe('AI Controller Test Suite', () => {
    let user;
    let session;
    let sport;
    let authToken;
    let mockModel;

    beforeEach(async () => {
        // Clean tables
        await User.destroy({ where: {}, truncate: true, cascade: true });
        await Sport.destroy({ where: {}, truncate: true, cascade: true });
        await Session.destroy({ where: {}, truncate: true, cascade: true });

        // Create test user
        user = await User.create({
            name: 'Test User',
            email: 'test@mail.com',
            password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' // hashed 'password'
        });

        // Create test sport
        sport = await Sport.create({
            name: 'Basketball',
            calories_per_hour: 400
        });

        // Create test session
        session = await Session.create({
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

        // Create auth token
        authToken = jwt.sign({ userId: user.id }, process.env.SECRET || 'secret');

        // Setup mock
        const mockGenAI = new GoogleGenerativeAI();
        mockModel = mockGenAI.getGenerativeModel();
    });

    afterAll(async () => {
        await User.destroy({ where: {}, truncate: true, cascade: true });
        await Sport.destroy({ where: {}, truncate: true, cascade: true });
        await Session.destroy({ where: {}, truncate: true, cascade: true });
    });

    describe('POST /ai/recommendation/:sessionId', () => {
        test('Should generate AI recommendation successfully', async () => {
            // Mock successful AI response
            const mockResponse = {
                response: {
                    candidates: [{
                        content: {
                            parts: [{
                                text: 'Untuk bermain basket selama 2 jam, Anda akan membakar sekitar 800 kalori. Jangan lupa minum air yang cukup dan lakukan pemanasan sebelum bermain.'
                            }]
                        }
                    }]
                }
            };

            mockModel.generateContent.mockResolvedValue(mockResponse);

            const response = await request(app)
                .post(`/ai/recommendation/${session.id}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'AI recommendation generated successfully');
            expect(response.body).toHaveProperty('recommendation');
            expect(response.body).toHaveProperty('session_id', session.id.toString());
            expect(response.body).toHaveProperty('sport', 'Basketball');
            expect(response.body).toHaveProperty('duration', 2);
            expect(response.body).toHaveProperty('calories_per_hour', 400);
        });

        test('Should return 404 for non-existent session', async () => {
            const response = await request(app)
                .post('/ai/recommendation/99999')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'Session not found');
        });

        test('Should return 401 without authentication token', async () => {
            const response = await request(app)
                .post(`/ai/recommendation/${session.id}`);

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('message', 'Access token required');
        });

        test('Should handle Gemini API error gracefully', async () => {
            // Mock API error
            const apiError = new Error('API rate limit exceeded');
            mockModel.generateContent.mockRejectedValue(apiError);

            const response = await request(app)
                .post(`/ai/recommendation/${session.id}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('message', 'Failed to generate AI recommendation');
            expect(response.body).toHaveProperty('error', 'API rate limit exceeded');
        });

        test('Should handle empty AI response', async () => {
            // Mock empty response
            const mockResponse = {
                response: {
                    candidates: [{
                        content: {
                            parts: [{
                                text: ''
                            }]
                        }
                    }]
                }
            };

            mockModel.generateContent.mockResolvedValue(mockResponse);

            const response = await request(app)
                .post(`/ai/recommendation/${session.id}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('message', 'Failed to generate AI recommendation');
            expect(response.body).toHaveProperty('error', 'Empty response from AI');
        });

        test('Should handle malformed AI response', async () => {
            // Mock malformed response
            const mockResponse = {
                response: {
                    candidates: []
                }
            };

            mockModel.generateContent.mockResolvedValue(mockResponse);

            const response = await request(app)
                .post(`/ai/recommendation/${session.id}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('message', 'Failed to generate AI recommendation');
            expect(response.body).toHaveProperty('error', 'No valid response from Gemini API');
        });

        test('Should handle null AI response', async () => {
            // Mock null response
            mockModel.generateContent.mockResolvedValue(null);

            const response = await request(app)
                .post(`/ai/recommendation/${session.id}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('message', 'Failed to generate AI recommendation');
            expect(response.body).toHaveProperty('error', 'No valid response from Gemini API');
        });

        test('Should handle database error when updating session', async () => {
            // Mock successful AI response
            const mockResponse = {
                response: {
                    candidates: [{
                        content: {
                            parts: [{
                                text: 'Test recommendation'
                            }]
                        }
                    }]
                }
            };

            mockModel.generateContent.mockResolvedValue(mockResponse);

            // Mock session update failure
            const originalUpdate = session.update;
            session.update = jest.fn().mockRejectedValue(new Error('Database connection error'));

            const response = await request(app)
                .post(`/ai/recommendation/${session.id}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('message', 'Internal server error');

            // Restore original method
            session.update = originalUpdate;
        });
    });
});
