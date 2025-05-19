import Express, { Request, Response } from "express";
const App = Express();
const PORT = 8080;
import dotenv from 'dotenv';
dotenv.config();

// Setup database for queries
import pg from 'pg';
const connectionString = process.env.DATABASE_URL ||
    `postgresql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?sslmode=disable`;
const pool = new pg.Pool({connectionString});
pool.connect()
  .catch(e => console.log(`Error connecting to Postgres server:\n${e}`));

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
interface ICategory {
  id?: string | number;
  name?: string;
  user_id: string | number;
}
interface IGraphParams {
  type?: string;
  startDate?: string | null;
  endDate?: string | null;
}
interface IEntryParams {
  startDate?: string | null;
  endDate?: string | null;
  mood?: null | string;
  limit?: null | string
  categoryId?: string | null;
}

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

const getEntryByEntryId = (attributes: { entryId: string; userId: string; }) => {
  const { entryId, userId } = attributes;
  const query = `SELECT *, TO_CHAR(date_created, 'YYYY-MM-DD') as date FROM entries
  WHERE user_id = $1 AND id = $2;`;
  const queryParams = [userId, entryId];
  return pool.query(query, queryParams);
};

const getGraphByUserId = ( userId: string, params: IGraphParams ) => {
  const { type, startDate, endDate } = params;
  const queryParams = [userId];
  let queryStart = 'SELECT mood, ';
  let queryMid = ' FROM entries WHERE user_id = $1 AND mood IS NOT NULL ';
  let queryEnd = '';
  if (type === 'line') {
    queryStart += `TO_CHAR(date_created, 'YYYY-MM-DD') as date`;
    queryEnd = 'ORDER BY date_created';
  }
  if (type === 'pie') {
    queryStart += 'count(*) as entries';
    queryEnd = 'GROUP BY mood';
  }
    if (startDate) {
      queryParams.push(startDate);
      queryMid += ` AND date_created >= $${queryParams.length}`;
    }
    if (endDate) {
      queryParams.push(endDate);
      queryMid += ` AND date_created <= $${queryParams.length}`;
    }
    
  const query = queryStart + queryMid + queryEnd;
  return pool.query(query, queryParams);
};

const getCategories = (userId: string) => {
  const query = `SELECT * FROM categories
  WHERE user_id = $1`;
  const queryParams = [userId];
  return pool.query(query, queryParams);
};

const getUserByUserId = (id: string) => {
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

const getUsers = () => {
  const query = 'SELECT * FROM users'
  return pool.query(query);
};

const getFontByFontId = (id: string) => {
  const query = `SELECT * FROM fonts
  WHERE id = $1;`;
  const queryParams = [id];
  return pool.query(query, queryParams);
};

const getFonts = () => {
  const query = 'SELECT * FROM fonts'
  return pool.query(query);
};

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

const insertCategory = (attributes: ICategory) => {
  return insertIntoDatabase(attributes, 'categories')
}

const insertEntry = (attributes: IEntry) => {
  return insertIntoDatabase(attributes, 'entries')
}

const insertUser = (attributes: IUser) => {
  return insertIntoDatabase(attributes, 'users')
}
const updateDatabase = (attributes: IEntry | IUser | ICategory, identifiers: { table: string, type: string, id: string }) => {
  const { table, type, id } = identifiers;
  const queryParams = [];
  let query = '';
  // either deleting or updating an item from a table
  if (type === 'delete') {
    query += `DELETE
    FROM ${table}` ;
  } else {
    query += `UPDATE ${table}`
    for (const [attribute, value] of Object.entries(attributes)) {
      !queryParams.length 
      ? query += ' SET '
      : query += ', ';
      queryParams.push(value);
      query += `${attribute} = $${queryParams.length}`;
    }
    // update the date_updated if it's an entry
    if (table === 'entries') {
      query += ', date_updated = NOW()'
    }
    
  }

  queryParams.push(id)
  query += ` WHERE id = $${queryParams.length}`;
  // this if will only fire when it's *not* the user table
  if (table !== 'users') {
    // @ts-ignore
    queryParams.push(attributes.user_id)
    query += ` AND user_id = $${queryParams.length}`
  }
  return pool.query(query, queryParams);
};

// Express Configuration
App.use(Express.urlencoded({ extended: false }));
App.use(Express.json());
App.use(Express.static('public'));

// Hardcoded userId for development
const userId = '1';

App.get('/api/entries', (req: Request, res: Response) => {
  getEntriesByCategory(userId, req.query)
  .then((data) => res.json(data.rows));
});

App.get('/api/entries/:entryId', (req: Request, res: Response) => {
  getEntryByEntryId({entryId: req.params.entryId, userId})
  .then((data) => res.json(data.rows));
});

App.get('/api/categories', (req: Request, res: Response) => {

  getCategories(userId)
  .then((data) => res.json(data.rows));
});

App.get('/api/users', (req: Request, res: Response) => {

  getUsers()
  .then((data) => res.json(data.rows));
});
App.get('/api/users/:id', (req: Request, res: Response) => {
   getUserByUserId(req.params.id)
   .then((data) => res.json(data.rows));
  });

App.get('/api/fonts', (req: Request, res: Response) => {

  getFonts()
  .then((data) => res.json(data.rows));
});
App.get('/api/fonts/:id', (req: Request, res: Response) => {
  getFontByFontId(req.params.id)
  .then((data) => res.json(data.rows));
});
App.get('/api/graph/', (req: Request, res: Response) => {
  getGraphByUserId(userId, req.query)
  .then((data) => res.json(data.rows));
});
App.post('/api/entries', (req: Request, res: Response) => {
  const attributes = {
    title: req.body.title,
    content: req.body.content,
    mood: req.body.mood || null,
    privacy: req.body.privacy || true,
    user_id: req.body.userId,
    category_id: req.body.category || null
  }
  insertEntry(attributes)
  .then((data) => res.json(data.rows));
});
App.post('/api/entries/:id', (req: Request, res: Response) => {
  updateDatabase(req.body.params, { table: 'entries', type: 'update', id: req.params.id })
  .then((data) => res.json(data.rows));
});
App.post('/api/users/:id', (req: Request, res: Response) => {
  updateDatabase(req.body.params, { table: 'users', type: 'update', id: req.params.id })
  .then((data) => res.json(data.rows));
});
App.delete('/api/entries/:id', (req: Request, res: Response) => {
  updateDatabase(req.body, { table: 'entries', type: 'delete', id: req.params.id })
  .then((data) => res.json(data.rows));
});
App.post('/api/categories', (req: Request, res: Response) => {
  insertCategory({user_id: userId, name: req.body.name})
  .then((data) => res.json(data.rows));
});
App.post('/api/users', (req: Request, res: Response) => {
  const attributes = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  }
  insertUser(attributes)
  .then((data) => res.json(data.rows));
});

App.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Express seems to be listening on port ${PORT} so that's pretty good 👍`);
});
