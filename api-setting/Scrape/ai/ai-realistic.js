const axios = require('axios');
const FormData = require('form-data');

const styleMap = {
    photorealistic: 'photorealistic style image',
    cinematic: 'cinematic style image',
    hyperreal: 'hyperrealistic style image',
    portrait: 'portrait style image'
};

const resolutionMap = {
    '512x512': { width: 512, height: 512 },
    '768x768': { width: 768, height: 768 },
    '1024x1024': { width: 1024, height: 1024 },
    '1920x1080': { width: 1920, height: 1080 }
};

async function RealisticImage({ prompt, style = 'photorealistic', resolution = '768x768', seed = null }) {
    const selectedStyle = styleMap[style.toLowerCase()];
    const selectedRes = resolutionMap[resolution];
    
    if (!selectedStyle || !selectedRes) {
        return { success: false, error: 'Invalid style or resolution' };
    }

    const fullPrompt = `${selectedStyle}: ${prompt}`;
    const form = new FormData();
    
    form.append('action', 'generate_realistic_ai_image');
    form.append('prompt', fullPrompt);
    form.append('seed', (seed || Math.floor(Math.random() * 100000)).toString());
    form.append('width', selectedRes.width.toString());
    form.append('height', selectedRes.height.toString());

    try {
        const res = await axios.post(
            'https://realisticaiimagegenerator.com/wp-admin/admin-ajax.php', 
            form, 
            {
                headers: {
                    ...form.getHeaders(),
                    'origin': 'https://realisticaiimagegenerator.com',
                    'referer': 'https://realisticaiimagegenerator.com/',
                    'user-agent': 'Mozilla/5.0 (X11; Linux x86_64)',
                    'accept': '*/*'
                }
            }
        );

        const json = res.data;
        
        if (json?.success && json.data?.imageUrl) {
            return { success: true, url: json.data.imageUrl };
        } else {
            return { success: false, error: 'No result returned' };
        }
    } catch (e) {
        return { success: false, error: e.message };
    }
}

module.exports = RealisticImage;
