const ImageKit = require("imagekit");

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
})

async function uploadFile(file,filename){
    try {
        const response = await imagekit.upload({
        file:file,
        fileName:filename,
        folder:"post-images"
    })
    return response;
    } catch (error) {
        console.log(error);
    }
}

module.exports = uploadFile;