const API_URL = "https://ticketmaster-event-tracker.vercel.app/api/ticketmaster";

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const locationInput = document.getElementById("location-input");
const statusEl = document.getElementById("status");
const eventsContainer = document.getElementById("events-container");
const loadMoreBtn = document.getElementById("load-more");

let allEvents = [];
let shownCount = 0;

let map;

// Initialize map after geolocation
navigator.geolocation.getCurrentPosition(
  (pos) => {
    const userLat = pos.coords.latitude;
    const userLng = pos.coords.longitude;

    map = L.map("map", { zoomControl: false }).setView([userLat, userLng], 10);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18
    }).addTo(map);

    L.marker([userLat, userLng])
      .addTo(map)
      .bindPopup("You are here");
  },
  () => {
    // Fallback if user denies location
    map = L.map("map").setView([37.7749, -122.4194], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18
    }).addTo(map);
  }
);

async function fetchEvents(keyword, location) {
  statusEl.textContent = "Loading events…";
  eventsContainer.innerHTML = "";
  loadMoreBtn.style.display = "none";
  allEvents = [];
  shownCount = 0;

  const url = `${API_URL}?keyword=${encodeURIComponent(
    keyword
  )}&location=${encodeURIComponent(location)}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    allEvents = data._embedded?.events || [];

    if (!allEvents.length) {
      statusEl.textContent = "No events found.";
      return;
    }

    statusEl.textContent = `Found ${allEvents.length} events`;
    renderEvents();
    renderMapPins();
  } catch (err) {
    statusEl.textContent = "Error fetching events.";
  }
}

function renderEvents() {
  const nextEvents = allEvents.slice(shownCount, shownCount + 5);
  shownCount += nextEvents.length;

  nextEvents.forEach((event) => {
    const venue = event._embedded.venues[0];
    const card = document.createElement("a");
    card.className = "tm-event-card";
    card.href = `event.html?id=${event.id}`;
    card.innerHTML = `
      <h3>${event.name}</h3>
      <p>${event.dates.start.localDate} — ${venue.city.name}, ${
      venue.state?.name || ""
    }</p>
    `;
    eventsContainer.appendChild(card);
  });

  loadMoreBtn.style.display = shownCount < allEvents.length ? "inline-flex" : "none";
}

function renderMapPins() {
  if (!map) return;

  const firstFive = allEvents.slice(0, 5);

  firstFive.forEach((event) => {
    const venue = event._embedded.venues[0];
    const lat = Number(venue.location.latitude);
    const lng = Number(venue.location.longitude);

    if (!lat || !lng) return;

    L.marker([lat, lng])
      .addTo(map)
      .bindPopup(`<b>${event.name}</b><br>${venue.city.name}`);
  });
}

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const keyword = searchInput.value.trim(); // optional
  const location = locationInput.value.trim(); // optional
  fetchEvents(keyword, location);
});

loadMoreBtn.addEventListener("click", () => {
  renderEvents();
});
