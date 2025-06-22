-- Cloudflare D1 Database Schema for QR Short Link Generator

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY, -- UUID or external auth provider ID
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT, -- nullable if using external auth
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Short links table
CREATE TABLE IF NOT EXISTS links (
  id TEXT PRIMARY KEY, -- UUID
  user_id TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE, -- short code
  target_url TEXT NOT NULL,
  qr_image_url TEXT, -- R2 object URL
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Sessions table (if not using external session management)
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY, -- session token
  user_id TEXT NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Index for fast lookup by user
CREATE INDEX IF NOT EXISTS idx_links_user_id ON links(user_id);

-- Enforce max 10 links per user (application-level check required)
-- (No direct SQL constraint for this in SQLite/D1)

-- Future: Analytics table (optional)
-- CREATE TABLE IF NOT EXISTS link_events (
--   id TEXT PRIMARY KEY,
--   link_id TEXT NOT NULL,
--   event_type TEXT NOT NULL, -- e.g., "redirect"
--   event_time DATETIME DEFAULT CURRENT_TIMESTAMP,
--   FOREIGN KEY (link_id) REFERENCES links(id)
-- );
