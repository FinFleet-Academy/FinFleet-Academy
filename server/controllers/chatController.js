import axios from 'axios';
import User from '../models/User.js';

const CHAT_LIMITS = {
  'FREE': 3,
  'PRO': 20,
  'ELITE': 100,
  'ELITE PRIME': Infinity
};

const SYSTEM_PROMPT = `You are FinFleet AI, a beginner-friendly financial assistant. 
Explain finance, stock market, and investing in simple words. 
Focus on Indian market (NSE, BSE). 
Do not give risky or illegal financial advice. 
Keep answers short (max 100 words).`;

export const handleChat = async (req, res) => {
  try {
    const { message, history } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Daily Reset Logic
    const now = new Date();
    const lastReset = new Date(user.lastChatReset);
    if (now.toDateString() !== lastReset.toDateString()) {
      user.chatCount = 0;
      user.lastChatReset = now;
      await user.save();
    }

    // Cooldown Check (3 seconds)
    const cooldown = 3000;
    const timeSinceLastMsg = now - new Date(user.lastMessageAt).getTime();
    if (timeSinceLastMsg < cooldown) {
      return res.status(429).json({ 
        message: `Please wait ${Math.ceil((cooldown - timeSinceLastMsg) / 1000)}s before sending another message.` 
      });
    }

    // Check Plan Limits
    const limit = CHAT_LIMITS[user.plan] || 3;
    if (user.chatCount >= limit && user.plan !== 'ELITE PRIME') {
      const upgradeMsg = user.plan === 'FREE' 
        ? "You’ve reached your free daily AI limit. Upgrade to Pro for more access."
        : "You’ve reached today’s AI limit. Try again tomorrow or upgrade.";
      return res.status(403).json({ message: upgradeMsg });
    }

    // Groq API Integration
    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      return res.status(500).json({ message: 'AI configuration missing' });
    }

    // Keep only last 5 messages for history
    const context = history.slice(-5).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...context,
          { role: 'user', content: message }
        ],
        max_tokens: 250,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const aiMessage = response.data.choices[0].message.content;

    // Increment chat count
    user.chatCount += 1;
    user.lastMessageAt = new Date();
    await user.save();

    res.json({ 
      message: aiMessage, 
      chatCount: user.chatCount,
      limit: limit === Infinity ? 'Unlimited' : limit
    });

  } catch (error) {
    console.error('Chat Error:', error.response?.data || error.message);
    res.status(500).json({ message: 'FinFleet AI is currently busy. Please try again later.' });
  }
};
