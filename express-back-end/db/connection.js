import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new pg.pool({
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
})

pool.connect()
  .then(() => console.log("Connected to Postgres server"))
  .catch(err => console.log(`Error connection to postgres server:\n${err}`)) 

export default pool;