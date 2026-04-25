import User from '../models/User.js';
import Notification from '../models/Notification.js';
import Subscriber from '../models/Subscriber.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

const generateTokens = (id) => {
  const accessToken = jwt.sign({ id }, process.env.JWT_SECRET || 'finfleet_super_secret_key_123!', {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
  const refreshToken = jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET || 'finfleet_refresh_secret_key_456!', {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
  return { accessToken, refreshToken };
};

const sendRefreshTokenCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: true, // Always true for SameSite=None
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, plan, referralCode: inputReferral } = req.body;

    // 1. Check if email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Generate UNIQUE Referral Code (with retry logic)
    let myReferralCode;
    let isUnique = false;
    let attempts = 0;
    
    while (!isUnique && attempts < 5) {
      const baseCode = name.replace(/[^a-zA-Z0-9]/g, '').substring(0, 4).toUpperCase() || 'FF';
      const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
      myReferralCode = `${baseCode}${randomStr}`;
      
      const existing = await User.findOne({ referralCode: myReferralCode });
      if (!existing) isUnique = true;
      attempts++;
    }

    // 4. Create User
    console.log(`[Registration] Creating user: ${email} with plan: ${plan}`);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      plan: plan || 'FREE',
      isAdmin: email === 'admin@finfleet.com',
      referralCode: myReferralCode,
      referredBy: inputReferral ? inputReferral.toUpperCase() : null
    });

    if (user) {
      console.log(`[Registration] User created successfully: ${user.id}`);
      const { accessToken, refreshToken } = generateTokens(user.id.toString());
      
      // Store refresh token
      user.refreshTokens.push(refreshToken);
      await user.save();

      sendRefreshTokenCookie(res, refreshToken);

      return res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        isAdmin: user.isAdmin,
        token: accessToken,
      });
    }
  } catch (error) {
    console.error('CRITICAL REGISTRATION FAILURE:', {
      message: error.message,
      stack: error.stack,
      email: req.body.email,
      name: req.body.name
    });
    
    // Handle Mongoose Duplicate Key Error explicitly
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Registration failed: Duplicate value detected (Email or Referral Code)' 
      });
    }

    res.status(500).json({ 
      message: 'Internal Server Error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const { accessToken, refreshToken } = generateTokens(user._id);

      // Add new refresh token and limit array size (optional, for security)
      user.refreshTokens.push(refreshToken);
      if (user.refreshTokens.length > 5) user.refreshTokens.shift();
      await user.save();

      sendRefreshTokenCookie(res, refreshToken);

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        isAdmin: user.isAdmin,
        token: accessToken,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const refreshAccessToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.refreshToken) return res.status(401).json({ message: 'No refresh token' });
  
  const oldRefreshToken = cookies.refreshToken;

  try {
    const decoded = jwt.verify(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET || 'finfleet_refresh_secret_key_456!');
    const user = await User.findById(decoded.id);

    if (!user || !user.refreshTokens.includes(oldRefreshToken)) {
      // Detected reuse or invalid token! Clear all tokens for safety.
      if (user) {
        user.refreshTokens = [];
        await user.save();
      }
      res.clearCookie('refreshToken');
      return res.status(403).json({ message: 'Session expired or invalid. Please login again.' });
    }

    // Token is valid. Rotate it!
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id);
    
    // Replace old token with new one in DB
    user.refreshTokens = user.refreshTokens.filter(t => t !== oldRefreshToken);
    user.refreshTokens.push(newRefreshToken);
    await user.save();

    sendRefreshTokenCookie(res, newRefreshToken);
    res.json({ token: accessToken });

  } catch (error) {
    // If expired, remove it from DB if we can decode it
    try {
        const decoded = jwt.decode(oldRefreshToken);
        if (decoded) {
            await User.findByIdAndUpdate(decoded.id, { $pull: { refreshTokens: oldRefreshToken } });
        }
    } catch (e) {}
    
    res.clearCookie('refreshToken');
    res.status(403).json({ message: 'Invalid refresh token' });
  }
};

export const logoutUser = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken) {
    try {
      const decoded = jwt.decode(refreshToken);
      if (decoded) {
        await User.findByIdAndUpdate(decoded.id, { $pull: { refreshTokens: refreshToken } });
      }
    } catch (e) {}
  }
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out successfully' });
};
