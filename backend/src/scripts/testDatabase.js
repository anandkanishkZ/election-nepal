/**
 * Database Connection Test Script
 * Run this to verify your database connection is working
 */

require('dotenv').config();
const db = require('../config/database');
const voterModel = require('../models/voterModel');

async function testDatabase() {
  console.log('='.repeat(60));
  console.log('🗄️  Database Connection Test');
  console.log('='.repeat(60));
  console.log();

  try {
    // Test 1: Basic Connection
    console.log('Test 1: Testing basic database connection...');
    const connected = await db.testConnection();
    if (connected) {
      console.log('✓ Database connection successful!\n');
    } else {
      throw new Error('Connection failed');
    }

    // Test 2: Get All Tables
    console.log('Test 2: Fetching all tables...');
    const tables = await voterModel.getAllTables();
    console.log(`✓ Found ${tables.length} tables:`);
    tables.forEach(t => console.log(`  - ${t.table_name}`));
    console.log();

    // Test 3: Get Voters Table Schema (if exists)
    if (tables.some(t => t.table_name === 'voters')) {
      console.log('Test 3: Getting voters table schema...');
      const schema = await voterModel.getTableSchema('voters');
      console.log(`✓ Voters table has ${schema.length} columns:`);
      schema.forEach(col => {
        console.log(`  - ${col.column_name} (${col.data_type})`);
      });
      console.log();

      // Test 4: Get Sample Voters
      console.log('Test 4: Fetching sample voters (limit 5)...');
      const voters = await voterModel.getVoters(5, 0);
      console.log(`✓ Retrieved ${voters.length} voters`);
      if (voters.length > 0) {
        console.log('Sample voter data:');
        console.log(JSON.stringify(voters[0], null, 2));
      }
      console.log();

      // Test 5: Get Statistics
      console.log('Test 5: Getting voter statistics...');
      const stats = await voterModel.getVoterStatistics();
      console.log(`✓ Total voters: ${stats.total}`);
      console.log(`✓ Districts: ${stats.byDistrict?.length || 0}`);
      console.log(`✓ Top municipalities: ${stats.byMunicipality?.length || 0}`);
      console.log(`✓ Gender breakdown: ${stats.byGender?.length || 0}`);
      console.log(`✓ Age groups: ${stats.byAgeGroup?.length || 0}`);
      console.log();
    } else {
      console.log('⚠️  Warning: "voters" table not found in database');
      console.log('   Available tables:', tables.map(t => t.table_name).join(', '));
      console.log();
    }

    console.log('='.repeat(60));
    console.log('✅ All tests completed successfully!');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('❌ Error during testing:');
    console.error(error);
    console.log();
    console.log('Troubleshooting:');
    console.log('1. Check if PostgreSQL is running');
    console.log('2. Verify database credentials in .env file');
    console.log('3. Ensure database "voter_db" exists');
    console.log('4. Check if user has proper permissions');
    console.log();
    console.log('Current configuration:');
    console.log(`  DB_HOST: ${process.env.DB_HOST || 'localhost'}`);
    console.log(`  DB_PORT: ${process.env.DB_PORT || '5432'}`);
    console.log(`  DB_NAME: ${process.env.DB_NAME || 'voter_db'}`);
    console.log(`  DB_USER: ${process.env.DB_USER || 'postgres'}`);
    console.log('='.repeat(60));
  } finally {
    // Close database connection
    await db.pool.end();
    console.log('Database connection closed.');
    process.exit(0);
  }
}

// Run the test
testDatabase();
