import multer from 'multer'
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import { config } from "dotenv";


import fs from "fs";

// Ensure upload directory exists
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      return cb(null, `${Date.now()}-${file.originalname}`);
    },
  });

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const upload = multer({ storage });

  const uplaodFile = async (req, res) => {
    try {
      console.log(req.file);
      const uploadResult = await cloudinary.uploader.upload(req.file.path);
  
      console.log(uploadResult);
      return res.json(uploadResult);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Upload failed" });
    }
  };
  
  export { upload, uplaodFile };