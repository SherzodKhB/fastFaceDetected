import User from '../models/User.js';
import Comment  from '../models/Comment.js';
import {compareFaces} from '../utils/faceRecognition.js'

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const addComment = async (req, res) => {
  const { comment } = req.body;
  const tokenUserId = req.user; // Token orqali foydalanuvchini aniqlash


  // Multer yordamida yuklangan fayl
  const image = req.file;
  
  try {
    if (!image) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    // Foydalanuvchi rasmiga mosligini tekshirish
    const user = await User.findById(tokenUserId.userId);

    
    
    
    // Temp papkada saqlangan rasmni tekshirish
    
    const user_image_json_file =  path.join(__dirname, '../', user.savedDescriptorPath);
    
    const uploadedImagePath = path.join(__dirname, '../temp', image.filename);
    
    const isMatched = await compareFaces(user_image_json_file, uploadedImagePath);

   
    
    

    if (!isMatched) {
    // fs.unlinkSync(uploadedImagePath);

      return res.status(400).json({ message: 'Uploaded image does not match with the user' });
    }

  
    // Yangi koment qo‘shish
    const newComment = await Comment.create({
      comment,
      userId: tokenUserId.userId,
    });

    res.status(201).json({ message: 'Comment added successfully', comment: newComment });

  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


 const getComments = async (req, res) => {
  try {
    // Kommentlarni olish
    const comments = await Comment.find().sort({ createdAt: -1 }); // Yangi kommentlarni yuqorida ko'rsatadi
    res.status(200).json({ success: true, comments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch comments', error: error.message });
  }
};

 

export  {getComments, addComment}