let allEvents = [];
let shownCount = 0;

const API_URL = "https://ticketmaster-event-tracker.vercel.app/api/ticketmaster";

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const locationInput = document.getElementById("location-input");
const statusEl = document.getElementById("status");
const eventsContainer = document.getElementById("events-container");
const loadMoreBtn = document.getElementById("load-more");

let map;
let userLat = null;
let userLng = null;

navigator.geolocation.getCurrentPosition((pos) => {
  userLat = pos.coords.latitude;
  userLng = pos.coords.longitude;

  map = L.map("map").setView([userLat, userLng], 10);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
});

async function fetchEvents(keyword, location) {
  statusEl.textContent = "Loading…";

  const url = `${API_URL}?keyword=${encodeURIComponent(keyword)}&location=${encodeURIComponent(location)}`;

  const res = await fetch(url);
  const data = await res.json();

  allEvents = data._embedded?.events || [];
  shownCount = 0;

  renderEvents();
  renderMapPins();
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
      <p>${event.dates.start.localDate} — ${venue.city.name}, ${venue.state?.name || ""}</p>
    `;
    eventsContainer.appendChild(card);
  });

  loadMoreBtn.style.display = shownCount < allEvents.length ? "block" : "none";
}

function renderMapPins() {
  if (!map) return;

  allEvents.slice(0, 5).forEach((event) => {
    const venue = event._embedded.venues[0];
    const lat = venue.location.latitude;
    const lng = venue.location.longitude;

    L.marker([lat, lng])
      .addTo(map)
      .bindPopup(`<b>${event.name}</b><br>${venue.city.name}`);
  });
}

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  eventsContainer.innerHTML = "";
  fetchEvents(searchInput.value.trim(), locationInput.value.trim());
});

loadMoreBtn.addEventListener("click", renderEvents);
