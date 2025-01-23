import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { compareFaces } from "../utils/faceRecognition.js";

const identifyStaff = async (req, res) => {

  const staff = await compareFaces(req.body.embedding);


  

  if (staff) {
    res.json({
      name: staff.name,
      position: staff.position,
    });
    
  }else {
    res.status(404).json({
      name: "Nomalum",
      position: "aniqlanmadi",
    })
  }
};

export default identifyStaff;
