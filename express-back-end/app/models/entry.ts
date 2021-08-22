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

const getEntryByEntryId = (attributes: { entryId: string; userId: string; }) => {
  const { entryId, userId } = attributes;
  const query = `SELECT *, TO_CHAR(date_created, 'YYYY-MM-DD') as date FROM entries
  WHERE user_id = $1 AND id = $2;`;
  const queryParams = [userId, entryId];
  return pool.query(query, queryParams);
};

const insertEntry = (attributes: IEntry) => {
  return insertIntoDatabase(attributes, 'entries')
}

export default { getEntryByEntryId, insertEntry };