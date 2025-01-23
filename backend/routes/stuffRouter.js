import { Router } from "express";
import multer from "multer";
import fs from "fs";
import path from "path"
import staffUploadController from "../controllers/staffUploadController.js";
import staffIdentifyController from "../controllers/staffIdentifyController.js";

const staffRouter = Router();



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./uploads";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Rasmni noyob qilish
  },
});

const upload = multer({ storage });

staffRouter.post("/upload", upload.single("image"), staffUploadController);
staffRouter.post("/identify", staffIdentifyController);

export default staffRouter;
