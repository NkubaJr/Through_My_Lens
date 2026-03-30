const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const db = require('../database');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

router.post('/register', async (req, res) => {
  const { email, username, password } = req.body;
  if (!email || !username || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const existing = await db.execute({
    sql: 'SELECT * FROM users WHERE email = ?',
    args: [email]
  });
  if (existing.rows.length > 0) {
    return res.status(400).json({ error: 'Email already registered' });
  }
  const password_hash = bcrypt.hashSync(password, 10);
  const result = await db.execute({
    sql: 'INSERT INTO users (email, username, password_hash) VALUES (?, ?, ?)',
    args: [email, username, password_hash]
  });
  res.json({ message: 'Account created successfully!', userId: Number(result.lastInsertRowid) });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const result = await db.execute({
    sql: 'SELECT * FROM users WHERE email = ?',
    args: [email]
  });
  const user = result.rows[0];
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

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const result = await db.execute({
    sql: 'SELECT * FROM users WHERE email = ?',
    args: [email]
  });
  const user = result.rows[0];
  if (!user) {
    return res.json({ message: 'If that email exists, a reset link has been sent.' });
  }
  const token = crypto.randomBytes(32).toString('hex');
  const expires_at = new Date(Date.now() + 60 * 60 * 1000).toISOString();
  await db.execute({
    sql: 'INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?)',
    args: [email, token, expires_at]
  });
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  await transporter.sendMail({
    from: `"Through My Lens" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Reset your password — Through My Lens',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #3b1f0e;">Reset Your Password</h2>
        <p>Hi ${user.username},</p>
        <p>We received a request to reset your password. Click the button below:</p>
        <a href="${resetLink}" style="display:inline-block; padding: 12px 24px; background-color: #3b1f0e; color: white; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 16px 0;">
          Reset Password
        </a>
        <p style="color: #999; font-size: 0.85rem;">This link expires in 1 hour. If you didn't request this, ignore this email.</p>
      </div>
    `
  });
  res.json({ message: 'If that email exists, a reset link has been sent.' });
});

router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;
  const result = await db.execute({
    sql: 'SELECT * FROM password_resets WHERE token = ? AND used = 0',
    args: [token]
  });
  const reset = result.rows[0];
  if (!reset) {
    return res.status(400).json({ error: 'Invalid or expired reset link.' });
  }
  if (new Date(reset.expires_at) < new Date()) {
    return res.status(400).json({ error: 'Reset link has expired.' });
  }
  const password_hash = bcrypt.hashSync(password, 10);
  await db.execute({
    sql: 'UPDATE users SET password_hash = ? WHERE email = ?',
    args: [password_hash, reset.email]
  });
  await db.execute({
    sql: 'UPDATE password_resets SET used = 1 WHERE token = ?',
    args: [token]
  });
  res.json({ message: 'Password reset successfully!' });
});

module.exports = router;