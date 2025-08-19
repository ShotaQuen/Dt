const axios = require('axios');
const cheerio = require('cheerio');

const getPopularAnime = async () => {
  try {
    const response = await axios.get('https://layaranime.com/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const popularAnime = [];
    
    // Target section with popular anime
    const popularSection = $('section.container.mx-auto').first();
    
    // Find each anime item
    popularSection.find('article').each((index, element) => {
      const animeElement = $(element);
      const titleElement = animeElement.find('h4');
      const linkElement = animeElement.find('a[href][title]').first();
      
      const url = linkElement.attr('href');
      const title = titleElement.text().trim();
      const image = animeElement.find('img').attr('src');
      
      // Extract rating
      const ratingElement = animeElement.find('.bg-c-primary span:last-child');
      const rating = ratingElement.text().trim();
      
      // Extract episode info
      const episodeElement = animeElement.find('.bg-c-ongoing, .bg-c-finished');
      const episodeCount = episodeElement.find('span.block.font-bold').text().trim();
      const episodeStatus = episodeElement.hasClass('bg-c-ongoing') ? 'Ongoing' : 'Finished';
      
      if (url && title) {
        popularAnime.push({
          title,
          url,
          image,
          rating: rating || 'N/A',
          episode: episodeCount || 'N/A',
          status: episodeStatus
        });
      }
    });
    
    return popularAnime;
  } catch (error) {
    console.error('Error scraping popular anime from LayarAnime:', error);
    return [];
  }
};

module.exports = getPopularAnime;
