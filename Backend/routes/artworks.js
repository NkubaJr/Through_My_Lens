const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const xss = require('xss');
const db = require('../database');

// helper to convert BigInt values in objects to numbers
function sanitizeRow(row) {
  if (!row) return row;
  const clean = {};
  for (const key of Object.keys(row)) {
    clean[key] = typeof row[key] === 'bigint' ? Number(row[key]) : row[key];
  }
  return clean;
}

function sanitizeRows(rows) {
  return rows.map(sanitizeRow);
}

function authenticate(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorised. Please log in.' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function isAdmin(req, res, next) {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

// GET /api/artworks
router.get('/', async (req, res) => {
  const { category, country } = req.query;
  let sql = `SELECT artworks.*, users.username 
             FROM artworks JOIN users ON artworks.user_id = users.user_id 
             WHERE artworks.status = 'active'`;
  const args = [];

  if (category) { sql += ' AND category = ?'; args.push(category); }
  if (country) { sql += ' AND country = ?'; args.push(country); }
  sql += ' ORDER BY created_at DESC';

  const result = await db.execute({ sql, args });
  res.json(sanitizeRows(result.rows));
});

// GET /api/artworks/admin/all
router.get('/admin/all', authenticate, isAdmin, async (req, res) => {
  const result = await db.execute(
    `SELECT artworks.*, users.username 
     FROM artworks JOIN users ON artworks.user_id = users.user_id 
     ORDER BY created_at DESC`
  );
  res.json(sanitizeRows(result.rows));
});

// GET /api/artworks/:id
router.get('/:id', async (req, res) => {
  const result = await db.execute({
    sql: `SELECT artworks.*, users.username 
          FROM artworks JOIN users ON artworks.user_id = users.user_id 
          WHERE artwork_id = ?`,
    args: [req.params.id]
  });
  const artwork = sanitizeRow(result.rows[0]);
  if (!artwork) return res.status(404).json({ error: 'Artwork not found' });

  const likesResult = await db.execute({
    sql: 'SELECT COUNT(*) as count FROM likes WHERE artwork_id = ?',
    args: [req.params.id]
  });

  const commentsResult = await db.execute({
    sql: 'SELECT * FROM comments WHERE artwork_id = ? ORDER BY created_at DESC',
    args: [req.params.id]
  });

  res.json({
    ...artwork,
    likes: Number(likesResult.rows[0].count),
    comments: sanitizeRows(commentsResult.rows)
  });
});

// POST /api/artworks
router.post('/', authenticate, async (req, res) => {
  const { title, story, category, country, file_url, extra_images } = req.body;

  if (!title || !story || !category || !country || !file_url) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  if (story.length < 50) {
    return res.status(400).json({ error: 'Story must be at least 50 characters' });
  }

  const cleanTitle = xss(title);
  const cleanStory = xss(story);

  const result = await db.execute({
    sql: 'INSERT INTO artworks (title, story, category, country, file_url, extra_images, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
    args: [cleanTitle, cleanStory, category, country, file_url, extra_images || '[]', req.user.userId]
  });

  res.json({ message: 'Artwork uploaded successfully!', artworkId: Number(result.lastInsertRowid) });
});

// DELETE /api/artworks/:id
router.delete('/:id', authenticate, async (req, res) => {
  const result = await db.execute({
    sql: 'SELECT * FROM artworks WHERE artwork_id = ?',
    args: [req.params.id]
  });
  const artwork = sanitizeRow(result.rows[0]);
  if (!artwork) return res.status(404).json({ error: 'Artwork not found' });

  if (artwork.user_id !== req.user.userId && req.user.role !== 'Admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  await db.execute({
    sql: 'DELETE FROM artworks WHERE artwork_id = ?',
    args: [req.params.id]
  });
  res.json({ message: 'Artwork deleted' });
});

// PATCH /api/artworks/:id/hide
router.patch('/:id/hide', authenticate, isAdmin, async (req, res) => {
  const result = await db.execute({
    sql: 'SELECT * FROM artworks WHERE artwork_id = ?',
    args: [req.params.id]
  });
  const artwork = sanitizeRow(result.rows[0]);
  if (!artwork) return res.status(404).json({ error: 'Artwork not found' });

  const newStatus = artwork.status === 'active' ? 'hidden' : 'active';
  await db.execute({
    sql: 'UPDATE artworks SET status = ? WHERE artwork_id = ?',
    args: [newStatus, req.params.id]
  });
  res.json({ message: `Artwork ${newStatus}`, status: newStatus });
});

// POST /api/artworks/:id/like
router.post('/:id/like', async (req, res) => {
  const { visitor_identifier } = req.body;
  const id = visitor_identifier || req.ip;

  const existing = await db.execute({
    sql: 'SELECT * FROM likes WHERE artwork_id = ? AND visitor_identifier = ?',
    args: [req.params.id, id]
  });

  if (existing.rows.length > 0) {
    await db.execute({
      sql: 'DELETE FROM likes WHERE like_id = ?',
      args: [existing.rows[0].like_id]
    });
    const count = await db.execute({
      sql: 'SELECT COUNT(*) as count FROM likes WHERE artwork_id = ?',
      args: [req.params.id]
    });
    return res.json({ liked: false, likes: Number(count.rows[0].count) });
  }

  await db.execute({
    sql: 'INSERT INTO likes (visitor_identifier, artwork_id) VALUES (?, ?)',
    args: [id, req.params.id]
  });
  const count = await db.execute({
    sql: 'SELECT COUNT(*) as count FROM likes WHERE artwork_id = ?',
    args: [req.params.id]
  });
  res.json({ liked: true, likes: Number(count.rows[0].count) });
});

// POST /api/artworks/:id/comment
router.post('/:id/comment', async (req, res) => {
  const { name, message } = req.body;
  if (!name || !message) {
    return res.status(400).json({ error: 'Name and message are required' });
  }
  await db.execute({
    sql: 'INSERT INTO comments (name, message, artwork_id) VALUES (?, ?, ?)',
    args: [xss(name), xss(message), req.params.id]
  });
  res.json({ message: 'Comment posted!' });
});

// POST /api/artworks/:id/support
router.post('/:id/support', async (req, res) => {
  try {
    const { visitor_name, visitor_email, message, amount, type } = req.body;
    const result = await db.execute({
      sql: 'SELECT * FROM artworks WHERE artwork_id = ?',
      args: [req.params.id]
    });
    if (result.rows.length === 0) return res.status(404).json({ error: 'Artwork not found' });

    await db.execute({
      sql: 'INSERT INTO transactions (visitor_name, visitor_email, message, amount, type, artwork_id) VALUES (?, ?, ?, ?, ?, ?)',
      args: [
        xss(visitor_name || 'Anonymous'),
        visitor_email || '',
        xss(message || ''),
        amount || '0',
        type || 'support',
        req.params.id
      ]
    });
    res.json({ message: 'Your message has been sent to the artist!' });
  } catch (err) {
    console.error('Support error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/artworks/:id/connections
router.get('/:id/connections', authenticate, async (req, res) => {
  const result = await db.execute({
    sql: 'SELECT * FROM transactions WHERE artwork_id = ? ORDER BY support_date DESC',
    args: [req.params.id]
  });
  res.json(sanitizeRows(result.rows));
});

module.exports = router;