const axios = require('axios');
const cheerio = require('cheerio');

async function githubStalk(username) {
  if (!username) return { success: false, error: 'Username tidak boleh kosong' };

  try {
    const url = `https://github.com/${username}`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const name = $('span.p-name').text().trim() || null;
    const bio = $('div.p-note').text().trim() || null;
    const avatar = $('img.avatar-user').attr('src') || null;
    const followers = $('a[href$="?tab=followers"] span.Counter').text().trim() || '0';
    const following = $('a[href$="?tab=following"] span.Counter').text().trim() || '0';
    const repoCount = $('a[href$="?tab=repositories"] span.Counter').text().trim() || '0';
    const stars = $('a[href$="?tab=stars"] span.Counter').text().trim() || '0';
    const location = $('[itemprop="homeLocation"]').text().trim() || null;
    const email = $('[itemprop="email"]').text().trim() || null;
    const website = $('[itemprop="url"]').text().trim() || null;
    const twitter = $('[itemprop="twitter"]').text().trim() || null;
    const organizations = [];

    $('div.js-profile-editable-area a.avatar-group-item').each((_, el) => {
      const org = $(el).attr('href');
      if (org) organizations.push('https://github.com' + org);
    });

    return {
      success: true,
      username,
      name,
      avatar,
      bio,
      stats: {
        repositories: repoCount,
        followers,
        following,
        stars
      },
      links: {
        location,
        email,
        website,
        twitter,
        organizations
      },
      profile_url: url
    };
  } catch (err) {
    return { success: false, error: 'User tidak ditemukan atau halaman gagal dimuat' };
  }
}

module.exports = githubStalk;
