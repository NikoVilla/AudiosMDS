const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const cheerio = require('cheerio');

const remoteUrl = 'http://10.143.50.16/MdsPlayer/MOD%207-Marketing/Horizontales/';
const localDir = 'C:\\audiosMDS\\publicidad\\clonacion';

fs.ensureDirSync(localDir);

const downloadImage = async (url, filepath) => {
  const response = await axios({
    url,
    responseType: 'stream',
  });

  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(filepath);
    response.data.pipe(writer);
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
};

const syncImages = async () => {
  try {
    fs.emptyDirSync(localDir);
    console.log('Todas las imágenes locales han sido eliminadas.');

    const response = await axios.get(remoteUrl);
    const $ = cheerio.load(response.data);
    const imageUrls = [];

    $('a').each((index, element) => {
      const href = $(element).attr('href');
      if (href && (href.endsWith('.jpg') || href.endsWith('.png') || href.endsWith('.gif'))) {
        imageUrls.push(remoteUrl + href);
      }
    });

    for (let i = 0; i < imageUrls.length; i++) {
      const imageUrl = imageUrls[i];
      const filename = `${i + 1}.jpg`; // Renombrar las imágenes secuencialmente
      const filepath = path.join(localDir, filename);
      await downloadImage(imageUrl, filepath);
      console.log(`Imagen descargada: ${filename}`);
    }

    console.log('Sincronización completa.');
  } catch (error) {
    console.error('Error al sincronizar las imágenes:', error);
  }
};

setInterval(syncImages, 172800000);

syncImages();

