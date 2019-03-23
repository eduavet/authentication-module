CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  uuid uuid primary key default uuid_generate_v4(),
  username text unique,
  password text,
  created_at timestamp not null default now()
);

CREATE TABLE tokens (
  token text primary key,
  owner uuid references users not null,
  created_at timestamp not null default now(),
  expiring_at timestamp not null
);
