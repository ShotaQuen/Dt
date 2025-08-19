/*
 • Fitur By Anomaki Team
 • Created : xyzan code
 • Instagram Stalk Scrape
 • Jangan Hapus Wm
 • https://whatsapp.com/channel/0029Vaio4dYC1FuGr5kxfy2l
*/
const axios = require('axios');
const cheerio = require('cheerio');

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function igstalk(username) {
    const url = `https://insta-stories-viewer.com/${username}/`;
    try {
        const res = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        });
        await delay(7000);
        const $ = cheerio.load(res.data);
        const nama = $('h1.profile__nickname').clone().children().remove().end().text().trim();
        const status = {
            post: $('span.profile__stats-posts').text().trim(),
            follower: $('span.profile__stats-followers').text().trim(),
            following: $('span.profile__stats-follows').text().trim()
        };
        const pp = $('img.profile__avatar-pic').attr('src') || null;
        const desk = $('div.profile__description').text().trim();
        
        return {
            usrname: nama,
            status,
            pp,
            desk
        };
        
    } catch (er) {
        console.error(er.message);
        return null;
    }
}

module.exports = igstalk;
