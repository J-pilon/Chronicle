import pg from 'pg';
// const { Pool } = require('pg');
import dotenv from 'dotenv';

dotenv.config();

const pool = new pg.Pool({ 
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT
});

pool.connect()
    .then(() => console.log("connected to postgres!"))
    .catch(err => console.log(`Error connecting to Postgres server:\n${err}`));

export default pool;
