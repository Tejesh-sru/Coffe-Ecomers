import { randomUUID } from 'crypto';
import express from 'express';
import bcrypt from 'bcryptjs';

import { requireAuth } from '../middleware/auth.js';
import { User } from '../models/User.js';

const router = express.Router();

const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

router.post('/register', async (req, res, next) => {
  try {
    const { username, email, password } = req.body ?? {};

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'username, email and password are required' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedUsername = String(username).trim();

    if (!validateEmail(normalizedEmail)) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    const emailExists = await User.exists({ email: normalizedEmail });
    if (emailExists) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const usernameExists = await User.exists({ username: normalizedUsername });
    if (usernameExists) {
      return res.status(400).json({ message: 'Username already in use' });
    }

    const passwordHash = await bcrypt.hash(String(password), 10);
    const token = randomUUID();

    const user = await User.create({
      username: normalizedUsername,
      email: normalizedEmail,
      passwordHash,
      authToken: token,
    });

    return res.status(201).json({
      token: user.authToken,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body ?? {};

    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(String(password), user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    user.authToken = randomUUID();
    await user.save();

    return res.json({
      token: user.authToken,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/profile', requireAuth, async (req, res) => {
  res.json({
    id: req.user._id.toString(),
    username: req.user.username,
    email: req.user.email,
  });
});

router.put('/profile', requireAuth, async (req, res, next) => {
  try {
    const { username } = req.body ?? {};

    if (!username || !String(username).trim()) {
      return res.status(400).json({ message: 'username is required' });
    }

    const normalizedUsername = String(username).trim();

    const usernameExists = await User.exists({
      username: normalizedUsername,
      _id: { $ne: req.user._id },
    });

    if (usernameExists) {
      return res.status(400).json({ message: 'Username already in use' });
    }

    req.user.username = normalizedUsername;
    await req.user.save();

    return res.json({
      id: req.user._id.toString(),
      username: req.user.username,
      email: req.user.email,
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
