const axios = require('axios');

async function checkAIContent(text) {
  const url = 'https://ai-detector.youscan.io/api/check-text';
  const headers = {
    'accept': 'application/json',
    'content-type': 'application/json',
    'origin': 'https://ai-detector.youscan.io',
    'referer': 'https://ai-detector.youscan.io/',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36'
  };
  const payload = { text };

  try {
    const res = await axios.post(url, payload, { headers });
    if (res.data && res.data.success && res.data.data) {
      const { ai_generated_likelihood, ...restData } = res.data.data;
      return {
        success: true,
        data: {
          persentase: `${ai_generated_likelihood}%`,
          ...restData
        },
        message: res.data.message
      };
    } else {
      return { success: false, error: 'Data tidak ditemukan atau gagal dianalisis.' };
    }
  } catch (err) {
    return { success: false, error: err.message };
  }
}

module.exports = checkAIContent;
