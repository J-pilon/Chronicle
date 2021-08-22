import pool from "./db/index";

const getCategories = (userId) => {
  const query = `SELECT * FROM categories
WHERE user_id = $1`;
  const queryParams = [userId];
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

const insertCategory = (attributes) => {
  return insertIntoDatabase(attributes, 'categories');
};

export default { getCategories, insertCategory };