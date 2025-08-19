const axios = require('axios');
const cheerio = require('cheerio');

const getLatestAnime = async () => {
  try {
    const response = await axios.get('https://layaranime.com/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const latestAnime = [];
    
    // Target section with latest anime
    const latestSection = $('div.new-anime.bg-white');
    
    // Find each anime item
    latestSection.find('article').each((index, element) => {
      const animeElement = $(element);
      const titleElement = animeElement.find('h4 a');
      const linkElement = animeElement.find('figure a').first();
      
      const url = linkElement.attr('href');
      const title = titleElement.text().trim();
      const image = animeElement.find('img').attr('src');
      
      // Extract rating
      const ratingElement = animeElement.find('.bg-c-primary span:last-child');
      const rating = ratingElement.length ? ratingElement.text().trim() : 'N/A';
      
      // Extract episode info
      const episodeElement = animeElement.find('.bg-c-ongoing, .bg-c-finished');
      const episodeCount = episodeElement.find('span.block.font-bold').text().trim();
      const episodeStatus = episodeElement.hasClass('bg-c-ongoing') ? 'Ongoing' : 'Finished';
      
      // Extract genres
      const genres = [];
      animeElement.find('footer a[href*="/genre/"], footer a[href*="/demografi/"], footer a[href*="/theme/"]').each((i, el) => {
        genres.push($(el).text().trim());
      });
      
      if (url && title) {
        latestAnime.push({
          title,
          url,
          image,
          rating,
          episode: episodeCount || 'N/A',
          status: episodeStatus,
          genres: [...new Set(genres)] // Remove duplicates
        });
      }
    });
    
    return latestAnime;
  } catch (error) {
    console.error('Error scraping latest anime from LayarAnime:', error);
    return [];
  }
};

module.exports = getLatestAnime;
