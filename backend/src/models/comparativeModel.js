const db = require('../config/database');

/**
 * Compare multiple regions (provinces, districts, or municipalities)
 */
const compareRegions = async (type, regions) => {
  try {
    let table = '';
    let joinClause = '';
    
    switch (type) {
      case 'province':
        table = 'provinces p';
        joinClause = 'LEFT JOIN provinces p ON d.province_id = p.id';
        break;
      case 'district':
        table = 'districts d';
        joinClause = 'LEFT JOIN districts d ON m.district_id = d.id';
        break;
      case 'municipality':
        table = 'municipalities m';
        joinClause = 'LEFT JOIN municipalities m ON w.municipality_id = m.id';
        break;
      default:
        throw new Error('Invalid type. Must be province, district, or municipality');
    }

    const placeholders = regions.map((_, index) => `$${index + 1}`).join(',');
    
    let query = '';
    if (type === 'province') {
      query = `
        SELECT 
          p.name_np as region_name,
          COUNT(v.id) as total_voters,
          COUNT(CASE WHEN v.gender = 'पुरुष' OR v.gender = 'Male' THEN 1 END) as male_voters,
          COUNT(CASE WHEN v.gender = 'महिला' OR v.gender = 'Female' THEN 1 END) as female_voters,
          COUNT(CASE WHEN v.gender = 'अन्य' OR v.gender = 'Other' THEN 1 END) as other_voters,
          ROUND(AVG(v.age), 1) as average_age,
          MIN(v.age) as min_age,
          MAX(v.age) as max_age,
          COUNT(DISTINCT d.id) as districts,
          COUNT(DISTINCT m.id) as municipalities
        FROM voters v
        LEFT JOIN voting_booths vb ON v.booth_id = vb.id
        LEFT JOIN wards w ON vb.ward_id = w.id
        LEFT JOIN municipalities m ON w.municipality_id = m.id
        LEFT JOIN districts d ON m.district_id = d.id
        LEFT JOIN provinces p ON d.province_id = p.id
        WHERE p.name_np IN (${placeholders})
        GROUP BY p.name_np
        ORDER BY total_voters DESC;
      `;
    } else if (type === 'district') {
      query = `
        SELECT 
          d.name_np as region_name,
          p.name_np as province_name,
          COUNT(v.id) as total_voters,
          COUNT(CASE WHEN v.gender = 'पुरुष' OR v.gender = 'Male' THEN 1 END) as male_voters,
          COUNT(CASE WHEN v.gender = 'महिला' OR v.gender = 'Female' THEN 1 END) as female_voters,
          COUNT(CASE WHEN v.gender = 'अन्य' OR v.gender = 'Other' THEN 1 END) as other_voters,
          ROUND(AVG(v.age), 1) as average_age,
          MIN(v.age) as min_age,
          MAX(v.age) as max_age,
          COUNT(DISTINCT m.id) as municipalities
        FROM voters v
        LEFT JOIN voting_booths vb ON v.booth_id = vb.id
        LEFT JOIN wards w ON vb.ward_id = w.id
        LEFT JOIN municipalities m ON w.municipality_id = m.id
        LEFT JOIN districts d ON m.district_id = d.id
        LEFT JOIN provinces p ON d.province_id = p.id
        WHERE d.name_np IN (${placeholders})
        GROUP BY d.name_np, p.name_np
        ORDER BY total_voters DESC;
      `;
    } else {
      query = `
        SELECT 
          m.name_np as region_name,
          d.name_np as district_name,
          p.name_np as province_name,
          COUNT(v.id) as total_voters,
          COUNT(CASE WHEN v.gender = 'पुरुष' OR v.gender = 'Male' THEN 1 END) as male_voters,
          COUNT(CASE WHEN v.gender = 'महिला' OR v.gender = 'Female' THEN 1 END) as female_voters,
          COUNT(CASE WHEN v.gender = 'अन्य' OR v.gender = 'Other' THEN 1 END) as other_voters,
          ROUND(AVG(v.age), 1) as average_age,
          MIN(v.age) as min_age,
          MAX(v.age) as max_age,
          COUNT(DISTINCT w.id) as wards
        FROM voters v
        LEFT JOIN voting_booths vb ON v.booth_id = vb.id
        LEFT JOIN wards w ON vb.ward_id = w.id
        LEFT JOIN municipalities m ON w.municipality_id = m.id
        LEFT JOIN districts d ON m.district_id = d.id
        LEFT JOIN provinces p ON d.province_id = p.id
        WHERE m.name_np IN (${placeholders})
        GROUP BY m.name_np, d.name_np, p.name_np
        ORDER BY total_voters DESC;
      `;
    }

    const params = regions;
    const result = await db.query(query, params);
    
    // Calculate additional metrics
    return result.rows.map(row => ({
      ...row,
      total_voters: parseInt(row.total_voters),
      male_voters: parseInt(row.male_voters),
      female_voters: parseInt(row.female_voters),
      other_voters: parseInt(row.other_voters),
      gender_ratio: row.female_voters > 0 ? (row.male_voters / row.female_voters).toFixed(3) : null,
      male_percentage: ((row.male_voters / row.total_voters) * 100).toFixed(2),
      female_percentage: ((row.female_voters / row.total_voters) * 100).toFixed(2),
    }));
  } catch (error) {
    console.error('Error comparing regions:', error);
    throw error;
  }
};

