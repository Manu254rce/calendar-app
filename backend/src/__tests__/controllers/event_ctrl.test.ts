import request from 'supertest';
import { startApp } from '../../app';
import mongoose from 'mongoose';
import CalendarEvent from '../../models/event_mdls';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { describe } from 'node:test';

describe('Event controller', () => {
    let mongoServer: MongoMemoryServer;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    })

    beforeEach(async () => {
        await CalendarEvent.deleteMany({});
    });

    describe('GET /api/events', () => {
        it('should return all events for a user', async () => {
            const mockUser = { userId: 'test-user-id' };
            const mockEvent = await CalendarEvent.create({
                title: 'Test Event',
                date: new Date(),
                user: mockUser.userId,
            })

            const response = await request(startApp)
                .get('/api/events')
                .set('user', JSON.stringify(mockUser));

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(1);
            expect(response.body[0].title).toBe(mockEvent.title);
        })
    })

    describe('POST /api/events', () => {
        it('should create a new event', async () => {
            const mockUser = { userId: 'test-user-id' };
            const newEvent = {
                title: 'New Test Event',
                date: new Date(),
                description: 'Test Description',
            };

            const response = await request(startApp)
                .post('/api/events')
                .set('user', JSON.stringify(mockUser))
                .send(newEvent);

            expect(response.status).toBe(201);
            expect(response.body.title).toBe(newEvent.title);
        });
    });

})