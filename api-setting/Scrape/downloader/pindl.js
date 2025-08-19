const axios = require('axios');

async function pindl(link) {
    const url = 'https://sigmawire.net/pindown.php';

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36',
        'Referer': 'https://sigmawire.net/pinterest-downloader'
    };

    const payload = 'url=' + encodeURIComponent(link);

    try {
        const response = await axios.post(url, payload, {
            headers
        });
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data || error.message
        };
    }
}

module.exports = pindl;
