-- No-Show-Killer: Initial Schema für DigitalOcean PostgreSQL
-- Erstellt: 2026-06-18
-- Ausführen in der Datenbank: no_show_killer

-- NextAuth.js benötigte Tabellen
CREATE TABLE IF NOT EXISTS accounts (
  id                 SERIAL PRIMARY KEY,
  user_id            INTEGER NOT NULL,
  type               TEXT NOT NULL,
  provider           TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  refresh_token      TEXT,
  access_token       TEXT,
  expires_at         BIGINT,
  token_type         TEXT,
  scope              TEXT,
  id_token           TEXT,
  session_state      TEXT,
  UNIQUE(provider, provider_account_id)
);

CREATE TABLE IF NOT EXISTS sessions (
  id            SERIAL PRIMARY KEY,
  user_id       INTEGER NOT NULL,
  expires       TIMESTAMPTZ NOT NULL,
  session_token TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS users (
  id             SERIAL PRIMARY KEY,
  name           TEXT,
  email          TEXT UNIQUE,
  email_verified TIMESTAMPTZ,
  image          TEXT,
  password_hash  TEXT
);

CREATE TABLE IF NOT EXISTS verification_tokens (
  identifier TEXT NOT NULL,
  token      TEXT NOT NULL UNIQUE,
  expires    TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- Praxisinhaber (verknüpft mit NextAuth-User)
CREATE TABLE IF NOT EXISTS businesses (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  owner_email  TEXT NOT NULL UNIQUE,
  plan         TEXT NOT NULL DEFAULT 'basis', -- 'basis' | 'pro' | 'premium'
  branding_name TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Endkunden der Praxis
CREATE TABLE IF NOT EXISTS customers (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  full_name   TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Termine
CREATE TABLE IF NOT EXISTS appointments (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id      UUID REFERENCES businesses(id) ON DELETE CASCADE,
  customer_id      UUID REFERENCES customers(id) ON DELETE CASCADE,
  scheduled_at     TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 45,
  price_value      NUMERIC(10,2) NOT NULL DEFAULT 0,
  status           TEXT NOT NULL DEFAULT 'scheduled',
  -- status: scheduled | reminded | confirmed | no_show | completed | rebooked
  reminder_sent_at TIMESTAMPTZ,
  confirmed_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Warteliste
CREATE TABLE IF NOT EXISTS waitlist (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id          UUID REFERENCES businesses(id) ON DELETE CASCADE,
  customer_id          UUID REFERENCES customers(id) ON DELETE CASCADE,
  preferred_time_range TEXT,
  created_at           TIMESTAMPTZ DEFAULT NOW()
);

-- Log automatischer Aktionen
CREATE TABLE IF NOT EXISTS automation_log (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id    UUID REFERENCES businesses(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  action_type    TEXT NOT NULL, -- reminder_sent | confirmation_received | waitlist_contacted
  details        TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);
