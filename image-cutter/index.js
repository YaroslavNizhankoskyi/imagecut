const sharp = require('sharp');

const downloadFile = async (url, context) => {
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

const resize = async (origin, sizes, context) => {
    const pormises = sizes.map(size => {
        return sharp(origin)
            .resize(size, size,
                {
                    fit: sharp.fit.inside,
                })
            .toBuffer({ resolveWithObject: true });
    });

    let results = [];

    try{
        results = await Promise.all(pormises);
    }
    catch(exception){
        context.log.error(exception);
        context.log.error(url);
    }

    return results;
}

module.exports = async function (context, message) {   
    const {url, sizes = [100,300]} = message;
    const origin = await downloadFile(url, context);        

    context.log.info("Size:", origin.byteLength);

    let response = {
        origin: Buffer.from(new Uint8Array(origin)),
        originUrl: url,
        images: []
    };

    let results = await resize(origin, sizes, context);

    results.forEach(result => {
        var imageInfo = {
            buffer: result.data,
            format: result.info.format,
            size: result.info.size,
            width: result.info.width,
            height: result.info.height
        };

        context.log.info(`Result ${imageInfo.size} h: ${imageInfo.height} w: ${imageInfo.width}`);

        response.images.push(imageInfo);
    });

    context.res = {
        body: response
    };
}
