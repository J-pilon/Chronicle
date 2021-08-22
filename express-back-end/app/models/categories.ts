interface IEntryParams {
  startDate?: string | null;
  endDate?: string | null;
  mood?: null | string;
  limit?: null | string
  categoryId?: string | null;
}

interface ICategory {
  id?: string | number;
  name?: string;
  user_id: string | number;
}

interface IUser {
  id?: string | number;
  username?: string;
  email?: string;
  password?: string;
  backgroundHex?: string;
  accentHex?: string;
  textHex?: string;
  prompts?: boolean;
  private?: boolean;
  dateCreated?: string;
  bodyFontId?: string | number;
  titleFontId?: string | number;
  
}
interface IEntry {
  id?: string | number;
  title: string;
  content: string;
  mood?: string | number;
  privacy?: boolean;
  dateCreated?: string;
  dateUpdated?: string;
  category_id?: string | number | null;
  user_id: string | number;
}

const insertIntoDatabase = (attributes: IEntry | IUser | ICategory, table: string) => {
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

const getEntriesByCategory = (userId: string, params: IEntryParams) => {

  const { startDate, endDate, mood, limit, categoryId } = params;
  const queryParams = [userId];
  let queryStart = `SELECT TO_CHAR(entries.date_created, 'YYYY-MM-DD') as date, `;
  let queryMid = ' FROM entries';
  let queryEnd = ' WHERE entries.user_id = $1';
  if (!categoryId) {
    queryStart += '*';
    queryEnd += ` AND category_id IS NULL`;
  } else {
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

const getCategories = (userId: string) => {
  const query = `SELECT * FROM categories
  WHERE user_id = $1`;
  const queryParams = [userId];
  return pool.query(query, queryParams);
};

const insertCategory = (attributes: ICategory) => {
  return insertIntoDatabase(attributes, 'categories')
}

export default { getEntriesByCategory, getCategories, insertCategory };