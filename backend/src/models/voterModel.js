const db = require('../config/database');

/**
 * Get all tables in the database
 */
const getAllTables = async () => {
  try {
    const result = await db.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    return result.rows;
  } catch (error) {
    console.error('Error getting tables:', error);
    throw error;
  }
};

/**
 * Get table schema
 */
const getTableSchema = async (tableName) => {
  try {
    const result = await db.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = $1
      ORDER BY ordinal_position;
    `, [tableName]);
    return result.rows;
  } catch (error) {
    console.error('Error getting table schema:', error);
    throw error;
  }
};

/**
 * Get all voters with pagination
 */
const getVoters = async (limit = 100, offset = 0) => {
  try {
    const result = await db.query(`
      SELECT * FROM voters 
      ORDER BY id 
      LIMIT $1 OFFSET $2;
    `, [limit, offset]);
    return result.rows;
  } catch (error) {
    console.error('Error getting voters:', error);
    throw error;
  }
};

/**
 * Get voter by ID
 */
const getVoterById = async (id) => {
  try {
    const result = await db.query(`
      SELECT * FROM voters WHERE id = $1;
    `, [id]);
    return result.rows[0];
  } catch (error) {
    console.error('Error getting voter by ID:', error);
    throw error;
  }
};

/**
 * Search voters by name or other criteria
 */
const searchVoters = async (searchParams) => {
  try {
    let query = `
      SELECT v.*, vb.name_np as booth_name, w.ward_number, m.name_np as municipality_name, d.name_np as district_name, p.name_np as province_name
      FROM voters v 
      LEFT JOIN voting_booths vb ON v.booth_id = vb.id 
      LEFT JOIN wards w ON vb.ward_id = w.id 
      LEFT JOIN municipalities m ON w.municipality_id = m.id 
      LEFT JOIN districts d ON m.district_id = d.id 
      LEFT JOIN provinces p ON d.province_id = p.id 
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    if (searchParams.name) {
      query += ` AND v.name_np ILIKE $${paramCount}`;
      params.push(`%${searchParams.name}%`);
      paramCount++;
    }

    if (searchParams.voter_id) {
      query += ` AND v.voter_id = $${paramCount}`;
      params.push(searchParams.voter_id);
      paramCount++;
    }

    if (searchParams.gender) {
      query += ` AND v.gender = $${paramCount}`;
      params.push(searchParams.gender);
      paramCount++;
    }

    query += ' ORDER BY v.id LIMIT 100;';

    const result = await db.query(query, params);
    return result.rows;
  } catch (error) {
    console.error('Error searching voters:', error);
    throw error;
  }
};

/**
 * Get voter statistics
 */
const getVoterStatistics = async () => {
  try {
    const totalQuery = await db.query('SELECT COUNT(*) as total FROM voters;');
    
    const byDistrictQuery = await db.query(`
      SELECT d.name_np as district_name, COUNT(v.id) as count 
      FROM voters v 
      LEFT JOIN voting_booths vb ON v.booth_id = vb.id
      LEFT JOIN wards w ON vb.ward_id = w.id
      LEFT JOIN municipalities m ON w.municipality_id = m.id
      LEFT JOIN districts d ON m.district_id = d.id
      WHERE d.name_np IS NOT NULL
      GROUP BY d.name_np 
      ORDER BY count DESC;
    `);

    const byMunicipalityQuery = await db.query(`
      SELECT m.name_np as municipality_name, COUNT(v.id) as count 
      FROM voters v
      LEFT JOIN voting_booths vb ON v.booth_id = vb.id
      LEFT JOIN wards w ON vb.ward_id = w.id
      LEFT JOIN municipalities m ON w.municipality_id = m.id
      WHERE m.name_np IS NOT NULL
      GROUP BY m.name_np 
      ORDER BY count DESC 
      LIMIT 20;
    `);

    const byGenderQuery = await db.query(`
      SELECT gender, COUNT(*) as count 
      FROM voters 
      GROUP BY gender 
      ORDER BY count DESC;
    `);

    const byAgeGroupQuery = await db.query(`
      SELECT 
        CASE 
          WHEN age < 25 THEN '18-24'
          WHEN age < 35 THEN '25-34'
          WHEN age < 45 THEN '35-44'
          WHEN age < 55 THEN '45-54'
          WHEN age < 65 THEN '55-64'
          ELSE '65+'
        END as age_group,
        COUNT(*) as count
      FROM voters
      WHERE age IS NOT NULL
      GROUP BY age_group
      ORDER BY age_group;
    `);

    return {
      total: parseInt(totalQuery.rows[0].total),
      byDistrict: byDistrictQuery.rows,
      byMunicipality: byMunicipalityQuery.rows,
      byGender: byGenderQuery.rows,
      byAgeGroup: byAgeGroupQuery.rows,
    };
  } catch (error) {
    console.error('Error getting voter statistics:', error);
    throw error;
  }
};

/**
 * Get voters by geographic location
 */
