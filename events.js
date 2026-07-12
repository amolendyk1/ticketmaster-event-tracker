let map;
let currentMarker = null;

document.addEventListener("DOMContentLoaded", () => {
  map = L.map("event-map").setView([37.7749, -122.4194], 4);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
  }).addTo(map);
});

function placeMarker(lat, lng, label) {
  if (!lat || !lng) return;

  if (currentMarker) map.removeLayer(currentMarker);

  currentMarker = L.marker([lat, lng]).addTo(map);

  if (label) currentMarker.bindPopup(label).openPopup();
}

function centerMapOnFirst(events) {
  if (!events || events.length === 0) return;

  const venue = events[0]._embedded?.venues?.[0];
  const lat = venue?.location?.latitude;
  const lng = venue?.location?.longitude;

  if (!lat || !lng) return;

  map.setView([lat, lng], 10);
  placeMarker(lat, lng, events[0].name);
}

window.toggleDetails = function (index) {
  const details = document.getElementById(`details-${index}`);
  const isOpen = details.style.display === "block";
  details.style.display = isOpen ? "none" : "block";

  if (!isOpen && window.eventData && window.eventData[index]) {
    const event = window.eventData[index];
    const venue = event._embedded?.venues?.[0];
    const lat = venue?.location?.latitude;
    const lng = venue?.location?.longitude;

    if (!lat || !lng) return;

    map.setView([lat, lng], 12);
    placeMarker(lat, lng, event.name);
  }
};
