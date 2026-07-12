const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const categorySelect = document.getElementById("category");
const statusEl = document.getElementById("status");
const eventsContainer = document.getElementById("events-container");

const API_URL = "https://ticketmaster-event-tracker.vercel.app/api/ticketmaster";

async function fetchEvents(keyword, category) {
  statusEl.textContent = "Loading events…";

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
      .map((event) => {
        const venue = event._embedded.venues[0];
        return `
          <a class="tm-event-card" href="event.html?id=${event.id}">
            <h3>${event.name}</h3>
            <p>${event.dates.start.localDate} — ${venue.city.name}, ${
          venue.state?.name || ""
        }</p>
          </a>
        `;
      })
      .join("");
  } catch (err) {
    statusEl.textContent = "Error fetching events.";
    eventsContainer.innerHTML = "";
  }
}

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const keyword = searchInput.value.trim();
  const category = categorySelect.value;
  if (!keyword) {
    statusEl.textContent = "Please enter a keyword.";
    return;
  }
  fetchEvents(keyword, category);
});
