const db = require('../config/database');
const cache = require('../config/cache');

/**
 * =================================================================
 * DESCRIPTIVE ANALYTICS - Overview (What happened?)
 * =================================================================
 */

/**
 * Get comprehensive descriptive statistics (OPTIMIZED WITH CACHING)
 */
const getDescriptiveStats = async () => {
  const cacheKey = 'analytics:descriptive';
  
  // Check cache first
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    // Run queries in parallel for speed
    const [overallQuery, geoDistQuery, topProvincesQuery, ageDistQuery] = await Promise.all([
      // Overall statistics - OPTIMIZED: Use COUNT(1) and hex gender matching
      db.query(`
        SELECT 
          COUNT(1) as total_voters,
          COUNT(CASE WHEN encode(gender::bytea, 'hex') = 'e0a4aae0a581e0a4b0e0a581e0a4b7' THEN 1 END) as male_voters,
          COUNT(CASE WHEN encode(gender::bytea, 'hex') = 'e0a4aee0a4b9e0a4bfe0a4b2e0a4be' THEN 1 END) as female_voters,
          COUNT(CASE WHEN encode(gender::bytea, 'hex') NOT IN ('e0a4aae0a581e0a4b0e0a581e0a4b7', 'e0a4aee0a4b9e0a4bfe0a4b2e0a4be') THEN 1 END) as other_voters,
          ROUND(AVG(age), 1) as average_age,
          MIN(age) as min_age,
          MAX(age) as max_age,
          ROUND(STDDEV(age), 1) as age_stddev
        FROM voters
        WHERE age IS NOT NULL;
      `),

      // Geographic distribution - OPTIMIZED: Direct subquery
      db.query(`
        SELECT 
          (SELECT COUNT(DISTINCT id) FROM provinces) as total_provinces,
          (SELECT COUNT(DISTINCT id) FROM districts) as total_districts,
          (SELECT COUNT(DISTINCT id) FROM municipalities) as total_municipalities,
          (SELECT COUNT(DISTINCT id) FROM wards) as total_wards,
          (SELECT COUNT(DISTINCT id) FROM voting_booths) as total_voting_booths;
      `),

      // Top 5 provinces - OPTIMIZED: Added LIMIT, hex gender matching
      db.query(`
        SELECT 
          p.name_np as province,
          COUNT(1) as voter_count,
          COUNT(CASE WHEN encode(v.gender::bytea, 'hex') = 'e0a4aae0a581e0a4b0e0a581e0a4b7' THEN 1 END) as male,
          COUNT(CASE WHEN encode(v.gender::bytea, 'hex') = 'e0a4aee0a4b9e0a4bfe0a4b2e0a4be' THEN 1 END) as female,
          ROUND(AVG(v.age), 1) as avg_age
        FROM voters v
        INNER JOIN voting_booths vb ON v.booth_id = vb.id
        INNER JOIN wards w ON vb.ward_id = w.id
        INNER JOIN municipalities m ON w.municipality_id = m.id
        INNER JOIN districts d ON m.district_id = d.id
        INNER JOIN provinces p ON d.province_id = p.id
        GROUP BY p.name_np
        ORDER BY voter_count DESC
        LIMIT 5;
      `),

      // Age distribution - OPTIMIZED: Use indexed age field with hex comparison
      db.query(`
        SELECT 
          CASE 
            WHEN age < 25 THEN '18-24'
            WHEN age < 35 THEN '25-34'
            WHEN age < 45 THEN '35-44'
            WHEN age < 55 THEN '45-54'
            WHEN age < 65 THEN '55-64'
            ELSE '65+'
          END as age_group,
          COUNT(1) as count,
          COUNT(CASE WHEN encode(gender::bytea, 'hex') = 'e0a4aae0a581e0a4b0e0a581e0a4b7' THEN 1 END) as male,
          COUNT(CASE WHEN encode(gender::bytea, 'hex') = 'e0a4aee0a4b9e0a4bfe0a4b2e0a4be' THEN 1 END) as female
        FROM voters
        WHERE age IS NOT NULL
        GROUP BY age_group
        ORDER BY age_group;
      `)
    ]);

    const result = {
      overall: overallQuery.rows[0],
      geographic: geoDistQuery.rows[0],
      topProvinces: topProvincesQuery.rows,
      ageDistribution: ageDistQuery.rows,
      timestamp: new Date().toISOString()
    };

    // Cache for 5 minutes
    cache.set(cacheKey, result, 5 * 60 * 1000);
    
    return result;
  } catch (error) {
    console.error('Error getting descriptive stats:', error);
    throw error;
  }
};

