const axios = require('axios');
const cheerio = require('cheerio');

async function fetchInitialPage(initialUrl) {
  try {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Linux; Android 10; RMX2185 Build/QP1A.190711.020) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.7103.60 Mobile Safari/537.36',
      'Referer': initialUrl,
    };

    const response = await axios.get(initialUrl, { headers });

    const $ = cheerio.load(response.data);
    const csrfToken = $('meta[name="csrf-token"]').attr('content');

    if (!csrfToken) {
      throw new Error('Gagal nemu token keamanan, coba lagi!');
    }

    let cookies = '';
    if (response.headers['set-cookie']) {
      cookies = response.headers['set-cookie'].join('; ');
    }

    return { csrfToken, cookies };

  } catch (error) {
    console.error('Error fetching initial page:', error.message);
    throw new Error(`Gagal mengambil halaman awal: ${error.message}`);
  }
}

async function postDownloadRequest(downloadUrl, userUrl, csrfToken, cookies) {
  try {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Linux; Android 10; RMX2185 Build/QP1A.190711.020) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.7103.60 Mobile Safari/537.36',
      'Referer': 'https://on4t.com/online-video-downloader',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Accept': '*/*',
      'X-Requested-With': 'XMLHttpRequest',
    };

    if (cookies) {
      headers['Cookie'] = cookies;
    }

    const postData = new URLSearchParams();
    postData.append('_token', csrfToken);
    postData.append('link[]', userUrl);

    const response = await axios.post(downloadUrl, postData.toString(), { headers });

    if (response.data && response.data.result && Array.isArray(response.data.result)) {
      const extractedData = response.data.result.map(item => ({
        title: item.title,
        videoimg_file_url: item.videoimg_file_url,
        video_file_url: item.video_file_url,
        image: item.image
      }));
      return extractedData;
    } else {
      throw new Error('Respons dari server gak sesuai harapan, coba link lain!');
    }

  } catch (error) {
    console.error('Error posting download request:', error.message);
    throw new Error(`Gagal melakukan permintaan download: ${error.message}`);
  }
}

async function getVideoDownloadLinks(url) {
  const initialUrl = 'https://on4t.com/online-video-downloader';
  const downloadUrl = 'https://on4t.com/all-video-download';

  if (!url) {
    throw new Error('Link-nya mana, Bos? Kasih link dong!');
  }

  try {
    const { csrfToken, cookies } = await fetchInitialPage(initialUrl);
    const videoData = await postDownloadRequest(downloadUrl, url, csrfToken, cookies);
    return videoData;
  } catch (error) {
    console.error('Proses download video keseluruhan gagal:', error.message);
    throw new Error(`Yah, gagal ngambil data nih: ${error.message}`);
  }
}

module.exports = getVideoDownloadLinks;
