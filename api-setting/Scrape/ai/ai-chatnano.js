const axios = require('axios');

const availableModels = [
    'gpt-4.1-nano',
    'gpt-4.1-mini',
    'gpt-4.1',
    'o4-mini',
    'deepseek-r1',
    'deepseek-v3',
    'claude-3.7',
    'gemini-2.0',
    'grok-3-mini',
    'qwen-qwq-32b',
    'gpt-4o',
    'o3',
    'gpt-4o-mini',
    'llama-3.3'
];

async function chatai(q, prompt, model = 'grok-3-mini') {
    if (!q) {
        return {
            status: false,
            message: 'Available models',
            models: availableModels,
            usage: 'chatai(question, [prompt], [model])'
        };
    }

    if (!availableModels.includes(model)) throw new Error(`Invalid model. Available models: ${availableModels.join(', ')}`);
    
    const messages = [];
    
    if (prompt) {
        messages.push({
            role: 'system',
            content: [{
                type: 'text',
                text: prompt
            }]
        });
    }
    
    messages.push({
        role: 'user',
        content: [{
            type: 'text',
            text: q
        }]
    });
    
    const { data } = await axios.post('https://api.appzone.tech/v1/chat/completions', {
        messages,
        model,
        isSubscribed: true
    }, {
        headers: {
            authorization: 'Bearer az-chatai-key',
            'content-type': 'application/json',
            'user-agent': 'okhttp/4.9.2',
            'x-app-version': '3.0',
            'x-requested-with': 'XMLHttpRequest',
            'x-user-id': '$RCAnonymousID:84947a7a4141450385bfd07a66c3b5c4'
        }
    });
    
    let fullText = '';
    const lines = data.split('\n\n').map(line => line.substring(6));
    
    for (const line of lines) {
        if (line === '[DONE]') continue;
        try {
            const d = JSON.parse(line);
            if (d.choices && d.choices[0].delta.content) {
                fullText += d.choices[0].delta.content;
            }
        } catch (e) {}
    }
    
    const thinkMatch = fullText.match(/<think>([\s\S]*?)<\/think>/);
    return {
        think: thinkMatch ? thinkMatch[1].trim() : null,
        response: fullText.replace(/<think>[\s\S]*?<\/think>/, '').trim()
    };
}

module.exports = chatai;
