const comparativeModel = require('../models/comparativeModel');

/**
 * Compare multiple regions (provinces, districts, or municipalities)
 */
exports.compareRegions = async (req, res, next) => {
  try {
    const { type, regions } = req.body;
    
    if (!type || !regions || !Array.isArray(regions) || regions.length < 2) {
      return res.status(400).json({
        error: true,
        message: 'Please provide type and at least 2 regions to compare',
      });
    }

    const comparison = await comparativeModel.compareRegions(type, regions);
    
    res.json({
      success: true,
      type,
      regions,
      data: comparison,
    });
  } catch (error) {
    console.error('Error comparing regions:', error);
    next({
      status: 500,
      message: 'Failed to compare regions',
      details: error.message,
    });
  }
};

/**
 * Get demographic comparison across regions
 */
exports.compareDemographics = async (req, res, next) => {
  try {
    const { regions } = req.body;
    
    if (!regions || !Array.isArray(regions)) {
      return res.status(400).json({
        error: true,
        message: 'Please provide regions to compare',
      });
    }

    const comparison = await comparativeModel.compareDemographics(regions);
    
    res.json({
      success: true,
      data: comparison,
    });
  } catch (error) {
    console.error('Error comparing demographics:', error);
    next({
      status: 500,
      message: 'Failed to compare demographics',
      details: error.message,
    });
  }
};

/**
 * Get age distribution comparison
 */
exports.compareAgeDistribution = async (req, res, next) => {
  try {
    const { districts } = req.query;
    const districtList = districts ? districts.split(',') : [];
    
    const comparison = await comparativeModel.compareAgeDistribution(districtList);
    
    res.json({
      success: true,
      data: comparison,
    });
  } catch (error) {
    console.error('Error comparing age distribution:', error);
    next({
      status: 500,
      message: 'Failed to compare age distribution',
      details: error.message,
    });
  }
};

/**
 * Get gender ratio comparison across regions
 */
exports.compareGenderRatio = async (req, res, next) => {
  try {
    const { type } = req.query; // 'province', 'district', or 'municipality'
    
    const comparison = await comparativeModel.compareGenderRatio(type || 'district');
    
    res.json({
      success: true,
      data: comparison,
    });
  } catch (error) {
    console.error('Error comparing gender ratio:', error);
    next({
      status: 500,
      message: 'Failed to compare gender ratio',
      details: error.message,
    });
  }
};

/**
 * Get province-wise comprehensive comparison
 */
exports.getProvinceComparison = async (req, res, next) => {
  try {
    const comparison = await comparativeModel.getProvinceComparison();
    
    res.json({
      success: true,
      data: comparison,
    });
  } catch (error) {
    console.error('Error getting province comparison:', error);
    next({
      status: 500,
      message: 'Failed to get province comparison',
      details: error.message,
    });
  }
};

/**
 * Get district rankings by various metrics
 */
exports.getDistrictRankings = async (req, res, next) => {
  try {
    const { metric, limit } = req.query;
    const rankings = await comparativeModel.getDistrictRankings(
      metric || 'total_voters',
      parseInt(limit) || 20
    );
    
    res.json({
      success: true,
      metric,
      data: rankings,
    });
  } catch (error) {
    console.error('Error getting district rankings:', error);
    next({
      status: 500,
      message: 'Failed to get district rankings',
      details: error.message,
    });
  }
};

/**
 * Get turnout comparison (if turnout data is available)
 */
exports.compareTurnout = async (req, res, next) => {
  try {
    const { regions } = req.body;
    
    const comparison = await comparativeModel.compareTurnout(regions);
    
    res.json({
      success: true,
      data: comparison,
    });
  } catch (error) {
    console.error('Error comparing turnout:', error);
    next({
      status: 500,
      message: 'Failed to compare turnout',
      details: error.message,
    });
  }
};

/**
 * Get comprehensive dashboard statistics with comparisons
 */
exports.getDashboardComparativeStats = async (req, res, next) => {
  try {
    const stats = await comparativeModel.getDashboardComparativeStats();
    
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error getting dashboard comparative stats:', error);
    next({
      status: 500,
      message: 'Failed to get dashboard comparative stats',
      details: error.message,
    });
  }
};

module.exports = exports;
