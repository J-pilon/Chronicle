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

const insertUser = (attributes: IUser) => {
  return insertIntoDatabase(attributes, 'users')
}

export default { getUserByUserId, getUsers, insertUser };