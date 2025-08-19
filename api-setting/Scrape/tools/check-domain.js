const axios = require('axios');
const cheerio = require('cheerio');

async function checkdomen(name) {
  const url = `https://www.namecheck.com/en/searchresult/?domain=${encodeURIComponent(name)}`;

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const $ = cheerio.load(response.data);
    const results = [];

    $('table.table tbody tr').each((_, row) => {
      const domainCell = $(row).find('td.domain.align-middle');
      const actionCell = $(row).find('td:last-child a');

      if (domainCell.length && actionCell.length) {
        const domainName = domainCell.text().replace(/\s+/g, '').trim();
        const actionText = actionCell.text().trim();

        if (!domainName.toLowerCase().startsWith('social:')) {
          const status = actionText === 'Register' ? 'Tersedia' : 'Tidak tersedia';
          results.push({ domain: domainName, status });
        }
      }
    });

    return results;
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}
module.exports = checkdomen;
