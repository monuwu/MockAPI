// Vercel serverless function to proxy MockAPI requests
const MOCKAPI_URL = 'https://695b621b1d8041d5eeb69275.mockapi.io/api/202/users';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { id } = req.query;
    let apiUrl = MOCKAPI_URL;
    
    // If there's an id in the query, append it to the URL
    if (id) {
      apiUrl = `${MOCKAPI_URL}/${id}`;
    }

    const options = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Add body for POST and PUT requests
    if (req.method === 'POST' || req.method === 'PUT') {
      options.body = JSON.stringify(req.body);
    }

    const response = await fetch(apiUrl, options);
    
    if (!response.ok) {
      throw new Error(`MockAPI returned ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(500).json({
      error: error.message
    });
  }
}