/**
 * =================================================================
 * DIAGNOSTIC ANALYTICS - Why it happened?
 * =================================================================
 */

/**
 * Analyze demographic anomalies and patterns (OPTIMIZED)
 */
const getDiagnosticAnalysis = async () => {
  const cacheKey = 'analytics:diagnostic';
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    // Run all queries in parallel - 4x faster
    const [genderAnomaliesQuery, ageOutliersQuery, densityQuery, correlationQuery] = await Promise.all([
      // Gender ratio analysis - OPTIMIZED: INNER JOIN, COUNT(1)
      db.query(`
        SELECT 
          d.name_np as district,
          p.name_np as province,
          COUNT(1) as total_voters,
          COUNT(CASE WHEN encode(v.gender::bytea, 'hex') = 'e0a4aae0a581e0a4b0e0a581e0a4b7' THEN 1 END) as male,
          COUNT(CASE WHEN encode(v.gender::bytea, 'hex') = 'e0a4aee0a4b9e0a4bfe0a4b2e0a4be' THEN 1 END) as female,
          ROUND(
            CAST(COUNT(CASE WHEN encode(v.gender::bytea, 'hex') = 'e0a4aae0a581e0a4b0e0a581e0a4b7' THEN 1 END) AS DECIMAL) / 
            NULLIF(COUNT(CASE WHEN encode(v.gender::bytea, 'hex') = 'e0a4aee0a4b9e0a4bfe0a4b2e0a4be' THEN 1 END), 0), 
            3
          ) as gender_ratio,
          ABS(
            ROUND(
              CAST(COUNT(CASE WHEN encode(v.gender::bytea, 'hex') = 'e0a4aae0a581e0a4b0e0a581e0a4b7' THEN 1 END) AS DECIMAL) / 
              NULLIF(COUNT(CASE WHEN encode(v.gender::bytea, 'hex') = 'e0a4aee0a4b9e0a4bfe0a4b2e0a4be' THEN 1 END), 0), 
              3
            ) - 1.0
          ) as deviation_from_parity
        FROM voters v
        INNER JOIN voting_booths vb ON v.booth_id = vb.id
        INNER JOIN wards w ON vb.ward_id = w.id
        INNER JOIN municipalities m ON w.municipality_id = m.id
        INNER JOIN districts d ON m.district_id = d.id
        INNER JOIN provinces p ON d.province_id = p.id
        GROUP BY d.name_np, p.name_np
        HAVING COUNT(1) > 1000
        ORDER BY deviation_from_parity DESC
        LIMIT 10;
      `),

      // Age distribution outliers - OPTIMIZED
      db.query(`
        SELECT 
          d.name_np as district,
          p.name_np as province,
          COUNT(1) as total_voters,
          ROUND(AVG(v.age), 1) as avg_age,
          MIN(v.age) as min_age,
          MAX(v.age) as max_age,
          ROUND(STDDEV(v.age), 1) as age_stddev,
          COUNT(CASE WHEN v.age < 25 THEN 1 END) as youth_count,
          COUNT(CASE WHEN v.age >= 65 THEN 1 END) as elderly_count
        FROM voters v
        INNER JOIN voting_booths vb ON v.booth_id = vb.id
        INNER JOIN wards w ON vb.ward_id = w.id
        INNER JOIN municipalities m ON w.municipality_id = m.id
        INNER JOIN districts d ON m.district_id = d.id
        INNER JOIN provinces p ON d.province_id = p.id
        WHERE v.age IS NOT NULL
        GROUP BY d.name_np, p.name_np
        HAVING COUNT(1) > 1000
        ORDER BY age_stddev DESC
        LIMIT 10;
      `),

      // Voter density analysis - OPTIMIZED
      db.query(`
        SELECT 
          p.name_np as province,
          COUNT(DISTINCT d.id) as districts,
          COUNT(DISTINCT m.id) as municipalities,
          COUNT(1) as total_voters,
          ROUND(COUNT(1)::DECIMAL / NULLIF(COUNT(DISTINCT m.id), 0), 0) as voters_per_municipality,
          ROUND(COUNT(1)::DECIMAL / NULLIF(COUNT(DISTINCT d.id), 0), 0) as voters_per_district
        FROM voters v
        INNER JOIN voting_booths vb ON v.booth_id = vb.id
        INNER JOIN wards w ON vb.ward_id = w.id
        INNER JOIN municipalities m ON w.municipality_id = m.id
        INNER JOIN districts d ON m.district_id = d.id
        INNER JOIN provinces p ON d.province_id = p.id
        GROUP BY p.name_np
        ORDER BY voters_per_municipality ASC;
      `),

      // Correlation analysis - OPTIMIZED: COUNT(1)
      db.query(`
        SELECT 
          CASE 
            WHEN age < 35 THEN 'Young (18-34)'
            WHEN age < 55 THEN 'Middle (35-54)'
            ELSE 'Senior (55+)'
          END as age_category,
          COUNT(1) as total,
          COUNT(CASE WHEN encode(gender::bytea, 'hex') = 'e0a4aae0a581e0a4b0e0a581e0a4b7' THEN 1 END) as male,
          COUNT(CASE WHEN encode(gender::bytea, 'hex') = 'e0a4aee0a4b9e0a4bfe0a4b2e0a4be' THEN 1 END) as female,
          ROUND(100.0 * COUNT(CASE WHEN encode(gender::bytea, 'hex') = 'e0a4aae0a581e0a4b0e0a581e0a4b7' THEN 1 END) / COUNT(1), 2) as male_percentage
        FROM voters
        WHERE age IS NOT NULL
        GROUP BY age_category
        ORDER BY age_category;
      `)
    ]);

    const result = {
      genderAnomalies: genderAnomaliesQuery.rows,
      ageOutliers: ageOutliersQuery.rows,
      densityAnalysis: densityQuery.rows,
      ageGenderCorrelation: correlationQuery.rows,
      insights: generateDiagnosticInsights(genderAnomaliesQuery.rows, ageOutliersQuery.rows, densityQuery.rows),
      timestamp: new Date().toISOString()
    };

    cache.set(cacheKey, result, 5 * 60 * 1000);
    return result;
  } catch (error) {
    console.error('Error getting diagnostic analysis:', error);
    throw error;
  }
};

