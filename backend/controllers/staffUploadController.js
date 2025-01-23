import Staff from "../db/Schema/StaffSchema.js";
import fs from "fs";
import path from "path";
import faceapi from "face-api.js";
import { loadImage } from "canvas";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadStaff = async (req, res) => {
  const { name, position } = req.body;

  const image_path = path.join(__dirname, "../uploads", req.file.filename);

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
 

    const image = await loadImage(image_path);

    const detections = await faceapi

      .detectSingleFace(image)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detections) {
      console.log("Yuz aniqlanmadi!");
      throw new Error("Yuz aniqlanmadi!");
    }

    const faceDescriptor = Array.from(detections.descriptor);


    const staffData = {
      name: name,
      position : position,
      embedding: faceDescriptor
    }

    await Staff.create(staffData)   

    return res.status(200).json({ message: "Foydalanuvchi saqlandi" });

    // fs.writeFileSync(savePath, JSON.stringify(faceDescriptor));
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export default uploadStaff;
