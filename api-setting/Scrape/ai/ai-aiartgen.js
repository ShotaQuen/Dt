const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

async function aiart(prompt, model, style, rasio) {
  const conf = {
    models: {
      flux: 'flux_text2img',
      artist: 'text2img_artist',
      anime: 'text2img_anime',
      realistic: 'text2img_real',
      realistic_v2: 'text2img_real_v2'
    },
    ratios: {
      '1:1': { width: 1024, height: 1024 },
      '3:4': { width: 864, height: 1152 },
      '4:3': { width: 1152, height: 864 },
      '4:5': { width: 921, height: 1152 },
      '5:4': { width: 1152, height: 921 },
      '9:16': { width: 756, height: 1344 },
      '16:9': { width: 1344, height: 756 }
    },
    flux_styles: ['general', 'anime', 'fantasy_art', 'line_art', 'photograph', 'comic'],
    styles: ['general', 'anime', 'ghibli', 'fantasy_art', 'line_art', 'photograph', 'comic']
  };

  if (!prompt && !model && !style && !rasio) {
    return {
      models: Object.keys(conf.models),
      ratios: Object.keys(conf.ratios),
      styles: conf.styles,
      flux_styles: conf.flux_styles
    };
  }

  if (!prompt) throw new Error('Prompt wajib diisi');
  if (!conf.models[model]) throw new Error(`Model tidak valid. Pilihan: ${Object.keys(conf.models).join(', ')}`);
  if (!conf.ratios[rasio]) throw new Error(`Rasio tidak valid. Pilihan: ${Object.keys(conf.ratios).join(', ')}`);
  if (model === 'flux' && !conf.flux_styles.includes(style)) throw new Error(`Style tidak valid untuk flux. Pilihan: ${conf.flux_styles.join(', ')}`);
  if (model !== 'flux' && !conf.styles.includes(style)) throw new Error(`Style tidak valid untuk ${model}. Pilihan: ${conf.styles.join(', ')}`);

  try {
    const uuid = uuidv4();

    await axios.get('https://api-cdn.aiartgen.net/comfyapi/v4/config', {
      params: {
        app_version_code: '469',
        app_version_name: '3.41.0',
        device_id: uuid,
        ad_id: '',
        platform: 'android'
      },
      headers: {
        'accept-encoding': 'gzip',
        'content-type': 'application/json; charset=UTF-8',
        'user-agent': 'okhttp/4.12.0'
      }
    });

    const { data: b } = await axios.post('https://api-cdn.aiartgen.net/comfyapi/v4/prompt', {
      batch_size: 1,
      diamond_remain: 3,
      height: conf.ratios[rasio].height,
      model_id: style,
      prompt: prompt,
      prompt_translated: prompt,
      ratio: rasio,
      width: conf.ratios[rasio].width,
      work_type: conf.models[model]
    }, {
      params: {
        app_version_code: '469',
        app_version_name: '3.41.0',
        device_id: uuid,
        ad_id: uuidv4(),
        platform: 'android'
      },
      headers: {
        'accept-encoding': 'gzip',
        'content-type': 'application/json; charset=UTF-8',
        'user-agent': 'okhttp/4.12.0'
      }
    });

    return b.images;
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = aiart;
