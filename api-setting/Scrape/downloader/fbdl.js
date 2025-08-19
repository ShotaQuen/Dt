const axios = require('axios');
const cheerio = require('cheerio');

async function fbdl(url) {
  if (!/^https:\/\/www\.facebook\.com\/share\/v\//.test(url)) {
    return { status: false, error: 'URL tidak valid' };
  }

  const verifyPayload = `url=${encodeURIComponent(url)}`;

  const verifyRes = await axios.post('https://fdownloader.net/api/userverify', verifyPayload, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Accept': '*/*',
      'X-Requested-With': 'XMLHttpRequest'
    }
  });

  const cftoken = verifyRes.data?.token;
  if (!cftoken) {
    return { status: false, error: 'Gagal mendapatkan token' };
  }

  const ajaxPayload =
    'k_exp=' + (Math.floor(Date.now() / 1000) + 1800) +
    '&k_token=4901a847f621da898b5429bf38df6f3a0959738cd4eb52a2bf0cf44b3eb44cad' +
    '&q=' + encodeURIComponent(url) +
    '&lang=id&web=fdownloader.net&v=v2&w=' +
    '&cftoken=' + encodeURIComponent(cftoken);

  const ajaxRes = await axios.post('https://v3.fdownloader.net/api/ajaxSearch', ajaxPayload, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Accept': '*/*'
    }
  });

  const { status, data: html } = ajaxRes.data;
  if (status !== 'ok' || !html) {
    return { status: false, error: 'Gagal ambil data dari server' };
  }

  const $ = cheerio.load(html);
  const thumbnail = $('.image-fb img').attr('src') || '';
  const duration = $('.content p').text().trim();
  const title = $('.content h3').text().trim();

  const links = [];
  $('a.download-link-fb').each((_, el) => {
    const link = $(el).attr('href');
    const quality = $(el).attr('title')?.replace('Download ', '') || 'Unknown';
    const format = link?.includes('.mp4') ? 'mp4' : 'unknown';
    if (link) links.push({ quality, format, link });
  });

  return {
    status: true,
    title,
    duration,
    thumbnail,
    links
  };
}

module.exports = fbdl;
