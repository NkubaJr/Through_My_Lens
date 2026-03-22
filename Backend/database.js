const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'mylens.db'));

// To create tables if they don't exist yet
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    username TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'Artist'
  );

  CREATE TABLE IF NOT EXISTS artworks (
    artwork_id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    story TEXT NOT NULL,
    category TEXT NOT NULL,
    country TEXT NOT NULL,
    file_url TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
  );

  CREATE TABLE IF NOT EXISTS transactions (
    transaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
    support_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    visitor_email TEXT,
    artwork_id INTEGER NOT NULL,
    FOREIGN KEY (artwork_id) REFERENCES artworks(artwork_id)
  );
`);

console.log('Database ready with all tables!');

module.exports = db;