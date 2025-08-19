const axios = require('axios');
const FormData = require('form-data');

async function brat(text, gif = false) {
  if (!text) return { success: false, error: 'Parameter text wajib diisi' };

  const isAnimated = gif === true;
  const delay = 500;
  const apiUrl = `https://api.siputzx.my.id/api/m/brat?text=${encodeURIComponent(text)}&isAnimated=${isAnimated}&delay=${delay}`;

  try {
    const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });

    const form = new FormData();
    form.append('reqtype', 'fileupload');
    form.append('fileToUpload', Buffer.from(response.data), {
      filename: 'result.webp',
      contentType: 'image/webp'
    });

    const catbox = await axios.post('https://catbox.moe/user/api.php', form, {
      headers: form.getHeaders()
    });

    return { success: true, url: catbox.data.trim() };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

module.exports = brat;
