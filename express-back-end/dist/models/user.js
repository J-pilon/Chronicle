import pool from "./db/index";

const getUsers = () => {
  const query = 'SELECT * FROM users';
  return pool.query(query);
};

const getUserByUserId = (id) => {
  const query = `
SELECT users.*,
fonts.script as body_script,
title.script as title_script
FROM users 
JOIN fonts ON users.body_font_id = fonts.id 
JOIN (
  SELECT fonts.*, users.id as user_id
  FROM users 
  JOIN fonts ON users.title_font_id = fonts.id 
  WHERE users.id = $1
) as title
ON users.id = title.user_id
  WHERE users.id = $1;`;
  const queryParams = [id];
  return pool.query(query, queryParams);
};

const insertIntoDatabase = (attributes, table) => {
  const queryParams = [];
  let queryStart = `INSERT INTO ${table} (`;
  let queryMid = ') VALUES (';
  let queryEnd = ') RETURNING id';
  for (const [attribute, value] of Object.entries(attributes)) {
      if (queryParams.length) {
          queryStart += ', ';
          queryMid += ', ';
      }
      queryParams.push(value);
      queryStart += `${attribute}`;
      queryMid += `$${queryParams.length}`;
  }
  if (table !== 'users') {
      queryEnd += ', user_id as userId';
  }
  const queryString = queryStart + queryMid + queryEnd;
  return pool.query(queryString, queryParams);
};

const insertUser = (attributes) => {
  return insertIntoDatabase(attributes, 'users');
};