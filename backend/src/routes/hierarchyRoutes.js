const express = require('express');
const router = express.Router();
const hierarchyController = require('../controllers/hierarchyController');

// Provinces
router.get('/provinces', hierarchyController.getProvinces);

// Districts by Province
router.get('/provinces/:provinceId/districts', hierarchyController.getDistrictsByProvince);

// Municipalities by District
router.get('/districts/:districtId/municipalities', hierarchyController.getMunicipalitiesByDistrict);

// Wards by Municipality
router.get('/municipalities/:municipalityId/wards', hierarchyController.getWardsByMunicipality);

// Location Statistics
router.get('/stats/:level/:id', hierarchyController.getLocationStats);

module.exports = router;
