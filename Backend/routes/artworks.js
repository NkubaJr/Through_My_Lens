const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../database');

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

// GET /api/artworks
router.get('/', (req, res) => {
  const { category, country } = req.query;
  let query = `SELECT artworks.*, users.username 
               FROM artworks JOIN users ON artworks.user_id = users.user_id 
               WHERE artworks.status = 'active'`;
  const params = [];
  if (category) { query += ' AND category = ?'; params.push(category); }
  if (country) { query += ' AND country = ?'; params.push(country); }
  query += ' ORDER BY created_at DESC';
  const artworks = db.prepare(query).all(...params);
  res.json(artworks);
});

// GET /api/artworks/:id
router.get('/:id', (req, res) => {
  const artwork = db.prepare(
    `SELECT artworks.*, users.username 
     FROM artworks JOIN users ON artworks.user_id = users.user_id 
     WHERE artwork_id = ?`
  ).get(req.params.id);
  if (!artwork) return res.status(404).json({ error: 'Artwork not found' });

  const likes = db.prepare('SELECT COUNT(*) as count FROM likes WHERE artwork_id = ?').get(req.params.id);
  const comments = db.prepare('SELECT * FROM comments WHERE artwork_id = ? ORDER BY created_at DESC').all(req.params.id);

  res.json({ ...artwork, likes: likes.count, comments });
});

// POST /api/artworks
router.post('/', authenticate, (req, res) => {
  const { title, story, category, country, file_url } = req.body;
  if (!title || !story || !category || !country || !file_url) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  if (story.length < 50) {
    return res.status(400).json({ error: 'Story must be at least 50 characters' });
  }
  const result = db.prepare(
    'INSERT INTO artworks (title, story, category, country, file_url, user_id) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(title, story, category, country, file_url, req.user.userId);
  res.json({ message: 'Artwork uploaded successfully!', artworkId: result.lastInsertRowid });
});

// DELETE /api/artworks/:id
router.delete('/:id', authenticate, (req, res) => {
  const artwork = db.prepare('SELECT * FROM artworks WHERE artwork_id = ?').get(req.params.id);
  if (!artwork) return res.status(404).json({ error: 'Artwork not found' });
  if (artwork.user_id !== req.user.userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  db.prepare('DELETE FROM artworks WHERE artwork_id = ?').run(req.params.id);
  res.json({ message: 'Artwork deleted' });
});

// POST /api/artworks/:id/like
router.post('/:id/like', (req, res) => {
  const { visitor_identifier } = req.body;
  const id = visitor_identifier || req.ip;

  const existing = db.prepare(
    'SELECT * FROM likes WHERE artwork_id = ? AND visitor_identifier = ?'
  ).get(req.params.id, id);

  if (existing) {
    db.prepare('DELETE FROM likes WHERE like_id = ?').run(existing.like_id);
    const count = db.prepare('SELECT COUNT(*) as count FROM likes WHERE artwork_id = ?').get(req.params.id);
    return res.json({ liked: false, likes: count.count });
  }

  db.prepare(
    'INSERT INTO likes (visitor_identifier, artwork_id) VALUES (?, ?)'
  ).run(id, req.params.id);

  const count = db.prepare('SELECT COUNT(*) as count FROM likes WHERE artwork_id = ?').get(req.params.id);
  res.json({ liked: true, likes: count.count });
});

// POST /api/artworks/:id/comment
router.post('/:id/comment', (req, res) => {
  const { name, message } = req.body;
  if (!name || !message) {
    return res.status(400).json({ error: 'Name and message are required' });
  }
  db.prepare(
    'INSERT INTO comments (name, message, artwork_id) VALUES (?, ?, ?)'
  ).run(name, message, req.params.id);
  res.json({ message: 'Comment posted!' });
});

// POST /api/artworks/:id/support
router.post('/:id/support', (req, res) => {
  try {
    const { visitor_name, visitor_email, message, amount, type } = req.body;
    console.log('Support request received:', req.body);
    
    const artwork = db.prepare('SELECT * FROM artworks WHERE artwork_id = ?').get(req.params.id);
    if (!artwork) return res.status(404).json({ error: 'Artwork not found' });

    db.prepare(
      'INSERT INTO transactions (visitor_name, visitor_email, message, amount, type, artwork_id) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(
      visitor_name || 'Anonymous',
      visitor_email || '',
      message || '',
      amount || '0',
      type || 'support',
      req.params.id
    );
    res.json({ message: 'Your message has been sent to the artist!' });
  } catch (err) {
    console.error('Support route error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/artworks/:id/connections
router.get('/:id/connections', authenticate, (req, res) => {
  const connections = db.prepare(
    'SELECT * FROM transactions WHERE artwork_id = ? ORDER BY support_date DESC'
  ).all(req.params.id);
  res.json(connections);
});

module.exports = router;