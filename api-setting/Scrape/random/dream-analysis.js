const axios = require('axios');

async function dreamAnalysis(text) {
  const url = 'https://safe-coast-53976-cd772af9b056.herokuapp.com/';
  const headers = {
    'Accept-Encoding': 'gzip',
    'Connection': 'Keep-Alive',
    'Content-Type': 'application/json',
    'Host': 'safe-coast-53976-cd772af9b056.herokuapp.com',
    'User-Agent': 'okhttp/4.9.2'
  };
  const payload = {
    text,
    isPremium: true
  };

  try {
    const response = await axios.post(url, payload, { headers });
    return response.data;
  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = dreamAnalysis;
