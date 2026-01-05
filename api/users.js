// Vercel serverless function to proxy MockAPI requests
import axios from 'axios';

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

    let response;
    
    switch (req.method) {
      case 'GET':
        response = await axios.get(apiUrl);
        break;
      
      case 'POST':
        response = await axios.post(apiUrl, req.body);
        break;
      
      case 'PUT':
        response = await axios.put(apiUrl, req.body);
        break;
      
      case 'DELETE':
        response = await axios.delete(apiUrl);
        break;
      
      default:
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(error.response?.status || 500).json({
      error: error.message,
      details: error.response?.data
    });
  }
}
