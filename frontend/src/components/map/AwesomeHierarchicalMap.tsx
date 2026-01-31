import { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, Home, MapPin, Users, Layers, Info } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'framer-motion';
import { getFeatureStatistics } from '@/data/nepalNameMapping';

interface GeoJSONFeature {
  type: 'Feature';
  properties: {
    [key: string]: any;
  };
  geometry: any;
}

interface Location {
  id: number;
  name_np: string;
  feature?: GeoJSONFeature;
}

type ViewLevel = 'provinces' | 'districts' | 'municipalities';

// Nepal Administrative Hierarchy:
// Provinces: 7 → Districts: 77 → Municipalities: 776
const GEOJSON_FILES = {
  provinces: '/geojson/nepal-provinces.geojson',
  districts: '/geojson/nepal-districts.geojson',
  municipalities: '/geojson/nepal-municipalities.geojson',
};

function MapController({ bounds, center }: { bounds: L.LatLngBounds | null; center?: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    if (bounds) {
      // Use flyToBounds for smoother, more natural animation
      map.flyToBounds(bounds, { 
        padding: [80, 80],     // More padding for better visibility
        maxZoom: 12,           // Allow closer zoom for municipalities
        duration: 1.2,         // Slower, smoother animation
        easeLinearity: 0.25    // Smoother easing
      });
    } else if (center) {
      map.flyTo(center, 7, { 
        duration: 1.2,
        easeLinearity: 0.25 
      });
    }
  }, [bounds, center, map]);
  
  return null;
}

