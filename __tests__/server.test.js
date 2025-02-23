// __tests__/server.test.js

const request = require('supertest');
const app = require('../src/server/server');

describe('Express Server API', () => {
  test('GET /api/test should return a success message', async () => {
    const response = await request(app).get('/api/test');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Server is working!');
  });
});