const getVotersByLocation = async (district, municipality, ward, name, voterId) => {
  try {
    let query = `
      SELECT v.*, vb.name_np as booth_name, w.ward_number, m.name_np as municipality_name, d.name_np as district_name, p.name_np as province_name
      FROM voters v
      LEFT JOIN voting_booths vb ON v.booth_id = vb.id
      LEFT JOIN wards w ON vb.ward_id = w.id
      LEFT JOIN municipalities m ON w.municipality_id = m.id
      LEFT JOIN districts d ON m.district_id = d.id
      LEFT JOIN provinces p ON d.province_id = p.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    if (district) {
      query += ` AND d.name_np ILIKE $${paramCount}`;
      params.push(`%${district}%`);
      paramCount++;
    }

    if (municipality) {
      query += ` AND m.name_np ILIKE $${paramCount}`;
      params.push(`%${municipality}%`);
      paramCount++;
    }

    if (ward) {
      query += ` AND w.ward_number = $${paramCount}`;
      params.push(parseInt(ward));
      paramCount++;
    }

    if (name) {
      query += ` AND v.name_np ILIKE $${paramCount}`;
      params.push(`%${name}%`);
      paramCount++;
    }

    if (voterId) {
      query += ` AND v.voter_id = $${paramCount}`;
      params.push(voterId);
      paramCount++;
    }

    query += ' ORDER BY v.id LIMIT 100;';

    const result = await db.query(query, params);
    return result.rows;
  } catch (error) {
    console.error('Error getting voters by location:', error);
    throw error;
  }
};

/**
 * Get statistics for a specific location (province, district, or municipality)
 */
const getLocationStatistics = async (locationType, locationName) => {
  try {
    let query = '';
    const params = [locationName];

    if (locationType === 'province') {
      query = `
        SELECT 
          COUNT(v.id) as total_voters,
          COUNT(CASE WHEN v.gender = 'पुरुष' OR v.gender = 'Male' THEN 1 END) as male_voters,
          COUNT(CASE WHEN v.gender = 'महिला' OR v.gender = 'Female' THEN 1 END) as female_voters,
          COUNT(CASE WHEN v.gender = 'अन्य' OR v.gender = 'Other' THEN 1 END) as other_voters,
          ROUND(AVG(v.age), 1) as average_age
        FROM voters v
        LEFT JOIN voting_booths vb ON v.booth_id = vb.id
        LEFT JOIN wards w ON vb.ward_id = w.id
        LEFT JOIN municipalities m ON w.municipality_id = m.id
        LEFT JOIN districts d ON m.district_id = d.id
        LEFT JOIN provinces p ON d.province_id = p.id
        WHERE p.name_np ILIKE $1 OR p.name_en ILIKE $1;
      `;
    } else if (locationType === 'district') {
      query = `
        SELECT 
          COUNT(v.id) as total_voters,
          COUNT(CASE WHEN v.gender = 'पुरुष' OR v.gender = 'Male' THEN 1 END) as male_voters,
          COUNT(CASE WHEN v.gender = 'महिला' OR v.gender = 'Female' THEN 1 END) as female_voters,
          COUNT(CASE WHEN v.gender = 'अन्य' OR v.gender = 'Other' THEN 1 END) as other_voters,
          ROUND(AVG(v.age), 1) as average_age
        FROM voters v
        LEFT JOIN voting_booths vb ON v.booth_id = vb.id
        LEFT JOIN wards w ON vb.ward_id = w.id
        LEFT JOIN municipalities m ON w.municipality_id = m.id
        LEFT JOIN districts d ON m.district_id = d.id
        WHERE d.name_np ILIKE $1 OR d.name_en ILIKE $1;
      `;
    } else if (locationType === 'municipality') {
      query = `
        SELECT 
          COUNT(v.id) as total_voters,
          COUNT(CASE WHEN v.gender = 'पुरुष' OR v.gender = 'Male' THEN 1 END) as male_voters,
          COUNT(CASE WHEN v.gender = 'महिला' OR v.gender = 'Female' THEN 1 END) as female_voters,
          COUNT(CASE WHEN v.gender = 'अन्य' OR v.gender = 'Other' THEN 1 END) as other_voters,
          ROUND(AVG(v.age), 1) as average_age
        FROM voters v
        LEFT JOIN voting_booths vb ON v.booth_id = vb.id
        LEFT JOIN wards w ON vb.ward_id = w.id
        LEFT JOIN municipalities m ON w.municipality_id = m.id
        WHERE m.name_np ILIKE $1 OR m.name_en ILIKE $1;
      `;
    }

    const result = await db.query(query, params);
    return result.rows[0] || {
      total_voters: 0,
      male_voters: 0,
      female_voters: 0,
      other_voters: 0,
      average_age: 0
    };
  } catch (error) {
    console.error('Error getting location statistics:', error);
    throw error;
  }
};

/**
 * Get election results (if available)
 */
const getElectionResults = async (municipality) => {
  try {
    let query = `
      SELECT 
        m.name_np as municipality_name,
        d.name_np as district_name,
        p.name_np as province_name,
        COUNT(v.id) as total_voters,
        SUM(CASE WHEN v.gender = 'पुरुष' THEN 1 ELSE 0 END) as male_voters,
        SUM(CASE WHEN v.gender = 'महिला' THEN 1 ELSE 0 END) as female_voters,
        ROUND(AVG(v.age), 2) as average_age
      FROM voters v
      LEFT JOIN voting_booths vb ON v.booth_id = vb.id
      LEFT JOIN wards w ON vb.ward_id = w.id
      LEFT JOIN municipalities m ON w.municipality_id = m.id
      LEFT JOIN districts d ON m.district_id = d.id
      LEFT JOIN provinces p ON d.province_id = p.id
      WHERE 1=1
    `;
    const params = [];

    if (municipality) {
      query += ' AND m.name_np ILIKE $1';
      params.push(`%${municipality}%`);
    }

    query += ' GROUP BY m.name_np, d.name_np, p.name_np ORDER BY total_voters DESC LIMIT 50;';

    const result = await db.query(query, params);
    return result.rows;
  } catch (error) {
    console.error('Error getting election results:', error);
    throw error;
  }
};

module.exports = {
  getAllTables,
  getTableSchema,
  getVoters,
  getVoterById,
  searchVoters,
  getVoterStatistics,
  getVotersByLocation,
  getLocationStatistics,
  getElectionResults,
};
