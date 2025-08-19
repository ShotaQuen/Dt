const axios = require('axios');

async function tts(query) {
    try {
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Origin': 'https://tikwm.com',
            'Referer': 'https://tikwm.com/'
        };

        const init = await axios.get('https://tikwm.com', { headers });
        const cookies = init.headers['set-cookie'].join('; ');
        const verifyFp = (cookies.match(/verify_fp=([^;]+)/) || [])[1] || '';

        headers['Cookie'] = cookies;
        headers['Content-Type'] = 'application/json';

        const payload = {
            keywords: query,
            verifyFp,
            region: 'ID',
            language: 'id'
        };

        const response = await axios.post(
            'https://tikwm.com/api/feed/search',
            payload,
            { headers }
        );

        if (!response.data?.data?.videos?.length) {
            throw new Error('No videos found');
        }

        return response.data.data.videos.map(video => ({
            id: video.id,
            description: video.desc,
            author: video.author?.unique_id || 'unknown',
            likes: video.statistics?.digg_count || 0,
            comments: video.statistics?.comment_count || 0,
            shares: video.statistics?.share_count || 0,
            views: video.statistics?.play_count || 0,
            video_url: video.play,
            cover_url: video.cover,
            created_at: video.create_time
        }));

    } catch (error) {
        throw new Error(`Error: ${error.message}`);
    }
}

module.exports = tts;