/**
 * Compare demographics across all regions
 */
const compareDemographics = async (regions) => {
  try {
    // Get demographic breakdown for each region
    const comparisons = await Promise.all(
      regions.map(async (region) => {
        const result = await db.query(`
          SELECT 
            COUNT(v.id) as total_voters,
            COUNT(CASE WHEN v.gender = 'पुरुष' THEN 1 END) as male,
            COUNT(CASE WHEN v.gender = 'महिला' THEN 1 END) as female,
            COUNT(CASE WHEN v.age < 25 THEN 1 END) as age_under_25,
            COUNT(CASE WHEN v.age BETWEEN 25 AND 34 THEN 1 END) as age_25_34,
            COUNT(CASE WHEN v.age BETWEEN 35 AND 44 THEN 1 END) as age_35_44,
            COUNT(CASE WHEN v.age BETWEEN 45 AND 54 THEN 1 END) as age_45_54,
            COUNT(CASE WHEN v.age BETWEEN 55 AND 64 THEN 1 END) as age_55_64,
            COUNT(CASE WHEN v.age >= 65 THEN 1 END) as age_65_plus,
            ROUND(AVG(v.age), 1) as avg_age
          FROM voters v
          LEFT JOIN voting_booths vb ON v.booth_id = vb.id
          LEFT JOIN wards w ON vb.ward_id = w.id
          LEFT JOIN municipalities m ON w.municipality_id = m.id
          LEFT JOIN districts d ON m.district_id = d.id
          WHERE d.name_np = $1;
        `, [region]);
        
        return {
          region,
          ...result.rows[0],
        };
      })
    );
    
    return comparisons;
  } catch (error) {
    console.error('Error comparing demographics:', error);
    throw error;
  }
};

/**
 * Compare age distribution across districts
 */
const compareAgeDistribution = async (districts) => {
  try {
    let whereClause = '';
    const params = [];
    
    if (districts && districts.length > 0) {
      const placeholders = districts.map((_, index) => `$${index + 1}`).join(',');
      whereClause = `WHERE d.name_np IN (${placeholders})`;
      params.push(...districts);
    }
    
    const query = `
      SELECT 
        d.name_np as district,
        CASE 
          WHEN v.age < 25 THEN '18-24'
          WHEN v.age < 35 THEN '25-34'
          WHEN v.age < 45 THEN '35-44'
          WHEN v.age < 55 THEN '45-54'
          WHEN v.age < 65 THEN '55-64'
          ELSE '65+'
        END as age_group,
        COUNT(*) as count
      FROM voters v
      LEFT JOIN voting_booths vb ON v.booth_id = vb.id
      LEFT JOIN wards w ON vb.ward_id = w.id
      LEFT JOIN municipalities m ON w.municipality_id = m.id
      LEFT JOIN districts d ON m.district_id = d.id
      ${whereClause}
      GROUP BY d.name_np, age_group
      ORDER BY d.name_np, age_group;
    `;
    
    const result = await db.query(query, params);
    
    // Organize data by district
    const organized = {};
    result.rows.forEach(row => {
      if (!organized[row.district]) {
        organized[row.district] = [];
      }
      organized[row.district].push({
        age_group: row.age_group,
        count: parseInt(row.count),
      });
    });
    
    return organized;
  } catch (error) {
    console.error('Error comparing age distribution:', error);
    throw error;
  }
};

/**
 * Compare gender ratio across regions
 */
