import pool from "./db/index";

const getEntryByEntryId = (attributes) => {
  const { entryId, userId } = attributes;
  const query = `SELECT *, TO_CHAR(date_created, 'YYYY-MM-DD') as date FROM entries
WHERE user_id = $1 AND id = $2;`;
  const queryParams = [userId, entryId];
  return pool.query(query, queryParams);
};

const insertEntry = (attributes) => {
  return insertIntoDatabase(attributes, 'entries');
};

export default { getEntryByEntryId, insertEntry };