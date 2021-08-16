import { Pool } from "pg";
import dotenv from 'dotenv';

const PORT = 8080;

dotenv.config();

const pool = new Pool({ 
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: PORT
});

pool.connect()
    .catch(err => console.log(`Error connecting to Postgres server:\n${err}`));

export default pool;
