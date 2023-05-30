const sharp = require('sharp');

module.exports = async function (context, message) {  
    context.log(message);
    context.log(message.url);
    const {url, sizes = [100,300]} = JSON.parse(message);
    const origin = await downloadFile(url);        

    const pormises = sizes.map(size => {
        return sharp(origin)
            .resize(size, size,
                {
                    fit: sharp.fit.contain,
                })
            .toBuffer({resolveWithObject: true})
    });

    let results = [];
    try{
        results = await Promise.all(pormises);
    }
    catch(exception){
        context.log.error(exception);
    }

    context.res = {
        queueOutput: results
    };
}

async function downloadFile(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Download failed');
      }
      return await response.arrayBuffer();
    } catch (error) {
      context.log.error('Error:', error);
      return null;
    }
  }