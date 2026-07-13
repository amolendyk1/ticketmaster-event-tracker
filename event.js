export async function loadEvents(keyword, category, city) {
  const url = `/api/ticketmaster?keyword=${encodeURIComponent(
    keyword
  )}&category=${encodeURIComponent(
    category
  )}&city=${encodeURIComponent(city)}&locale=*`;

  const eventsContainer = document.getElementById("events-list");
  const statusEl = document.getElementById("events-status");

  try {
    const response = await fetch(url);
    const data = await response.json();

    // ⭐ No events found
    if (!data._embedded || !data._embedded.events) {
      statusEl.textContent = "No events found.";
      eventsContainer.innerHTML = "";
      return;
    }

    const events = data._embedded.events;

    statusEl.textContent = `${events.length} events found`;

    eventsContainer.innerHTML = events
      .map(
        (ev) => `
        <a class="tm-event-card" href="event.html?id=${ev.id}">
          <h3>${ev.name}</h3>
          <p>${ev.dates.start.localDate}</p>
          <p>${ev._embedded?.venues?.[0]?.name || "Unknown venue"}</p>
        </a>
      `
      )
      .join("");
  } catch (err) {
    statusEl.textContent = "Error fetching events.";
    console.error(err);
  }
}
