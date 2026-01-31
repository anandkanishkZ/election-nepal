import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, Home, MapPin, Users } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Location {
  id: number;
  name_np: string;
  province_id?: number;
  district_id?: number;
  municipality_id?: number;
  ward_number?: number;
}

interface Statistics {
  total: number;
  byGender?: Array<{ gender: string; count: number }>;
}

type ViewLevel = 'provinces' | 'districts' | 'municipalities' | 'wards';

function MapController({ bounds }: { bounds: L.LatLngBounds | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    }
  }, [bounds, map]);
  
  return null;
}

export function HierarchicalNepalMap() {
  const [viewLevel, setViewLevel] = useState<ViewLevel>('provinces');
  const [geoData, setGeoData] = useState<any>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bounds, setBounds] = useState<L.LatLngBounds | null>(null);
  
  // Navigation state
  const [selectedProvince, setSelectedProvince] = useState<Location | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<Location | null>(null);
  const [selectedMunicipality, setSelectedMunicipality] = useState<Location | null>(null);

  const API_BASE = 'http://localhost:5000/api';

  // Fetch GeoJSON boundaries
  const fetchGeoData = async () => {
    try {
      const res = await fetch(`${API_BASE}/nepal-units`);
      if (!res.ok) throw new Error('Failed to fetch GeoJSON');
      const data = await res.json();
      setGeoData(data);
      
      if (data && data.features && data.features.length > 0) {
        const geojsonLayer = L.geoJSON(data);
        setBounds(geojsonLayer.getBounds());
      }
    } catch (err) {
      console.error('Error fetching GeoJSON:', err);
      setError('Failed to load map data');
    }
  };

  // Fetch locations based on current level
  const fetchLocations = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let endpoint = '';
      
      switch (viewLevel) {
        case 'provinces':
          endpoint = `${API_BASE}/hierarchy/provinces`;
          break;
        case 'districts':
          if (!selectedProvince) return;
          endpoint = `${API_BASE}/hierarchy/provinces/${selectedProvince.id}/districts`;
          break;
        case 'municipalities':
          if (!selectedDistrict) return;
          endpoint = `${API_BASE}/hierarchy/districts/${selectedDistrict.id}/municipalities`;
          break;
        case 'wards':
          if (!selectedMunicipality) return;
          endpoint = `${API_BASE}/hierarchy/municipalities/${selectedMunicipality.id}/wards`;
          break;
      }
      
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error('Failed to fetch locations');
      const data = await res.json();
      setLocations(data);
    } catch (err) {
      console.error('Error fetching locations:', err);
      setError('Failed to load locations');
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/voter-statistics`);
      if (!res.ok) throw new Error('Failed to fetch statistics');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  };

  // Initialize
  useEffect(() => {
    fetchGeoData();
    fetchStats();
  }, []);

  // Fetch locations when level changes
  useEffect(() => {
    fetchLocations();
  }, [viewLevel, selectedProvince, selectedDistrict, selectedMunicipality]);

  // Handle province selection
  const handleProvinceClick = (province: Location) => {
    setSelectedProvince(province);
    setSelectedDistrict(null);
    setSelectedMunicipality(null);
    setViewLevel('districts');
  };

  // Handle district selection
  const handleDistrictClick = (district: Location) => {
    setSelectedDistrict(district);
    setSelectedMunicipality(null);
    setViewLevel('municipalities');
  };

  // Handle municipality selection
  const handleMunicipalityClick = (municipality: Location) => {
    setSelectedMunicipality(municipality);
    setViewLevel('wards');
  };

  // Navigate back
  const handleBack = () => {
    if (viewLevel === 'wards') {
      setSelectedMunicipality(null);
      setViewLevel('municipalities');
    } else if (viewLevel === 'municipalities') {
      setSelectedDistrict(null);
      setViewLevel('districts');
    } else if (viewLevel === 'districts') {
      setSelectedProvince(null);
      setViewLevel('provinces');
    }
  };

  // Navigate to home
  const handleHome = () => {
    setSelectedProvince(null);
    setSelectedDistrict(null);
    setSelectedMunicipality(null);
    setViewLevel('provinces');
  };

  const getTitle = () => {
    if (viewLevel === 'wards') return `Wards in ${selectedMunicipality?.name_np}`;
    if (viewLevel === 'municipalities') return `Municipalities in ${selectedDistrict?.name_np}`;
    if (viewLevel === 'districts') return `Districts in ${selectedProvince?.name_np}`;
    return 'Provinces of Nepal';
  };

  const getBreadcrumb = () => {
    const items = ['Nepal'];
    if (selectedProvince) items.push(selectedProvince.name_np);
    if (selectedDistrict) items.push(selectedDistrict.name_np);
    if (selectedMunicipality) items.push(selectedMunicipality.name_np);
    return items.join(' → ');
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Map */}
      <Card className="lg:col-span-2 p-0 overflow-hidden">
        <MapContainer
          center={[28.3949, 84.1240]}
          zoom={7}
          className="h-[600px] w-full"
          scrollWheelZoom={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          
          {geoData && (
            <GeoJSON
              data={geoData}
              style={(feature) => ({
                fillColor: '#3b82f6',
                fillOpacity: 0.3,
                color: '#1e40af',
                weight: 2,
              })}
              onEachFeature={(feature, layer) => {
                if (feature.properties) {
                  layer.bindPopup(`
                    <div class="p-2">
                      <strong>${feature.properties.NAME || feature.properties.name || 'Unknown'}</strong>
                      <br/>Type: ${feature.properties.TYPE || 'Administrative Unit'}
                    </div>
                  `);
                }
              }}
            />
          )}
          
          {bounds && <MapController bounds={bounds} />}
        </MapContainer>
      </Card>

      {/* Navigation Panel */}
      <Card className="p-6">
        {/* Breadcrumb & Controls */}
        <div className="mb-4 space-y-2">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleHome}
              disabled={viewLevel === 'provinces'}
            >
              <Home className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              disabled={viewLevel === 'provinces'}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">{getBreadcrumb()}</p>
          <h3 className="text-lg font-semibold">{getTitle()}</h3>
        </div>

        {/* Statistics Summary */}
        {stats && (
          <div className="mb-4 p-4 bg-primary/5 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-primary" />
              <span className="font-medium">Total Voters:</span>
              <span className="text-primary">{stats.total.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Location List */}
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {loading && (
            <div className="text-center py-4 text-muted-foreground">Loading...</div>
          )}
          
          {error && (
            <div className="text-center py-4 text-destructive">{error}</div>
          )}
          
          {!loading && !error && locations.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">No data available</div>
          )}
          
          {!loading && !error && locations.map((location) => (
            <Button
              key={location.id}
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                if (viewLevel === 'provinces') handleProvinceClick(location);
                else if (viewLevel === 'districts') handleDistrictClick(location);
                else if (viewLevel === 'municipalities') handleMunicipalityClick(location);
              }}
            >
              <MapPin className="h-4 w-4 mr-2" />
              <span className="flex-1 text-left">
                {viewLevel === 'wards' 
                  ? `Ward ${location.ward_number}` 
                  : location.name_np}
              </span>
            </Button>
          ))}
        </div>

        {/* Level Indicator */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Current Level:</span>
            <span className="font-medium capitalize">{viewLevel}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground mt-1">
            <span>Items:</span>
            <span className="font-medium">{locations.length}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
