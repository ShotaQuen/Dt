const axios = require('axios');

async function translateAI(word, from, to) {
  const url = 'https://api.translasion.com/enhance/dictionary';
  const headers = {
    'Accept-Encoding': 'identity',
    'Content-Type': 'application/json; charset=UTF-8'
  };
  const data = {
    app_key: '',
    from: from,
    gpt_switch: '0',
    override_from_flag: '0',
    scene: 100,
    system_lang: 'en',
    to: to,
    word: word
  };

  try {
    const response = await axios.post(url, data, { headers });
    return response.data.data;
  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = translateAI;
