import { Canvas, Image, ImageData, loadImage } from "canvas";
import faceapi from "face-api.js";
import path from "path";
import fs from "fs";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

let modelsLoaded = false;

const loadModels = async () => {
  if (modelsLoaded) return;

  const modelPath = path.join(__dirname, "../public/models");

  try {
    // SSD MobileNet v1 modelining bo'linmalarini yuklash
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(
      modelPath,
      "ssd_mobilenetv1_model-shard1"
    );
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(
      modelPath,
      "ssd_mobilenetv1_model-shard2"
    );

    // Face Recognition modelining bo'linmalarini yuklash
    await faceapi.nets.faceRecognitionNet.loadFromDisk(
      modelPath,
      "face_recognition_model-shard1"
    );
    await faceapi.nets.faceRecognitionNet.loadFromDisk(
      modelPath,
      "face_recognition_model-shard2"
    );

    // Face Landmark 68 modelining bo'linmalarini yuklash
    await faceapi.nets.faceLandmark68Net.loadFromDisk(
      modelPath,
      "face_landmark_68_model-shard1"
    );
    // await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath, 'face_landmark_68_model-shard2');

    console.log("Models loaded successfully!");
  } catch (err) {
    console.error("Error loading models:", err);
  }
};

const compareFaces = async (user_image_json_file, uploadedImagePath) => {
  try {
    const uploadedImage = await loadImage(uploadedImagePath);

    // Saqlangan descriptor'ni o'qish va to'g'ri formatga aylantirish
    const savedImage = JSON.parse(fs.readFileSync(user_image_json_file));

   
    
    const savedDescriptor = new Float32Array(Object.values(savedImage));

    

    // Yuklangan descriptor'ni olish
    const uploadedDetection = await faceapi
      .detectSingleFace(uploadedImage)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!uploadedDetection) {
      console.log("Uploaded image: yuz aniqlanmadi!");
      return false; // Yuz aniqlanmasa
    }

    const uploadedDescriptor = uploadedDetection.descriptor;

    // Descriptor uzunligini tekshirish
    if (savedDescriptor.length !== uploadedDescriptor.length) {


      console.error("Descriptor uzunligi mos emas");
      return false;
    }

    // Descriptor'larni solishtirish
    const distance = faceapi.euclideanDistance(
      savedDescriptor,
      uploadedDescriptor
    );

    console.log(`Distance: ${distance}`);
    return distance < 0.6; // Threshold: 0.6 dan kichik bo'lsa mos deb hisoblaymiz
  } catch (err) {
    console.error("Error detect images:", err);
    return false; // Xatolik bo'lsa
  }
};

export { compareFaces, loadModels };
