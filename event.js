// DOM Elements
const seatmapContainer = document.getElementById('seatmap-container');
const eventDetails = document.getElementById('event-details');
const loadingIndicator = document.getElementById('loading-indicator');

// Initialize with event data
document.addEventListener('DOMContentLoaded', async () => {
  const eventId = getEventIdFromURL();
  if (eventId) {
    await loadEvent(eventId);
  }
});

async function loadEvent(eventId) {
  showLoading(true);

  try {
    const eventData = await fetchEventDetails(eventId);
    renderEventDetails(eventData);

    // Load official Ticketmaster seat map
    renderSeatmap(eventData.url);

  } catch (error) {
    console.error('Loading error:', error);
    showError('Failed to load event data');
  } finally {
    showLoading(false);
  }
}

async function fetchEventDetails(eventId) {
  const response = await fetch(`/api/events/${eventId}`);
  if (!response.ok) throw new Error('Event details fetch failed');
  return await response.json();
}

function renderEventDetails(event) {
  eventDetails.innerHTML = `
    <h2>${event.name}</h2>
    <p>${event.date}</p>
    <p>${event.venue}</p>
  `;
}

function renderSeatmap(ticketmasterUrl) {
  seatmapContainer.innerHTML = `
    <iframe 
      src="${ticketmasterUrl}" 
      class="seatmap-iframe"
      style="width:100%; height:800px; border:none; opacity:0.1;"
      onload="this.style.opacity='1'"
    ></iframe>
  `;
}

function showLoading(show) {
  loadingIndicator.style.display = show ? 'block' : 'none';
  seatmapContainer.style.visibility = show ? 'hidden' : 'visible';
}

function showError(message) {
  seatmapContainer.innerHTML = `<div class="error">${message}</div>`;
}

function getEventIdFromURL() {
  return new URLSearchParams(window.location.search).get('eventId');
}
