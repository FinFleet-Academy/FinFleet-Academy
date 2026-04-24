import User from '../models/User.js';
import Notification from '../models/Notification.js';
import Subscriber from '../models/Subscriber.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateTokens = (id) => {
  const accessToken = jwt.sign({ id }, process.env.JWT_SECRET || 'finfleet_super_secret_key_123!', {
    expiresIn: '15m',
  });
  const refreshToken = jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET || 'finfleet_refresh_secret_key_456!', {
    expiresIn: '7d',
  });
  return { accessToken, refreshToken };
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, plan, referralCode: inputReferral } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const baseCode = name.replace(/[^a-zA-Z0-9]/g, '').substring(0, 4).toUpperCase();
    const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
    const myReferralCode = `${baseCode}${randomStr}`;

    let referredById = null;
    if (inputReferral) {
      const referrer = await User.findOne({ referralCode: inputReferral.toUpperCase() });
      if (referrer) {
        referredById = referrer._id;
      }
    }

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
      if (referredById) {
         await User.findByIdAndUpdate(referredById, {
           $push: { referredUsers: user._id },
           $inc: { chatCount: -10 }
         });
         
         await Notification.create({
           userEmail: (await User.findById(referredById)).email,
           title: 'Referral Bonus',
           message: `Someone just signed up using your referral code! We've added 10 bonus AI messages to your account.`
         });
      }

      await Notification.create({
        userEmail: user.email,
        title: 'Welcome to FinFleet Academy',
        message: `Welcome to FinFleet Academy, ${user.name}! We're excited to help you master the markets.`
      });

      const { accessToken, refreshToken } = generateTokens(user._id);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        isAdmin: user.isAdmin,
        token: accessToken,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const { accessToken, refreshToken } = generateTokens(user._id);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

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
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: 'No refresh token' });

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || 'finfleet_refresh_secret_key_456!');
    const { accessToken } = generateTokens(decoded.id);
    res.json({ token: accessToken });
  } catch (error) {
    res.status(403).json({ message: 'Invalid refresh token' });
  }
};

export const logoutUser = async (req, res) => {
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out successfully' });
};