/**
 * Generate diagnostic insights from data
 */
const generateDiagnosticInsights = (genderData, ageData, densityData) => {
  const insights = [];

  // Gender insights
  if (genderData.length > 0) {
    const topImbalance = genderData[0];
    if (topImbalance.deviation_from_parity > 0.2) {
      insights.push({
        type: 'gender_imbalance',
        severity: 'high',
        title: 'Significant Gender Imbalance Detected',
        description: `${topImbalance.district} shows a gender ratio of ${topImbalance.gender_ratio}:1 (Male:Female), indicating ${topImbalance.gender_ratio > 1 ? 'more males' : 'more females'} than expected.`,
        recommendation: 'Investigate socio-economic factors, migration patterns, or data collection issues.'
      });
    }
  }

  // Age insights
  if (ageData.length > 0) {
    const highStdDev = ageData[0];
    if (highStdDev.age_stddev > 20) {
      insights.push({
        type: 'age_diversity',
        severity: 'medium',
        title: 'High Age Diversity',
        description: `${highStdDev.district} has high age variance (σ=${highStdDev.age_stddev.toFixed(1)}), suggesting diverse demographic composition.`,
        recommendation: 'Consider age-specific outreach programs for both youth and elderly populations.'
      });
    }
  }

  // Density insights
  if (densityData.length > 0) {
    const lowDensity = densityData[0];
    if (lowDensity.voters_per_municipality < 5000) {
      insights.push({
        type: 'low_density',
        severity: 'medium',
        title: 'Low Voter Density Detected',
        description: `${lowDensity.province} has only ${lowDensity.voters_per_municipality} voters per municipality on average.`,
        recommendation: 'May require additional resources for voter registration and booth accessibility.'
      });
    }
  }

  return insights;
};

/**
 * =================================================================
 * PREDICTIVE ANALYTICS - What will happen?
 * =================================================================
 */

/**
 * Predict future voter trends and demographics
 */
/**
 * Predict future voter trends and demographics (OPTIMIZED)
 */
