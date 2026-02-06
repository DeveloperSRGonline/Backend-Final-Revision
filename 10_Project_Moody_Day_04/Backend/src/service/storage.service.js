const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: "https://ik.imagekit.io/utb655bqf",
});

function uploadFile(file) {
  // promise is liye kyo ki hamein nahi pata file ko server se imagekit pe pohachne ke liye kitna time lagne wala hai
  // do condtion - success(resolve) and failure(reject)
  return new Promise((resolve, reject) => {
    // ab upload kaise karenge
    imagekit.upload(
      {
        file: file.buffer,
        fileName: file.originalname,
        folder:"moody-player-audio"
      },
      (error, result) => {
        if (error) {
          // agar error aaya toh reject karega
          reject(error);
        } else {
          // agar error nahi aaya toh resolve karega
          resolve(result);
        }
      },
    );
  });
}

// finally function ko export
module.exports = uploadFile;
