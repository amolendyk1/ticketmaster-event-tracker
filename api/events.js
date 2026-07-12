export default async function handler(req, res) {
  const { keyword } = req.query;

  if (!keyword) {
    return res.status(400).json({ error: "Keyword is required" });
  }

  const API_KEY = process.env.TICKETMASTER_API_KEY;
  console.log("Using API_KEY:", API_KEY ? "[HIDDEN]" : "NOT SET");

  if (!API_KEY) {
    return res.status(500).json({ error: "TICKETMASTER_API_KEY is not set" });
  }

  const url = new URL("https://app.ticketmaster.com/discovery/v2/events.json");
  url.searchParams.set("apikey", API_KEY);
  url.searchParams.set("keyword", keyword);
  url.searchParams.set("countryCode", "US");
  url.searchParams.set("size", "50");
  url.searchParams.set("locale", "*");

  try {
    console.log("Fetching from:", url.toString().replace(API_KEY, "[HIDDEN]"));
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error("API Error:", response.status, errorData);
      return res.status(502).json({ 
        error: "Ticketmaster API error", 
        status: response.status,
        details: errorData
      });
    }
    
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Network error:", error);
    return res.status(500).json({ 
      error: "Network error", 
      details: error.message 
    });
  }
}
