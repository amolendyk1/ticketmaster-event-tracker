const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const statusEl = document.getElementById("status");
const eventsContainer = document.getElementById("events-container");
const favoritesContainer = document.getElementById("favorites-container");

const FAVORITES_KEY = "tm_favorites";

function loadFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveFavorites(favs) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
}

let favorites = loadFavorites();

// -------- FETCH FROM VERCEL BACKEND --------
async function fetchEvents(keyword) {
  statusEl.textContent = "Loading events...";
  eventsContainer.innerHTML = "";

  try {
    const res = await fetch(`/api/events?keyword=${encodeURIComponent(keyword)}`);

    if (!res.ok) {
      throw new Error(`Server error: ${res.status}`);
    }

    const data = await res.json();
    const events = data?._embedded?.events || [];

    if (events.length === 0) {
      statusEl.textContent = "No events found. Try a different search.";
      return;
    }

    statusEl.textContent = `Found ${events.length} event(s).`;
    renderEvents(events);
  } catch (err) {
    console.error(err);
    statusEl.textContent = "Error fetching events.";
  }
}

// -------- RENDERING --------
function renderEvents(events) {
  eventsContainer.innerHTML = "";

  events.forEach((event) => {
    const card = createEventCard(event, false);
    eventsContainer.appendChild(card);
  });
}

function renderFavorites() {
  favoritesContainer.innerHTML = "";

  if (favorites.length === 0) {
    favoritesContainer.innerHTML =
      "<p class='event-meta'>No favorites yet.</p>";
    return;
  }

  favorites.forEach((fav) => {
    const card = createEventCard(fav, true);
    favoritesContainer.appendChild(card);
  });
}

// -------- MAP EVENT FIELDS --------
function mapEvent(event) {
  const name = event.name || "Untitled event";

  const venue = event._embedded?.venues?.[0]?.name || "Venue TBA";
  const city = event._embedded?.venues?.[0]?.city?.name || "";
  const state = event._embedded?.venues?.[0]?.state?.name || "";

  const date = event.dates?.start?.localDate || "Date TBA";
  const time = event.dates?.start?.localTime || "";

  const priceRange = event.priceRanges?.[0]
    ? `${event.priceRanges[0].min}–${event.priceRanges[0].max} ${event.priceRanges[0].currency}`
    : "Price TBA";

  const url = event.url || "#";
  const id = event.id;

  return {
    id,
    name,
    venue,
    city,
    state,
    date,
    time,
    priceRange,
    url,
  };
}

// -------- CREATE EVENT CARD --------
function createEventCard(eventRaw, isFavoriteCard) {
  const event = mapEvent(eventRaw);

  const card = document.createElement("article");
  card.className = "event-card";

  const header = document.createElement("div");
  header.className = "event-header";

  const title = document.createElement("div");
  title.className = "event-title";
  title.textContent = event.name;

  const venue = document.createElement("div");
  venue.className = "event-venue";
  venue.textContent = event.city
    ? `${event.venue} • ${event.city}, ${event.state}`
    : event.venue;

  header.appendChild(title);
  header.appendChild(venue);

  const meta = document.createElement("div");
  meta.className = "event-meta";
  meta.textContent = `${event.date}${
    event.time ? " at " + event.time : ""
  } • ${event.priceRange}`;

  // Map iframe
  const mapFrame = document.createElement("iframe");
  mapFrame.className = "map-frame";
  mapFrame.width = "100%";
  mapFrame.height = "200";
  mapFrame.style.border = "0";
  mapFrame.loading = "lazy";
  mapFrame.allowFullscreen = true;
  mapFrame.referrerPolicy = "no-referrer-when-downgrade";

  const mapQuery = `${event.venue}, ${event.city} ${event.state}`;
  mapFrame.src = `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_KEY&q=${encodeURIComponent(
    mapQuery
  )}`;

  const actions = document.createElement("div");
  actions.className = "event-actions";

  const link = document.createElement("a");
  link.href = event.url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "View on Ticketmaster";
  link.style.fontSize = "0.8rem";

  const favBtn = document.createElement("button");
  favBtn.className = "favorite-btn";
  favBtn.textContent = isFavorite(event.id) ? "Saved" : "Save";

  if (isFavorite(event.id)) {
    favBtn.classList.add("active");
  }

  favBtn.addEventListener("click", () => {
    toggleFavorite(eventRaw);
  });

  actions.appendChild(link);
  actions.appendChild(favBtn);

  card.appendChild(header);
  card.appendChild(meta);
  card.appendChild(mapFrame);
  card.appendChild(actions);

  return card;
}

// -------- FAVORITES LOGIC --------
function isFavorite(id) {
  return favorites.some((f) => f.id === id);
}

function toggleFavorite(eventRaw) {
  const id = eventRaw.id;

  if (isFavorite(id)) {
    favorites = favorites.filter((f) => f.id !== id);
  } else {
    favorites.push(eventRaw);
  }

  saveFavorites(favorites);
  renderFavorites();
}

// -------- EVENT LISTENERS --------
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const keyword = searchInput.value.trim();
  if (!keyword) return;

  fetchEvents(keyword);
});

document.addEventListener("DOMContentLoaded", () => {
  renderFavorites();
});
