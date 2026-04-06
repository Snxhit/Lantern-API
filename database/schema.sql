-- used to initially populate the postgres db
-- also nukes everything

DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_username
ON users(username);

-- =

CREATE TABLE conversations (
  id SERIAL PRIMARY KEY,
  user1_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user2_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT unique_dm UNIQUE (user1_id, user2_id),
  CONSTRAINT no_self_dm CHECK (user1_id <> user2_id)
);

CREATE INDEX idx_conversations_user1
ON conversations(user1_id);

CREATE INDEX idx_conversations_user2
ON conversations(user2_id);

-- =

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  conversation_id INTEGER NOT NULL
    REFERENCES conversations(id)
    ON DELETE CASCADE,

  sender_id INTEGER NOT NULL
    REFERENCES users(id)
    ON DELETE CASCADE,

  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation
ON messages(conversation_id);

CREATE INDEX idx_messages_created
ON messages(created_at);

-- =

ALTER TABLE messages
ADD COLUMN content_tsv tsvector
GENERATED ALWAYS AS (
  to_tsvector('english', content)
) STORED;

CREATE INDEX idx_messages_search
ON messages USING GIN (content_tsv);
