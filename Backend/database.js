const { createClient } = require('@libsql/client');

const db = createClient({
  url: process.env.TURSO_URL,
  authToken: process.env.TURSO_TOKEN
});

async function initDb() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      user_id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      username TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'Artist'
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS artworks (
      artwork_id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      story TEXT NOT NULL,
      category TEXT NOT NULL,
      country TEXT NOT NULL,
      file_url TEXT NOT NULL,
      extra_images TEXT DEFAULT '[]',
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      user_id INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(user_id)
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS transactions (
      transaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
      support_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      visitor_name TEXT,
      visitor_email TEXT,
      message TEXT,
      amount TEXT,
      type TEXT DEFAULT 'support',
      artwork_id INTEGER NOT NULL,
      FOREIGN KEY (artwork_id) REFERENCES artworks(artwork_id)
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS likes (
      like_id INTEGER PRIMARY KEY AUTOINCREMENT,
      visitor_identifier TEXT NOT NULL,
      artwork_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (artwork_id) REFERENCES artworks(artwork_id)
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS comments (
      comment_id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      artwork_id INTEGER NOT NULL,
      FOREIGN KEY (artwork_id) REFERENCES artworks(artwork_id)
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS password_resets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      token TEXT NOT NULL,
      expires_at DATETIME NOT NULL,
      used INTEGER DEFAULT 0
    )
  `);

  const bcrypt = require('bcryptjs');
  const existing = await db.execute({
    sql: 'SELECT * FROM users WHERE email = ?',
    args: ['admin@mylens.com']
  });
  if (existing.rows.length === 0) {
    const hash = bcrypt.hashSync('mylens_admin_2024', 10);
    await db.execute({
      sql: 'INSERT INTO users (email, username, password_hash, role) VALUES (?, ?, ?, ?)',
      args: ['admin@mylens.com', 'Admin', hash, 'Admin']
    });
    console.log('Admin account created!');
  }

  console.log('Turso database ready!');
}

initDb().catch(console.error);

module.exports = db;