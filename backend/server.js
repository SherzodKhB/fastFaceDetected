import express from 'express';
import dotenv from 'dotenv';
// import authRoutes from './routes/authRoutes.js';
// import commentRoutes from './routes/commentRoutes.js';
// import profile from "./routes/profile.js"
import connectDB from './config/db.js';
// import { loadModels } from './utils/faceRecognition.js';
import cors from "cors"
import path from "path"
import { loadModels } from './utils/faceRecognition.js';

import { fileURLToPath } from 'url';
import { log } from 'console';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
app.use(cors())

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use( (req, res, next) => {
    console.log(req.url);
    next()
})



// MongoDB ulanishi
connectDB();

(async () => {
    await loadModels(); // Modellarni dastur ishga tushganda bir marta yuklash
  })()

// Routerlar
// app.use('/api/auth', authRoutes);
// app.use('/api/comments', commentRoutes);
// app.use('/api/user', profile);


app.use(express.static(path.join(__dirname, 'public')));



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
