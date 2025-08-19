const axios = require('axios');

async function artingNih(prompt) {
  try {
    const params = {
      prompt: prompt,
      model_id: "asyncsMIX_v7",
      samples: 1,
      height: 1216,
      width: 832,
      negative_prompt: "score_6, score_5, score_4, source_pony, (worst quality:1.2), (low quality:1.2), (normal quality:1.2), lowres, bad anatomy, bad hands, signature, watermarks, ugly, imperfect eyes, skewed eyes, unnatural face, unnatural body, error, (extra limb), missing limbs, painting by bad-artist, 3d art, nipple ring, extra hands, (((extra fingers))), tan lines",
      seed: Math.floor(Math.random() * 1000000000),
      lora_ids: "",
      lora_weight: "0.7",
      sampler: "Euler a",
      steps: 40,
      guidance: 8,
      clip_skip: 2
    };

    const cres = await axios.post(
      'https://api.arting.ai/api/cg/text-to-image/create',
      params,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Mobile Safari/537.36',
          'Referer': 'https://arting.ai/ai-image-generator',
          'Content-Type': 'application/json'
        }
      }
    );

    if (!cres.data?.data?.request_id) {
      throw new Error('Gagal dapat request ID: ' + JSON.stringify(cres.data));
    }

    const reqid = cres.data.data.request_id;
    const maksret = 10;
    let jumlhRetry = 0;
    
    while (jumlhRetry < maksret) {
      const getres = await axios.post(
        'https://api.arting.ai/api/cg/text-to-image/get',
        { request_id: reqid },
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Mobile Safari/537.36',
            'Referer': 'https://arting.ai/ai-image-generator',
            'Content-Type': 'application/json'
          }
        }
      );

      if (getres.data.data?.output?.length > 0) {
        return {
          sukses: true,
          gambar: getres.data.data.output,
          id_permintaan: reqid
        };
      }

      if (getres.data.data?.status === 'failed') {
        throw new Error('Generate gambar gagal');
      }

      await new Promise(resolve => setTimeout(resolve, 3000));
      jumlhRetry++;
    }

    throw new Error('Waktu generate habis');
  } catch (er) {
    throw new Error(`Error: ${er.message}`);
  }
}

module.exports = artingNih;
