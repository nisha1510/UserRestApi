import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid'; 
import jwt from 'jsonwebtoken';

import User from '../models/User.js';
import Password from '../models/Password.js';
import userSession from '../models/userSession.js';


const generateTokens = (payload) => {
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_TOKEN, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ 
        email 
    });
    if (existingUser) return res.status(400).json({ 
        message: 'User already exists' 
    });

    const id = uuid();
    const newUser = new User({ 
        id, fullName, email 
    });
    await newUser.save();

    const hashedPassword = await bcrypt.hash(password, 10);
    const newPassword = new Password({ 
        userId: id, hashedPassword 
    });
    await newPassword.save();

    const { accessToken, refreshToken } = generateTokens({ id, email });
    
    await userSession.create({ userId: id, refreshToken });
    
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false, 
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 
    });

    res.status(201).json({ 
      message: 'User created successfully', 
      accessToken, 
      user: { id, fullName, email}, 
        
    });
  } catch (err) {
    res.status(500).json({ 
        message: err.message 
    });
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ 
        email 
    });
    if (!user) return res.status(400).json({ 
        message: 'Invalid credentials' 
    });

    const passEntry = await Password.findOne({ 
        userId: user.id 
    });
    if (!passEntry) return res.status(400).json({ 
      message: 'Invalid credentials' 
    });

    const isMatch = await bcrypt.compare(password, passEntry.hashedPassword);
    if (!isMatch) return res.status(400).json({ 
        message: 'Invalid credentials' 
    });

    const { accessToken, refreshToken } = generateTokens({ id: user.id, email });

    await userSession.create({ 
      userId: user.id, 
      refreshToken 
    });
   
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,    
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({ 
        message: 'Login successful', 
        accessToken,
        user: { id: user.id, fullName: user.fullName, email: user.email } 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    return res.status(401).json({ 
      message: "No refresh token, please login" 
    });
  }

  try {
    // Check if token exists in DB
    const session = await userSession.findOne({ refreshToken: token });
    if (!session) {
      return res.status(403).json({ message: "Invalid session" });
    }

    // Verify refresh token validity
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_TOKEN);

    // Generate new access token only
    const accessToken = jwt.sign(
      { id: decoded.id, email: decoded.email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    return res.json({ accessToken });
  } catch (err) {
    console.error("Refresh token error:", err.message);
    return res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};

// export const refreshToken = async (req, res) => {
//   const token = req.cookies.refreshToken;
//   if (!token) return res.status(401).json({ message: 'No refresh token, please login' });

//   try {
//     const session = await userSession.findOne({ refreshToken: token });
//     session.refreshToken = newRefreshToken;
//     await session.save();

//     if (!session) return res.status(403).json({ message: 'Invalid session' });
//     const decoded = jwt.verify(token, process.env.JWT_REFRESH_TOKEN);
//     const { accessToken, refreshToken: newRefreshToken } = generateTokens({ 
//         id: decoded.id, 
//         email: decoded.email 
//     });

//     // Replace old refresh token with new one
//     session.refreshToken = newRefreshToken;
//     await session.save();

//     // Rotate refresh token
//     res.cookie('refreshToken', newRefreshToken, {
//       httpOnly: true,
//       secure: false,
//       sameSite: 'strict',
//       maxAge: 7 * 24 * 60 * 60 * 1000
//     });

//     res.json({ accessToken });
//   } catch (err) {
//     res.status(403).json({ message: 'Invalid or expired refresh token' });
//   }
// };

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const updateUser = async (req, res) => {
  try {
    const { fullName, email } = req.body;
    const updatedUser = await User.findOneAndUpdate(
      { id: req.params.id },
      { fullName, email },
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ id: req.params.id });
    if (!user) return res.status(404).json({ message: 'User not found' });

    await Password.findOneAndDelete({ userId: req.params.id });
    await userSession.deleteMany({ userId: req.params.id });
    res.json({ message: 'User, session and password deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const logout = async (req, res) => {
  try {
    const { id } = req.user; // from verifyToken middleware
    await userSession.deleteMany({ userId: id });// remove all sessions
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out from all sessions' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};