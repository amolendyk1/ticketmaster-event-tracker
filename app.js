const API_URL = "https://ticketmaster-event-tracker.vercel.app/api/ticketmaster";

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const locationInput = document.getElementById("location-input");
const categorySelect = document.getElementById("category-select");
const statusEl = document.getElementById("status");
const eventsContainer = document.getElementById("events-container");
const loadMoreBtn = document.getElementById("load-more");
const filterTag = document.getElementById("filter-tag");

let allEvents = [];
let filteredEvents = [];
let shownCount = 0;

let map;

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
    map = L.map("map").setView([37.7749, -122.4194], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18
    }).addTo(map);
  }
);

async function fetchEvents(keyword, locationFilter, categoryFilter) {
  statusEl.textContent = "Loading events…";
  eventsContainer.innerHTML = "";
  loadMoreBtn.style.display = "none";
  filterTag.style.display = "none";
  allEvents = [];
  filteredEvents = [];
  shownCount = 0;

  const url = `${API_URL}?keyword=${encodeURIComponent(keyword)}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    allEvents = data._embedded?.events || [];

    filteredEvents = allEvents.filter((event) => {
      const venue = event._embedded.venues[0];
      const city = venue.city.name.toLowerCase();
      const state = (venue.state?.name || "").toLowerCase();

      const classification =
        (event.classifications?.[0]?.segment?.name ||
          event.classifications?.[0]?.genre?.name ||
          "").toLowerCase();

      let locationMatch = true;
      let categoryMatch = true;

      if (locationFilter) {
        const filter = locationFilter.toLowerCase();
        locationMatch = city.includes(filter) || state.includes(filter);
      }

      if (categoryFilter) {
        const cat = categoryFilter.toLowerCase();
        categoryMatch = classification.includes(cat);
      }

      return locationMatch && categoryMatch;
    });

    if (!filteredEvents.length) {
      statusEl.textContent = "No events found for these filters.";
      return;
    }

    statusEl.textContent = `Found ${filteredEvents.length} events`;

    const parts = [];
    if (locationFilter) parts.push(`Location: ${locationFilter}`);
    if (categoryFilter) {
      const label = categorySelect.options[categorySelect.selectedIndex].text;
      parts.push(`Type: ${label}`);
    }
    if (parts.length) {
      filterTag.textContent = parts.join(" • ");
      filterTag.style.display = "inline-block";
    }

    renderEvents();
    renderMapPins();
  } catch (err) {
    statusEl.textContent = "Error fetching events.";
  }
}

function renderEvents() {
  const nextEvents = filteredEvents.slice(shownCount, shownCount + 5);
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

  loadMoreBtn.style.display =
    shownCount < filteredEvents.length ? "inline-flex" : "none";
}

function renderMapPins() {
  if (!map) return;

  const firstFive = filteredEvents.slice(0, 5);

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
  const keyword = searchInput.value.trim();
  const location = locationInput.value.trim();
  const category = categorySelect.value.trim();
  fetchEvents(keyword, location, category);
});

loadMoreBtn.addEventListener("click", () => {
  renderEvents();
});