const compareGenderRatio = async (type = 'district') => {
  try {
    let groupBy = 'd.name_np';
    let selectName = 'd.name_np as name';
    let joinClause = `
      LEFT JOIN voting_booths vb ON v.booth_id = vb.id
      LEFT JOIN wards w ON vb.ward_id = w.id
      LEFT JOIN municipalities m ON w.municipality_id = m.id
      LEFT JOIN districts d ON m.district_id = d.id
    `;
    
    if (type === 'province') {
      groupBy = 'p.name_np';
      selectName = 'p.name_np as name';
      joinClause += ' LEFT JOIN provinces p ON d.province_id = p.id';
    } else if (type === 'municipality') {
      groupBy = 'm.name_np';
      selectName = 'm.name_np as name';
    }
    
    const query = `
      SELECT 
        ${selectName},
        COUNT(v.id) as total,
        COUNT(CASE WHEN v.gender = 'पुरुष' OR v.gender = 'Male' THEN 1 END) as male,
        COUNT(CASE WHEN v.gender = 'महिला' OR v.gender = 'Female' THEN 1 END) as female,
        ROUND(
          CAST(COUNT(CASE WHEN v.gender = 'पुरुष' OR v.gender = 'Male' THEN 1 END) AS DECIMAL) / 
          NULLIF(COUNT(CASE WHEN v.gender = 'महिला' OR v.gender = 'Female' THEN 1 END), 0), 
          3
        ) as gender_ratio
      FROM voters v
      ${joinClause}
      WHERE ${groupBy} IS NOT NULL
      GROUP BY ${groupBy}
      ORDER BY gender_ratio DESC
      LIMIT 50;
    `;
    
    const result = await db.query(query);
    return result.rows.map(row => ({
      ...row,
      total: parseInt(row.total),
      male: parseInt(row.male),
      female: parseInt(row.female),
      male_percentage: ((row.male / row.total) * 100).toFixed(2),
      female_percentage: ((row.female / row.total) * 100).toFixed(2),
    }));
  } catch (error) {
    console.error('Error comparing gender ratio:', error);
    throw error;
  }
};

/**
 * Get comprehensive province comparison
 */
const getProvinceComparison = async () => {
  try {
    const query = `
      SELECT 
        p.name_np as province,
        COUNT(DISTINCT d.id) as total_districts,
        COUNT(DISTINCT m.id) as total_municipalities,
        COUNT(DISTINCT w.id) as total_wards,
        COUNT(v.id) as total_voters,
        COUNT(CASE WHEN v.gender = 'पुरुष' THEN 1 END) as male_voters,
        COUNT(CASE WHEN v.gender = 'महिला' THEN 1 END) as female_voters,
        COUNT(CASE WHEN v.gender = 'अन्य' THEN 1 END) as other_voters,
        ROUND(AVG(v.age), 1) as average_age,
        COUNT(CASE WHEN v.age < 25 THEN 1 END) as voters_under_25,
        COUNT(CASE WHEN v.age BETWEEN 25 AND 40 THEN 1 END) as voters_25_40,
        COUNT(CASE WHEN v.age BETWEEN 41 AND 60 THEN 1 END) as voters_41_60,
        COUNT(CASE WHEN v.age > 60 THEN 1 END) as voters_over_60
      FROM voters v
      LEFT JOIN voting_booths vb ON v.booth_id = vb.id
      LEFT JOIN wards w ON vb.ward_id = w.id
      LEFT JOIN municipalities m ON w.municipality_id = m.id
      LEFT JOIN districts d ON m.district_id = d.id
      LEFT JOIN provinces p ON d.province_id = p.id
      WHERE p.name_np IS NOT NULL
      GROUP BY p.name_np
      ORDER BY p.id;
    `;
    
    const result = await db.query(query);
    
    // Calculate additional metrics
    const totalVoters = result.rows.reduce((sum, row) => sum + parseInt(row.total_voters), 0);
    
    return result.rows.map(row => ({
      ...row,
      total_voters: parseInt(row.total_voters),
      male_voters: parseInt(row.male_voters),
      female_voters: parseInt(row.female_voters),
      other_voters: parseInt(row.other_voters),
      gender_ratio: row.female_voters > 0 ? (row.male_voters / row.female_voters).toFixed(3) : null,
      percentage_of_total: ((row.total_voters / totalVoters) * 100).toFixed(2),
      voters_per_district: (row.total_voters / row.total_districts).toFixed(0),
      voters_per_municipality: (row.total_voters / row.total_municipalities).toFixed(0),
    }));
  } catch (error) {
    console.error('Error getting province comparison:', error);
    throw error;
  }
};

