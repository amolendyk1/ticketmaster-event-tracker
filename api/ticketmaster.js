export default async function handler(req, res) {
  const { keyword = "", category = "", id = "" } = req.query;

  const API_KEY = process.env.TM_KEY;

  let url;

  // ⭐ If an event ID is passed → fetch event details
  if (id) {
    url = `https://app.ticketmaster.com/discovery/v2/events/${id}.json?apikey=${API_KEY}`;
  }

  // ⭐ Otherwise → search events
  else {
    url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${API_KEY}&keyword=${encodeURIComponent(
      keyword
    )}&classificationName=${encodeURIComponent(category)}&countryCode=US&size=50`;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({
      error: "Ticketmaster API error",
      details: err.toString(),
    });
  }
}
