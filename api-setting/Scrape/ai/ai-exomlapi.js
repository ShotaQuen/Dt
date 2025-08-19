const axios = require("axios");

const modelList = [
  "llama",
  "gemma",
  "qwen-3-235b",
  "gpt-4.1",
  "gpt-4o",
  "gpt-4o-mini",
  "llama-4-scout",
  "llama-4-maverick",
  "deepseek-r1",
  "qwq-32b"
];

const ai = {
  getRandom: () => {
    const gen = (length, charSet = {}) => {
      const l = "abcdefghijklmnopqrstuvwxyz";
      const u = l.toUpperCase();
      const s = "-_";
      const n = "0123456789";
      let cs = "";
      const { lowerCase = false, upperCase = false, symbol = false, number = false } = charSet;
      if (!lowerCase && !upperCase && !symbol && !number) {
        cs += l + u + s + n;
      } else {
        if (lowerCase) cs += l;
        if (upperCase) cs += u;
        if (symbol) cs += s;
        if (number) cs += n;
      }
      const result = Array.from({ length }, () => cs[Math.floor(Math.random() * cs.length)]).join("") || null;
      return result;
    };
    const id = gen(16, { upperCase: true, lowerCase: true, number: true });
    const chatId = `chat-${Date.now()}-${gen(9, { lowerCase: true, number: true })}`;
    const userId = `local-user-${Date.now()}-${gen(9, { lowerCase: true, number: true })}`;
    const antiBotId = `${gen(32)}-${gen(8, { number: true, lowerCase: true })}`;
    return { id, chatId, userId, antiBotId };
  },

  generate: async (messages, systemPrompt, model) => {
    const body = {
      messages,
      systemPrompt,
      model,
      isAuthenticated: true,
      ...ai.getRandom()
    };

    const headers = {
      "Content-Type": "application/json"
    };

    const response = await axios.post("https://exomlapi.com/api/chat", body, { headers });
    const data = response.data;

    const raw = typeof data === "string" ? data : JSON.stringify(data);
    const anu = [...raw.matchAll(/^0:"(.*?)"$/gm)].map(v => v[1]).join("").replaceAll("\\n", "\n").replaceAll('\\"', '"');
    if (!anu) throw new Error(`gagal parsing pesan dari server, kemungkinan pesan kosong / error.\n\n${raw}`);
    return anu;
  }
};

async function chatai(prompt, model) {
  if (!prompt && !model) {
    return {
      success: true,
      models: modelList
    };
  }

  if (!modelList.includes(model)) {
    return {
      success: false,
      error: "Model tidak ditemukan"
    };
  }

  const systemPrompt = "balas singkat. tidak bertele tele. straight to the poin.";
  const messages = [
    { role: "user", content: "halo" },
    { role: "assistant", content: "Halo! Ada yang bisa saya bantu?" },
    { role: "user", content: prompt }
  ];

  try {
    const result = await ai.generate(messages, systemPrompt, model);
    return {
      success: true,
      model,
      response: result
    };
  } catch (err) {
    return {
      success: false,
      error: err.message
    };
  }
}

module.exports = chatai;
