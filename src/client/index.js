import { processTrip } from './js/app';

document.addEventListener('DOMContentLoaded', () => {
  const tripForm = document.getElementById('tripForm');
  const addDestinationBtn = document.getElementById('addDestination');
  const tripListElement = document.getElementById('tripList');
  const tripSummaryElement = document.getElementById('trip-summary');

  // --- Allow Multiple Destinations ---
  let destinationCount = 1;
  addDestinationBtn.addEventListener('click', () => {
    const destinationGroup = document.createElement('div');
    destinationGroup.className = 'destination-group';
    destinationGroup.innerHTML = `
      <label for="location-${destinationCount}">Destination:</label>
      <input type="text" id="location-${destinationCount}" name="location[]" placeholder="Enter a destination" required />
    `;
    addDestinationBtn.parentNode.insertBefore(destinationGroup, addDestinationBtn);
    destinationCount++;
  });

  // --- Load Saved Trips from LocalStorage ---
  function loadSavedTrips() {
    const trips = JSON.parse(localStorage.getItem('trips')) || [];
    tripListElement.innerHTML = '';
    trips.forEach((trip) => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${trip.destinations.join(', ')}</strong> - ${trip.startDate} to ${trip.endDate} (Duration: ${trip.duration} days)`;
      tripListElement.appendChild(li);
    });
  }
  loadSavedTrips();

  // --- Form Submission Handler ---
  tripForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Gather destination fields (multiple)
    const destinationInputs = document.querySelectorAll('input[name="location[]"]');
    const destinations = Array.from(destinationInputs)
      .map((input) => input.value.trim())
      .filter((val) => val !== '');

    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const todoListRaw = document.getElementById('todo-list').value;
    const todoList = todoListRaw.split(',').map((item) => item.trim()).filter((item) => item !== '');

    // --- Trip Duration Calculation ---
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    // Process each destination (for demonstration, we process sequentially)
    let tripDetails = [];
    for (let destination of destinations) {
      const details = await processTrip(destination, startDate, endDate);
      tripDetails.push(details);
    }

    // --- Update UI with Trip Summary ---
    let summaryHTML = `<p><strong>Destinations:</strong> ${destinations.join(', ')}</p>`;
    summaryHTML += `<p><strong>Trip Duration:</strong> ${duration} day(s)</p>`;
    if (todoList.length > 0) {
      summaryHTML += `<p><strong>Packing/To-Do List:</strong> ${todoList.join(', ')}</p>`;
    }
    // For demonstration, show detail for the first destination
    if (tripDetails[0]) {
      summaryHTML += `<div id="destination-detail">
        <h3>${tripDetails[0].geonames ? tripDetails[0].geonames.name : destinations[0]}</h3>
        <p>Weather: ${tripDetails[0].weather ? tripDetails[0].weather.data[0].weather.description : 'N/A'}</p>
        <img src="${tripDetails[0].image}" alt="Image of ${destinations[0]}" style="max-width:300px;">
      </div>`;
    }
    tripSummaryElement.innerHTML = summaryHTML;

    // --- Save Trip to LocalStorage ---
    const savedTrip = {
      destinations,
      startDate,
      endDate,
      duration,
      todoList,
      tripDetails,
    };
    let trips = JSON.parse(localStorage.getItem('trips')) || [];
    trips.push(savedTrip);
    localStorage.setItem('trips', JSON.stringify(trips));
    loadSavedTrips();

    // Optionally, reset the form and remove extra destination fields
    tripForm.reset();
    document.querySelectorAll('.destination-group').forEach((group, index) => {
      if (index > 0) {
        group.remove();
      }
    });
    destinationCount = 1;
  });

  // --- Service Worker Registration (Offline Capabilities) ---
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    });
  }
});