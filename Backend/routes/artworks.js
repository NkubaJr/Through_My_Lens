const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../database');

// JWT authentication middleware
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

// GET /api/artworks — supports ?category= and ?country= filters
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
  res.json(artwork);
});

// POST /api/artworks — requires authentication
router.post('/', authenticate, (req, res) => {
  const { title, story, category, country, file_url } = req.body;

  if (!title || !story || !category || !country || !file_url) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // FR-3.2: story must be at least 50 characters
  if (story.length < 50) {
    return res.status(400).json({ error: 'Story must be at least 50 characters' });
  }

  const result = db.prepare(
    'INSERT INTO artworks (title, story, category, country, file_url, user_id) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(title, story, category, country, file_url, req.user.userId);

  res.json({ message: 'Artwork uploaded successfully!', artworkId: result.lastInsertRowid });
});

// DELETE /api/artworks/:id — owner only
router.delete('/:id', authenticate, (req, res) => {
  const artwork = db.prepare('SELECT * FROM artworks WHERE artwork_id = ?').get(req.params.id);

  if (!artwork) return res.status(404).json({ error: 'Artwork not found' });
  if (artwork.user_id !== req.user.userId) {
    return res.status(403).json({ error: 'Forbidden: you can only delete your own artwork' });
  }

  db.prepare('DELETE FROM artworks WHERE artwork_id = ?').run(req.params.id);
  res.json({ message: 'Artwork deleted' });
});

// POST /api/artworks/:id/support — simulated transaction
router.post('/:id/support', (req, res) => {
  const { visitor_email } = req.body;
  const artwork = db.prepare('SELECT * FROM artworks WHERE artwork_id = ?').get(req.params.id);

  if (!artwork) return res.status(404).json({ error: 'Artwork not found' });

  db.prepare(
    'INSERT INTO transactions (visitor_email, artwork_id) VALUES (?, ?)'
  ).run(visitor_email || 'anonymous', req.params.id);

  res.json({ message: 'Thank you for supporting this artist! 🎨' });
});

module.exports = router;