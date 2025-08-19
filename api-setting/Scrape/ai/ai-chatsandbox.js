/*
 • Fitur By Anomaki Team
 • Created : xyzan code
 • SCRAPE CHATSANDBOX AI
 • Jangan Hapus Wm
 • https://whatsapp.com/channel/0029Vaio4dYC1FuGr5kxfy2l
*/
const axios = require('axios');

async function chatsandbox(prompt) {
  const h = {
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Mobile Safari/537.36',
    'Referer': 'https://chatsandbox.com/chat/openai'
  };
  
  const data = {
    messages: [prompt],
    character: 'openai'
  };
  
  try {
    const res = await axios.post('https://chatsandbox.com/api/chat', data, {
      headers: h,
      decompress: true
    });
    return res.data;
  } catch (error) {
    throw new Error(`${error.message}`);
  }
}

module.exports = chatsandbox;
