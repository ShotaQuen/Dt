const axios = require('axios');

async function shorten(url) {
    try {
        const res = await axios.post(
            'https://shorturlbase.com/api/url', {
                longUrl: url
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36',
                    'Referer': 'https://shorturlbase.com/'
                },
                timeout: 10000
            }
        );

        return {
            success: true,
            result: res.data
        };
    } catch (e) {
        return {
            success: false,
            message: 'Gaga ringkas urlmu',
            error: e?.message || e
        };
    }
}

module.exports = shorten;
