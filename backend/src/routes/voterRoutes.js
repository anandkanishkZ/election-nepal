const express = require('express');
const router = express.Router();
const voterController = require('../controllers/voterController');

// Voter routes
router.get('/voters', voterController.getAllVoters);
router.get('/voters/:id', voterController.getVoterById);
router.get('/voters/search/query', voterController.searchVoters);
router.get('/voters/location/filter', voterController.getVotersByLocation);

// Statistics routes
router.get('/voter-statistics', voterController.getVoterStatistics);
router.get('/location-statistics/:locationType/:locationName', voterController.getLocationStatistics);
router.get('/election-results', voterController.getElectionResults);

// Database info routes
router.get('/database/info', voterController.getDatabaseInfo);
router.get('/database/schema/:tableName', voterController.getTableSchema);

module.exports = router;
