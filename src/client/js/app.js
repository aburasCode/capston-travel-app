// src/client/js/app.js

/**
 * Fetch location data from Geonames API
 * @param {string} location - The destination entered by the user
 * @returns {Promise<Object|null>} - Geonames data or null on error
 */
export async function fetchGeonames(location) {
    try {
      const response = await fetch(`/api/geonames?location=${encodeURIComponent(location)}`);
      if (!response.ok) throw new Error('Error fetching Geonames data');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  
  /**
   * Fetch current weather data from Weatherbit API
   * @param {string} lat - Latitude from Geonames API result
   * @param {string} lon - Longitude from Geonames API result
   * @returns {Promise<Object|null>} - Weather data or null on error
   */
  export async function fetchWeather(lat, lon) {
    try {
      const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
      if (!response.ok) throw new Error('Error fetching Weather data');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  
  /**
   * Fetch an image from Pixabay API based on the location
   * @param {string} query - The location query for images
   * @returns {Promise<Object|null>} - Pixabay data or null on error
   */
  export async function fetchPixabay(query) {
    try {
      const response = await fetch(`/api/pixabay?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Error fetching Pixabay data');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  
  /**
   * Process the trip by calling the APIs and building a trip object
   * @param {string} location - Destination entered by the user
   * @param {string} startDate - Start date of the trip
   * @param {string} endDate - End date of the trip
   * @returns {Promise<Object>} - An object containing trip details
   */
  export async function processTrip(location, startDate, endDate) {
    const primaryTrip = {
      location,
      startDate,
      endDate,
      geonames: null,
      weather: null,
      image: null,
    };
  
    // Fetch geonames data
    const geonamesData = await fetchGeonames(location);
    if (geonamesData && geonamesData.geonames && geonamesData.geonames.length > 0) {
      primaryTrip.geonames = geonamesData.geonames[0];
      const lat = primaryTrip.geonames.lat;
      const lon = primaryTrip.geonames.lng;
  
      // Fetch weather data based on the geonames result
      const weatherData = await fetchWeather(lat, lon);
      primaryTrip.weather = weatherData;
    }
  
    // Fetch image data from Pixabay; fallback to a placeholder if no image is found
    const pixabayData = await fetchPixabay(location);
    if (pixabayData && pixabayData.hits && pixabayData.hits.length > 0) {
      primaryTrip.image = pixabayData.hits[0].webformatURL;
    } else {
      primaryTrip.image = 'https://via.placeholder.com/600x400';
    }
  
    return primaryTrip;
  }
  
  /**
   * Update the UI with trip data
   * @param {Object} trip - The trip object returned from processTrip
   */
  export function updateUI(trip) {
    // Update location information
    const locationInfoDiv = document.getElementById('location-info');
    if (trip.geonames) {
      locationInfoDiv.innerHTML = `
        <h3>Location Information</h3>
        <p>City: ${trip.geonames.name}</p>
        <p>Country: ${trip.geonames.countryName}</p>
      `;
    } else {
      locationInfoDiv.innerHTML = `<p>No location information available.</p>`;
    }
  
    // Update weather information
    const weatherInfoDiv = document.getElementById('weather-info');
    if (trip.weather && trip.weather.data && trip.weather.data.length > 0) {
      const weatherData = trip.weather.data[0];
      weatherInfoDiv.innerHTML = `
        <h3>Current Weather</h3>
        <p>Temperature: ${weatherData.temp}°C</p>
        <p>Weather: ${weatherData.weather.description}</p>
      `;
    } else {
      weatherInfoDiv.innerHTML = `<p>No weather information available.</p>`;
    }
  
    // Update image display
    const imageDisplayDiv = document.getElementById('image-display');
    imageDisplayDiv.innerHTML = `
      <h3>Destination Image</h3>
      <img src="${trip.image}" alt="Image of ${trip.location}" />
    `;
  }
  