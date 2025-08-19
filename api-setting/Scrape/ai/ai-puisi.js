const axios = require('axios');

const type_valid = [
  'Haiku', 'Sonnet', 'Free Verse', 'Blank Verse',
  'Limerick', 'Romantic', 'Proposal', 'Love',
  'Lyric', 'Acrostic', 'Ballad', 'Epic',
  'Elegy', 'Ode', 'Pantoum', 'Narrative',
  'Cinquain', 'Villanelle', 'Sestina', 'Couplet'
];

const panjang_valid = ['short', 'medium', 'long'];
const bahasa_valid = ['English', 'Japanese', 'Indonesian'];

async function genpuisi(topic, type, panjang, bahasa) {
  const kosongSemua = !topic && !type && !panjang && !bahasa;
  if (kosongSemua) {
    return {
      success: false,
      message: 'Silakan pilih parameter untuk menghasilkan puisi',
      type_valid,
      panjang_valid,
      bahasa_valid
    };
  }

  try {
    if (!panjang_valid.includes(panjang)) {
      throw `Panjang puisi tidak valid. Gunakan: ${panjang_valid.join(', ')}`;
    }

    const url = 'https://aipoemgenerator.io';

    const getRes = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const tokenMatch = getRes.data.match(/<meta name="_token" content="(.*?)"/);
    if (!tokenMatch) throw 'token tidak ditemukan';

    const token = tokenMatch[1];
    const cookies = getRes.headers['set-cookie'].map(c => c.split(';')[0]).join('; ');

    const form = new URLSearchParams();
    form.append('topic', topic);
    form.append('length', panjang);
    form.append('type', type);
    form.append('lang', bahasa);
    form.append('poemVersion', '1');
    form.append('_token', token);

    const postRes = await axios.post(`${url}/generate_poem`, form.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': cookies,
        'Referer': `${url}/`,
        'Origin': url,
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    return {
      success: true,
      result: postRes.data?.trim()
    };

  } catch (e) {
    return {
      success: false,
      message: 'Gagal menghasilkan puisi',
      error: e?.message || e
    };
  }
}

module.exports = genpuisi;
