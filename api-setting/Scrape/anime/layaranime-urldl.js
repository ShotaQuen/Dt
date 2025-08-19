const axios = require('axios');
const cheerio = require('cheerio');

const getDownloadLinks = async (url) => {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://layaranime.com/'
      }
    });
    
    const $ = cheerio.load(response.data);
    const downloadLinks = [];

    // Cari section download
    const downloadSection = $('div.bg-white.border.border-1.shadow.p-2.mb-3:has(h4:contains("LINK DOWNLOAD"))');
    
    if (downloadSection.length > 0) {
      // Ekstrak semua link download
      downloadSection.find('a[href*="download"]').each((index, element) => {
        const link = $(element);
        downloadLinks.push({
          url: link.attr('href'),
          quality: link.text().trim().replace(/\s+/g, ' '),
          type: link.text().includes('MP4') ? 'video/mp4' : 'unknown'
        });
      });
    }

    // Ekstrak info episode
    const episodeInfo = {
      title: $('h1.entry-title').text().trim(),
      episode: '',
      releaseDate: '',
      duration: ''
    };

    $('div.episode-info div').each(function() {
      const text = $(this).text().trim();
      if (text.includes('Episode')) {
        episodeInfo.episode = text.replace('Episode', '').trim();
      } else if (text.includes('Dirilis')) {
        episodeInfo.releaseDate = text.replace('Dirilis', '').trim();
      } else if (text.includes('Durasi')) {
        episodeInfo.duration = text.replace('Durasi', '').trim();
      }
    });

    return {
      success: true,
      downloadLinks,
      episodeInfo
    };
    
  } catch (error) {
    console.error('Error scraping download links:', error.message);
    return {
      success: false,
      downloadLinks: [],
      episodeInfo: {
        title: '',
        episode: '',
        releaseDate: '',
        duration: ''
      },
      error: error.message
    };
  }
};

module.exports = getDownloadLinks;
