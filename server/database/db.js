
const Database = require("better-sqlite3");
const path = require("path");

// Keep using the existing SQLite database file.
const dbPath = path.join(__dirname, "nexnote.db");
const db = new Database(dbPath);

// Database settings
db.pragma("foreign_keys = ON");
db.pragma("journal_mode = WAL");

// Create the original notes table if it does not exist.
db.exec(`
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

// Add pinned to older databases if it is missing.
let noteColumns = db.prepare("PRAGMA table_info(notes)").all();

if (!noteColumns.some((column) => column.name === "pinned")) {
  db.exec(`
    ALTER TABLE notes
    ADD COLUMN pinned INTEGER NOT NULL DEFAULT 0
  `);
}

// Create users table for registration and login.
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL COLLATE NOCASE UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

// Create sessions table for authentication tokens.
// Store only token hashes, never raw tokens.
db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token_hash TEXT NOT NULL UNIQUE,
    expires_at INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),

    FOREIGN KEY (user_id)
      REFERENCES users(id)
      ON DELETE CASCADE
  );
`);

// Add user_id to an existing notes table without deleting old notes.
noteColumns = db.prepare("PRAGMA table_info(notes)").all();

if (!noteColumns.some((column) => column.name === "user_id")) {
  db.exec(`
    ALTER TABLE notes
    ADD COLUMN user_id INTEGER
    REFERENCES users(id)
    ON DELETE CASCADE
  `);
}

// Indexes for faster user-specific note and session queries.
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_notes_user_updated
  ON notes(user_id, updated_at);

  CREATE INDEX IF NOT EXISTS idx_sessions_user
  ON sessions(user_id);

  CREATE INDEX IF NOT EXISTS idx_sessions_expiry
  ON sessions(expires_at);
`);

console.log("NexNote SQLite database connected successfully.");
console.log("Users, sessions, and notes.user_id are ready.");

module.exports = db;
