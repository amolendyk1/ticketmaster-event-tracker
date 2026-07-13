class EventApp {
  constructor() {
    this.currentPage = 0;
    this.initElements();
    this.setupEventListeners();
    this.initMap();
  }

  initElements() {
    this.elements = {
      searchForm: document.getElementById('search-form'),
      searchInput: document.getElementById('search-input'),
      categorySelect: document.getElementById('category-select'),
      eventsContainer: document.getElementById('events-container'),
      statusEl: document.getElementById('status'),
      loadMoreBtn: document.getElementById('load-more'),
      map: null
    };
  }

  initMap() {
    this.elements.map = L.map('map').setView([39.8283, -98.5795], 4);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.elements.map);
  }

  async fetchEvents(params = {}) {
    try {
      this.elements.statusEl.textContent = 'Loading events...';
      const response = await fetch(`/api/events?${new URLSearchParams(params)}`);
      if (!response.ok) throw new Error(await response.text());
      return await response.json();
    } catch (error) {
      this.elements.statusEl.textContent = `Error: ${error.message}`;
      return [];
    }
  }

  renderEvents(events) {
    if (!events.length) {
      this.elements.eventsContainer.innerHTML = '<p>No events found</p>';
      return;
    }

    this.elements.eventsContainer.innerHTML = events.map(event => `
      <div class="event-card">
        <h3>${event.name}</h3>
        <p>${event.dates?.start?.localDate || 'Date TBD'}</p>
        <p>${event._embedded?.venues?.[0]?.name || 'Venue TBD'}</p>
      </div>
    `).join('');
  }

  setupEventListeners() {
    this.elements.searchForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const events = await this.fetchEvents({
        keyword: this.elements.searchInput.value,
        category: this.elements.categorySelect.value
      });
      this.renderEvents(events);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => new EventApp());