require('dotenv').config();
const fetch = require('node-fetch');

class TicketmasterService {
  constructor() {
    this.baseUrl = 'https://app.ticketmaster.com/discovery/v2';
    this.apiKey = process.env.TICKETMASTER_API_KEY;
  }

  async fetchEvents(params = {}) {
    const query = new URLSearchParams({
      apikey: this.apiKey,
      countryCode: 'US',
      size: 50,
      ...params
    });

    try {
      const response = await fetch(`${this.baseUrl}/events.json?${query}`);
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Ticketmaster API Error:', error);
      throw error;
    }
  }
}

module.exports = new TicketmasterService();