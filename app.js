const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const statusEl = document.getElementById("status");
const eventsContainer = document.getElementById("events-container");

const API_KEY = "YOUR_BROWSER_API_KEY"; // IMPORTANT

// Map setup
let map = L.map("event-map").setView([37.7749, -122.4194], 4);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

// Fetch events
async function fetchEvents(keyword) {
  statusEl.textContent = "Loading...";

  const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${API_KEY}&keyword=${encodeURIComponent(
    keyword
  )}&countryCode=US&size=50`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data._embedded?.events) {
      statusEl.textContent = "No events found.";
      eventsContainer.innerHTML = "";
      return;
    }

    statusEl.textContent = `Found ${data._embedded.events.length} events`;
    renderEvents(data._embedded.events);

  } catch (err) {
    statusEl.textContent = "Error fetching events";
  }
}

// Render events
function renderEvents(events) {
  eventsContainer.innerHTML = events
    .map((event, index) => {
      const name = event.name;
      const date = event.dates?.start?.localDate || "";
      const venue = event._embedded?.venues?.[0]?.name || "";
      const city = event._embedded?.venues?.[0]?.city?.name || "";
      const state = event._embedded?.venues?.[0]?.state?.name || "";
      const url = event.url;

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

  window.eventData = events;
}

// Expand/collapse + map update
function toggleDetails(index) {
  const details = document.getElementById(`details-${index}`);
  details.style.display = details.style.display === "block" ? "none" : "block";

  const event = window.eventData[index];
  const venue = event._embedded?.venues?.[0];
  const lat = venue?.location?.latitude;
  const lng = venue?.location?.longitude;

  if (lat && lng) {
    map.setView([lat, lng], 12);
    L.marker([lat, lng]).addTo(map).bindPopup(event.name).openPopup();
  }
}

// Search listener
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  fetchEvents(searchInput.value.trim());
});
