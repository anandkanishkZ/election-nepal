const voterModel = require('../models/voterModel');

/**
 * Get all voters with pagination
 */
exports.getAllVoters = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;

    const voters = await voterModel.getVoters(limit, offset);
    
    res.json({
      success: true,
      count: voters.length,
      data: voters,
    });
  } catch (error) {
    console.error('Error getting voters:', error);
    next({
      status: 500,
      message: 'Failed to get voters',
      details: error.message,
    });
  }
};

/**
 * Get voter by ID
 */
exports.getVoterById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const voter = await voterModel.getVoterById(id);
    
    if (!voter) {
      return res.status(404).json({
        error: true,
        message: 'Voter not found',
      });
    }
    
    res.json({
      success: true,
      data: voter,
    });
  } catch (error) {
    console.error('Error getting voter by ID:', error);
    next({
      status: 500,
      message: 'Failed to get voter',
      details: error.message,
    });
  }
};

/**
 * Search voters
 */
exports.searchVoters = async (req, res, next) => {
  try {
    const searchParams = {
      name: req.query.name,
      district: req.query.district,
      province: req.query.province,
      municipality: req.query.municipality,
    };

    const voters = await voterModel.searchVoters(searchParams);
    
    res.json({
      success: true,
      count: voters.length,
      data: voters,
    });
  } catch (error) {
    console.error('Error searching voters:', error);
    next({
      status: 500,
      message: 'Failed to search voters',
      details: error.message,
    });
  }
};

/**
 * Get voter statistics
 */
exports.getVoterStatistics = async (req, res, next) => {
  try {
    const stats = await voterModel.getVoterStatistics();
    
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error getting voter statistics:', error);
    next({
      status: 500,
      message: 'Failed to get statistics',
      details: error.message,
    });
  }
};

/**
 * Get voters by location
 */
exports.getVotersByLocation = async (req, res, next) => {
  try {
    const { district, municipality, ward, name, voter_id } = req.query;
    
    const voters = await voterModel.getVotersByLocation(district, municipality, ward, name, voter_id);
    
    res.json({
      success: true,
      count: voters.length,
      data: voters,
    });
  } catch (error) {
    console.error('Error getting voters by location:', error);
    next({
      status: 500,
      message: 'Failed to get voters by location',
      details: error.message,
    });
  }
};

/**
 * Get election results
 */
exports.getElectionResults = async (req, res, next) => {
  try {
    const { municipality } = req.query;
    
    const results = await voterModel.getElectionResults(municipality);
    
    res.json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    console.error('Error getting election results:', error);
    next({
      status: 500,
      message: 'Failed to get election results',
      details: error.message,
    });
  }
};

/**
 * Get database info
 */
exports.getDatabaseInfo = async (req, res, next) => {
  try {
    const tables = await voterModel.getAllTables();
    
    res.json({
      success: true,
      database: process.env.DB_NAME || 'voter_db',
      tables: tables.map(t => t.table_name),
    });
  } catch (error) {
    console.error('Error getting database info:', error);
    next({
      status: 500,
      message: 'Failed to get database info',
      details: error.message,
    });
  }
};

/**
 * Get table schema
 */
exports.getTableSchema = async (req, res, next) => {
  try {
    const { tableName } = req.params;
    const schema = await voterModel.getTableSchema(tableName);
    
    res.json({
      success: true,
      table: tableName,
      columns: schema,
    });
  } catch (error) {
    console.error('Error getting table schema:', error);
    next({
      status: 500,
      message: 'Failed to get table schema',
      details: error.message,
    });
  }
};

/**
 * Get statistics for a specific location
 */
exports.getLocationStatistics = async (req, res, next) => {
  try {
    const { locationType, locationName } = req.params;
    
    if (!['province', 'district', 'municipality'].includes(locationType)) {
      return res.status(400).json({
        error: true,
        message: 'Invalid location type. Must be province, district, or municipality',
      });
    }

    const stats = await voterModel.getLocationStatistics(locationType, locationName);
    
    res.json({
      success: true,
      locationType,
      locationName,
      data: stats,
    });
  } catch (error) {
    console.error('Error getting location statistics:', error);
    next({
      status: 500,
      message: 'Failed to get location statistics',
      details: error.message,
    });
  }
};
