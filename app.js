const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const statusEl = document.getElementById("status");
const eventsContainer = document.getElementById("events-container");

// Debug mode - set to false in production
const DEBUG_MODE = true;

async function fetchEvents(keyword) {
  if (!keyword) {
    showError("Please enter a search term");
    return;
  }

  showLoading(true);
  showStatus(`Searching for "${keyword}"...`);

  try {
    if (DEBUG_MODE) console.log("[DEBUG] Starting fetch for:", keyword);

    const startTime = Date.now();
    const response = await fetch(`/api/events?keyword=${encodeURIComponent(keyword)}`);
    const fetchTime = Date.now() - startTime;

    if (DEBUG_MODE) {
      console.log(`[DEBUG] Fetch completed in ${fetchTime}ms`);
      console.log("[DEBUG] Response status:", response.status);
    }

    if (!response.ok) {
      const errorData = await parseErrorResponse(response);
      throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    
    if (DEBUG_MODE) console.log("[DEBUG] API response data:", data);

    if (!data._embedded?.events) {
      throw new Error("No events found in response data");
    }

    renderEvents(data._embedded.events);
    showStatus(`Found ${data._embedded.events.length} events`);
    
  } catch (error) {
    if (DEBUG_MODE) console.error("[DEBUG] Full error:", error);
    
    let errorMessage = "Error fetching events";
    
    if (error.message.includes("Failed to fetch")) {
      errorMessage = "Network error - check your connection";
    } else if (error.message.includes("No events found")) {
      errorMessage = "No events found. Try a different search term.";
    } else if (error.message.includes("HTTP error")) {
      errorMessage = `Server error: ${error.message}`;
    }

    showError(errorMessage);
  } finally {
    showLoading(false);
  }
}

// Enhanced error parsing
async function parseErrorResponse(response) {
  try {
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return await response.json();
    }
    return { message: await response.text() };
  } catch {
    return { message: "Unknown error occurred" };
  }
}

function renderEvents(events) {
  if (!events || events.length === 0) {
    eventsContainer.innerHTML = "<p class='no-events'>No events to display</p>";
    return;
  }

  eventsContainer.innerHTML = events.map(event => `
    <div class="event-card">
      <h3>${event.name || "Untitled Event"}</h3>
      <p>${event.dates?.start?.localDate || "Date not available"}</p>
      <p>${event._embedded?.venues?.[0]?.name || "Venue not specified"}</p>
    </div>
  `).join('');
}

function showStatus(message) {
  statusEl.textContent = message;
  statusEl.className = "status-info";
}

function showError(message) {
  statusEl.textContent = message;
  statusEl.className = "status-error";
  eventsContainer.innerHTML = "";
}

function showLoading(isLoading) {
  if (isLoading) {
    statusEl.innerHTML = `<span class="loading-spinner"></span> Loading...`;
  }
}

// Event listener with debounce
let searchTimeout;
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    fetchEvents(searchInput.value.trim());
  }, 300);
});

// Initial load
fetchEvents("music");