const getPredictiveAnalysis = async () => {
  const cacheKey = 'analytics:predictive';
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    // Run queries in parallel
    const [currentDemoQuery, provinceGrowthQuery, genderTrendQuery] = await Promise.all([
      // Demographic trend - OPTIMIZED
      db.query(`
        SELECT 
          CASE 
            WHEN age < 25 THEN '18-24'
            WHEN age < 35 THEN '25-34'
            WHEN age < 45 THEN '35-44'
            WHEN age < 55 THEN '45-54'
            WHEN age < 65 THEN '55-64'
            ELSE '65+'
          END as age_group,
          COUNT(1) as current_count
        FROM voters
        WHERE age IS NOT NULL
        GROUP BY age_group
        ORDER BY age_group;
      `),

      // Province growth - OPTIMIZED: INNER JOIN, COUNT(1)
      db.query(`
        SELECT 
          p.name_np as province,
          COUNT(1) as current_voters,
          COUNT(CASE WHEN v.age < 30 THEN 1 END) as youth_voters,
          ROUND(100.0 * COUNT(CASE WHEN v.age < 30 THEN 1 END) / COUNT(1), 2) as youth_percentage,
          COUNT(DISTINCT m.id) as municipalities
        FROM voters v
        INNER JOIN voting_booths vb ON v.booth_id = vb.id
        INNER JOIN wards w ON vb.ward_id = w.id
        INNER JOIN municipalities m ON w.municipality_id = m.id
        INNER JOIN districts d ON m.district_id = d.id
        INNER JOIN provinces p ON d.province_id = p.id
        GROUP BY p.name_np
        ORDER BY current_voters DESC;
      `),

      // Gender trend - OPTIMIZED
      db.query(`
        SELECT 
          p.name_np as province,
          COUNT(CASE WHEN encode(v.gender::bytea, 'hex') = 'e0a4aae0a581e0a4b0e0a581e0a4b7' THEN 1 END) as male,
          COUNT(CASE WHEN encode(v.gender::bytea, 'hex') = 'e0a4aee0a4b9e0a4bfe0a4b2e0a4be' THEN 1 END) as female,
          ROUND(
            CAST(COUNT(CASE WHEN encode(v.gender::bytea, 'hex') = 'e0a4aae0a581e0a4b0e0a581e0a4b7' THEN 1 END) AS DECIMAL) / 
            NULLIF(COUNT(CASE WHEN encode(v.gender::bytea, 'hex') = 'e0a4aee0a4b9e0a4bfe0a4b2e0a4be' THEN 1 END), 0), 
            3
          ) as current_ratio
        FROM voters v
        INNER JOIN voting_booths vb ON v.booth_id = vb.id
        INNER JOIN wards w ON vb.ward_id = w.id
        INNER JOIN municipalities m ON w.municipality_id = m.id
        INNER JOIN districts d ON m.district_id = d.id
        INNER JOIN provinces p ON d.province_id = p.id
        GROUP BY p.name_np
        ORDER BY current_ratio DESC;
      `)
    ]);

    // Calculate predictions
    const predictions = currentDemoQuery.rows.map((row, index) => {
      const ageGroups = ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'];
      const currentIndex = ageGroups.indexOf(row.age_group);
      
      return {
        age_group: row.age_group,
        current_count: parseInt(row.current_count),
        predicted_5yr: currentIndex < ageGroups.length - 1 
          ? Math.round(parseInt(row.current_count) * 0.85)
          : Math.round(parseInt(row.current_count) * 1.1),
        change_percentage: currentIndex < ageGroups.length - 1 ? -15 : 10
      };
    });

    const provinceForecasts = provinceGrowthQuery.rows.map(row => {
      const youthFactor = row.youth_percentage / 100;
      const growthRate = (youthFactor * 0.15) + 0.02;
      
      return {
        province: row.province,
        current_voters: parseInt(row.current_voters),
        youth_percentage: parseFloat(row.youth_percentage),
        predicted_growth_rate: (growthRate * 100).toFixed(2),
        predicted_5yr_voters: Math.round(parseInt(row.current_voters) * (1 + growthRate * 5)),
        predicted_change: Math.round(parseInt(row.current_voters) * growthRate * 5)
      };
    });

    const genderForecasts = genderTrendQuery.rows.map(row => {
      const currentRatio = parseFloat(row.current_ratio);
      const targetRatio = 1.0;
      const yearlyChange = (targetRatio - currentRatio) * 0.1;
      const predicted5YrRatio = currentRatio + (yearlyChange * 5);

      return {
        province: row.province,
        current_male: parseInt(row.male),
        current_female: parseInt(row.female),
        current_ratio: currentRatio,
        predicted_5yr_ratio: predicted5YrRatio.toFixed(3),
        trend: currentRatio > 1 ? 'converging_to_parity' : 'stable'
      };
    });

    const result = {
      demographicShift: predictions,
      provinceGrowthForecast: provinceForecasts,
      genderRatioForecast: genderForecasts,
      confidence: {
        level: 'medium',
        note: 'Predictions based on current trends and simplified demographic models. Actual outcomes may vary due to migration, policy changes, and external factors.'
      },
      timestamp: new Date().toISOString()
    };

    cache.set(cacheKey, result, 5 * 60 * 1000);
    return result;
  } catch (error) {
    console.error('Error getting predictive analysis:', error);
    throw error;
  }
};

