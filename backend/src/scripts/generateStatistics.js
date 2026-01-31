/**
 * Generate static JSON files with pre-calculated statistics
 * Run this script whenever voter data is updated
 */

const fs = require('fs').promises;
const path = require('path');
const db = require('../config/database');

const OUTPUT_DIR = path.join(__dirname, '../../../frontend/public/statistics');

/**
 * Generate statistics for all provinces
 */
async function generateProvinceStats() {
  console.log('Generating province statistics...');
  
  const query = `
    SELECT 
      p.id,
      p.name_np,
      COUNT(v.id) as total_voters,
      COUNT(CASE WHEN v.gender = 'पुरुष' OR v.gender = 'Male' THEN 1 END) as male_voters,
      COUNT(CASE WHEN v.gender = 'महिला' OR v.gender = 'Female' THEN 1 END) as female_voters,
      COUNT(CASE WHEN v.gender = 'अन्य' OR v.gender = 'Other' THEN 1 END) as other_voters,
      ROUND(AVG(v.age), 1) as average_age,
      MIN(v.age) as min_age,
      MAX(v.age) as max_age
    FROM provinces p
    LEFT JOIN districts d ON d.province_id = p.id
    LEFT JOIN municipalities m ON m.district_id = d.id
    LEFT JOIN wards w ON w.municipality_id = m.id
    LEFT JOIN voting_booths vb ON vb.ward_id = w.id
    LEFT JOIN voters v ON v.booth_id = vb.id
    GROUP BY p.id, p.name_np
    ORDER BY p.id;
  `;

  const result = await db.query(query);
  const stats = {};

  result.rows.forEach(row => {
    const key = row.name_np || `Province ${row.id}`;
    stats[key] = {
      total_voters: parseInt(row.total_voters) || 0,
      male_voters: parseInt(row.male_voters) || 0,
      female_voters: parseInt(row.female_voters) || 0,
      other_voters: parseInt(row.other_voters) || 0,
      average_age: parseFloat(row.average_age) || 0,
      min_age: parseInt(row.min_age) || 0,
      max_age: parseInt(row.max_age) || 0
    };
  });

  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await fs.writeFile(
    path.join(OUTPUT_DIR, 'provinces.json'),
    JSON.stringify(stats, null, 2)
  );

  console.log(`✓ Generated statistics for ${Object.keys(stats).length} provinces`);
  return stats;
}

/**
 * Generate statistics for all districts
 */
async function generateDistrictStats() {
  console.log('Generating district statistics...');
  
  const query = `
    SELECT 
      d.id,
      d.name_np,
      p.name_np as province_name,
      COUNT(v.id) as total_voters,
      COUNT(CASE WHEN v.gender = 'पुरुष' OR v.gender = 'Male' THEN 1 END) as male_voters,
      COUNT(CASE WHEN v.gender = 'महिला' OR v.gender = 'Female' THEN 1 END) as female_voters,
      COUNT(CASE WHEN v.gender = 'अन्य' OR v.gender = 'Other' THEN 1 END) as other_voters,
      ROUND(AVG(v.age), 1) as average_age,
      MIN(v.age) as min_age,
      MAX(v.age) as max_age
    FROM districts d
    LEFT JOIN provinces p ON p.id = d.province_id
    LEFT JOIN municipalities m ON m.district_id = d.id
    LEFT JOIN wards w ON w.municipality_id = m.id
    LEFT JOIN voting_booths vb ON vb.ward_id = w.id
    LEFT JOIN voters v ON v.booth_id = vb.id
    GROUP BY d.id, d.name_np, p.name_np
    ORDER BY d.name_np;
  `;

  const result = await db.query(query);
  const stats = {};

  result.rows.forEach(row => {
    const key = row.name_np || `District ${row.id}`;
    stats[key] = {
      province: row.province_name,
      total_voters: parseInt(row.total_voters) || 0,
      male_voters: parseInt(row.male_voters) || 0,
      female_voters: parseInt(row.female_voters) || 0,
      other_voters: parseInt(row.other_voters) || 0,
      average_age: parseFloat(row.average_age) || 0,
      min_age: parseInt(row.min_age) || 0,
      max_age: parseInt(row.max_age) || 0
    };
  });

  await fs.writeFile(
    path.join(OUTPUT_DIR, 'districts.json'),
    JSON.stringify(stats, null, 2)
  );

  console.log(`✓ Generated statistics for ${Object.keys(stats).length} districts`);
  return stats;
}

