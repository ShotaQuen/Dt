const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')
const path = require('path')

const CodeTeam = async (imageUrl) => {
  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' })
    const imageBuffer = Buffer.from(response.data, 'binary')

    const form = new FormData()
    form.append('file', imageBuffer, {
      filename: 'upload.jpg',
      contentType: 'image/jpeg'
    })

    const res = await axios.post(
      'https://be.neuralframes.com/clip_interrogate/',
      form,
      {
        headers: {
          ...form.getHeaders(),
          'authorization': 'Bearer uvcKfXuj6Ygncs6tiSJ6VXLxoapJdjQ3EEsSIt45Zm+vsl8qcLAAOrnnGWYBccx4sbEaQtCr416jxvc/zJNAlcDjLYjfHfHzPpfJ00l05h0oy7twPKzZrO4xSB+YGrmCyb/zOduHh1l9ogFPg/3aeSsz+wZYL9nlXfXdvCqDIP9bLcQMHiUKB0UCGuew2oRt',
          'origin': 'https://www.neuralframes.com',
          'referer': 'https://www.neuralframes.com'
        }
      }
    )

    return res.data
  } catch (err) {
    throw new Error('Upload gagal: ' + err.message)
  }
}

module.exports = CodeTeam;
