const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'voter_db',
  user: 'postgres',
  password: 'admin123'
});

pool.query('SELECT column_name, data_type FROM information_schema.columns WHERE table_name = $1 ORDER BY ordinal_position', ['voters'])
  .then(res => {
    console.log(JSON.stringify(res.rows, null, 2));
    pool.end();
  })
  .catch(err => {
    console.error(err);
    pool.end();
  });
