const axios = require('axios');

async function ttdl(url) {
  try {
    const response = await axios.get(`https://www.savetts.com/api/info?url=${encodeURIComponent(url)}`, {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36',
        'Referer': `https://www.savetts.com/id?url=${encodeURIComponent(url)}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch TikTok info: ${error.message}`);
  }
}

module.exports = ttdl;
