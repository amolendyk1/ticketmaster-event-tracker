const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const categorySelect = document.getElementById("category");
const statusEl = document.getElementById("status");
const eventsContainer = document.getElementById("events-container");

const API_URL = "https://ticketmaster-event-tracker.vercel.app/api/ticketmaster";

async function fetchEvents(keyword, category) {
  statusEl.textContent = "Loading…";

  const url = `${API_URL}?keyword=${encodeURIComponent(
    keyword
  )}&category=${encodeURIComponent(category)}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data._embedded?.events) {
      statusEl.textContent = "No events found.";
      eventsContainer.innerHTML = "";
      return;
    }

    const events = data._embedded.events;
    statusEl.textContent = `Found ${events.length} events`;

    eventsContainer.innerHTML = events
      .map(
        (event) => `
      <a class="tm-event-card" href="event.html?id=${event.id}">
        <h3>${event.name}</h3>
        <p>${event.dates.start.localDate} — ${
          event._embedded.venues[0].city.name
        }, ${event._embedded.venues[0].state.name}</p>
      </a>
    `
      )
      .join("");
  } catch (err) {
    statusEl.textContent = "Error fetching events";
  }
}

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  fetchEvents(searchInput.value.trim(), categorySelect.value);
});
