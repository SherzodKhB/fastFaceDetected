import express from 'express';
import { addComment, getComments } from '../controllers/commentsController.js';
import  authenticate  from '../middlewares/authMiddleware.js';
import multer  from 'multer';

const router = express.Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'temp/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

router.post('/add', authenticate, upload.single('image'), addComment);
router.get('/getcomments', authenticate, getComments);

export default  router;
