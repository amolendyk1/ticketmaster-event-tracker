// ===============================
// Ticketmaster Event Tracker (GitHub Pages Version)
// ===============================

// DOM elements
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const statusEl = document.getElementById("status");
const eventsContainer = document.getElementById("events-container");

// Your PUBLIC Ticketmaster API key
// IMPORTANT: This must be the "Browser" key from Ticketmaster Developer Portal
const API_KEY = "YOUR_PUBLIC_TICKETMASTER_KEY";

// Show loading
function showLoading(isLoading) {
  if (isLoading) {
    statusEl.innerHTML = `<span class="loading-spinner"></span> Loading...`;
  }
}

// Show status message
function showStatus(message) {
  statusEl.textContent = message;
  statusEl.className = "tm-status";
}

// Show error message
function showError(message) {
  statusEl.textContent = message;
  statusEl.className = "tm-status";
  eventsContainer.innerHTML = "";
}

// Fetch events directly from Ticketmaster API
async function fetchEvents(keyword) {
  if (!keyword) {
    showError("Please enter a search term");
    return;
  }

  showLoading(true);
  showStatus(`Searching for "${keyword}"...`);

  try {
    const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${API_KEY}&keyword=${encodeURIComponent(
      keyword
    )}&countryCode=US&size=50&locale=*`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Ticketmaster API error");
    }

    const data = await response.json();

    if (!data._embedded?.events) {
      showError("No events found. Try another search.");
      return;
    }

    renderEvents(data._embedded.events);
    showStatus(`Found ${data._embedded.events.length} events`);

  } catch (error) {
    console.error(error);
    showError("Error fetching events");
  } finally {
    showLoading(false);
  }
}

// Render events with expandable cards
function renderEvents(events) {
  eventsContainer.innerHTML = events
    .map((event, index) => {
      const name = event.name || "Untitled Event";
      const date = event.dates?.start?.localDate || "Date not available";
      const time = event.dates?.start?.localTime || "";
      const venue = event._embedded?.venues?.[0]?.name || "Venue not specified";
      const city = event._embedded?.venues?.[0]?.city?.name || "";
      const state = event._embedded?.venues?.[0]?.state?.name || "";
      const url = event.url || "#";

      return `
        <div class="tm-event-card" onclick="toggleDetails(${index})">
          <div class="tm-event-header">
            <div class="tm-event-title">${name}</div>
            <div class="tm-event-date">${date}</div>
          </div>

          <div id="details-${index}" class="tm-event-details">
            <p><strong>Time:</strong> ${time}</p>
            <p><strong>Venue:</strong> ${venue}</p>
            <p><strong>Location:</strong> ${city}, ${state}</p>
            <a href="${url}" target="_blank">Find Tickets</a>
          </div>
        </div>
      `;
    })
    .join("");
}

// Expand/collapse event details
function toggleDetails(index) {
  const details = document.getElementById(`details-${index}`);
  details.style.display = details.style.display === "block" ? "none" : "block";
}

// Search form listener
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  fetchEvents(searchInput.value.trim());
});

// Initial load
fetchEvents("music");
