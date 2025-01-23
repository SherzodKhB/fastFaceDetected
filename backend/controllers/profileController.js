import User from "../models/User.js";
import fs from "fs";
import path  from "path";
import faceapi from "face-api.js"

import { Canvas, Image, ImageData, loadImage } from 'canvas';


import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const userId = req.user.userId;

    const user = await User.findOne({ _id: userId });

    user.image = `/uploads/${req.file.filename}`;
    user.verificationExpires = undefined;
    user.savedDescriptorPath = `/savedDescriptorPath/${userId}_face_descriptor.json`
    


     const user_image =  path.join(__dirname, '../', user.image);
     const savePath =  path.join(__dirname, '../', user.savedDescriptorPath);

     


     try {
      const image = await loadImage(user_image)
       const detections = await faceapi
     
     .detectSingleFace(image)
     .withFaceLandmarks()
     .withFaceDescriptor();
     
    if (!detections) {
      console.log("Yuz aniqlanmadi!");
      throw new Error("Yuz aniqlanmadi!");
    }

    const faceDescriptor = detections.descriptor;

    console.log(faceDescriptor.length);
    

    fs.writeFileSync(savePath, JSON.stringify(faceDescriptor));

    console.log("Yuz xususiyatlari saqlandi:", savePath);


     }catch(err) {
      console.log("error: " + err);
      
     }

     
     

    await user.save();

    res.status(200).json({
      message: "Image uploaded successfully",
      imagePath: `/uploads/${req.file.filename}`,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export default uploadImage;