/**
 * =================================================================
 * PRESCRIPTIVE ANALYTICS - What should we do?
 * =================================================================
 */

/**
 * Generate actionable recommendations (OPTIMIZED)
 */
const getPrescriptiveRecommendations = async () => {
  const cacheKey = 'analytics:prescriptive';
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    // Run queries in parallel - 3x faster
    const [boothOptimizationQuery, genderEngagementQuery, youthEngagementQuery] = await Promise.all([
      // Booth optimization - OPTIMIZED: INNER JOIN, COUNT(1), LIMIT 15
      db.query(`
        SELECT 
          d.name_np as district,
          p.name_np as province,
          COUNT(1) as total_voters,
          COUNT(DISTINCT vb.id) as voting_booths,
          ROUND(COUNT(1)::DECIMAL / NULLIF(COUNT(DISTINCT vb.id), 0), 0) as voters_per_booth
        FROM voters v
        INNER JOIN voting_booths vb ON v.booth_id = vb.id
        INNER JOIN wards w ON vb.ward_id = w.id
        INNER JOIN municipalities m ON w.municipality_id = m.id
        INNER JOIN districts d ON m.district_id = d.id
        INNER JOIN provinces p ON d.province_id = p.id
        GROUP BY d.name_np, p.name_np
        HAVING COUNT(DISTINCT vb.id) > 0
        ORDER BY voters_per_booth DESC
        LIMIT 15;
      `),

      // Gender engagement - OPTIMIZED: LIMIT 10
      db.query(`
        SELECT 
          d.name_np as district,
          p.name_np as province,
          COUNT(1) as total_voters,
          COUNT(CASE WHEN encode(v.gender::bytea, 'hex') = 'e0a4aee0a4b9e0a4bfe0a4b2e0a4be' THEN 1 END) as female_voters,
          ROUND(100.0 * COUNT(CASE WHEN encode(v.gender::bytea, 'hex') = 'e0a4aee0a4b9e0a4bfe0a4b2e0a4be' THEN 1 END) / COUNT(1), 2) as female_percentage
        FROM voters v
        INNER JOIN voting_booths vb ON v.booth_id = vb.id
        INNER JOIN wards w ON vb.ward_id = w.id
        INNER JOIN municipalities m ON w.municipality_id = m.id
        INNER JOIN districts d ON m.district_id = d.id
        INNER JOIN provinces p ON d.province_id = p.id
        GROUP BY d.name_np, p.name_np
        HAVING COUNT(1) > 1000
        ORDER BY female_percentage ASC
        LIMIT 10;
      `),

      // Youth engagement - OPTIMIZED: LIMIT 10
      db.query(`
        SELECT 
          d.name_np as district,
          p.name_np as province,
          COUNT(1) as total_voters,
          COUNT(CASE WHEN v.age < 30 THEN 1 END) as youth_voters,
          ROUND(100.0 * COUNT(CASE WHEN v.age < 30 THEN 1 END) / COUNT(1), 2) as youth_percentage
        FROM voters v
        INNER JOIN voting_booths vb ON v.booth_id = vb.id
        INNER JOIN wards w ON vb.ward_id = w.id
        INNER JOIN municipalities m ON w.municipality_id = m.id
        INNER JOIN districts d ON m.district_id = d.id
        INNER JOIN provinces p ON d.province_id = p.id
        WHERE v.age IS NOT NULL
        GROUP BY d.name_np, p.name_np
        HAVING COUNT(1) > 1000
        ORDER BY youth_percentage DESC
        LIMIT 10;
      `)
    ]);

    // Generate recommendations
    const recommendations = [];

    // Booth optimization recommendations
    boothOptimizationQuery.rows.forEach((row, index) => {
      if (row.voters_per_booth > 1000) {
        const suggestedBooths = Math.ceil(row.total_voters / 800); // Target: 800 voters per booth
        const additionalBooths = suggestedBooths - row.voting_booths;
        
        recommendations.push({
          category: 'infrastructure',
          priority: index < 5 ? 'high' : 'medium',
          district: row.district,
          province: row.province,
          issue: `High voters per booth ratio (${row.voters_per_booth})`,
          recommendation: `Add ${additionalBooths} voting booths to reduce congestion`,
          impact: `Will reduce voters per booth from ${row.voters_per_booth} to ~800`,
          cost_estimate: `${additionalBooths * 50000}` // Rough estimate: 50,000 per booth
        });
      }
    });

    // Gender engagement recommendations
    genderEngagementQuery.rows.forEach((row, index) => {
      if (row.female_percentage < 45) {
        recommendations.push({
          category: 'engagement',
          priority: index < 3 ? 'high' : 'medium',
          district: row.district,
          province: row.province,
          issue: `Low female voter representation (${row.female_percentage}%)`,
          recommendation: 'Launch targeted female voter registration campaign',
          actions: [
            'Conduct door-to-door registration drives',
            'Partner with women\'s organizations',
            'Provide female registration officers',
            'Address cultural barriers'
          ],
          expected_impact: 'Increase female representation by 5-10%'
        });
      }
    });

    // Youth engagement recommendations
    youthEngagementQuery.rows.slice(0, 5).forEach((row, index) => {
      if (row.youth_percentage > 30) {
        recommendations.push({
          category: 'youth_outreach',
          priority: 'medium',
          district: row.district,
          province: row.province,
          opportunity: `High youth population (${row.youth_percentage}%)`,
          recommendation: 'Implement digital-first engagement strategy',
          actions: [
            'Social media voter education campaigns',
            'Mobile voting information apps',
            'Youth ambassador programs',
            'University partnerships'
          ],
          expected_impact: 'Increase youth voter turnout by 15-20%'
        });
      }
    });

    const result = {
      recommendations: recommendations,
      summary: {
        total_recommendations: recommendations.length,
        high_priority: recommendations.filter(r => r.priority === 'high').length,
        medium_priority: recommendations.filter(r => r.priority === 'medium').length,
        categories: {
          infrastructure: recommendations.filter(r => r.category === 'infrastructure').length,
          engagement: recommendations.filter(r => r.category === 'engagement').length,
          youth_outreach: recommendations.filter(r => r.category === 'youth_outreach').length
        }
      },
      timestamp: new Date().toISOString()
    };

    cache.set(cacheKey, result, 5 * 60 * 1000);
    return result;
  } catch (error) {
    console.error('Error getting prescriptive recommendations:', error);
    throw error;
  }
};

