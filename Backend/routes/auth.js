const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (existingUser) {
    return res.status(400).json({ error: 'Email already registered' });
  }

  const password_hash = bcrypt.hashSync(password, 10);

  const result = db.prepare(
    'INSERT INTO users (email, username, password_hash) VALUES (?, ?, ?)'
  ).run(email, username, password_hash);

  res.json({ message: 'Account created successfully!', userId: result.lastInsertRowid });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }

  const validPassword = bcrypt.compareSync(password, user.password_hash);
  if (!validPassword) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }

  const token = jwt.sign(
    { userId: user.user_id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    message: 'Login successful!',
    token,
    user: { id: user.user_id, username: user.username, email: user.email, role: user.role }
  });
});

module.exports = router;