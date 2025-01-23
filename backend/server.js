import express from 'express';
import dotenv from 'dotenv';
import stuffRouter from './routes/stuffRouter.js';
import connectDB from './db/db.js';
import { loadModels } from './utils/faceRecognition.js';
import cors from "cors"
import path from "path"

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
app.use(cors())




// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB ulanishi
connectDB();

(async () => {
    await loadModels(); // Modellarni dastur ishga tushganda bir marta yuklash
  })()


// nima url ga sorov kelyabdi korib turish
app.use( (req, res, next) => {
    console.log(req.url);
    next()
})


// public ichidagi modellarni olishi uchun
app.use("/models", express.static(path.join(__dirname, 'public/models')));


// routers
app.use('/api/staff', stuffRouter);







const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
