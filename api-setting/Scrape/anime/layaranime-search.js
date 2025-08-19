const axios = require('axios');
const cheerio = require('cheerio');

const searchLayarAnime = async (query) => {
  try {
    const response = await axios.get(`https://layaranime.com/?s=${encodeURIComponent(query)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const results = [];
    
    $('figure.z-10.mb-2').each((index, element) => {
      const animeLink = $(element).find('a[href][title]');
      const url = animeLink.attr('href');
      const title = animeLink.attr('title');
      
      // Extract clean anime name from title attribute
      let name = '';
      if (title) {
        const match = title.match(/Nonton Anime (.+?)\. Subtitle/);
        name = match ? match[1] : title.split('.')[0];
      }
      
      if (url && name) {
        results.push({
          name: name.trim(),
          url: url.trim()
        });
      }
    });
    
    return results;
  } catch (error) {
    console.error('Error scraping LayarAnime:', error);
    return [];
  }
};

module.exports = searchLayarAnime;
