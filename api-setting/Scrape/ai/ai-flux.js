const axios = require('axios');

async function fluxAI(prompt) {
  try {
    const res = await axios.post('https://fluxai.pro/api/tools/fast', 
      { prompt: prompt },
      {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Mobile Safari/537.36',
          'Referer': 'https://fluxai.pro/fast-flux'
        },
        timeout: 30000,
        decompress: true
      }
    );

    if (res.data?.ok === true && res.data?.data?.imageUrl) {
      return res.data.data.imageUrl;
    }

    if (res.data?.data?.images?.[0]) {
      return res.data.data.images[0];
    }

    throw new Error('Image URL not found in API response');
  } catch (er) {
    throw new Error(`Failed to generate image: ${er.message}`);
  }
}

module.exports = fluxAI;
