import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Proxy route for OpenRouteService Directions API
app.get('/api/route', async (req, res) => {
  try {
    const { originLat, originLng, destinationLat, destinationLng, profile = 'foot-walking' } = req.query;

    if (!originLat || !originLng || !destinationLat || !destinationLng) {
      return res.status(400).json({ error: 'Missing coordinates parameters.' });
    }

    const apiKey = process.env.ORS_API_KEY;
    if (!apiKey) {
      console.error('ORS_API_KEY is not defined in the environment.');
      return res.status(500).json({ error: 'Routing service configuration error.' });
    }

    const url = `https://api.heigit.org/openrouteservice/v2/directions/${profile}/geojson`;
    
    const body = {
      coordinates: [
        [parseFloat(originLng), parseFloat(originLat)],
        [parseFloat(destinationLng), parseFloat(destinationLat)]
      ]
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': apiKey
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouteService API error:', response.status, errorText);
      return res.status(response.status).json({ error: 'Failed to retrieve route from routing provider.' });
    }

    const data = await response.json();
    
    // Extract geometry, distance, and duration
    if (!data.features || data.features.length === 0) {
      return res.status(404).json({ error: 'No route found between coordinates.' });
    }

    const routeFeature = data.features[0];
    const { distance, duration } = routeFeature.properties.summary;
    const geometry = routeFeature.geometry;

    return res.json({
      distanceMeters: distance,
      durationSeconds: duration,
      geometry
    });

  } catch (error) {
    console.error('Server proxy error:', error);
    return res.status(500).json({ error: 'Internal server error occurred while routing.' });
  }
});

app.listen(PORT, () => {
  console.log(`DHAROHAR API Proxy running on port ${PORT}`);
});
