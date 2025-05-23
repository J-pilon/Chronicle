DROP TABLE IF EXISTS entries CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS fonts CASCADE;

CREATE TABLE fonts (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  script VARCHAR(255) NOT NULL
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  email VARCHAR(255) NOT NULL,
  userName VARCHAR(255) NOT NULL,
  password VARCHAR(500) NOT NULL,
  background_hex VARCHAR(7) DEFAULT '#76c2f5',
  secondary_hex VARCHAR(7) DEFAULT '#041454',
  accent_hex VARCHAR(7) DEFAULT '#6699cc',
  form_hex VARCHAR(7) DEFAULT '#fffcdf',
  text_hex VARCHAR(7) DEFAULT '#ffffff',
  prompts BOOLEAN DEFAULT TRUE,
  private BOOLEAN DEFAULT TRUE,
  date_created TIMESTAMP DEFAULT NOW(),
  body_font_id INTEGER REFERENCES fonts(id) ON DELETE CASCADE DEFAULT 1,
  title_font_id INTEGER REFERENCES fonts(id) ON DELETE CASCADE DEFAULT 1
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE entries (
  id SERIAL PRIMARY KEY NOT NULL,
  title VARCHAR(255) NOT NULL,
  content VARCHAR(12000) NOT NULL,
  mood INTEGER,
  privacy BOOLEAN DEFAULT TRUE,
  date_created TIMESTAMP DEFAULT NOW(),
  date_updated TIMESTAMP DEFAULT NOW(),
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);