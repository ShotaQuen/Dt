const axios = require("axios");

async function removebg(url) {
  if (!url) {
    return { success: false, error: "URL gambar tidak boleh kosong." };
  }

  try {
    const endpoint = `https://flowfalcon.dpdns.org/imagecreator/removebg?url=${encodeURIComponent(url)}`;
    const response = await axios.get(endpoint);

    const data = response.data;

    if (data.status && data.result) {
      return {
        success: true,
        result: data.result
      };
    } else {
      return {
        success: false,
        error: "Gagal mendapatkan hasil."
      };
    }
  } catch (err) {
    return {
      success: false,
      error: err.response?.data || err.message
    };
  }
}

module.exports = removebg;
