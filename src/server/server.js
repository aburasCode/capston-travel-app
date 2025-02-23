const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const dotenv = require('dotenv');
const path = require('path');

if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: path.resolve(__dirname, '.env.production') });
} else {
  dotenv.config({ path: path.resolve(__dirname, '.env.development') });
}

const app = express();
const PORT = process.env.PORT || 3000;

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Parse incoming JSON and URL-encoded payloads
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, '../../dist')));

// ---------------------------------------------------
// Test Route: Verify the server is working correctly
// ---------------------------------------------------
app.get('/api/test', (req, res) => {
  res.status(200).json({ message: 'Server is working!' });
});

// ---------------------------------------------------
// Geonames API Route
// Expects: GET /api/geonames?location=<location>
// ---------------------------------------------------
app.get('/api/geonames', async (req, res) => {
  try {
    const { location } = req.query;
    const username = process.env.GEONAMES_USERNAME;
    const response = await fetch(`http://api.geonames.org/searchJSON?q=${encodeURIComponent(location)}&maxRows=1&username=${username}`);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data from Geonames:', error);
    res.status(500).json({ error: 'Error fetching data from Geonames', details: error });
  }
});

// ---------------------------------------------------
// Weatherbit API Route
// Expects: GET /api/weather?lat=<latitude>&lon=<longitude>
// ---------------------------------------------------
app.get('/api/weather', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    const key = process.env.WEATHERBIT_KEY;
    const response = await fetch(`https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lon}&key=${key}`);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data from Weatherbit:', error);
    res.status(500).json({ error: 'Error fetching data from Weatherbit', details: error });
  }
});

// ---------------------------------------------------
// Pixabay API Route
// Expects: GET /api/pixabay?q=<search term>
// ---------------------------------------------------
app.get('/api/pixabay', async (req, res) => {
  try {
    const { q } = req.query;
    const key = process.env.PIXABAY_KEY;
    const response = await fetch(`https://pixabay.com/api/?key=${key}&q=${encodeURIComponent(q)}&image_type=photo`);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data from Pixabay:', error);
    res.status(500).json({ error: 'Error fetching data from Pixabay', details: error });
  }
});

// Handle all other routes by serving the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist/index.html'));
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app; // Exporting for testing purposes