const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const categorySelect = document.getElementById("category");
const statusEl = document.getElementById("status");
const eventsContainer = document.getElementById("events-container");

// IMPORTANT: This calls your Vercel backend, NOT Ticketmaster directly
const API_URL = "/api/ticketmaster";

async function fetchEvents(keyword, category) {
  statusEl.textContent = "Loading…";

  const url = `${API_URL}?keyword=${encodeURIComponent(
    keyword
  )}&category=${encodeURIComponent(category)}`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error("Backend error");
    }

    const data = await res.json();

    // No events found
    if (!data._embedded?.events) {
      statusEl.textContent = "No events found.";
      eventsContainer.innerHTML = "";
      window.eventData = [];
      return;
    }

    // Store events globally for map + details
    window.eventData = data._embedded.events;

    statusEl.textContent = `Found ${window.eventData.length} events`;

    renderEvents(window.eventData);
    centerMapOnFirst(window.eventData);

  } catch (err) {
    statusEl.textContent = "Error fetching events";

    eventsContainer.innerHTML = `
      <p style="color:#402821; font-weight:600;">
        Could not load events. Make sure your Vercel API route is working.
      </p>
    `;

    window.eventData = []; // prevent map crashes
  }
}

function renderEvents(events) {
  eventsContainer.innerHTML = events
    .map((event, index) => {
      const name = event.name;
      const date = event.dates?.start?.localDate || "Date unavailable";
      const venue = event._embedded?.venues?.[0]?.name || "Venue unavailable";
      const city = event._embedded?.venues?.[0]?.city?.name || "";
      const state = event._embedded?.venues?.[0]?.state?.name || "";
      const url = event.url || "#";

      return `
        <div class="tm-event-card" onclick="toggleDetails(${index})">
          <h3>${name}</h3>
          <p>${date} — ${city}, ${state}</p>

          <div id="details-${index}" class="tm-event-details">
            <p><strong>Venue:</strong> ${venue}</p>
            <p><strong>Location:</strong> ${city}, ${state}</p>
            <a href="${url}" target="_blank">Find Tickets</a>
          </div>
        </div>
      `;
    })
    .join("");
}

// Handle search form
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  fetchEvents(searchInput.value.trim(), categorySelect.value);
});
