import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new pg.Pool({
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
})

pool.connect()
  .then(() => console.log("Connected to Postgres server"))
  .catch((e: string) => console.log(`Error connection to postgres server:\n${e}`)) 

export default pool;