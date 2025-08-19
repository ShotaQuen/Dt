const axios = require('axios');

async function pint(query) {
  const base = 'https://www.pinterest.com/resource/BaseSearchResource/get/?data=';
  const queryParam = '{"options":{"query":"' + encodeURIComponent(query) + '"}}';
  const url = base + encodeURIComponent(queryParam);

  try {
    const response = await axios({
      url,
      method: 'HEAD',
      headers: {
        'screen-dpr': '4',
        'x-pinterest-pws-handler': 'www/search/[scope].js'
      },
      validateStatus: null
    });

    const rhl = response.headers['link'];
    if (!rhl) throw new Error(`hasil pencarian ${query} kosong`);

    const links = [...rhl.matchAll(/<(.*?)>/gm)].map(v => v[1]);
    return links;
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = pint;
