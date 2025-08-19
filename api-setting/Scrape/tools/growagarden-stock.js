const axios = require('axios');
const cheerio = require('cheerio');

async function getstock() {
  try {
    const baseUrl = 'https://growgardenstock.com';
    const url = `${baseUrl}/`;
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const extractStockItems = (selector) => {
      const items = [];
      $(`${selector} .stock-item`).each((i, el) => {
        const imageSrc = $(el).find('.item-image').attr('src');
        const emoji = $(el).find('.item-emoji').text().trim();
        
        const item = {
          name: $(el).find('.item-name').text().trim(),
          rarity: $(el).find('.item-rarity').text().trim(),
          rarityClass: $(el).find('.item-rarity').attr('class').split(' ').find(c => c.startsWith('rarity-')).replace('rarity-', ''),
          quantity: parseInt($(el).find('.item-rarity').text().trim().replace('x', '')) || 1
        };

        if (imageSrc) {
          item.image = imageSrc.startsWith('http') ? imageSrc : `${baseUrl}${imageSrc}`;
        }
        if (emoji) item.emoji = emoji;

        items.push(item);
      });
      return items;
    };

    const extractWeatherItems = (selector) => {
      const items = [];
      $(`${selector} .stock-item`).each((i, el) => {
        const emoji = $(el).find('.item-emoji').text().trim();
        const item = {
          name: $(el).find('.item-name').text().trim(),
          rarity: $(el).find('.item-rarity').text().trim(),
          rarityClass: $(el).find('.item-rarity').attr('class').split(' ').find(c => c.startsWith('rarity-')).replace('rarity-', '')
        };
        if (emoji) item.emoji = emoji;
        items.push(item);
      });
      return items;
    };

    const extractCosmeticItems = (selector) => {
      const items = [];
      $(`${selector} .stock-item`).each((i, el) => {
        const imageSrc = $(el).find('.item-image').attr('src');
        const emoji = $(el).find('.item-emoji').text().trim();
        
        const item = {
          name: $(el).find('.item-name').text().trim(),
          rarity: $(el).find('.item-rarity').text().trim(),
          rarityClass: $(el).find('.item-rarity').attr('class').split(' ').find(c => c.startsWith('rarity-')).replace('rarity-', ''),
          quantity: parseInt($(el).find('.item-rarity').text().trim().replace('x', '')) || 1
        };

        if (imageSrc) {
          item.image = imageSrc.startsWith('http') ? imageSrc : `${baseUrl}${imageSrc}`;
        }
        if (emoji) item.emoji = emoji;

        items.push(item);
      });
      return items;
    };

    const extractRecentlySpotted = () => {
      const items = [];
      $('.spotted-items .spotted-item').each((i, el) => {
        items.push($(el).text().trim());
      });
      return items;
    };

    const extractTimers = () => {
      return {
        gear: $('#gear-timer').text().trim(),
        seeds: $('#seeds-timer').text().trim(),
        eggs: $('#eggs-timer').text().trim(),
        weather: $('#weather-timer').text().trim(),
        event: $('#event-timer').text().trim(),
        cosmetics: $('#cosmetics-timer').text().trim()
      };
    };

    const cosmeticsCrates = extractCosmeticItems('#cosmetics-crates');
    const cosmeticsItems = extractCosmeticItems('#cosmetics-items');

    const result = {
      gear: extractStockItems('#gear-stock'),
      seeds: extractStockItems('#seeds-stock'),
      eggs: extractStockItems('#eggs-stock'),
      weather: extractWeatherItems('#weather-stock'),
      event: extractStockItems('#event-stock'),
      cosmetics: {
        crates: cosmeticsCrates,
        items: cosmeticsItems
      },
      recentlySpotted: extractRecentlySpotted(),
      timers: extractTimers(),
      lastUpdated: new Date().toISOString()
    };

    return result;
  } catch (error) {
    throw new Error(`Failed to fetch Grow a Garden stock data: ${error.message}`);
  }
}

module.exports = getstock;
