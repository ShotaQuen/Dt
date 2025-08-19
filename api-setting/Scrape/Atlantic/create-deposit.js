const axios = require('axios');
const crypto = require('crypto');

async function h2hcDeposit(apiKey, nominal) {
  const reffId = 'ref_' + crypto.randomBytes(4).toString('hex');

  const payload = {
    api_key: apiKey,
    reff_id: reffId,
    nominal: nominal,
    type: 'ewallet',
    metode: 'qris'
  };

  try {
    const response = await axios.post('https://atlantich2h.com/deposit/create', payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return {
      success: true,
      reff_id: reffId,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      reff_id: reffId,
      error: error.response?.data || error.message
    };
  }
}

module.exports = h2hcDeposit;