export function AwesomeHierarchicalMap() {
  const [viewLevel, setViewLevel] = useState<ViewLevel>('provinces');
  const [geoData, setGeoData] = useState<GeoJSONFeature[]>([]);
  const [filteredGeoData, setFilteredGeoData] = useState<GeoJSONFeature[]>([]);
  const [loading, setLoading] = useState(false);
  const [bounds, setBounds] = useState<L.LatLngBounds | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<GeoJSONFeature | null>(null);
  const [hoveredFeature, setHoveredFeature] = useState<GeoJSONFeature | null>(null);
  const [mapKey, setMapKey] = useState(0);
  
  // Navigation state
  const [selectedProvince, setSelectedProvince] = useState<GeoJSONFeature | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<GeoJSONFeature | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [shouldResetBounds, setShouldResetBounds] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [featureStats, setFeatureStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  
  // Static statistics data (loaded once)
  const [statisticsData, setStatisticsData] = useState<{
    provinces: Record<string, any>;
    districts: Record<string, any>;
    municipalities: Record<string, any>;
  } | null>(null);

  const API_BASE = 'http://localhost:5000/api';

  // Get voter density color based on statistics
  const getVoterDensityColor = (feature: GeoJSONFeature, level: ViewLevel): string => {
    if (!statisticsData) return '#94a3b8'; // Gray if no data
    
    // Get feature name
    let featureName = '';
    if (level === 'provinces') {
      featureName = feature.properties.PR_NAME || feature.properties.PROVINCE;
    } else if (level === 'districts') {
      featureName = feature.properties.DISTRICT || feature.properties.DIST_NAME;
    } else if (level === 'municipalities') {
      featureName = feature.properties.NEW_MUNICI || feature.properties.MUNICIPALITY;
    }
    
    if (!featureName) return '#94a3b8';
    
    // Get voter count from statistics
    const stats = statisticsData[level]?.[featureName];
    const voterCount = stats?.total_voters || 0;
    
    if (voterCount === 0) return '#94a3b8';
    
    // Calculate percentile based on level
    let maxVoters = 0;
    let minVoters = Infinity;
    
    if (statisticsData[level]) {
      Object.values(statisticsData[level]).forEach((stat: any) => {
        const count = stat.total_voters || 0;
        maxVoters = Math.max(maxVoters, count);
        minVoters = Math.min(minVoters, count);
      });
    }
    
    // Calculate ratio (0 to 1)
    const ratio = (voterCount - minVoters) / (maxVoters - minVoters || 1);
    
    // Color gradient: Blue (low) → Yellow → Orange → Red (high)
    if (ratio > 0.8) return '#dc2626'; // Dark red - Very high density
    if (ratio > 0.6) return '#f97316'; // Orange - High density
    if (ratio > 0.4) return '#fbbf24'; // Yellow - Medium-high density
    if (ratio > 0.2) return '#60a5fa'; // Light blue - Medium-low density
    return '#3b82f6'; // Blue - Low density
  };

  // Color schemes for different levels
  const getColor = (level: ViewLevel, feature?: GeoJSONFeature) => {
    // Use voter density colors if statistics are loaded
    if (statisticsData && feature) {
      return getVoterDensityColor(feature, level);
    }
    
    // Fallback colors
    const colors = {
      provinces: '#10b981',
      districts: '#f59e0b',
      municipalities: '#ef4444',
    };
    
    return colors[level];
  };

  // Fetch GeoJSON for current level
  const loadGeoJSON = async (level: ViewLevel) => {
    console.log('📥 Loading GeoJSON for level:', level);
    setLoading(true);
    try {
      const file = GEOJSON_FILES[level];
      const response = await fetch(file);
      const data = await response.json();
      console.log(`✅ Loaded ${data.features?.length || 0} features for ${level}`);
      setGeoData(data.features || []);
      // Don't set filtered data here - let the filtering effect handle it
      
      // Only set bounds if we want to reset the view (e.g., initial load or Home button)
      if (shouldResetBounds && data.features && data.features.length > 0) {
        const geojsonLayer = L.geoJSON(data);
        setBounds(geojsonLayer.getBounds());
      }
    } catch (error) {
      console.error('Error loading GeoJSON:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load static statistics on mount (one-time load)
  useEffect(() => {
    const loadStatistics = async () => {
      try {
        const [provinces, districts, municipalities] = await Promise.all([
          fetch('/statistics/provinces.json').then(r => r.json()).catch(() => ({})),
          fetch('/statistics/districts.json').then(r => r.json()).catch(() => ({})),
          fetch('/statistics/municipalities.json').then(r => r.json()).catch(() => ({}))
        ]);
        setStatisticsData({ provinces, districts, municipalities });
        console.log('✓ Statistics loaded:', { 
          provinces: Object.keys(provinces).length, 
          districts: Object.keys(districts).length,
          municipalities: Object.keys(municipalities).length 
        });
      } catch (error) {
        console.error('Failed to load statistics:', error);
      }
    };
    loadStatistics();
  }, []);

  // Fetch voter statistics
  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/voter-statistics`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Detect actual feature level from properties
  const detectFeatureLevel = (feature: GeoJSONFeature): ViewLevel => {
    if (feature.properties.LOCAL) return 'municipalities';
    if (feature.properties.DISTRICT && !feature.properties.LOCAL) return 'districts';
    return 'provinces';
  };

  // Get feature statistics instantly from static data
  const getFeatureStats = (feature: GeoJSONFeature, level?: ViewLevel) => {
    if (!statisticsData) return null;

    // Use detected level if not provided or if viewLevel is stale
    const actualLevel = level || detectFeatureLevel(feature);

    const dataMap: Record<ViewLevel, Record<string, any>> = {
      'provinces': statisticsData.provinces,
      'districts': statisticsData.districts,
      'municipalities': statisticsData.municipalities
    };

    return getFeatureStatistics(feature, actualLevel, dataMap[actualLevel]);
  };

  // Old async version - replaced with instant lookup above
  const fetchFeatureStats = async (feature: GeoJSONFeature, level: ViewLevel) => {
    setLoadingStats(true);
    try {
      let locationType = '';
      let locationName = '';

      if (level === 'provinces') {
        locationType = 'province';
        locationName = feature.properties.PR_NAME || feature.properties.NAME || `Province ${feature.properties.PROVINCE}`;
      } else if (level === 'districts') {
        locationType = 'district';
        locationName = feature.properties.DISTRICT || feature.properties.NAME;
      } else if (level === 'municipalities') {
        locationType = 'municipality';
        locationName = feature.properties.LOCAL || feature.properties.NAME;
      }

      if (locationName) {
        const res = await fetch(`${API_BASE}/location-statistics/${locationType}/${encodeURIComponent(locationName)}`);
        if (res.ok) {
          const data = await res.json();
          setFeatureStats(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching feature stats:', error);
      setFeatureStats(null);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    loadGeoJSON(viewLevel);
    fetchStats();
  }, [viewLevel]);

  // Filter features based on selection
  useEffect(() => {
    console.log('🔍 Filtering effect triggered:', { viewLevel, hasGeoData: geoData?.length > 0, selectedProvince: !!selectedProvince, selectedDistrict: !!selectedDistrict });
    
    if (!geoData || geoData.length === 0) {
      console.log('⚠️ No geoData available');
      setFilteredGeoData([]);
      return;
    }

    if (viewLevel === 'districts' && selectedProvince) {
      const provinceId = selectedProvince.properties.PROVINCE || selectedProvince.properties.OBJECTID;
      const filtered = geoData.filter(f => f.properties.PROVINCE === provinceId);
      console.log(`✅ Filtered ${filtered.length} districts for province ${provinceId}`);
      setFilteredGeoData(filtered);
      // Bounds are set in handleProvinceClick, no need to set here
    } else if (viewLevel === 'municipalities' && selectedDistrict) {
      const districtName = selectedDistrict.properties.DISTRICT;
      const filtered = geoData.filter(f => f.properties.DISTRICT === districtName);
      console.log(`✅ Filtered ${filtered.length} municipalities for district ${districtName}`);
      setFilteredGeoData(filtered);
      // Bounds are set in handleDistrictClick, no need to set here
    } else {
      console.log(`✅ Showing all ${geoData.length} features (no filtering)`);
      setFilteredGeoData(geoData);
      // Only set bounds for initial province view load
      if (geoData.length > 0 && viewLevel === 'provinces' && !selectedProvince) {
        setTimeout(() => {
          const layer = L.geoJSON({ 
            type: 'FeatureCollection', 
            features: geoData 
          } as any);
          setBounds(layer.getBounds());
        }, 100);
      }
    }
  }, [geoData, selectedProvince, selectedDistrict, viewLevel]);

  // Handle province click -> show districts
  const handleProvinceClick = useCallback((feature: GeoJSONFeature) => {
    console.log('🏛️ Province clicked, transitioning to districts');
    setIsTransitioning(true);
    
    // First, zoom to the clicked province smoothly
    const provinceLayer = L.geoJSON(feature);
    setBounds(provinceLayer.getBounds());
    
    // Prevent automatic bounds reset when loading new data
    setShouldResetBounds(false);
    
    // Update state
    setSelectedProvince(feature);
    setSelectedDistrict(null);
    setSelectedFeature(feature);
    
    // Change level after zoom animation starts
    setTimeout(() => {
      console.log('📍 Setting viewLevel to districts');
      setViewLevel('districts');
      setTimeout(() => {
        setIsTransitioning(false);
        console.log('✅ Transition complete, viewLevel:', 'districts');
      }, 300);
    }, 200);
  }, []);

  // Handle district click
  const handleDistrictClick = useCallback((feature: GeoJSONFeature) => {
    setIsTransitioning(true);
    
    // First, zoom to the clicked district smoothly
    const districtLayer = L.geoJSON(feature);
    setBounds(districtLayer.getBounds());
    
    // Prevent automatic bounds reset when loading new data
    setShouldResetBounds(false);
    
    // Update state
    setSelectedDistrict(feature);
    setSelectedFeature(null); // Clear feature so municipalities can be individually selected
    
    // Change level after zoom animation starts
    setTimeout(() => {
      setViewLevel('municipalities');
      setTimeout(() => setIsTransitioning(false), 300);
    }, 200);
  }, []);

  // Navigate back
  const handleBack = () => {
    if (viewLevel === 'municipalities') {
      // Zoom back to the province view
      if (selectedProvince) {
        const provinceLayer = L.geoJSON(selectedProvince);
        setBounds(provinceLayer.getBounds());
      }
      
      // Prevent bounds reset
      setShouldResetBounds(false);
      
      setSelectedDistrict(null);
      setSelectedFeature(selectedProvince);
      
      setTimeout(() => {
        setViewLevel('districts');
      }, 200);
    } else if (viewLevel === 'districts') {
      // Allow bounds reset when going back to provinces
      setShouldResetBounds(true);
      
      setSelectedProvince(null);
      setSelectedFeature(null);
      setViewLevel('provinces');
    }
  };

  // Navigate to home
  const handleHome = () => {
    // Enable bounds reset for home view
    setShouldResetBounds(true);
    
    setSelectedProvince(null);
    setSelectedDistrict(null);
    setSelectedFeature(null);
    
    // If already at provinces, just reset bounds
    if (viewLevel === 'provinces' && geoData.length > 0) {
      const allLayer = L.geoJSON({ 
        type: 'FeatureCollection', 
        features: geoData 
      } as any);
      setBounds(allLayer.getBounds());
    } else {
      setViewLevel('provinces');
    }
  };

  // Get title based on level
  const getTitle = () => {
    if (viewLevel === 'municipalities') return `Municipalities in ${selectedDistrict?.properties.DISTRICT || 'District'} (${filteredGeoData.length})`;
    if (viewLevel === 'districts') return `Districts in ${selectedProvince?.properties.PR_NAME || 'Province'} (${filteredGeoData.length})`;
    return '7 Provinces of Nepal';
  };

  // Get breadcrumb
  const getBreadcrumb = () => {
    const items = ['Nepal'];
    
    if (viewLevel === 'provinces') {
      items.push('7 Provinces');
    } else if (selectedProvince) {
      items.push(selectedProvince.properties.PR_NAME || 'Province');
      
      if (viewLevel === 'districts') {
        items.push(`${filteredGeoData.length} Districts`);
      } else if (selectedDistrict) {
        items.push(selectedDistrict.properties.DISTRICT || 'District');
        
        if (viewLevel === 'municipalities') {
          items.push(`${filteredGeoData.length} Municipalities`);
        }
      }
    }
    
    return items.join(' → ');
  };

  // Style function for GeoJSON
  const styleFeature = (feature: GeoJSONFeature) => {
    const isSelected = selectedFeature?.properties.OBJECTID === feature.properties.OBJECTID;
    const isHovered = hoveredFeature?.properties.OBJECTID === feature.properties.OBJECTID;
    
    return {
      fillColor: isSelected ? '#FFD700' : isHovered ? '#60a5fa' : getColor(viewLevel, feature),
      fillOpacity: isSelected ? 0.9 : isHovered ? 0.6 : 0.5,
      color: isSelected ? '#FF6B00' : isHovered ? '#1e40af' : '#1e293b',
      weight: isSelected ? 4 : isHovered ? 3 : 2,
      opacity: 1,
    };
  };

  // Handle feature interactions
  const onEachFeature = (feature: GeoJSONFeature, layer: L.Layer) => {
    layer.on({
      mouseover: (e) => {
        setHoveredFeature(feature);
        const layer = e.target;
        layer.setStyle({
          weight: 3,
          fillOpacity: 0.7,
          color: '#1e40af',
        });
        
        // Get statistics instantly from static data (auto-detect level)
        const stats = getFeatureStats(feature);
        if (stats) {
          setFeatureStats(stats);
        }
        
        // Always open popup on hover for better UX
        layer.openPopup();
      },
      mouseout: (e) => {
        setHoveredFeature(null);
        // Don't clear stats immediately - keep them visible
        const layer = e.target;
        layer.setStyle(styleFeature(feature));
        
        // Close popup when not hovering
        layer.closePopup();
      },
      click: (e) => {
        console.log('🖱️ Click detected:', { viewLevel, featureType: detectFeatureLevel(feature), properties: feature.properties });
        
        if (viewLevel === 'provinces') {
          console.log('✅ Triggering province click');
          handleProvinceClick(feature);
        } else if (viewLevel === 'districts') {
          console.log('✅ Triggering district click');
          handleDistrictClick(feature);
        } else if (viewLevel === 'municipalities') {
          // Make municipalities clickable to lock statistics
          setSelectedFeature(feature);
          const stats = getFeatureStats(feature);
          if (stats) {
            setFeatureStats(stats);
          }
          
          // Force map to re-render with new selection
          setMapKey(prev => prev + 1);
          
          // Open popup
          setTimeout(() => layer.openPopup(), 100);
        } else {
          e.target.setStyle({
            fillColor: '#3b82f6',
            fillOpacity: 0.7,
          });
        }
      },
    });

    // Dynamic Popup based on hierarchical level
    const props = feature.properties;
    let name = 'Unknown';
    let subtext = '';
    let extra = '';
    let icon = '📍';
    
    if (viewLevel === 'provinces') {
      // At Province Level - Show Province Info
      name = props.PR_NAME || `Province ${props.PROVINCE || ''}`;
      subtext = `Province ${props.PROVINCE || ''}`;
      icon = '🏛️';
      extra = '👆 Click to view districts in this province';
    } else if (viewLevel === 'districts') {
      // Province Selected - Show District Info
      name = props.DISTRICT || 'District';
      subtext = `In ${props.PR_NAME || selectedProvince?.properties.PR_NAME || 'Province'}`;
      icon = '🏘️';
      extra = '👆 Click to view municipalities in this district';
    } else if (viewLevel === 'municipalities') {
      // District Selected - Show Municipality Info
      name = props.LOCAL || props.NAME || 'Municipality';
      const type = props.TYPE || 'Municipality';
      subtext = `${type}`;
      icon = type === 'Mahanagarpalika' ? '🏙️' : type === 'Nagarpalika' ? '🏘️' : '🏞️';
      extra = `District: ${props.DISTRICT || selectedDistrict?.properties.DISTRICT || ''}`;
      // Add click instruction for municipalities
      extra += '<br/><span class="text-blue-600 font-medium">👆 Click to pin statistics</span>';
    }
    
    layer.bindPopup(`
      <div class="p-3 min-w-[200px]">
        <div class="flex items-start gap-2">
          <span class="text-xl">${icon}</span>
          <div class="flex-1">
            <div class="font-bold text-base text-gray-800">${name}</div>
            ${subtext ? `<div class="text-sm text-gray-600">${subtext}</div>` : ''}
          </div>
        </div>
        ${extra ? `<div class="text-xs text-gray-500 mt-2 pt-2 border-t">${extra}</div>` : ''}
        <div class="text-xs text-blue-600 mt-2 font-medium">→ See statistics panel</div>
      </div>
    `, {
      className: 'custom-popup',
      closeButton: false,
      offset: [0, -10]
    });
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Map */}
      <Card className="lg:col-span-2 p-0 overflow-hidden relative">
        {loading && (
          <div className="absolute top-4 right-4 z-[1000] bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-2xl border-2 border-primary/20">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-t-2 border-primary"></div>
              <div>
                <div className="text-sm font-semibold text-gray-800">Loading map data...</div>
                <div className="text-xs text-gray-500 mt-0.5">Please wait</div>
              </div>
            </div>
          </div>
        )}
        
        {/* Transition Indicator */}
        <AnimatePresence>
          {isTransitioning && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[1000] bg-primary/95 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-2xl"
            >
              <div className="flex items-center gap-3 text-white">
                <div className="animate-pulse">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="font-semibold">Navigating...</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <MapContainer
          center={[28.3949, 84.1240]}
          zoom={7}
          className="h-[650px] w-full"
          scrollWheelZoom={true}
          zoomControl={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          
          {filteredGeoData.length > 0 && (
            <GeoJSON
              key={`${viewLevel}-${selectedProvince?.properties.OBJECTID || 'all'}-${selectedDistrict?.properties.OBJECTID || 'none'}-${selectedFeature?.properties.OBJECTID || 'unselected'}-${mapKey}`}
              data={{ 
                type: 'FeatureCollection', 
                features: filteredGeoData 
              } as any}
              style={styleFeature}
              onEachFeature={onEachFeature}
            />
          )}
          
          <MapController bounds={bounds} />
        </MapContainer>

        {/* Enhanced Hover Info Box */}
        <AnimatePresence>
          {hoveredFeature && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-4 left-4 z-[1000] bg-gradient-to-br from-white to-primary/5 px-5 py-4 rounded-xl shadow-2xl border-2 border-primary/30 backdrop-blur-sm min-w-[300px]"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-base text-gray-800 mb-1">
                    {viewLevel === 'provinces' && (hoveredFeature.properties.PR_NAME || `Province ${hoveredFeature.properties.PROVINCE}`)}
                    {viewLevel === 'districts' && (hoveredFeature.properties.DISTRICT || 'District')}
                    {viewLevel === 'municipalities' && (hoveredFeature.properties.LOCAL || hoveredFeature.properties.NAME || 'Municipality')}
                  </div>
                  
                  <div className="space-y-1">
                    {viewLevel === 'provinces' && (
                      <div className="text-xs text-gray-600">
                        Province {hoveredFeature.properties.PROVINCE || ''}
                      </div>
                    )}
                    
                    {viewLevel === 'districts' && (
                      <div className="text-xs text-gray-600">
                        {hoveredFeature.properties.PR_NAME || selectedProvince?.properties.PR_NAME || 'Province'}
                      </div>
                    )}
                    
                    {viewLevel === 'municipalities' && (
                      <>
                        <div className="inline-block px-2 py-0.5 bg-primary/20 text-primary text-xs font-medium rounded">
                          {hoveredFeature.properties.TYPE || 'Municipality'}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          District: {hoveredFeature.properties.DISTRICT || selectedDistrict?.properties.DISTRICT}
                        </div>
                      </>
                    )}
                    
                    {/* Voter Statistics */}
                    {loadingStats && (
                      <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                        <div className="animate-spin rounded-full h-3 w-3 border-b border-primary"></div>
                        <span>Loading statistics...</span>
                      </div>
                    )}
                    
                    {!loadingStats && featureStats && (
                      <div className="mt-2 pt-2 border-t border-gray-200 space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Total Voters:</span>
                          <span className="font-bold text-primary">{parseInt(featureStats.total_voters || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Male:</span>
                          <span className="text-blue-600">{parseInt(featureStats.male_voters || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Female:</span>
                          <span className="text-pink-600">{parseInt(featureStats.female_voters || 0).toLocaleString()}</span>
                        </div>
                        {featureStats.average_age && (
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600">Avg Age:</span>
                            <span className="text-gray-800">{parseFloat(featureStats.average_age).toFixed(1)} years</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="text-xs text-primary font-medium mt-2 flex items-center gap-1">
                    {viewLevel !== 'municipalities' && (
                      <>
                        <span>👆</span>
                        <span>Click to explore deeper</span>
                      </>
                    )}
                    {viewLevel === 'municipalities' && (
                      <>
                        <span>ℹ️</span>
                        <span>Hover to view details</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Control Panel */}
      <Card className="p-6 space-y-4">
        {/* Navigation Controls */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleHome}
              disabled={viewLevel === 'provinces'}
              className="flex-1"
            >
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBack}
              disabled={viewLevel === 'provinces'}
              className="flex-1"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
          
          <div className="p-3 bg-primary/5 rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">Navigation Path</div>
            <div className="text-sm font-medium">{getBreadcrumb()}</div>
          </div>
          
          {/* Current Level Indicator */}
          <div className="p-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
            <div className="text-xs text-muted-foreground mb-2">Hierarchy Level</div>
            <div className="flex items-center gap-2">
              <div className={`flex-1 h-2 rounded-full ${viewLevel === 'provinces' ? 'bg-primary' : 'bg-gray-300'}`}></div>
              <div className={`flex-1 h-2 rounded-full ${viewLevel === 'districts' ? 'bg-primary' : 'bg-gray-300'}`}></div>
              <div className={`flex-1 h-2 rounded-full ${viewLevel === 'municipalities' ? 'bg-primary' : 'bg-gray-300'}`}></div>
            </div>
            <div className="flex justify-between text-xs mt-1 font-medium">
              <span className={viewLevel === 'provinces' ? 'text-primary' : 'text-gray-400'}>Province</span>
              <span className={viewLevel === 'districts' ? 'text-primary' : 'text-gray-400'}>District</span>
              <span className={viewLevel === 'municipalities' ? 'text-primary' : 'text-gray-400'}>Municipal</span>
            </div>
          </div>
        </div>

        {/* Statistics Panel */}
        {featureStats && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200"
          >
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Location Statistics</h3>
              {selectedFeature && viewLevel === 'municipalities' && (
                <span className="ml-auto text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                  📌 Pinned
                </span>
              )}
            </div>
            {selectedFeature && (
              <div className="mb-3 p-2 bg-blue-50 rounded text-xs">
                <div className="font-semibold text-blue-900">
                  {selectedFeature.properties.LOCAL || selectedFeature.properties.NAME}
                </div>
                <div className="text-blue-700">
                  {selectedFeature.properties.TYPE} • {selectedFeature.properties.DISTRICT}
                </div>
              </div>
            )}
            <div className="space-y-3">
              <div className="p-2 bg-white/60 rounded">
                <div className="text-xs text-gray-600 mb-1">Total Voters</div>
                <div className="text-2xl font-bold text-blue-900">
                  {featureStats.total_voters?.toLocaleString() || 'N/A'}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-white/60 rounded">
                  <div className="text-xs text-blue-600">Male</div>
                  <div className="text-lg font-semibold text-blue-900">
                    {featureStats.male_voters?.toLocaleString() || 'N/A'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {featureStats.total_voters > 0 ? 
                      `${((featureStats.male_voters / featureStats.total_voters) * 100).toFixed(1)}%` : 
                      ''}
                  </div>
                </div>
                <div className="p-2 bg-white/60 rounded">
                  <div className="text-xs text-pink-600">Female</div>
                  <div className="text-lg font-semibold text-pink-900">
                    {featureStats.female_voters?.toLocaleString() || 'N/A'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {featureStats.total_voters > 0 ? 
                      `${((featureStats.female_voters / featureStats.total_voters) * 100).toFixed(1)}%` : 
                      ''}
                  </div>
                </div>
              </div>
              {featureStats.other_voters > 0 && (
                <div className="p-2 bg-white/60 rounded">
                  <div className="text-xs text-purple-600">Other</div>
                  <div className="text-sm font-semibold">{featureStats.other_voters?.toLocaleString()}</div>
                </div>
              )}
              <div className="p-2 bg-white/60 rounded">
                <div className="text-xs text-gray-600">Average Age</div>
                <div className="text-lg font-semibold text-gray-900">
                  {featureStats.average_age ? `${featureStats.average_age.toFixed(1)} years` : 'N/A'}
                </div>
                {featureStats.min_age && featureStats.max_age && (
                  <div className="text-xs text-gray-500">
                    Range: {featureStats.min_age} - {featureStats.max_age}
                  </div>
                )}
              </div>
              {selectedFeature && viewLevel === 'municipalities' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedFeature(null);
                    setMapKey(prev => prev + 1);
                  }}
                  className="w-full mt-2 text-xs"
                >
                  Clear Selection
                </Button>
              )}
            </div>
          </motion.div>
        )}

        {/* Existing Statistics */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg"
          >
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Voter Statistics</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Voters:</span>
                <span className="text-sm font-bold text-primary">{stats.total?.toLocaleString()}</span>
              </div>
              {stats.byGender && stats.byGender.map((g: any) => (
                <div key={g.gender} className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{g.gender}:</span>
                  <span className="text-sm font-medium">{g.count?.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Current View Info */}
        <div className="p-4 bg-muted/50 rounded-lg space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Layers className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Current Level:</span>
            <span className="font-semibold capitalize">{viewLevel}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Info className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Showing:</span>
            <span className="font-semibold">{filteredGeoData.length} features</span>
          </div>
          <div className="text-xs text-muted-foreground mt-2 pt-2 border-t">
            {viewLevel === 'provinces' && (
              <div className="space-y-1">
                <div className="font-semibold text-primary mb-1">💡 Navigation Tips:</div>
                <div>• Hover over any province to see its name</div>
                <div>• Click to view districts within that province</div>
              </div>
            )}
            {viewLevel === 'districts' && (
              <div className="space-y-1">
                <div className="font-semibold text-primary mb-1">💡 Navigation Tips:</div>
                <div>• Hover to see district names</div>
                <div>• Click any district to view its municipalities</div>
              </div>
            )}
            {viewLevel === 'municipalities' && (
              <div className="space-y-1">
                <div className="font-semibold text-primary mb-1">💡 Navigation Tips:</div>
                <div>• Hover to see municipality details</div>
                <div>• Different colors represent municipality types</div>
              </div>
            )}
          </div>
        </div>

        {/* Feature List */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm">{getTitle()}</h3>
          <div className="max-h-[300px] overflow-y-auto space-y-1">
            {filteredGeoData.slice(0, 100).map((feature, index) => {
              let name = `Area ${index + 1}`;
              let badge = '';
              
              if (viewLevel === 'provinces') {
                name = feature.properties.PR_NAME || `Province ${feature.properties.PROVINCE || index + 1}`;
              } else if (viewLevel === 'districts') {
                name = feature.properties.DISTRICT || 'District';
              } else if (viewLevel === 'municipalities') {
                name = feature.properties.LOCAL || feature.properties.NAME || 'Municipality';
                badge = feature.properties.TYPE || '';
              }
              
              const isSelected = selectedFeature?.properties.OBJECTID === feature.properties.OBJECTID;
              
              return (
                <Button
                  key={feature.properties.OBJECTID || index}
                  variant={isSelected ? "default" : "ghost"}
                  size="sm"
                  className="w-full justify-start text-left"
                  onClick={() => {
                    if (viewLevel === 'provinces') {
                      handleProvinceClick(feature);
                    } else if (viewLevel === 'districts') {
                      handleDistrictClick(feature);
                    }
                  }}
                >
                  <MapPin className="h-3 w-3 mr-2 flex-shrink-0" />
                  <span className="truncate flex-1">{name}</span>
                  {badge && (
                    <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full ml-2 flex-shrink-0">
                      {badge}
                    </span>
                  )}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="pt-4 border-t space-y-2">
          <h3 className="font-semibold text-sm">Voter Density Heatmap</h3>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#dc2626' }}></div>
              <span className="text-muted-foreground">Very High (80-100%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f97316' }}></div>
              <span className="text-muted-foreground">High (60-80%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#fbbf24' }}></div>
              <span className="text-muted-foreground">Medium (40-60%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#60a5fa' }}></div>
              <span className="text-muted-foreground">Low (20-40%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#3b82f6' }}></div>
              <span className="text-muted-foreground">Very Low (0-20%)</span>
            </div>
            <div className="flex items-center gap-2 pt-1 border-t mt-2">
              <div className="w-4 h-4 rounded bg-yellow-400"></div>
              <span className="text-muted-foreground">Selected Area</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-400"></div>
              <span className="text-muted-foreground">Hovered Area</span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground italic pt-2">
            Colors represent relative voter density within current view level
          </div>
        </div>
      </Card>
    </div>
  );
}
