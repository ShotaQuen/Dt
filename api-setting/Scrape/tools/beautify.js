const kode = require('kode-scrape');
const { tools } = kode;

async function beautify(code, type) {
  if (!code || !type) {
    return { success: false, error: "Parameter code dan type harus diisi." };
  }

  try {
    let result;

    switch (type.toLowerCase()) {
      case "js":
        result = tools.beautifyJS(code);
        break;
      case "css":
        result = tools.beautifyCSS(code);
        break;
      case "html":
        result = tools.beautifyHTML(code);
        break;
      default:
        return { success: false, error: "Tipe tidak dikenali. Gunakan: js, css, atau html." };
    }

    return { success: true, result };
  } catch (err) {
    return { success: false, error: "Gagal memformat kode." };
  }
}

module.exports = beautify;
