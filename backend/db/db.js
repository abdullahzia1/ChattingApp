import pg from "pg";

const Pool = pg.Pool;

const pool = new Pool({
  user: "postgres",
  password: "123456",
  host: "localhost",
  port: 5001,
  database: "chatapp",
});

export default pool;
