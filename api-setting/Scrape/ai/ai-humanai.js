const axios = require('axios');

async function humanai(teks, level) {
  const isLevel = ["standard", "enhanced", "aggressive"];

  if (!level || !level.trim()) {
    return {
      success: false,
      code: 400,
      result: {
        error: "Levelnya kudu diisi bree 🗿",
        availableLevels: isLevel
      }
    };
  }

  if (typeof teks !== 'string' || !teks.trim()) {
    return { 
      success: false, 
      code: 400, 
      result: { 
        error: "Inputnya kudu diisi bree, kagak boleh kosong begitu.. 🗿"
      } 
    };
  }

  level = level.toLowerCase();
  if (!isLevel.includes(level)) {
    return {
      success: false,
      code: 400,
      result: {
        error: `Level ${level} kagak valid bree 🗿`
      }
    };
  }

  try {
    const defaultSettings = {
      removeUnicode: true,
      dashesToCommas: true,
      removeDashes: true,
      transformQuotes: true,
      removeWhitespace: true,
      removeEmDash: true,
      keyboardOnly: true
    };

    const response = await axios.post(
      'https://unaimytext.com/api/humanize',
      {
        text: teks,
        recaptchaToken: "",
        level,
        settings: defaultSettings
      },
      { 
        headers: {
          'authority': 'unaimytext.com',
          'accept': '*/*',
          'content-type': 'application/json',
          'origin': 'https://unaimytext.com',
          'referer': 'https://unaimytext.com/',
          'user-agent': 'Postify/1.0.0'
        },
        timeout: 10000
      }
    );

    if (!response.data?.text) {
      return {
        success: false,
        code: 500,
        result: {
          error: "Responsenya kosong bree 😂"
        }
      };
    }

    return {
      success: true,
      code: 200,
      level,
      result: {
        code: response.data.text,
        originalLength: teks.length,
        transformedLength: response.data.text.length,
        reductionPercentage: ((teks.length - response.data.text.length) / teks.length * 100).toFixed(2) + '%'
      }
    };

  } catch (err) {
    return {
      success: false,
      code: err.response?.status || 500,
      result: {
        error: "Error bree 😂"
      }
    };
  }
}

module.exports = humanai;
