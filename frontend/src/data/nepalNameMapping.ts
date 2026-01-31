/**
 * Nepal Name Mapping Helper
 * Maps English GeoJSON names to Nepali database names
 */

import municipalityMappingData from './municipalityMapping.json';

interface MunicipalityMapping {
  municipalities: Record<string, {
    nepali: string;
    district: string;
    districtEn: string;
    province: string;
    provinceEn: string;
    compositeKey: string;
  }>;
  districts: Record<string, string>;
  provinces: Record<string, string>;
}

const mapping = municipalityMappingData as MunicipalityMapping;

/**
 * Get Nepali name from English name
 */
export function getNepaliName(englishName: string, type: 'province' | 'district' | 'municipality'): string | null {
  try {
    if (type === 'municipality') {
      return mapping.municipalities[englishName]?.compositeKey || null;
    } else if (type === 'district') {
      return mapping.districts[englishName] || null;
    } else if (type === 'province') {
      return mapping.provinces[englishName] || null;
    }
  } catch (e) {
    return null;
  }
  return null;
}

/**
 * Try multiple variations to find a match
 */
export function findMatchingKey(
  feature: any,
  level: 'provinces' | 'districts' | 'municipalities',
  statisticsData: Record<string, any>
): string | null {
  if (!statisticsData) return null;

  // Extract possible English names from GeoJSON properties
  let possibleEnglishNames: string[] = [];
  
  if (level === 'provinces') {
    possibleEnglishNames = [
      feature.properties.PR_NAME,
      feature.properties.NAME,
      feature.properties.PROVINCE && `Province No ${feature.properties.PROVINCE}`,
      feature.properties.PROVINCE && `Province No. ${feature.properties.PROVINCE}`
    ].filter(Boolean);
  } else if (level === 'districts') {
    possibleEnglishNames = [
      feature.properties.DISTRICT,
      feature.properties.NAME,
      feature.properties.NAME_1,
      feature.properties.FIRST_DIST
    ].filter(Boolean);
  } else if (level === 'municipalities') {
    const municipalityNames = [
      feature.properties.LOCAL,
      feature.properties.FIRST_NAMA,
      feature.properties.NAME,
      feature.properties.GaPa_NaPa
    ].filter(Boolean);
    
    const districtNames = [
      feature.properties.DISTRICT,
      feature.properties.FIRST_DIST
    ].filter(Boolean);
    
    // Try both plain names and "Name, District" format for municipalities
    possibleEnglishNames = [
      ...municipalityNames,
      ...municipalityNames.flatMap(mun => 
        districtNames.map(dist => `${mun}, ${dist}`)
      )
    ];
  }

  const type = level === 'provinces' ? 'province' : level === 'districts' ? 'district' : 'municipality';
  const keys = Object.keys(statisticsData);
  
  // Try to find match
  for (const englishName of possibleEnglishNames) {
    // Try mapped Nepali name FIRST (most reliable)
    const nepaliKey = getNepaliName(englishName, type);
    if (nepaliKey && statisticsData[nepaliKey]) {
      console.log(`✓ Mapped match for ${level}:`, englishName, '→', nepaliKey);
      return nepaliKey;
    }
    
    // Try exact match
    if (statisticsData[englishName]) {
      console.log(`✓ Exact match for ${level}:`, englishName);
      return englishName;
    }
    
    // Try case-insensitive match
    const caseMatch = keys.find(key => key.toLowerCase() === englishName.toLowerCase());
    if (caseMatch) {
      console.log(`✓ Case-insensitive match for ${level}:`, englishName, '→', caseMatch);
      return caseMatch;
    }
  }

  return null;
}

/**
 * Get statistics for a feature
 */
export function getFeatureStatistics(
  feature: any,
  level: 'provinces' | 'districts' | 'municipalities',
  statisticsData: Record<string, any>
): any | null {
  const matchingKey = findMatchingKey(feature, level, statisticsData);
  
  if (matchingKey) {
    console.log(`✓ Statistics found for ${level}:`, matchingKey);
    return statisticsData[matchingKey];
  }
  
  console.warn(`⚠️ No statistics found for ${level}`, feature.properties);
  return null;
}

export default {
  getNepaliName,
  findMatchingKey,
  getFeatureStatistics
};
