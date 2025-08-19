const axios = require('axios');

function extractYoutubeId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/)([\w-]{11})/,
    /youtube\.com\/.*[?&]v=([\w-]{11})/
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

async function yta(url) {
  const videoId = extractYoutubeId(url);
  if (!videoId) {
    return { success: false, error: 'URL YouTube tidak valid.' };
  }

  const sig = 'dae3312c4c6c7000a37ecfb7b0aeb0e4';
  const endpoint = `https://d8.ymcdn.org/api/v1/convert?sig=${sig}&v=${videoId}&f=mp3&_=${Math.random()}`;

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36',
    'Referer': 'https://id.ytmp3.mobi/v1/'
  };

  try {
    const response = await axios.get(endpoint, { headers });

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message
    };
  }
}

module.exports = yta;
