/* ============================================================
   events.js — Map + Event Detail Logic for Ticketmaster App
   Works with GitHub Pages (client-side only)
============================================================ */

/* 
  This file handles:
  - Map initialization
  - Centering map on events
  - Adding markers
  - Updating map when an event is expanded
  - Smooth marker replacement
*/

/* ============================================================
   MAP INITIALIZATION
============================================================ */

let map;
let currentMarker = null;

// Initialize map once the page loads
document.addEventListener("DOMContentLoaded", () => {
  map = L.map("event-map").setView([37.7749, -122.4194], 4); // default USA view

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
  }).addTo(map);
});

/* ============================================================
   CENTER MAP ON FIRST EVENT
============================================================ */

function centerMapOnFirst(events) {
  if (!events || events.length === 0) return;

  const venue = events[0]._embedded?.venues?.[0];
  const lat = venue?.location?.latitude;
  const lng = venue?.location?.longitude;

  if (lat && lng) {
    map.setView([lat, lng], 10);
    placeMarker(lat, lng, events[0].name);
  }
}

/* ============================================================
   PLACE MARKER
============================================================ */

function placeMarker(lat, lng, label) {
  // Remove old marker
  if (currentMarker) {
    map.removeLayer(currentMarker);
  }

  // Add new marker
  currentMarker = L.marker([lat, lng]).addTo(map);

  if (label) {
    currentMarker.bindPopup(label).openPopup();
  }
}

/* ============================================================
   UPDATE MAP WHEN EVENT EXPANDS
============================================================ */

function updateMapForEvent(event) {
  const venue = event._embedded?.venues?.[0];
  const lat = venue?.location?.latitude;
  const lng = venue?.location?.longitude;

  if (!lat || !lng) return;

  map.setView([lat, lng], 12);
  placeMarker(lat, lng, event.name);
}

/* ============================================================
   HANDLE EXPANDABLE EVENT CARDS
============================================================ */

window.toggleDetails = function (index) {
  const details = document.getElementById(`details-${index}`);

  // Toggle visibility
  const isOpen = details.style.display === "block";
  details.style.display = isOpen ? "none" : "block";

  // Update map only when opening
  if (!isOpen && window.eventData) {
    const event = window.eventData[index];
    updateMapForEvent(event);
  }
};
