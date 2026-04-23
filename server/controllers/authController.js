import User from '../models/User.js';
import Notification from '../models/Notification.js';
import Subscriber from '../models/Subscriber.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'finfleet_super_secret_key_123!', {
    expiresIn: '30d',
  });
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

    // Generate unique referral code
    const baseCode = name.replace(/[^a-zA-Z0-9]/g, '').substring(0, 4).toUpperCase();
    const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
    const myReferralCode = `${baseCode}${randomStr}`;

    let referredById = null;
    if (inputReferral) {
      const referrer = await User.findOne({ referralCode: inputReferral.toUpperCase() });
      if (referrer) {
        referredById = referrer._id;
        // Optionally reward referrer immediately (e.g. +10 AI messages)
        // This can be done after user creation
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
         // Reward referrer: Add user to referred list and give +10 AI messages (decrement usage)
         await User.findByIdAndUpdate(referredById, {
           $push: { referredUsers: user._id },
           $inc: { chatCount: -10 }
         });
         
         // Notify referrer
         await Notification.create({
           userEmail: (await User.findById(referredById)).email,
           title: 'Referral Bonus',
           message: `Someone just signed up using your referral code! We've added 10 bonus AI messages to your account.`
         });
      }

      // Create welcome notification
      await Notification.create({
        userEmail: user.email,
        title: 'Welcome to FinFleet Academy',
        message: `Welcome to FinFleet Academy, ${user.name}! We're excited to help you master the markets.`
      });

      // Add to subscribers automatically
      try {
        await Subscriber.findOneAndUpdate(
          { email: user.email },
          { $setOnInsert: { email: user.email, source: 'registration' } },
          { upsert: true }
        );
      } catch (subErr) {
        console.error('Error adding subscriber:', subErr);
      }

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        isAdmin: user.isAdmin,
        chatCount: user.chatCount,
        referralCode: user.referralCode,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
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
      // Add to subscribers automatically if they aren't already
      try {
        await Subscriber.findOneAndUpdate(
          { email: user.email },
          { $setOnInsert: { email: user.email, source: 'login' } },
          { upsert: true }
        );
      } catch (subErr) {
        console.error('Error adding subscriber:', subErr);
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        isAdmin: user.isAdmin,
        chatCount: user.chatCount,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
