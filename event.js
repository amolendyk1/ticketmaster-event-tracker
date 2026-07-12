// DOM Elements
const seatmapContainer = document.getElementById('seatmap-container');
const eventDetails = document.getElementById('event-details');
const loadingIndicator = document.getElementById('loading-indicator');

// Cache for seatmap data
const seatmapCache = new Map();

// Initialize with event data
document.addEventListener('DOMContentLoaded', async () => {
  const eventId = getEventIdFromURL(); // Implement this based on your routing
  if (eventId) {
    await loadEventAndSeatmap(eventId);
  }
});

async function loadEventAndSeatmap(eventId) {
  showLoading(true);
  
  try {
    // Load event details and seatmap in parallel
    const [eventData, seatmapData] = await Promise.all([
      fetchEventDetails(eventId),
      fetchSeatmapData(eventId)
    ]);
    
    renderEventDetails(eventData);
    renderSeatmap(seatmapData);
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

async function fetchSeatmapData(eventId) {
  // Check cache first
  if (seatmapCache.has(eventId)) {
    return seatmapCache.get(eventId);
  }

  const response = await fetch(`/api/events/${eventId}/seatmap`);
  if (!response.ok) throw new Error('Seatmap fetch failed');
  
  const data = await response.json();
  // Cache the seatmap data
  seatmapCache.set(eventId, data);
  return data;
}

function renderEventDetails(event) {
  eventDetails.innerHTML = `
    <h2>${event.name}</h2>
    <p>${event.date}</p>
    <p>${event.venue}</p>
  `;
}

function renderSeatmap(seatmapData) {
  // Implement your seatmap rendering logic here
  seatmapContainer.innerHTML = `
    <div class="seatmap">
      ${seatmapData.sections.map(section => `
        <div class="section" data-price="${section.price}">
          ${section.seats.map(seat => `
            <div class="seat ${seat.available ? 'available' : 'sold'}" 
                 data-seat="${seat.id}"></div>
          `).join('')}
        </div>
      `).join('')}
    </div>
  `;
  
  // Add interactivity
  document.querySelectorAll('.seat.available').forEach(seat => {
    seat.addEventListener('click', () => selectSeat(seat.dataset.seat));
  });
}

function showLoading(show) {
  loadingIndicator.style.display = show ? 'block' : 'none';
  seatmapContainer.style.visibility = show ? 'hidden' : 'visible';
}

function showError(message) {
  seatmapContainer.innerHTML = `<div class="error">${message}</div>`;
}

// Utility function - implement based on your routing
function getEventIdFromURL() {
  return new URLSearchParams(window.location.search).get('eventId');
}