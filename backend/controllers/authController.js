import User from "../models/User.js"
import crypto from "crypto"
import nodemailer from "nodemailer"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists', step: 3 });
    }

    const verificationCode = crypto.randomBytes(20).toString('hex');
    const verificationExpires = Date.now() + 20 * 60 * 1000; // 10 minutes

    const newUser = await User.create({
      username,
      email,
      password,
      verificationCode,
      verificationExpires
    });

    res.status(201).json({ message: 'User registered', email});
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};



const sendVerificationCode = async (req, res) => {
  const { email } = req.body;


  

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User already verified' });
    }

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      to: email,
      subject: 'Verification Code',
      text: `Your verification code is: ${user.verificationCode}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Verification code sent' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const verifyUser = async (req, res) => {
  const { email, code } = req.body;

 
  

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.verificationCode !== code || user.verificationExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired verification code' });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    await user.save();

    res.status(200).json({ message: 'User verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};




const loginUser = async (req, res) => {
  const { email, password } = req.body;





  

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: 'User is not verified' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
    
      
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};



export  {
  registerUser,
  loginUser,
  verifyUser,
  sendVerificationCode,
}