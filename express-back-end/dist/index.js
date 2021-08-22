import Express from "express";
const App = Express();
import pool from "./db/index";

import { getCategories, insertCategory } from "./models/categories";
import getEntriesByCategory from "./models/entries";
import { getEntryByEntryId, insertEntry } from "./models/entry";
import { getFontByFontId, getFonts } from "./models/font";
import getGraphByUserId from "./models/graph";
import { getUsers, getUserByUserId, insertUser } from "./models/user";


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
