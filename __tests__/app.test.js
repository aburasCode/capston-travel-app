// __tests__/app.test.js

// Import the function to test from app.js
import { processTrip } from '../src/client/js/app';

// Mock the global fetch function before each test
global.fetch = jest.fn();

describe('processTrip function', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('should return a trip object with location, weather, and image data', async () => {
    // Set up mocks for the three API calls in order

    // 1. Mock Geonames API call
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            geonames: [
              { name: 'Test City', countryName: 'Test Country', lat: '10', lng: '20' },
            ],
          }),
      })
    );

    // 2. Mock Weatherbit API call
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            data: [
              { temp: 25, weather: { description: 'Clear sky' } },
            ],
          }),
      })
    );

    // 3. Mock Pixabay API call
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            hits: [{ webformatURL: 'http://test.com/image.jpg' }],
          }),
      })
    );

    // Call processTrip with test data
    const trip = await processTrip('Test City', '2025-01-01', '2025-01-10');

    // Verify that the returned trip object contains the expected properties
    expect(trip).toHaveProperty('location', 'Test City');
    expect(trip).toHaveProperty('startDate', '2025-01-01');
    expect(trip).toHaveProperty('endDate', '2025-01-10');

    // Check geonames data
    expect(trip.geonames).toBeDefined();
    expect(trip.geonames.name).toBe('Test City');
    expect(trip.geonames.countryName).toBe('Test Country');

    // Check weather data
    expect(trip.weather).toBeDefined();
    expect(trip.weather.data[0].temp).toBe(25);
    expect(trip.weather.data[0].weather.description).toBe('Clear sky');

    // Check image data
    expect(trip.image).toBe('http://test.com/image.jpg');
  });
});
