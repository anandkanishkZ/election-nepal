const express = require('express');
const router = express.Router();
const comparativeController = require('../controllers/comparativeController');

// Compare multiple regions
router.post('/compare/regions', comparativeController.compareRegions);

// Compare demographics
router.post('/compare/demographics', comparativeController.compareDemographics);

// Compare age distribution
router.get('/compare/age-distribution', comparativeController.compareAgeDistribution);

// Compare gender ratio
router.get('/compare/gender-ratio', comparativeController.compareGenderRatio);

// Get province comparison
router.get('/compare/provinces', comparativeController.getProvinceComparison);

// Get district rankings
router.get('/compare/district-rankings', comparativeController.getDistrictRankings);

// Compare turnout
router.post('/compare/turnout', comparativeController.compareTurnout);

// Get comprehensive dashboard comparative stats
router.get('/dashboard/comparative-stats', comparativeController.getDashboardComparativeStats);

module.exports = router;
