const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const categorySelect = document.getElementById("category");
const statusEl = document.getElementById("status");
const eventsContainer = document.getElementById("events-container");

// IMPORTANT: Your Consumer Key will NEVER work here.
// Replace this with your Vercel proxy once it's ready.
const API_URL = "https://ticketmaster-proxy.vercel.app/api/tm";


async function fetchEvents(keyword, category) {
  statusEl.textContent = "Loading…";

  const url = `${API_URL}?keyword=${encodeURIComponent(
    keyword
  )}&category=${encodeURIComponent(category)}`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error("Proxy or API error");
    }

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
    statusEl.textContent = "Error fetching events (API key blocked)";
    eventsContainer.innerHTML = `
      <p style="color:#402821; font-weight:600;">
        Your Ticketmaster Consumer Key cannot be used in the browser.<br>
        You must use your Vercel proxy instead.
      </p>
    `;
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
