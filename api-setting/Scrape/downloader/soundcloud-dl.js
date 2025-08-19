const axios = require('axios')
const cheerio = require('cheerio')

async function scdl(url) {
  if (!/^https:\/\/soundcloud\.com\/.+/.test(url)) {
    return { success: false, error: 'url soundcloudmu tak valid mah' }
  }

  const formData = `------WebKitFormBoundaryfe79BFG397L2GBLa\r
Content-Disposition: form-data; name="url"\r
\r
${url}\r
------WebKitFormBoundaryfe79BFG397L2GBLa--`

  const h = {
    'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundaryfe79BFG397L2GBLa',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
    'Referer': 'https://soundcloudmp3.co/pt',
    'Origin': 'https://soundcloudmp3.co',
    'Accept': '*/*'
  }

  try {
    const res = await axios.post('https://soundcloudmp3.co/result.php', formData, { headers: h })
    const $ = cheerio.load(res.data)

    const judul = $('.text-2xl').text().trim()
    const audiourl = $('audio > source').attr('src')
    const dhref = $('a.chbtn').attr('href')
    const durl = dhref?.startsWith('http') ? dhref : `https://soundcloudmp3.co${decodeURIComponent(dhref)}`

    if (!audiourl || !judul || !durl) {
      return { success: false, error: 'ggl ekstrak data' }
    }

    return {
      success: true,
      title: judul,
      audio_url: audiourl,
      download_url: durl
    }

  } catch (err) {
    return { success: false, error: err.message }
  }
}

module.exports = scdl;
