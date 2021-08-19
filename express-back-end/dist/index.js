import Express from "express";
import pool from "./db/index";

const App = Express();

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
const getEntryByEntryId = (attributes) => {
    const { entryId, userId } = attributes;
    const query = `SELECT *, TO_CHAR(date_created, 'YYYY-MM-DD') as date FROM entries
  WHERE user_id = $1 AND id = $2;`;
    const queryParams = [userId, entryId];
    return pool.query(query, queryParams);
};
const getGraphByUserId = (userId, params) => {
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
const getCategories = (userId) => {
    const query = `SELECT * FROM categories
  WHERE user_id = $1`;
    const queryParams = [userId];
    return pool.query(query, queryParams);
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
const getUsers = () => {
    const query = 'SELECT * FROM users';
    return pool.query(query);
};
const getFontByFontId = (id) => {
    const query = `SELECT * FROM fonts
  WHERE id = $1;`;
    const queryParams = [id];
    return pool.query(query, queryParams);
};
const getFonts = () => {
    const query = 'SELECT * FROM fonts';
    return pool.query(query);
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
const insertEntry = (attributes) => {
    return insertIntoDatabase(attributes, 'entries');
};
const insertUser = (attributes) => {
    return insertIntoDatabase(attributes, 'users');
};
const updateDatabase = (attributes, identifiers) => {
    const { table, type, id } = identifiers;
    const queryParams = [];
    let query = '';
    if (type === 'delete') {
        query += `DELETE
    FROM ${table}`;
    }
    else {
        query += `UPDATE ${table}`;
        for (const [attribute, value] of Object.entries(attributes)) {
            !queryParams.length
                ? query += ' SET '
                : query += ', ';
            queryParams.push(value);
            query += `${attribute} = $${queryParams.length}`;
        }
        if (table === 'entries') {
            query += ', date_updated = NOW()';
        }
    }
    queryParams.push(id);
    query += ` WHERE id = $${queryParams.length}`;
    if (table !== 'users') {
        queryParams.push(attributes.user_id);
        query += ` AND user_id = $${queryParams.length}`;
    }
    return pool.query(query, queryParams);
};
App.use(Express.urlencoded({ extended: false }));
App.use(Express.json());
App.use(Express.static('public'));
const userId = '1';
App.get('/api/entries', (req, res) => {
    getEntriesByCategory(userId, req.query)
        .then((data) => res.json(data.rows));
});
App.get('/api/entries/:entryId', (req, res) => {
    getEntryByEntryId({ entryId: req.params.entryId, userId })
        .then((data) => res.json(data.rows));
});
App.get('/api/categories', (req, res) => {
    getCategories(userId)
        .then((data) => res.json(data.rows));
});
App.get('/api/users', (req, res) => {
    getUsers()
        .then((data) => res.json(data.rows));
});
App.get('/api/users/:id', (req, res) => {
    getUserByUserId(req.params.id)
        .then((data) => res.json(data.rows));
});
App.get('/api/fonts', (req, res) => {
    getFonts()
        .then((data) => res.json(data.rows));
});
App.get('/api/fonts/:id', (req, res) => {
    getFontByFontId(req.params.id)
        .then((data) => res.json(data.rows));
});
App.get('/api/graph/', (req, res) => {
    getGraphByUserId(userId, req.query)
        .then((data) => res.json(data.rows));
});
App.post('/api/entries', (req, res) => {
    const attributes = {
        title: req.body.title,
        content: req.body.content,
        mood: req.body.mood || null,
        privacy: req.body.privacy || true,
        user_id: req.body.userId,
        category_id: req.body.category || null
    };
    insertEntry(attributes)
        .then((data) => res.json(data.rows));
});
App.post('/api/entries/:id', (req, res) => {
    updateDatabase(req.body.params, { table: 'entries', type: 'update', id: req.params.id })
        .then((data) => res.json(data.rows));
});
App.post('/api/users/:id', (req, res) => {
    updateDatabase(req.body.params, { table: 'users', type: 'update', id: req.params.id })
        .then((data) => res.json(data.rows));
});
App.delete('/api/entries/:id', (req, res) => {
    updateDatabase(req.body, { table: 'entries', type: 'delete', id: req.params.id })
        .then((data) => res.json(data.rows));
});
App.post('/api/categories', (req, res) => {
    insertCategory({ user_id: userId, name: req.body.name })
        .then((data) => res.json(data.rows));
});
App.post('/api/users', (req, res) => {
    const attributes = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    };
    insertUser(attributes)
        .then((data) => res.json(data.rows));
});
App.listen(PORT, () => {
    console.log(`Express seems to be listening on port ${PORT} so that's pretty good 👍`);
});
