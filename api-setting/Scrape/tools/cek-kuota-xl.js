/*
 • Fitur By Anomaki Team
 • Created : xyzan code
 • Scrape Cek Kuota XL
 • Jangan Hapus Wm
 • https://whatsapp.com/channel/0029Vaio4dYC1FuGr5kxfy2l
 
 memeriksa kuota xl, tidak bisa spam cek nomor yang sama
*/

const axios = require('axios');

async function cekXL(nomor) {
  const h = {
    'authority': 'script.google.com',
    'accept': '*/*',
    'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
    'origin': 'https://2079164363-atari-embeds.googleusercontent.com',
    'referer': 'https://2079164363-atari-embeds.googleusercontent.com/',
    'sec-ch-ua': '"Chromium";v="137", "Not/A)Brand";v="24"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Linux"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'cross-site',
    'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
    'x-client-data': 'CI//ygE='
  };
  
  try {
    const proses1 = await axios.get(`https://script.google.com/macros/s/AKfycbzWc8Gw-nDH_1BGZFsswNedO5v0GDV46NBe7RNaO_4xqMXxaLeEzp-YXodMju8shFoypw/exec?msisdn=${nomor}`, {
      headers: h,
      timeout: 10000
    });
    
    return proses1.data;
  } catch (e) {
    throw new Error(`${e.message}`);
  }
}

module.exports = cekXL;
