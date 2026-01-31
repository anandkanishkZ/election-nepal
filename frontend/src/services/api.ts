// API Configuration and Base Setup
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  count?: number;
  error?: boolean;
  message?: string;
}

// Base fetch wrapper with error handling
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// API Service
export const api = {
  // Health check
  health: async () => {
    return fetchAPI('/health');
  },

  // Voter endpoints
  voters: {
    getAll: async (limit = 100, offset = 0) => {
      return fetchAPI<ApiResponse>(`/voters?limit=${limit}&offset=${offset}`);
    },
    
    getById: async (id: string | number) => {
      return fetchAPI<ApiResponse>(`/voters/${id}`);
    },
    
    search: async (params: {
      name?: string;
      district?: string;
      province?: string;
      municipality?: string;
      gender?: string;
      voter_id?: string;
    }) => {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      return fetchAPI<ApiResponse>(`/voters/search/query?${queryParams.toString()}`);
    },
    
    getByLocation: async (district?: string, municipality?: string, ward?: string, name?: string, voterId?: string) => {
      const queryParams = new URLSearchParams();
      if (district) queryParams.append('district', district);
      if (municipality) queryParams.append('municipality', municipality);
      if (ward) queryParams.append('ward', ward);
      if (name) queryParams.append('name', name);
      if (voterId) queryParams.append('voter_id', voterId);
      return fetchAPI<ApiResponse>(`/voters/location/filter?${queryParams.toString()}`);
    },
    
    getStatistics: async () => {
      return fetchAPI<ApiResponse>('/voter-statistics');
    },
    
    getLocationStatistics: async (locationType: 'province' | 'district' | 'municipality', locationName: string) => {
      return fetchAPI<ApiResponse>(`/location-statistics/${locationType}/${encodeURIComponent(locationName)}`);
    },
  },

  // Election results
  electionResults: {
    getAll: async (municipality?: string) => {
      const queryParams = municipality ? `?municipality=${municipality}` : '';
      return fetchAPI<ApiResponse>(`/election-results${queryParams}`);
    },
  },

  // Hierarchy endpoints
  hierarchy: {
    getProvinces: async () => {
      return fetchAPI<any[]>('/hierarchy/provinces');
    },
    
    getDistricts: async (provinceId: string | number) => {
      return fetchAPI<any[]>(`/hierarchy/provinces/${provinceId}/districts`);
    },
    
    getMunicipalities: async (districtId: string | number) => {
      return fetchAPI<any[]>(`/hierarchy/districts/${districtId}/municipalities`);
    },
    
    getWards: async (municipalityId: string | number) => {
      return fetchAPI<any[]>(`/hierarchy/municipalities/${municipalityId}/wards`);
    },
    
    getLocationStats: async (level: string, id: string | number) => {
      return fetchAPI<ApiResponse>(`/hierarchy/stats/${level}/${id}`);
    },
  },

  // GIS endpoints
  gis: {
    getNepalUnits: async () => {
      return fetchAPI<ApiResponse>('/nepal-units');
    },
    
    getUnitById: async (id: string | number) => {
      return fetchAPI<ApiResponse>(`/nepal-units/${id}`);
    },
    
    getStatistics: async () => {
      return fetchAPI<ApiResponse>('/statistics');
    },
    
    search: async (query: string) => {
      return fetchAPI<ApiResponse>(`/search?q=${encodeURIComponent(query)}`);
    },
  },

  // Database info
  database: {
    getInfo: async () => {
      return fetchAPI<ApiResponse>('/database/info');
    },
    
    getSchema: async (tableName: string) => {
      return fetchAPI<ApiResponse>(`/database/schema/${tableName}`);
    },
  },

  // Comparative Analytics endpoints
  comparative: {
    compareRegions: async (type: 'province' | 'district' | 'municipality', regions: string[]) => {
      return fetchAPI<ApiResponse>('/compare/regions', {
        method: 'POST',
        body: JSON.stringify({ type, regions }),
      });
    },

    compareDemographics: async (regions: string[]) => {
      return fetchAPI<ApiResponse>('/compare/demographics', {
        method: 'POST',
        body: JSON.stringify({ regions }),
      });
    },

    compareAgeDistribution: async (districts?: string[]) => {
      const queryParams = districts && districts.length > 0 
        ? `?districts=${districts.join(',')}` 
        : '';
      return fetchAPI<ApiResponse>(`/compare/age-distribution${queryParams}`);
    },

    compareGenderRatio: async (type: 'province' | 'district' | 'municipality' = 'district') => {
      return fetchAPI<ApiResponse>(`/compare/gender-ratio?type=${type}`);
    },

    getProvinceComparison: async () => {
      return fetchAPI<ApiResponse>('/compare/provinces');
    },

    getDistrictRankings: async (metric?: string, limit?: number) => {
      const queryParams = new URLSearchParams();
      if (metric) queryParams.append('metric', metric);
      if (limit) queryParams.append('limit', limit.toString());
      const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
      return fetchAPI<ApiResponse>(`/compare/district-rankings${query}`);
    },

    compareTurnout: async (regions: string[]) => {
      return fetchAPI<ApiResponse>('/compare/turnout', {
        method: 'POST',
        body: JSON.stringify({ regions }),
      });
    },

    getDashboardStats: async () => {
      return fetchAPI<ApiResponse>('/dashboard/comparative-stats');
    },
  },

  // Advanced Analytics endpoints
  analytics: {
    // Descriptive Analytics (Overview - What happened?)
    getDescriptive: async () => {
      return fetchAPI<ApiResponse>('/analytics/descriptive');
    },

    getOverview: async () => {
      return fetchAPI<ApiResponse>('/analytics/overview');
    },

    // Diagnostic Analytics (Why it happened?)
    getDiagnostic: async () => {
      return fetchAPI<ApiResponse>('/analytics/diagnostic');
    },

    // Predictive Analytics (What will happen?)
    getPredictive: async () => {
      return fetchAPI<ApiResponse>('/analytics/predictive');
    },

    // Prescriptive Analytics (What should we do?)
    getPrescriptive: async () => {
      return fetchAPI<ApiResponse>('/analytics/prescriptive');
    },

    // Geographic Analytics
    getGeographic: async () => {
      return fetchAPI<ApiResponse>('/analytics/geographic');
    },

    // Temporal Analytics
    getTemporal: async () => {
      return fetchAPI<ApiResponse>('/analytics/temporal');
    },

    // Comprehensive Analytics Dashboard
    getDashboard: async () => {
      return fetchAPI<ApiResponse>('/analytics/dashboard');
    },
  },
};

export default api;