/**
 * Generate statistics for all municipalities
 */
async function generateMunicipalityStats() {
  console.log('Generating municipality statistics...');
  
  const query = `
    SELECT 
      m.id,
      m.name_np,
      d.name_np as district_name,
      p.name_np as province_name,
      COUNT(v.id) as total_voters,
      COUNT(CASE WHEN v.gender = 'पुरुष' OR v.gender = 'Male' THEN 1 END) as male_voters,
      COUNT(CASE WHEN v.gender = 'महिला' OR v.gender = 'Female' THEN 1 END) as female_voters,
      COUNT(CASE WHEN v.gender = 'अन्य' OR v.gender = 'Other' THEN 1 END) as other_voters,
      ROUND(AVG(v.age), 1) as average_age,
      MIN(v.age) as min_age,
      MAX(v.age) as max_age
    FROM municipalities m
    LEFT JOIN districts d ON d.id = m.district_id
    LEFT JOIN provinces p ON p.id = d.province_id
    LEFT JOIN wards w ON w.municipality_id = m.id
    LEFT JOIN voting_booths vb ON vb.ward_id = w.id
    LEFT JOIN voters v ON v.booth_id = vb.id
    GROUP BY m.id, m.name_np, d.name_np, p.name_np
    ORDER BY m.name_np;
  `;

  const result = await db.query(query);
  const stats = {};

  result.rows.forEach(row => {
    // Use "Municipality, District" format to handle duplicates
    const key = `${row.name_np}, ${row.district_name}`;
    stats[key] = {
      district: row.district_name,
      province: row.province_name,
      total_voters: parseInt(row.total_voters) || 0,
      male_voters: parseInt(row.male_voters) || 0,
      female_voters: parseInt(row.female_voters) || 0,
      other_voters: parseInt(row.other_voters) || 0,
      average_age: parseFloat(row.average_age) || 0,
      min_age: parseInt(row.min_age) || 0,
      max_age: parseInt(row.max_age) || 0
    };
  });

  await fs.writeFile(
    path.join(OUTPUT_DIR, 'municipalities.json'),
    JSON.stringify(stats, null, 2)
  );

  console.log(`✓ Generated statistics for ${Object.keys(stats).length} municipalities`);
  return stats;
}

/**
 * Generate aggregate statistics
 */
async function generateAggregateStats(provinceStats, districtStats, municipalityStats) {
  console.log('Generating aggregate statistics...');
  
  const aggregate = {
    totalProvinces: Object.keys(provinceStats).length,
    totalDistricts: Object.keys(districtStats).length,
    totalMunicipalities: Object.keys(municipalityStats).length,
    totalVoters: Object.values(provinceStats).reduce((sum, p) => sum + p.total_voters, 0),
    totalMaleVoters: Object.values(provinceStats).reduce((sum, p) => sum + p.male_voters, 0),
    totalFemaleVoters: Object.values(provinceStats).reduce((sum, p) => sum + p.female_voters, 0),
    generatedAt: new Date().toISOString()
  };

  await fs.writeFile(
    path.join(OUTPUT_DIR, 'aggregate.json'),
    JSON.stringify(aggregate, null, 2)
  );

  console.log('✓ Generated aggregate statistics');
  return aggregate;
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log('=================================');
    console.log('Statistics Generation Started');
    console.log('=================================\n');

    const startTime = Date.now();

    const provinceStats = await generateProvinceStats();
    const districtStats = await generateDistrictStats();
    const municipalityStats = await generateMunicipalityStats();
    const aggregate = await generateAggregateStats(provinceStats, districtStats, municipalityStats);

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log('\n=================================');
    console.log('Statistics Generation Complete');
    console.log('=================================');
    console.log(`Duration: ${duration} seconds`);
    console.log(`Output: ${OUTPUT_DIR}`);
    console.log(`Total Voters: ${aggregate.totalVoters.toLocaleString()}`);
    console.log('\nFiles generated:');
    console.log('  • provinces.json');
    console.log('  • districts.json');
    console.log('  • municipalities.json');
    console.log('  • aggregate.json');

    process.exit(0);
  } catch (error) {
    console.error('Error generating statistics:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { generateProvinceStats, generateDistrictStats, generateMunicipalityStats };
