const axios = require('axios');

async function igdlstory(username) {
  try {
    const res = await axios.get(`https://insnoop.com/api/info/${username}?type=3`, {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Mobile Safari/537.36',
        'Referer': `https://insnoop.com/?u=${username}`
      }
    });

    if (res.data.code !== 1 || !res.data.info) {
      throw new Error('Akun tidak ditemukan atau tidak bisa diakses');
    }

    const { pk, storyRequestID, is_private } = res.data.info;

    if (is_private) {
      throw new Error('Akun private, tidak bisa mengambil story');
    }

    const storiesRes = await axios.post(`https://insnoop.com/api/stories/${username}`, {
      token: "",
      pk,
      storyRequestID
    }, {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Mobile Safari/537.36',
        'Referer': `https://insnoop.com/?u=${username}`
      }
    });

    if (storiesRes.data.code !== 1) {
      throw new Error('Gagal mengambil story');
    }

    if (!storiesRes.data.data || storiesRes.data.data.length === 0) {
      throw new Error('Tidak ada story yang tersedia saat ini');
    }

    const validStories = storiesRes.data.data.filter(story => 
      story.video_url || story.cover_url
    );

    if (validStories.length === 0) {
      throw new Error('Tidak ditemukan story yang valid');
    }

    return {
      status: 'success',
      username: username,
      stories: validStories
    };
  } catch (error) {
    return {
      status: 'error',
      username: username,
      message: error.message
    };
  }
};

module.exports = igdlstory;
