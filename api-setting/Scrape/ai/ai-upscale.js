const axios = require('axios');
const FormData = require('form-data');

async function upscaleImage(imageUrl) {
  if (!imageUrl) return { success: false, error: 'URL gambar wajib diisi' };

  try {
    const img = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(img.data);

    const form = new FormData();
    form.append('image', buffer, { filename: 'image.jpg' });
    form.append('scale', '2');

    const headers = {
      ...form.getHeaders(),
      accept: 'application/json',
      'x-client-version': 'web'
    };

    const response = await axios.post('https://api2.pixelcut.app/image/upscale/v1', form, { headers });
    return { success: true, result: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message
    };
  }
}

module.exports = upscaleImage;