/**
 * =================================================================
 * GEOGRAPHIC ANALYTICS - Spatial Analysis
 * =================================================================
 */

/**
 * Get geographic hotspots and patterns (OPTIMIZED)
 */
const getGeographicAnalytics = async () => {
  const cacheKey = 'analytics:geographic';
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    // Run queries in parallel - 2x faster
    const [provinceHeatmap, districtDensity] = await Promise.all([
      // Province heatmap - OPTIMIZED: INNER JOIN, COUNT(1)
      db.query(`
        SELECT 
          p.name_np as province,
          COUNT(1) as voter_count,
          COUNT(CASE WHEN encode(v.gender::bytea, 'hex') = 'e0a4aae0a581e0a4b0e0a581e0a4b7' THEN 1 END) as male,
          COUNT(CASE WHEN encode(v.gender::bytea, 'hex') = 'e0a4aee0a4b9e0a4bfe0a4b2e0a4be' THEN 1 END) as female,
          ROUND(AVG(v.age), 1) as avg_age,
          COUNT(DISTINCT d.id) as districts
        FROM voters v
        INNER JOIN voting_booths vb ON v.booth_id = vb.id
        INNER JOIN wards w ON vb.ward_id = w.id
        INNER JOIN municipalities m ON w.municipality_id = m.id
        INNER JOIN districts d ON m.district_id = d.id
        INNER JOIN provinces p ON d.province_id = p.id
        GROUP BY p.name_np
        ORDER BY voter_count DESC;
      `),

      // District density - OPTIMIZED: LIMIT to top 20 districts
      db.query(`
        SELECT 
          d.name_np as district,
          p.name_np as province,
          COUNT(1) as voter_count,
          COUNT(DISTINCT m.id) as municipalities,
          COUNT(DISTINCT vb.id) as voting_booths,
          ROUND(COUNT(1)::DECIMAL / NULLIF(COUNT(DISTINCT m.id), 0), 0) as voters_per_municipality
        FROM voters v
        INNER JOIN voting_booths vb ON v.booth_id = vb.id
        INNER JOIN wards w ON vb.ward_id = w.id
        INNER JOIN municipalities m ON w.municipality_id = m.id
        INNER JOIN districts d ON m.district_id = d.id
        INNER JOIN provinces p ON d.province_id = p.id
        GROUP BY d.name_np, p.name_np
        ORDER BY voter_count DESC
        LIMIT 20;
      `)
    ]);

    const result = {
      provinceHeatmap: provinceHeatmap.rows,
      districtDensity: districtDensity.rows,
      timestamp: new Date().toISOString()
    };

    cache.set(cacheKey, result, 5 * 60 * 1000);
    return result;
  } catch (error) {
    console.error('Error getting geographic analytics:', error);
    throw error;
  }
};

