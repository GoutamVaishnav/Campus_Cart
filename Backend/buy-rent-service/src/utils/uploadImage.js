// import sharp from "sharp";
// import cloudinary from "../config/cloudinary.js";
// import streamifier from "streamifier";

// export const uploadCompressedImage = async(file)=>{

//  const buffer = await sharp(file.buffer)
//   .resize(800)
//   .jpeg({quality:60})
//   .toBuffer();

//  return new Promise((resolve,reject)=>{

//   const stream = cloudinary.uploader.upload_stream(
//    {folder:"buy-rent-products"},
//    (error,result)=>{
//     if(result) resolve(result.secure_url)
//     else reject(error)
//    }
//   )

//   streamifier.createReadStream(buffer).pipe(stream)

//  })
// }

import sharp from "sharp";
import cloudinary from "../config/cloudinary.js";

export const uploadCompressedImage = async (file) => {
  try {
    let quality = 80;
    let compressedBuffer;

    // Compress until image size is around 300-400 KB
    do {
      compressedBuffer = await sharp(file.buffer)
        .resize({ width: 800 })
        .jpeg({ quality })
        .toBuffer();

      quality -= 5;
    } while (compressedBuffer.length > 400 * 1024 && quality > 30);

    // Upload to cloudinary
    const result = await cloudinary.uploader.upload(
      `data:image/jpeg;base64,${compressedBuffer.toString("base64")}`,
      {
        folder: "buy-rent-products",
      },
    );

    return result.secure_url;
  } catch (error) {
    throw new Error("Image upload failed");
  }
};
