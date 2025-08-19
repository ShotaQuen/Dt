/*
 • Fitur By Anomaki Team
 • Created : xyzan code
 • Scrape yt stalk
 • Jangan Hapus Wm
 • https://whatsapp.com/channel/0029Vaio4dYC1FuGr5kxfy2l
 
 memeriksa subscriber dan statistik subscriber secara realtime
*/

const axios = require('axios');

function numb(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

async function ytstalk(usrname) {
  const h = {
    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36',
    'Referer': 'https://socialcounts.org/youtube-live-subscriber-count'
  };
  
  try {
    const sres = await axios.get(`https://api.socialcounts.org/youtube-live-subscriber-count/search/${encodeURIComponent(usrname)}`, { headers: h });
    
    if (!sres.data.items || sres.data.items.length === 0) {
      throw new Error('Channel tidak ditemukan');
    }
    
    const ch1 = sres.data.items[0];
    const chid = ch1.id;
    
    const detailH = {
      ...h,
      'Referer': `https://socialcounts.org/youtube-live-subscriber-count/${chid}`
    };
    
    const detailRes = await axios.get(`https://api.socialcounts.org/youtube-live-subscriber-count/${chid}`, { headers: detailH });
    
    return {
      inpoCH: {
        id: ch1.id,
        nama: ch1.title,
        pp: ch1.avatar,
        banner: ch1.banner,
        adbanner: ch1.isBanner,
        subscriber: numb(ch1.subscriberCount)
      },
      stats: {
        perkiraanSubscriber: numb(detailRes.data.est_sub),
        subsApi: numb(detailRes.data.API_sub)
      }
    };
  } catch (e) {
    throw new Error(`${e.message}`);
  }
}

module.exports = ytstalk;
