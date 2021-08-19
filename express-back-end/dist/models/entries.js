import pool from "./db/index";

const getEntriesByCategory = (userId, params) => {
  const { startDate, endDate, mood, limit, categoryId } = params;
  const queryParams = [userId];
  let queryStart = `SELECT TO_CHAR(entries.date_created, 'YYYY-MM-DD') as date, `;
  let queryMid = ' FROM entries';
  let queryEnd = ' WHERE entries.user_id = $1';
  if (!categoryId) {
      queryStart += '*';
      queryEnd += ` AND category_id IS NULL`;
  }
  else {
      queryStart += 'entries.*, categories.name as category_name';
      queryMid += ' LEFT JOIN categories ON entries.category_id = categories.id';
      if (categoryId !== 'all') {
          queryParams.push(categoryId);
          queryEnd += ' AND entries.category_id = $2';
      }
  }
  if (startDate) {
      queryParams.push(startDate);
      queryEnd += ` AND entries.date_created >= $${queryParams.length}`;
  }
  if (endDate) {
      queryParams.push(endDate);
      queryEnd += ` AND entries.date_created <= $${queryParams.length}`;
  }
  if (mood && mood !== 'all') {
      queryParams.push(mood);
      queryEnd += ` AND entries.mood = $${queryParams.length}`;
  }
  if (!mood) {
      queryEnd += ` AND entries.mood IS NULL`;
  }
  queryEnd += ' ORDER BY entries.date_created DESC';
  if (limit) {
      queryParams.push(limit);
      queryEnd += ` LIMIT $${queryParams.length}`;
  }
  let query = queryStart + queryMid + queryEnd;
  return pool.query(query, queryParams);
};

export default getEntriesByCategory;