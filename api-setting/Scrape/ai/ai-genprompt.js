const axios = require('axios')

async function promptgen(content) {
  const url = 'https://api-v1.junia.ai/api/free-tools/generate'
  const h = {
    'Content-Type': 'application/json',
    'x-api-client-version': '4',
    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36',
    'Referer': 'https://www.junia.ai/tools/prompt-generator'
  }
  const data = {
    content,
    op: 'op-prompt'
  }

  try {
    const res = await axios.post(url, data, { headers: h })
    return {
      success: true,
      data: res.data
    }
  } catch (e) {
    return {
      success: false,
      error: e.message
    }
  }
}

module.exports = promptgen
