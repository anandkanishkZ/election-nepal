const db = require('../config/database');

/**
 * Get all provinces with their boundaries (GeoJSON)
 */
const getProvinces = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        id,
        name_np
      FROM provinces
      ORDER BY id;
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching provinces:', error);
    res.status(500).json({ 
      error: 'Failed to fetch provinces',
      details: error.message 
    });
  }
};

/**
 * Get districts within a specific province
 */
const getDistrictsByProvince = async (req, res) => {
  try {
    const { provinceId } = req.params;

    const result = await db.query(`
      SELECT 
        d.id,
        d.name_np,
        d.province_id
      FROM districts d
      WHERE d.province_id = $1
      ORDER BY d.name_np;
    `, [provinceId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching districts:', error);
    res.status(500).json({ 
      error: 'Failed to fetch districts',
      details: error.message 
    });
  }
};

/**
 * Get municipalities within a specific district
 */
const getMunicipalitiesByDistrict = async (req, res) => {
  try {
    const { districtId } = req.params;

    const result = await db.query(`
      SELECT 
        m.id,
        m.name_np,
        m.district_id
      FROM municipalities m
      WHERE m.district_id = $1
      ORDER BY m.name_np;
    `, [districtId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching municipalities:', error);
    res.status(500).json({ 
      error: 'Failed to fetch municipalities',
      details: error.message 
    });
  }
};

/**
 * Get wards within a specific municipality
 */
const getWardsByMunicipality = async (req, res) => {
  try {
    const { municipalityId } = req.params;

    const result = await db.query(`
      SELECT 
        w.id,
        w.ward_number,
        w.municipality_id
      FROM wards w
      WHERE w.municipality_id = $1
      ORDER BY w.ward_number;
    `, [municipalityId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching wards:', error);
    res.status(500).json({ 
      error: 'Failed to fetch wards',
      details: error.message 
    });
  }
};

/**
 * Get voter statistics for a specific location
 */
const getLocationStats = async (req, res) => {
  try {
    const { level, id } = req.params;

    let query;
    let params = [id];

    switch (level) {
      case 'province':
        query = `
          SELECT 
            COUNT(DISTINCT v.id) as total_voters,
            COUNT(DISTINCT d.id) as total_districts,
            COUNT(DISTINCT m.id) as total_municipalities,
            COUNT(DISTINCT vb.id) as total_booths
          FROM voters v
          JOIN voting_booths vb ON v.booth_id = vb.id
          JOIN wards w ON vb.ward_id = w.id
          JOIN municipalities m ON w.municipality_id = m.id
          JOIN districts d ON m.district_id = d.id
          WHERE d.province_id = $1;
        `;
        break;
      
      case 'district':
        query = `
          SELECT 
            COUNT(DISTINCT v.id) as total_voters,
            COUNT(DISTINCT m.id) as total_municipalities,
            COUNT(DISTINCT vb.id) as total_booths
          FROM voters v
          JOIN voting_booths vb ON v.booth_id = vb.id
          JOIN wards w ON vb.ward_id = w.id
          JOIN municipalities m ON w.municipality_id = m.id
          WHERE m.district_id = $1;
        `;
        break;
      
      case 'municipality':
        query = `
          SELECT 
            COUNT(DISTINCT v.id) as total_voters,
            COUNT(DISTINCT w.id) as total_wards,
            COUNT(DISTINCT vb.id) as total_booths,
            COUNT(CASE WHEN v.gender = 'पुरुष' THEN 1 END) as male_voters,
            COUNT(CASE WHEN v.gender = 'महिला' THEN 1 END) as female_voters,
            COUNT(CASE WHEN v.gender = 'अन्य' THEN 1 END) as other_voters
          FROM voters v
          JOIN voting_booths vb ON v.booth_id = vb.id
          JOIN wards w ON vb.ward_id = w.id
          WHERE w.municipality_id = $1;
        `;
        break;
      
      case 'ward':
        query = `
          SELECT 
            COUNT(DISTINCT v.id) as total_voters,
            COUNT(DISTINCT vb.id) as total_booths,
            COUNT(CASE WHEN v.gender = 'पुरुष' THEN 1 END) as male_voters,
            COUNT(CASE WHEN v.gender = 'महिला' THEN 1 END) as female_voters,
            COUNT(CASE WHEN v.gender = 'अन्य' THEN 1 END) as other_voters,
            ROUND(AVG(v.age), 2) as average_age
          FROM voters v
          JOIN voting_booths vb ON v.booth_id = vb.id
          WHERE vb.ward_id = $1;
        `;
        break;
      
      default:
        return res.status(400).json({ 
          error: 'Invalid level. Use: province, district, municipality, or ward' 
        });
    }

    const result = await db.query(query, params);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching location stats:', error);
    res.status(500).json({ 
      error: 'Failed to fetch location statistics',
      details: error.message 
    });
  }
};

module.exports = {
  getProvinces,
  getDistrictsByProvince,
  getMunicipalitiesByDistrict,
  getWardsByMunicipality,
  getLocationStats
};
