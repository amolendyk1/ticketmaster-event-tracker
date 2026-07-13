const params = new URLSearchParams(window.location.search);
const eventId = params.get("id");

const API_URL = "https://ticketmaster-event-tracker.vercel.app/api/ticketmaster";

async function loadEvent() {
  if (!eventId) return;

  try {
    const res = await fetch(`${API_URL}?id=${eventId}`);
    const event = await res.json();

    const venue = event._embedded.venues[0];

    // Basic details
    document.getElementById("event-name").textContent = event.name;
    document.getElementById("event-date").textContent =
      event.dates.start.localDate;
    document.getElementById("event-venue").textContent = venue.name;
    document.getElementById("event-location").textContent =
      `${venue.city.name}, ${venue.state?.name || ""}`;

    // ⭐ BUY TICKETS — official Ticketmaster checkout
    const ticketBtn = document.getElementById("ticket-link");
    ticketBtn.href = event.url;   // event.url is ALWAYS the official TM checkout

    // ⭐ SEAT MAP — open full-screen modal
    const openBtn = document.getElementById("open-seatmap");
    const closeBtn = document.getElementById("close-seatmap");
    const modal = document.getElementById("seatmap-modal");
    const frame = document.getElementById("seatmap-frame");

    openBtn.onclick = () => {
      modal.style.display = "flex";

      // ⭐ Use Ticketmaster's official seat map URL if available
      if (event.seatmap?.staticUrl) {
        frame.src = event.seatmap.staticUrl;
      } else {
        // fallback: official event page
        frame.src = event.url;
      }
    };

    closeBtn.onclick = () => {
      modal.style.display = "none";
      frame.src = ""; // clear iframe
    };

  } catch (err) {
    document.getElementById("event-name").textContent =
      "Unable to load event details.";
  }
}

loadEvent();

