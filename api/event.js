const ticketmaster = require('./ticketmaster');

module.exports = async (req, res) => {
  try {
    const { keyword, category, location } = req.query;
    const params = {};
    
    if (keyword) params.keyword = keyword;
    if (category) params.classificationName = category;
    if (location) params.city = location;

    const data = await ticketmaster.fetchEvents(params);
    res.json(data._embedded?.events || []);
    
  } catch (error) {
    console.error('API Route Error:', error);
    res.status(500).json({ 
      error: error.message,
      details: 'Failed to fetch events' 
    });
  }
};