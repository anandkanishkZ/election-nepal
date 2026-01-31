require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function checkSchema() {
  try {
    console.log('\nChecking table schemas...\n');
    
    const tables = ['districts', 'municipalities', 'provinces', 'wards', 'voting_booths'];
    
    for (const table of tables) {
      const result = await pool.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = $1 
        ORDER BY ordinal_position
      `, [table]);
      
      console.log(`${table.toUpperCase()} table:`);
      result.rows.forEach(col => {
        console.log(`  - ${col.column_name} (${col.data_type})`);
      });
      console.log('');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkSchema();
