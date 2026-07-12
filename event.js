const params = new URLSearchParams(window.location.search);
const eventId = params.get("id");

const API_URL = "https://ticketmaster-event-tracker.vercel.app/api/ticketmaster";

async function loadEvent() {
  if (!eventId) return;

  try {
    const res = await fetch(`${API_URL}?id=${eventId}`);
    const event = await res.json();

    const venue = event._embedded.venues[0];

    document.getElementById("event-name").textContent = event.name;
    document.getElementById("event-date").textContent =
      event.dates.start.localDate;
    document.getElementById("event-venue").textContent = venue.name;
    document.getElementById("event-location").textContent =
      `${venue.city.name}, ${venue.state?.name || ""}`;

    // Buy Tickets button goes to official Ticketmaster checkout
    document.getElementById("ticket-link").href = event.url;

    // Seat map: embed official Ticketmaster event page
    loadSeatMap(event.id);
  } catch (err) {
    document.getElementById("event-name").textContent =
      "Unable to load event details.";
  }
}

function loadSeatMap(eventId) {
  document.getElementById("seatmap").innerHTML = `
    <iframe
      src="https://www.ticketmaster.com/event/${eventId}"
    ></iframe>
  `;
}

loadEvent();
