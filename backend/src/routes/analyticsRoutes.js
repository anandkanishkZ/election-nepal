const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

/**
 * Analytics Routes
 * Comprehensive analytics endpoints for descriptive, diagnostic, predictive, and prescriptive analytics
 */

// Overview / Descriptive Analytics - What happened?
router.get('/analytics/descriptive', analyticsController.getDescriptiveAnalytics);
router.get('/analytics/overview', analyticsController.getDescriptiveAnalytics); // Alias

// Diagnostic Analytics - Why it happened?
router.get('/analytics/diagnostic', analyticsController.getDiagnosticAnalytics);

// Predictive Analytics - What will happen?
router.get('/analytics/predictive', analyticsController.getPredictiveAnalytics);

// Prescriptive Analytics - What should we do?
router.get('/analytics/prescriptive', analyticsController.getPrescriptiveAnalytics);

// Geographic Analytics
router.get('/analytics/geographic', analyticsController.getGeographicAnalytics);

// Temporal Analytics
router.get('/analytics/temporal', analyticsController.getTemporalAnalytics);

// Comprehensive Dashboard (all analytics combined)
router.get('/analytics/dashboard', analyticsController.getAnalyticsDashboard);

module.exports = router;
