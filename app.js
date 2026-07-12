const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const categorySelect = document.getElementById("category");
const statusEl = document.getElementById("status");
const eventsContainer = document.getElementById("events-container");

const API_KEY = "YOUR_BROWSER_API_KEY"; // IMPORTANT

async function fetchEvents(keyword, category) {
  statusEl.textContent = "Loading...";

  let categoryParam = category ? `&classificationName=${category}` : "";

  const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${API_KEY}&keyword=${encodeURIComponent(
    keyword
  )}${categoryParam}&countryCode=US&size=50`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data._embedded?.events) {
      statusEl.textContent = "No events found.";
      eventsContainer.innerHTML = "";
      return;
    }

    window.eventData = data._embedded.events;
    statusEl.textContent = `Found ${window.eventData.length} events`;

    renderEvents(window.eventData);
    centerMapOnFirst(window.eventData);

  } catch (err) {
    statusEl.textContent = "Error fetching events";
  }
}

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
}

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  fetchEvents(searchInput.value.trim(), categorySelect.value);
});
