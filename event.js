const params = new URLSearchParams(window.location.search);
const eventId = params.get("id");

const API_URL = "https://ticketmaster-event-tracker.vercel.app/api/ticketmaster";

async function loadEvent() {
  const res = await fetch(`${API_URL}?id=${eventId}`);
  const event = await res.json();

  const venue = event._embedded.venues[0];

  document.getElementById("event-name").textContent = event.name;
  document.getElementById("event-date").textContent =
    event.dates.start.localDate;
  document.getElementById("event-venue").textContent = venue.name;
  document.getElementById("event-location").textContent =
    `${venue.city.name}, ${venue.state.name}`;

  document.getElementById("ticket-link").href = event.url;

  loadSeatMap(eventId);
}

function loadSeatMap(eventId) {
  document.getElementById("seatmap").innerHTML = `
    <iframe
      src="https://ticketmaster.com/seatmap/${eventId}"
    ></iframe>
  `;
}

loadEvent();
