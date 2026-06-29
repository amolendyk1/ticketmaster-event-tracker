What I'm building: (one sentence)
Which API I'm using: (name and URL)
Why I chose this: (what interests you about this data?)
Core features: (3-5 things it will do)
What I don't know yet: (what about fetch/async/JSON is new to you?)


https://developer.ticketmaster.com/products-and-docs/apis/getting-started/




What the app does (the short answer)
It fetches live events from Ticketmaster’s Discovery API, lets users search by artist, venue, city, or keyword, and displays results in a clean, responsive interface with loading + error states.

🔧 Key Features (each begins with a Guided Link)
Live event search — call https://app.ticketmaster.com/discovery/v2/events.json?apikey=YOUR_KEY to fetch events .

Keyword search — “Taylor Swift”, “comedy”, “soccer”, etc.

Location filters — country, city, zip, DMA (Ticketmaster supports all of these) .

Genre browsing — music, sports, arts & theater, family, festivals.

Artist detail pages — using /attractions/{id} for artist info .

Venue detail pages — using /venues/{id}.

Loading + error states — “Finding events…” / “No events found.”

Responsive design — grid on desktop, stacked cards on mobile.

Deploy on Vercel — because your API key must be hidden (Ticketmaster requires a key and warns not to expose it in client code) .

🎨 UI Concept


Main screens
Home: search bar + trending categories

Results: event cards with image, date, venue, price range

Event detail: hero image, description, venue info, link to buy

Artist detail: photo, bio snippet, upcoming events

Venue detail: map + upcoming shows

🔍 Non‑obvious twist
Add a “Vibe Selector” that filters events by mood instead of genre:

“High Energy” → EDM, rock, sports

“Chill Night Out” → jazz, acoustic, comedy

“Family Friendly” → kids shows, musicals

“Outdoors” → festivals, fairs

This makes your app feel more personal and fun than a standard event search.

🧠 Why this fits MP3 perfectly
Uses a real API with live data (Ticketmaster Discovery API) 

Requires search + filters

Lets you design loading + error states

Encourages a polished, responsive UI

Requires Vercel deployment to hide your API key (Ticketmaster explicitly warns not to expose keys) 

Has clear, achievable scope for a 1–2 week project