/**
 * =================================================================
 * TEMPORAL ANALYTICS - Time-based Analysis
 * =================================================================
 */

/**
 * Analyze age cohort distribution over time (OPTIMIZED)
 */
const getTemporalAnalytics = async () => {
  const cacheKey = 'analytics:temporal';
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    // Run queries in parallel - 2x faster
    const [cohortQuery, growthSimulation] = await Promise.all([
      // Cohort analysis - OPTIMIZED: COUNT(1), age filter
      // Estimate registration year: current_year - (age - 18) = year they turned 18
      db.query(`
        SELECT 
          CASE 
            WHEN (2026 - (age - 18)) >= 2023 THEN '2023'
            WHEN (2026 - (age - 18)) = 2022 THEN '2022'
            WHEN (2026 - (age - 18)) = 2021 THEN '2021'
            WHEN (2026 - (age - 18)) = 2020 THEN '2020'
            ELSE '2019 or earlier'
          END as registration_period,
          COUNT(1) as voter_count
        FROM voters
        WHERE age BETWEEN 18 AND 25
        GROUP BY registration_period
        ORDER BY registration_period DESC;
      `),

      // Growth simulation - OPTIMIZED: INNER JOIN, COUNT(1)
      db.query(`
        SELECT 
          p.name_np as province,
          COUNT(1) as current_count,
          COUNT(CASE WHEN v.age BETWEEN 18 AND 25 THEN 1 END) as new_eligible,
          COUNT(CASE WHEN v.age >= 65 THEN 1 END) as aging_population
        FROM voters v
        INNER JOIN voting_booths vb ON v.booth_id = vb.id
        INNER JOIN wards w ON vb.ward_id = w.id
        INNER JOIN municipalities m ON w.municipality_id = m.id
        INNER JOIN districts d ON m.district_id = d.id
        INNER JOIN provinces p ON d.province_id = p.id
        GROUP BY p.name_np
        ORDER BY current_count DESC;
      `)
    ]);

    const result = {
      cohortDistribution: cohortQuery.rows,
      provinceGrowthTrends: growthSimulation.rows,
      timestamp: new Date().toISOString()
    };

    cache.set(cacheKey, result, 5 * 60 * 1000);
    return result;
  } catch (error) {
    console.error('Error getting temporal analytics:', error);
    throw error;
  }
};

module.exports = {
  // Descriptive
  getDescriptiveStats,
  
  // Diagnostic
  getDiagnosticAnalysis,
  
  // Predictive
  getPredictiveAnalysis,
  
  // Prescriptive
  getPrescriptiveRecommendations,
  
  // Geographic
  getGeographicAnalytics,
  
  // Temporal
  getTemporalAnalytics
};




