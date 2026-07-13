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

    const ticketBtn = document.getElementById("ticket-link");
    ticketBtn.href = event.url;

    const openBtn = document.getElementById("open-seatmap");
    const closeBtn = document.getElementById("close-seatmap");
    const modal = document.getElementById("seatmap-modal");
    const frame = document.getElementById("seatmap-frame");

    openBtn.onclick = () => {
      modal.style.display = "flex";

      if (event.seatmap?.staticUrl) {
        frame.src = event.seatmap.staticUrl;
      } else {
        frame.src = event.url;
      }

      frame.style.width = "100%";
      frame.style.height = "100%";
      frame.style.border = "none";
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
