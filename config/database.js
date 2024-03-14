const { Pool } = require('pg');

// const pool = createPool({
//   port: process.env.DB_PORT,
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.MYSQL_DB,
//   connectionLimit: 50,
//   ssl: { rejectUnauthorized: true },
// });

const pool = new Pool({
  user: 'postgres.ztajcwozibbfkendjijo',
  host: 'aws-0-ap-southeast-1.pooler.supabase.com',
  database: 'postgres',
  password: 'AyalaErickaMeh@129',
  port: 5432,
});

module.exports = pool;
