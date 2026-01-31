const express = require('express');
const router = express.Router();
const gisController = require('../controllers/gisController');

// Get all Nepal local units as GeoJSON
router.get('/nepal-units', gisController.getNepalUnits);

// Get specific unit by ID
router.get('/nepal-units/:id', gisController.getUnitById);

// Get statistics
router.get('/statistics', gisController.getStatistics);

// Search units
router.get('/search', gisController.searchUnits);

module.exports = router;
