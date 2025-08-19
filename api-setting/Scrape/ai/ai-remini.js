const axios = require("axios");

async function remini(url) {
  if (!url) {
    return { success: false, error: "Parameter URL tidak boleh kosong." };
  }

  try {
    const endpoint = `https://flowfalcon.dpdns.org/imagecreator/remini?url=${encodeURIComponent(url)}`;
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
        error: "Tidak ada hasil."
      };
    }
  } catch (err) {
    return {
      success: false,
      error: err.response?.data || err.message
    };
  }
}

module.exports = remini;
