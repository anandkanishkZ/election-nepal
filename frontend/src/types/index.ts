// Type definitions for Nepal Election Analysis System

export interface Voter {
  id: number;
  voter_id?: string;
  name_np: string;
  name_en?: string;
  age?: number;
  gender?: string;
  parents_name_np?: string;
  partners_name_np?: string;
  booth_id?: number;
  booth_name?: string;
  ward_number?: number;
  municipality_name?: string;
  district_name?: string;
  province_name?: string;
}

export interface VoterStatistics {
  total: number;
  byDistrict: Array<{
    district_name: string;
    count: number;
  }>;
  byMunicipality: Array<{
    municipality_name: string;
    count: number;
  }>;
  byGender: Array<{
    gender: string;
    count: number;
  }>;
  byAgeGroup: Array<{
    age_group: string;
    count: number;
  }>;
}

export interface ElectionResult {
  municipality_name: string;
  district_name: string;
  province_name: string;
  total_voters: number;
  male_voters: number;
  female_voters: number;
  average_age: number;
}

export interface Province {
  id: number;
  name_np: string;
  name_en?: string;
}

export interface District {
  id: number;
  name_np: string;
  name_en?: string;
  province_id: number;
}

export interface Municipality {
  id: number;
  name_np: string;
  name_en?: string;
  district_id: number;
}

export interface Ward {
  id: number;
  ward_number: number;
  municipality_id: number;
}

export interface LocationStats {
  level: string;
  id: number;
  name: string;
  total_voters: number;
  male_voters: number;
  female_voters: number;
  average_age: number;
}

export interface GISUnit {
  id: number;
  type: string;
  properties: {
    name: string;
    name_np: string;
    type: string;
    [key: string]: any;
  };
  geometry: {
    type: string;
    coordinates: any[];
  };
}

export interface SearchParams {
  name?: string;
  district?: string;
  province?: string;
  municipality?: string;
  gender?: string;
  voter_id?: string;
}

export interface ProvinceComparison {
  province: string;
  voters2079: number;
  voters2074: number;
  growth: number;
  male: number;
  female: number;
}

export interface GenderTrend {
  year: string;
  male: number;
  female: number;
  total: number;
}
