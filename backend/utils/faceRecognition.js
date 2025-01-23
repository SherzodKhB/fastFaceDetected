import { Canvas, Image, ImageData } from "canvas";
import faceapi from "face-api.js";
import path from "path";
import Staff from "../db/Schema/StaffSchema.js";

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

const compareFaces = async (embedding) => {
  try {
    const embeddingFloat32 = new Float32Array(embedding);

    const allStaff = await Staff.find();

    allStaff.forEach((staff) => {
      const staffEmbedFloat32 = new Float32Array(staff.embedding);

      const distance = faceapi.euclideanDistance(
        embeddingFloat32,
        staffEmbedFloat32
      );

      
      if (Integer(distance) < 0.6) {
        return staff;
      } else {
        console.log("jkljdsd");
        
      }
    });
  } catch (error) {
    console.error("Xato yuz berdi:", error);
  }
};

export { loadModels, compareFaces };
