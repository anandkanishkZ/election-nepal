const analyticsModel = require('../models/analyticsModel');

/**
 * Get Descriptive Analytics (Overview - What happened?)
 */
exports.getDescriptiveAnalytics = async (req, res) => {
  try {
    const data = await analyticsModel.getDescriptiveStats();
    // Set cache control headers to prevent browser caching
    res.set({
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    res.json({
      success: true,
      type: 'descriptive',
      description: 'Overview of voter demographics and distribution',
      data
    });
  } catch (error) {
    console.error('Error:', { status: 500, message: 'Failed to get descriptive analytics', details: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to get descriptive analytics',
      error: error.message
    });
  }
};

/**
 * Get Diagnostic Analytics (Why it happened?)
 */
exports.getDiagnosticAnalytics = async (req, res) => {
  try {
    const data = await analyticsModel.getDiagnosticAnalysis();
    res.json({
      success: true,
      type: 'diagnostic',
      description: 'Analysis of patterns, anomalies, and root causes',
      data
    });
  } catch (error) {
    console.error('Error:', { status: 500, message: 'Failed to get diagnostic analytics', details: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to get diagnostic analytics',
      error: error.message
    });
  }
};

/**
 * Get Predictive Analytics (What will happen?)
 */
exports.getPredictiveAnalytics = async (req, res) => {
  try {
    const data = await analyticsModel.getPredictiveAnalysis();
    res.json({
      success: true,
      type: 'predictive',
      description: 'Forecasts and trend predictions for voter demographics',
      data
    });
  } catch (error) {
    console.error('Error:', { status: 500, message: 'Failed to get predictive analytics', details: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to get predictive analytics',
      error: error.message
    });
  }
};

/**
 * Get Prescriptive Analytics (What should we do?)
 */
exports.getPrescriptiveAnalytics = async (req, res) => {
  try {
    const data = await analyticsModel.getPrescriptiveRecommendations();
    res.json({
      success: true,
      type: 'prescriptive',
      description: 'Actionable recommendations and optimization strategies',
      data
    });
  } catch (error) {
    console.error('Error:', { status: 500, message: 'Failed to get prescriptive analytics', details: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to get prescriptive analytics',
      error: error.message
    });
  }
};

/**
 * Get Geographic Analytics
 */
exports.getGeographicAnalytics = async (req, res) => {
  try {
    const data = await analyticsModel.getGeographicAnalytics();
    res.json({
      success: true,
      type: 'geographic',
      description: 'Spatial distribution and density analysis',
      data
    });
  } catch (error) {
    console.error('Error:', { status: 500, message: 'Failed to get geographic analytics', details: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to get geographic analytics',
      error: error.message
    });
  }
};

/**
 * Get Temporal Analytics
 */
exports.getTemporalAnalytics = async (req, res) => {
  try {
    const data = await analyticsModel.getTemporalAnalytics();
    res.json({
      success: true,
      type: 'temporal',
      description: 'Time-based trends and cohort analysis',
      data
    });
  } catch (error) {
    console.error('Error:', { status: 500, message: 'Failed to get temporal analytics', details: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to get temporal analytics',
      error: error.message
    });
  }
};

/**
 * Get comprehensive analytics dashboard
 */
exports.getAnalyticsDashboard = async (req, res) => {
  try {
    const [descriptive, diagnostic, predictive, prescriptive] = await Promise.all([
      analyticsModel.getDescriptiveStats(),
      analyticsModel.getDiagnosticAnalysis(),
      analyticsModel.getPredictiveAnalysis(),
      analyticsModel.getPrescriptiveRecommendations()
    ]);

    res.json({
      success: true,
      description: 'Comprehensive analytics dashboard with all analysis types',
      data: {
        descriptive,
        diagnostic,
        predictive,
        prescriptive,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error:', { status: 500, message: 'Failed to get analytics dashboard', details: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to get analytics dashboard',
      error: error.message
    });
  }
};