/**
 * Get district rankings by various metrics
 */
const getDistrictRankings = async (metric = 'total_voters', limit = 20) => {
  try {
    const validMetrics = ['total_voters', 'gender_ratio', 'average_age', 'male_voters', 'female_voters'];
    if (!validMetrics.includes(metric)) {
      metric = 'total_voters';
    }
    
    let orderClause = 'total_voters DESC';
    if (metric === 'gender_ratio') {
      orderClause = 'gender_ratio DESC';
    } else if (metric === 'average_age') {
      orderClause = 'average_age DESC';
    } else if (metric === 'male_voters') {
      orderClause = 'male_voters DESC';
    } else if (metric === 'female_voters') {
      orderClause = 'female_voters DESC';
    }
    
    const query = `
      SELECT 
        d.name_np as district,
        p.name_np as province,
        COUNT(v.id) as total_voters,
        COUNT(CASE WHEN v.gender = 'पुरुष' THEN 1 END) as male_voters,
        COUNT(CASE WHEN v.gender = 'महिला' THEN 1 END) as female_voters,
        ROUND(AVG(v.age), 1) as average_age,
        ROUND(
          CAST(COUNT(CASE WHEN v.gender = 'पुरुष' THEN 1 END) AS DECIMAL) / 
          NULLIF(COUNT(CASE WHEN v.gender = 'महिला' THEN 1 END), 0), 
          3
        ) as gender_ratio,
        COUNT(DISTINCT m.id) as municipalities
      FROM voters v
      LEFT JOIN voting_booths vb ON v.booth_id = vb.id
      LEFT JOIN wards w ON vb.ward_id = w.id
      LEFT JOIN municipalities m ON w.municipality_id = m.id
      LEFT JOIN districts d ON m.district_id = d.id
      LEFT JOIN provinces p ON d.province_id = p.id
      WHERE d.name_np IS NOT NULL
      GROUP BY d.name_np, p.name_np
      ORDER BY ${orderClause}
      LIMIT $1;
    `;
    
    const result = await db.query(query, [limit]);
    
    return result.rows.map((row, index) => ({
      rank: index + 1,
      ...row,
      total_voters: parseInt(row.total_voters),
      male_voters: parseInt(row.male_voters),
      female_voters: parseInt(row.female_voters),
    }));
  } catch (error) {
    console.error('Error getting district rankings:', error);
    throw error;
  }
};

/**
 * Compare turnout (placeholder - implement when turnout data is available)
 */
const compareTurnout = async (regions) => {
  // This would require turnout data in the database
  // For now, return placeholder data
  return {
    message: 'Turnout comparison not yet implemented',
    regions,
  };
};

/**
 * Get comprehensive dashboard comparative statistics
 */
const getDashboardComparativeStats = async () => {
  try {
    // Get province comparison
    const provinces = await getProvinceComparison();
    
    // Get top 10 districts by voter count
    const topDistricts = await getDistrictRankings('total_voters', 10);
    
    // Get gender ratio comparison across provinces
    const genderComparison = await compareGenderRatio('province');
    
    // Get overall age distribution
    const ageDistributionQuery = await db.query(`
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
    
    // Get overall statistics
    const overallQuery = await db.query(`
      SELECT 
        COUNT(*) as total_voters,
        COUNT(CASE WHEN gender = 'पुरुष' THEN 1 END) as male_voters,
        COUNT(CASE WHEN gender = 'महिला' THEN 1 END) as female_voters,
        COUNT(CASE WHEN gender = 'अन्य' THEN 1 END) as other_voters,
        ROUND(AVG(age), 1) as average_age,
        MIN(age) as min_age,
        MAX(age) as max_age
      FROM voters;
    `);
    
    return {
      overall: overallQuery.rows[0],
      provinces,
      topDistricts,
      genderComparison,
      ageDistribution: ageDistributionQuery.rows,
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error getting dashboard comparative stats:', error);
    throw error;
  }
};

module.exports = {
  compareRegions,
  compareDemographics,
  compareAgeDistribution,
  compareGenderRatio,
  getProvinceComparison,
  getDistrictRankings,
  compareTurnout,
  getDashboardComparativeStats,
};
