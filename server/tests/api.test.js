import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';

// We mock the app or create a mini version of it for testing
const app = express();
app.get('/api/health', (req, res) => res.status(200).json({ status: 'ok' }));

describe('API Health Check', () => {
  it('should return 200 OK for /api/health', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });
});
