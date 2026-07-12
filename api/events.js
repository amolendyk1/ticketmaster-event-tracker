export default async function handler(req, res) {
  const { keyword } = req.query;

  if (!keyword) {
    return res.status(400).json({ error: "Keyword is required" });
  }

  const API_KEY = process.env.Wg8zO4A2WIDvCi2l9QmQ506m0Z5ETgwg;

  if (!API_KEY) {
    return res.status(500).json({ error: "TM_API_KEY is not set" });
  }

  const url = new URL("https://app.ticketmaster.com/discovery/v2/events.json");
  url.searchParams.set("apikey", API_KEY);
  url.searchParams.set("keyword", keyword);
  url.searchParams.set("countryCode", "US");
  url.searchParams.set("size", "50");
  url.searchParams.set("locale", "*");

  try {
    const response = await fetch(url.toString());
    const data = await response.json();

    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error", details: error.message });
  }
}
