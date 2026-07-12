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

    // Buy Tickets button → official Ticketmaster checkout
    document.getElementById("ticket-link").href = event.url;

    // Full-screen seat map modal using official event page
    const openBtn = document.getElementById("open-seatmap");
    const closeBtn = document.getElementById("close-seatmap");
    const modal = document.getElementById("seatmap-modal");
    const frame = document.getElementById("seatmap-frame");

    openBtn.onclick = () => {
      modal.style.display = "flex";
      frame.style.opacity = "0.1";
      frame.src = event.url; // official Ticketmaster event page
      frame.onload = () => {
        frame.style.opacity = "1";
      };
    };

    closeBtn.onclick = () => {
      modal.style.display = "none";
      frame.src = "";
    };
  } catch (err) {
    document.getElementById("event-name").textContent =
      "Unable to load event details.";
  }
}

loadEvent();
