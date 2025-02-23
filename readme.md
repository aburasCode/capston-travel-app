# Travel Planner App

## Overview
The Travel Planner App is a web-based application that helps users plan their trips by providing essential information such as weather forecasts and images of their travel destinations. The application integrates multiple APIs to fetch geolocation data, weather details, and relevant images for the destination. It is built using JavaScript and runs in a Webpack environment with an Express server and service workers for offline capabilities.

## Features
- User inputs a travel destination and departure date.
- Geonames API fetches the latitude and longitude of the entered location.
- Weatherbit API provides a weather forecast based on the travel date.
- Pixabay API fetches an image of the entered destination.
- Countdown feature calculates the days remaining until the trip.
- Responsive design for optimal usability across different devices.
- Service workers for offline capabilities.
- Webpack for module bundling and development efficiency.
- Jest testing for both client-side and server-side functionality.
- ES6 syntax with const/let and arrow functions.
- Code formatted according to the Udacity JavaScript Style Guide.

## Project Structure
```
Root
├── package.json
├── README.md
├── src
│   ├── client
│   │   ├── index.js
│   │   ├── js
│   │   │   └── app.js
│   │   ├── styles
│   │   │   └── style.scss
│   │   └── views
│   │       └── index.html
│   └── server
│       └── server.js
└── webpack.config.js
```

## Installation & Setup
### Prerequisites
Ensure you have Node.js and npm installed on your system.

### Steps to Run Locally

1. Install dependencies:
   ```sh
   npm install
   ```
2. Create a `.env` file in the root directory and add your API keys:
   ```sh
   GEONAMES_USERNAME=your_geonames_username
   WEATHERBIT_API_KEY=your_weatherbit_api_key
   PIXABAY_API_KEY=your_pixabay_api_key
   ```
3. Build the project:
   ```sh
   npm run build
   ```
4. Start the development server:
   ```sh
   npm run dev
   ```
5. Start the Express server:
   ```sh
   npm run start
   ```
6. Open the application in your browser at `http://localhost:8080/`.

## APIs Used
- **[Geonames API](http://www.geonames.org/)**: Fetches latitude and longitude from a location name.
- **[Weatherbit API](https://www.weatherbit.io/)**: Provides current or future weather forecasts based on coordinates.
- **[Pixabay API](https://pixabay.com/api/docs/)**: Fetches images related to the entered travel destination.

## Testing
This project includes Jest testing for both server-side and client-side functionalities.
To run the tests, execute:
```sh
npm run test
```

## Enhancements
- Add an end date and display the total trip length.
- Fetch and display additional travel details like flights and accommodations.
- Allow users to save trips using Local Storage.
- Include the REST Countries API to display country-specific data.
- Enable users to export their trip details as a PDF.
- Implement a to-do or packing list feature.

## Prerequisites
- Node.js version 18 or higher

## Author
Developed by [Ali aburas].